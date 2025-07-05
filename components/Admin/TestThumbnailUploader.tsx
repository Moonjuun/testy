// components/admin/TestThumbnailUploader.tsx
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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🖼️ 테스트 썸네일 등록
          <Badge variant="secondary" className="ml-2">
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
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <span className="font-medium text-lg">{test.title}</span>
                <div className="flex items-center gap-4">
                  {uploadingId === test.id && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  )}
                  <Button asChild variant="outline" disabled={!!uploadingId}>
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
