import { useCallback } from "react";
import { useTranslation } from "react-i18next"; // 사용하는 번역 라이브러리에 맞게 수정
import { useAlert } from "@/components/modal/alert-context";

// 공유에 필요한 옵션 타입을 정의합니다.
interface ShareOptions {
  url: string;
  text: string;
}

/**
 * SNS 공유 및 링크 복사 기능을 제공하는 커스텀 훅
 * @returns { handleShare } - 플랫폼과 공유 옵션을 받아 공유를 실행하는 함수
 */
export const useShare = () => {
  const { t } = useTranslation();
  const customAlert = useAlert();

  const handleShare = useCallback(
    async (platform: string, options: ShareOptions) => {
      const { url, text } = options;

      switch (platform) {
        case "twitter": {
          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`;
          window.open(tweetUrl, "_blank", "noopener,noreferrer");
          break;
        }
        case "facebook": {
          const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`;
          window.open(fbShareUrl, "_blank", "noopener,noreferrer");
          break;
        }
        case "copy": {
          try {
            await navigator.clipboard.writeText(url);
            await customAlert({
              title: t("alert.copySuccessTitle"),
              message: t("alert.copySuccessMessage"),
              confirmText: t("alert.confirm"),
            });
          } catch (err) {
            console.error("Failed to copy: ", err);
            await customAlert({
              title: t("alert.copyFailTitle"),
              message: t("alert.copyFailMessage"),
              confirmText: t("alert.confirm"),
            });
          }
          break;
        }
        case "image": {
          // 이미지 저장 로직은 컴포넌트 특화적일 수 있으므로,
          // 필요하다면 별도의 콜백 함수를 인자로 받아 처리하는 것이 더 유연합니다.
          await customAlert({
            title: t("profile.notification"),
            message: t("error.waitPlease"), // "이미지 저장 기능은 준비 중입니다." 와 같은 메시지가 더 적합할 수 있습니다.
            confirmText: t("alert.confirm"),
          });
          break;
        }
        default:
          console.warn(`Unsupported share platform: ${platform}`);
      }
    },
    [t, customAlert] // 의존성 배열에 t와 customAlert 추가
  );

  return { handleShare };
};
