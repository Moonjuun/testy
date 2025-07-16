// components/admin/LunchImageUploader.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Utensils, Loader2, Image as ImageIcon } from "lucide-react";
import type { LunchMenu } from "@/types/test";
import { uploadLunchImageToSupabase } from "@/lib/supabase/admin/adminLunch";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  setSnackBarMessage: (msg: string) => void;
  lunchMenusWithoutImages: LunchMenu[];
  lunchMenusWithImages: LunchMenu[]; // ✅ props 추가
  reloadLunchMenusWithoutImages: () => Promise<void>;
  reloadLunchMenusWithImages: () => Promise<void>;
}

export default function LunchImageUploader({
  setSnackBarMessage,
  lunchMenusWithoutImages,
  lunchMenusWithImages,
  reloadLunchMenusWithoutImages,
  reloadLunchMenusWithImages,
}: Props) {
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handleFileSelect = async (
    menuId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(menuId);
    try {
      await uploadLunchImageToSupabase(menuId, file);
      // ✅ 두 목록을 모두 새로고침
      await Promise.all([
        reloadLunchMenusWithoutImages(),
        reloadLunchMenusWithImages(),
      ]);
      setSnackBarMessage(`✅ 메뉴 ID ${menuId}의 이미지가 업로드되었습니다.`);
    } catch (error: any) {
      console.error("Image upload failed:", error);
      setSnackBarMessage(`❌ 이미지 업로드 실패: ${error.message}`);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 이미지 신규 등록 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils /> 점심 메뉴 이미지 신규 등록
            <Badge variant="outline" className="ml-2">
              {lunchMenusWithoutImages.length}개 대기중
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lunchMenusWithoutImages.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">이미지가 필요한 메뉴가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lunchMenusWithoutImages.map((menu) => (
                <div
                  key={menu.id}
                  className="flex items-center justify-between rounded-lg border p-4 gap-4"
                >
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    {menu.name} (ID: {menu.id})
                  </p>

                  <div className="flex-shrink-0 flex items-center gap-4">
                    {uploadingId === menu.id && (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    )}
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      disabled={!!uploadingId}
                    >
                      <label className="cursor-pointer">
                        이미지 선택
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(menu.id, e)}
                          disabled={!!uploadingId}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. 등록된 이미지 수정 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon /> 등록된 이미지 수정
            <Badge variant="secondary" className="ml-2">
              {lunchMenusWithImages.length}개
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {lunchMenusWithImages.map((menu) => (
              <AccordionItem
                key={menu.id}
                value={String(menu.id)}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-4">
                    {menu.image_url && (
                      <img
                        src={menu.image_url}
                        alt="Thumbnail"
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    )}
                    <span className="font-medium text-left">{menu.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pt-4">
                    <label
                      htmlFor={`file-upload-${menu.id}`}
                      className="text-sm font-medium"
                    >
                      새 이미지로 교체
                    </label>
                    <Input
                      id={`file-upload-${menu.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(menu.id, e)}
                      className="mt-2 cursor-pointer"
                      disabled={uploadingId === menu.id}
                    />
                    {uploadingId === menu.id && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        업로드 중...
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
