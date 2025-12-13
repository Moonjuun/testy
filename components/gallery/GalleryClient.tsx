// components/gallery/GalleryClient.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getGalleryImages } from "@/lib/supabase/gallery/getGalleryData";
import { Category, GalleryImage } from "@/types/gallery/gallery";
import { Language } from "@/store/useLanguageStore";
import { ExternalLink, Filter, Heart, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatBoldText } from "@/utils/formatBoldText";

import GalleryModal from "../modal/gallery-modal";

const PAGE_SIZE = 12;

interface GalleryClientProps {
  initialImages: GalleryImage[];
  initialCategories: Category[];
  locale: Language;
}

export default function GalleryClient({
  initialImages,
  initialCategories,
  locale,
}: GalleryClientProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // 데이터베이스 쿼리에서 이미 이미지가 있는 항목만 가져오므로 추가 필터링 불필요
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialImages.length === PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      setIsLoading(true);
      const fetchMoreImages = async () => {
        const newImages = await getGalleryImages(
          locale,
          page,
          selectedCategory
        );
        // 데이터베이스 쿼리에서 이미 필터링되었으므로 그대로 사용
        setImages((prevImages) => [...prevImages, ...newImages]);
        setHasMore(newImages.length === PAGE_SIZE);
        setIsLoading(false);
      };
      fetchMoreImages();
    }
  }, [page, locale, selectedCategory]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategoryChange = async (categoryId: number | "all") => {
    if (categoryId === selectedCategory) return;

    setSelectedCategory(categoryId);
    setPage(1);
    setIsLoading(true);

    const newImages = await getGalleryImages(locale, 1, categoryId);
    // 데이터베이스 쿼리에서 이미 필터링되었으므로 그대로 사용
    setImages(newImages);
    setHasMore(newImages.length === PAGE_SIZE);
    setIsLoading(false);
  };

  const handleGoToTest = (testId: number | null) => {
    if (!testId) return;
    router.push(`/${locale}/test/${testId}`);
  };

  const handleImageClick = (image: GalleryImage) => setSelectedImage(image);
  const handleCloseModal = () => setSelectedImage(null);

  const handleNavigation = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    // 데이터베이스 쿼리에서 이미 필터링되었으므로 그대로 사용
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    let nextIndex;
    if (direction === "prev") {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    setSelectedImage(images[nextIndex]);
  };

  const SkeletonCard = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={cn(
        !isMobile &&
          "rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"
      )}
    >
      <div
        className={cn(
          "bg-gray-300 dark:bg-gray-600",
          isMobile ? "aspect-square" : "aspect-[3/4]"
        )}
      />
      {!isMobile && (
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
        </div>
      )}
    </div>
  );

  const ImageCard = ({
    image,
    onClick,
  }: {
    image: GalleryImage;
    onClick: () => void;
  }) => (
    <div
      className="group cursor-pointer sm:rounded-2xl overflow-hidden sm:hover:shadow-xl transition-all duration-300 sm:hover:-translate-y-1 sm:border"
      onClick={onClick}
    >
      <div className="relative overflow-hidden aspect-square sm:aspect-[3/4]">
        <Image
          src={image.src || "/placeholder.svg"}
          alt={image.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {image.category && (
          <div className="hidden sm:block absolute top-3 right-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900 shadow-md">
            {image.category}
          </div>
        )}

        <div className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
          <Button
            size="sm"
            className="bg-white/90 text-gray-900 hover:bg-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" /> {t("gallery.viewDetails")}
          </Button>
        </div>
      </div>
      <div className="hidden sm:block">
        <CardContent className="p-4 bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {formatBoldText(image.title)}
          </h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {image.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {image.testId && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Heart className="w-4 h-4" />
              <span className="truncate">{image.testTitle}</span>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
  return (
    <>
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full animate-bounce" />
          <div className="absolute bottom-10 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full animate-ping hidden md:block" />
          <div className="absolute bottom-20 right-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full animate-pulse hidden sm:block" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="text-center space-y-4 md:space-y-6">
            {/* 아이콘과 제목: 모바일용 크기 및 간격 조절 */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🎨</span>
              </div>
              {/* 제목: 모바일용 텍스트 크기 조절 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Image Gallery
              </h1>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-xl sm:text-2xl">✨</span>
              </div>
            </div>

            {/* 서브타이틀: 모바일용 텍스트 크기 조절 */}
            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-yellow-200">testy.im</span>
              {isClient ? t("gallery.description") : ""}
            </p>

            {/* 통계 정보: 모바일용 간격 및 텍스트 크기 조절 */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 md:pt-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  100+
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  {isClient ? t("gallery.image") : ""}
                </div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  50+
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  {isClient ? t("gallery.test") : ""}
                </div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  1000+
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  {isClient ? t("gallery.viewCount") : ""}
                </div>
              </div>
            </div>

            {/* CTA 버튼: flex-col sm:flex-row 으로 이미 반응형이 잘 되어있음, 간격만 살짝 조절 */}
            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 md:pt-6">
              <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                인기 이미지 보기
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-full backdrop-blur-sm bg-transparent w-full sm:w-auto"
              >
                새로운 테스트 하기
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "shrink-0 rounded-full transition-all",
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              #all
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "shrink-0 rounded-full transition-all",
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                #{category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-1 sm:px-4 py-8">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {page === 1 && isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div key={index}>
                  <div className="block sm:hidden">
                    <SkeletonCard isMobile={true} />
                  </div>
                  <div className="hidden sm:block">
                    <SkeletonCard isMobile={false} />
                  </div>
                </div>
              ))
            : images.map((image, index) => {
                if (images.length === index + 1) {
                  return (
                    <div ref={lastImageElementRef} key={image.id}>
                      <ImageCard
                        image={image}
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                  );
                } else {
                  return (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onClick={() => handleImageClick(image)}
                    />
                  );
                }
              })}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8 col-span-full">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {!isLoading && images.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("gallery.noImages")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("gallery.selectAnotherCategory")}
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <GalleryModal
          image={selectedImage}
          onClose={handleCloseModal}
          onPrev={() => handleNavigation("prev")}
          onNext={() => handleNavigation("next")}
          onGoToTest={handleGoToTest}
          locale={locale}
        />
      )}
    </>
  );
}
