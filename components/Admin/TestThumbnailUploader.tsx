"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Loader2 } from "lucide-react";
import type { TestForUpload } from "@/types/test";
import { uploadTestThumbnailToSupabase } from "@/lib/supabase/adminTest";

interface Props {
  setSnackBarMessage: (msg: string) => void;
  testsWithoutThumbnails: TestForUpload[];
  reloadTestsWithoutThumbnails: () => Promise<void>;
  reloadTestsWithThumbnails: () => Promise<void>;
}

export default function TestThumbnailUploader({
  setSnackBarMessage,
  testsWithoutThumbnails,
  reloadTestsWithoutThumbnails,
  reloadTestsWithThumbnails,
}: Props) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileSelect = async (
    testId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(testId);
    try {
      await uploadTestThumbnailToSupabase(testId, file);
      await reloadTestsWithoutThumbnails();
      await reloadTestsWithThumbnails();
      setSnackBarMessage(`✅ 테스트 ID ${testId}의 썸네일이 업로드되었습니다.`);
    } catch (error: any) {
      console.error("Thumbnail upload failed:", error);
      setSnackBarMessage(`❌ 썸네일 업로드 실패: ${error.message}`);
    } finally {
      setUploadingId(null);
    }
  };

  const handleCopyHint = async (testId: string, hint: string) => {
    if (!hint) return;
    try {
      await navigator.clipboard.writeText(hint);
      setCopiedId(testId);
      setTimeout(() => setCopiedId(null), 1000); // 2초 후 원래 상태로
    } catch (err) {
      console.error("복사 실패:", err);
      setSnackBarMessage("❌ 복사에 실패했습니다.");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🖼️ 테스트 썸네일 등록
          <Badge variant="outline" className="ml-2">
            {testsWithoutThumbnails.length}개 대기중
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testsWithoutThumbnails.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">썸네일이 필요한 테스트가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testsWithoutThumbnails.map((test) => (
              <div
                key={test.id}
                className="flex items-start justify-between rounded-lg border p-4 gap-4"
              >
                <div className="flex-grow">
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    {test.title}
                  </p>

                  {test.character?.prompt_hint && (
                    <p
                      className={`mt-1 text-sm transition-colors duration-300 cursor-pointer ${
                        copiedId === test.id
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                      onClick={() =>
                        handleCopyHint(test.id, test.character.prompt_hint)
                      }
                      title="클릭하여 복사"
                    >
                      {/* ✅ "복사 완료" 텍스트를 제거하고 항상 원래 텍스트를 보여줍니다. */}
                      {test.character.prompt_hint}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    {test.theme && (
                      <Badge variant="outline">Theme: {test.theme}</Badge>
                    )}
                    {test.tone && (
                      <Badge variant="secondary">
                        Tone: {JSON.stringify(test.tone)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-4 pt-1">
                  {uploadingId === test.id && (
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
                        onChange={(e) => handleFileSelect(test.id, e)}
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
  );
}
