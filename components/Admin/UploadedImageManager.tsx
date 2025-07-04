// components/admin/UploadedImageManager.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadResultImageToSupabase } from "@/lib/supabase/adminResults";
import type { TestResult } from "@/types/test";

interface Props {
  setSnackBarMessage: (msg: string) => void;
  testsWithImages: TestResult[];
  reloadTestsWithImages: () => Promise<void>;
}

export default function UploadedImageManager({
  setSnackBarMessage,
  testsWithImages,
  reloadTestsWithImages,
}: Props) {
  const handleFileSelect = async (
    resultId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadResultImageToSupabase(resultId, file);
      await reloadTestsWithImages(); // ✅ 외부에서 상태 갱신
      setSnackBarMessage(`✅ 결과 ID ${resultId}의 이미지가 수정되었습니다.`);
    } catch (error: any) {
      console.error("Image re-upload error:", error);
      setSnackBarMessage(
        `❌ 이미지 수정 실패: ${error.message || "알 수 없는 오류"}`
      );
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          ✅ 등록된 이미지 관리
          <Badge variant="secondary" className="ml-2">
            {testsWithImages.length}개
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" defaultValue={[]} className="space-y-4">
          {testsWithImages.map((result) => (
            <AccordionItem
              key={result.id}
              value={result.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {result.test_name} - {result.result_title}
                  </span>
                  {result.result_image_url && (
                    <img
                      src={result.result_image_url}
                      alt="Preview"
                      className="w-8 h-8 object-cover rounded-sm ml-2"
                    />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {result.image_prompt}
                    </p>
                    {typeof result.result_image_url === "string" &&
                      result.result_image_url.trim() !== "" && (
                        <img
                          src={result.result_image_url}
                          alt="등록된 이미지"
                          className="w-full h-auto max-w-xs border rounded"
                        />
                      )}
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700 dark:text-gray-300">
                      이미지 수정 업로드
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(result.id, e)}
                      className="mt-2 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
