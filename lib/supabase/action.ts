"use server";

import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClientForServer } from "./server";
import { revalidatePath } from "next/cache";
import { inappropriateWords } from "@/constants/profile/user";
const signInWith = (provider: Provider) => async (formData: FormData) => {
  // 클라이언트에서 보낸 'locale' 값을 받습니다.
  const locale = (formData.get("locale") as string) || "en";
  const supabase = await createClientForServer();

  // 돌아올 주소에 전달받은 locale을 포함시킵니다.
  const auth_callback_url = `${process.env.SITE_URL}/${locale}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    console.log(error);
  }

  if (data.url) {
    redirect(data.url);
  }
};

const signInWithGoogle = signInWith("google");

const signOut = async (locale: string) => {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
};

export async function deleteUserAccount() {
  const supabase = await createClientForServer();
  const { error } = await supabase.rpc("delete_user_account");

  if (error) {
    console.error("Error deleting user account:", error);
    return { error };
  }

  await supabase.auth.signOut();
  return { error: null };
}

export async function updateUserNickname(nickname: string, locale: string) {
  // --- 닉네임 유효성 검사 로직 추가 ---

  // 1. 닉네임 길이 검사 (2~10자)
  if (!nickname || nickname.length < 2 || nickname.length > 10) {
    return { error: { message: "닉네임은 2~10자 사이여야 합니다." } };
  }

  // 2. 공백 및 특수문자 검사 (한글, 영문, 숫자만 허용)
  const validCharRegex = /^[a-zA-Z0-9가-힣]+$/;
  if (!validCharRegex.test(nickname)) {
    return {
      error: { message: "닉네임에 공백이나 특수문자를 사용할 수 없습니다." },
    };
  }

  // 3. 다국어 비속어 필터링
  if (
    inappropriateWords.some((word) => nickname.toLowerCase().includes(word))
  ) {
    return { error: { message: "사용할 수 없는 닉네임입니다." } };
  }
  // --- 유효성 검사 끝 ---

  const supabase = await createClientForServer();
  const { error } = await supabase.rpc("update_user_nickname", {
    new_nickname: nickname,
  });

  if (error) {
    console.error("Error updating nickname:", error);
    return { error };
  }

  revalidatePath(`/${locale}`);

  return { error: null };
}

export { signInWithGoogle, signOut };
