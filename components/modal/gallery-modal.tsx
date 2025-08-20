import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryImage } from "@/types/gallery/gallery";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Share2,
  X,
} from "lucide-react";
import { useShare } from "@/hooks/useShare";
import { Language } from "@/store/useLanguageStore";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "./alert-context";
import { useTranslation } from "react-i18next";

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoToTest: (testId: number | null) => void;
  locale: Language;
}

export default function GalleryModal({
  image,
  onClose,
  onPrev,
  onNext,
  onGoToTest,
  locale,
}: ImageModalProps) {
  const { handleShare } = useShare();
  const { t } = useTranslation();
  const { user } = useAuth();
  const customAlert = useAlert();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 모달에 보이는 이미지에 항상 워터마크를 그리는 로직
  useEffect(() => {
    if (!image.src) return;
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, container.clientHeight);
        canvas.width = size;
        canvas.height = size;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
      const watermarkText = "Testy";
      const fontSize = canvas.width / 12;
      ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
    };
    img.src = image.src;
  }, [image.src]);

  const handleDownloadRequest = async () => {
    if (user) {
      // ✅ 로그인 유저: 워터마크 없는 원본 이미지 바로 다운로드
      downloadOriginalImage();
    } else {
      // ❌ 비로그인 유저: 로그인 안내 알림창 표시 후, 워터마크 이미지 다운로드
      await customAlert({
        title: `${t("gallery.notice")}`,
        message: `${t("gallery.watermarkedMessage")}`,
        confirmText: `${t("gallery.confirm")}`,
      });
      downloadWatermarkedImage();
    }
  };

  // 워터마크 있는 이미지 다운로드 함수 (재추가)
  const downloadWatermarkedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    const fileName =
      `${image.testTitle}_${image.title}_watermarked.png`.replace(
        /[\\/:*?"<>|]/g,
        ""
      );
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 워터마크 없는 원본 이미지 다운로드 함수
  const downloadOriginalImage = async () => {
    if (!image.src) return;
    try {
      const response = await fetch(image.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${image.testTitle}_${image.title}.png`.replace(
        /[\\/:*?"<>|]/g,
        ""
      );
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Original image download failed:", error);
    }
  };

  const onShareClick = () => {
    if (!image.testId) return;
    const shareUrl = `https://testy.im/${locale}/test/${image.testId}`;
    const shareText = image.testTitle;
    handleShare("copy", { url: shareUrl, text: shareText });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/80 hover:bg-white backdrop-blur rounded-full h-8 w-8"
            onClick={onShareClick}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/80 hover:bg-white backdrop-blur rounded-full h-8 w-8"
            onClick={handleDownloadRequest}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/80 hover:bg-white backdrop-blur rounded-full h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Buttons */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute left-3 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur rounded-full h-8 w-8"
          onClick={onPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-1/3 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur rounded-full h-8 w-8"
          onClick={onNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Image Area */}
        <div className="relative w-full aspect-square flex-shrink-0 bg-gray-200 dark:bg-gray-900">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Information & Action Area */}
        <div className="p-4 sm:p-6 flex flex-col flex-1 overflow-y-auto min-h-0">
          {/* Top Info */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {image.title}
              </h2>
              <div className="flex flex-wrap gap-1 mb-2">
                {image.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs sm:text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Test */}
            {image.testId && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 sm:p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-pink-500" />
                  {t("gallery.aboutTest")}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  {image.testTitle}
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg text-sm"
                  onClick={() => onGoToTest(image.testId)}
                >
                  {t("gallery.gotoTest")} →
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="pt-3 mt-auto hidden sm:block">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg text-sm"
                onClick={onShareClick}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("gallery.share")}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg text-sm"
                onClick={handleDownloadRequest}
              >
                <Download className="w-4 h-4 mr-2" />
                {t("gallery.download")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
