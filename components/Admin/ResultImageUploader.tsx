// components/admin/ResultImageUploader.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import type { TestResult } from "@/types/test";

// api
import { uploadResultImageToSupabase } from "@/lib/supabase/adminResults";

interface Props {
  setSnackBarMessage: (msg: string) => void;
  testsWithoutImages: TestResult[];
  reloadTestsWithoutImages: () => Promise<void>;
  reloadTestsWithImages: () => Promise<void>;
}

export default function ResultImageUploader({
  setSnackBarMessage,
  testsWithoutImages,
  reloadTestsWithoutImages,
  reloadTestsWithImages,
}: Props) {
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleImageUpload = async (resultId: string, file: File) => {
    setUploadingImages((prev) => new Set(prev).add(resultId));
    try {
      await uploadResultImageToSupabase(resultId, file);
      await reloadTestsWithoutImages(); // ✅ 상위에서 상태 갱신
      await reloadTestsWithImages(); // ✅ 이미지 등록 후에도 갱신
      setSnackBarMessage(`✅ 결과 ID ${resultId}의 이미지가 업로드되었습니다.`);
    } catch (error: any) {
      console.error("Image upload failed:", error);
      setSnackBarMessage(
        `❌ 이미지 업로드 실패: ${error.message || "알 수 없는 오류"}`
      );
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resultId);
        return newSet;
      });
    }
  };

  const handleFileSelect = (
    resultId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) handleImageUpload(resultId, file);
  };

  const getTestGroups = () => {
    const groups: Record<string, TestResult[]> = {};
    testsWithoutImages.forEach((test) => {
      if (!groups[test.test_id]) groups[test.test_id] = [];
      groups[test.test_id].push(test);
    });
    return groups;
  };

  const handleCopyImagePrompt = async (resultId: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPromptId(resultId);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          🖼️ 결과 이미지 등록
          <Badge variant="secondary" className="ml-2">
            {testsWithoutImages.length}개 대기중
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testsWithoutImages.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              이미지가 필요한 테스트 결과가 없습니다
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {Object.entries(getTestGroups()).map(([testId, results]) => (
              <AccordionItem
                key={testId}
                value={testId}
                className="border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {results[0].test_name}
                    </span>
                    <Badge variant="outline">{results.length}개 결과</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              {result.result_title}
                            </h4>
                            <p
                              className={`text-sm mb-3 cursor-pointer transition-colors duration-200 break-words ${
                                copiedPromptId === result.id
                                  ? "text-green-600 dark:text-green-400 font-semibold"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                              onClick={() =>
                                handleCopyImagePrompt(
                                  result.id,
                                  result.image_prompt
                                )
                              }
                              title="클릭하여 복사"
                            >
                              {result.image_prompt}
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm text-gray-700 dark:text-gray-300">
                                이미지 업로드
                              </Label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(result.id, e)}
                                disabled={uploadingImages.has(result.id)}
                                className="mt-1 cursor-pointer bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
                              />
                            </div>
                            {uploadingImages.has(result.id) && (
                              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                이미지 생성 중...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
