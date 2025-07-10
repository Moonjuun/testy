"use server";

import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClientForServer } from "./server";

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

export { signInWithGoogle, signOut };
