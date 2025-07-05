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
import { uploadTestThumbnailToSupabase } from "@/lib/supabase/adminTest";
import type { TestForUpload } from "@/types/test";
import Image from "next/image";

interface Props {
  setSnackBarMessage: (msg: string) => void;
  testsWithThumbnails: TestForUpload[];
  reloadTestsWithThumbnails: () => Promise<void>;
}

export default function TestThumbnailManager({
  setSnackBarMessage,
  testsWithThumbnails,
  reloadTestsWithThumbnails,
}: Props) {
  const handleFileSelect = async (
    testId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadTestThumbnailToSupabase(testId, file);
      await reloadTestsWithThumbnails();
      setSnackBarMessage(`✅ 테스트 ID ${testId}의 썸네일이 수정되었습니다.`);
    } catch (error: any) {
      console.error("Thumbnail re-upload error:", error);
      setSnackBarMessage(`❌ 썸네일 수정 실패: ${error.message}`);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🖼️ 등록된 테스트 썸네일 관리
          <Badge variant="outline" className="ml-2">
            {testsWithThumbnails.length}개
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-4">
          {testsWithThumbnails.map((test) => (
            <AccordionItem
              key={test.id}
              value={test.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  {test.thumbnail_url && (
                    <Image
                      src={test.thumbnail_url}
                      alt="Thumbnail"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  )}
                  <span className="font-medium text-left">{test.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid md:grid-cols-2 gap-6 items-start pt-4">
                  <div className="space-y-4">
                    {test.thumbnail_url && (
                      // ✅ 이 부분의 width, height 값을 줄이고 w-full 클래스를 제거했습니다.
                      <Image
                        src={test.thumbnail_url}
                        alt="등록된 썸네일"
                        width={200}
                        height={200}
                        className="border rounded-lg shadow-sm aspect-square object-cover"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
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
                  <div className="pt-1">
                    <Label
                      htmlFor={`file-upload-${test.id}`}
                      className="text-sm font-medium"
                    >
                      새 썸네일로 교체
                    </Label>
                    <Input
                      id={`file-upload-${test.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(test.id, e)}
                      className="mt-2 cursor-pointer"
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
