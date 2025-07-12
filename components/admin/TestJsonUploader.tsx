// components/admin/TestJsonUploader.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { sendTestJson } from "@/apis/sendTestJson";
import {
  NewPromptText,
  TestPrompt,
  ResultPrompt,
} from "@/constants/AdminResult";
import type { TestData } from "@/types/test";
import { Input } from "@/components/ui/input";
import { detectDominantLanguage } from "@/lib/utils";

interface UploadStatus {
  type: "success" | "error" | null;
  message: string;
}

interface Props {
  onUploadSuccess: () => void;
}

export default function TestJsonUploader({ onUploadSuccess }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonResultInput, setJsonResultInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: null,
    message: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const [language, setLanguage] = useState<"ko" | "ja" | "en" | "vi">("ko");
  const [testId, setTestId] = useState<number | null>(null);

  // 복사 핸들러들
  const handleCopyTestPrompt = async () => {
    await navigator.clipboard.writeText(TestPrompt);
    setCopiedTest(true);
    setTimeout(() => setCopiedTest(false), 2000);
  };

  const handleCopyResultPrompt = async () => {
    await navigator.clipboard.writeText(ResultPrompt);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const validateJSON = (
    jsonString: string
  ): { isValid: boolean; data?: Omit<TestData, "results">; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      const data2 = JSON.parse(jsonResultInput);
      if (
        !data.title ||
        !data.description ||
        !data.tone ||
        !data.theme ||
        !data.palette ||
        !data.character ||
        !data.questions
      ) {
        return {
          isValid: false,
          error:
            "필수 필드 누락 (title, description, tone, theme, palette, character, questions)",
        };
      }

      // if (
      //   !data2.result.description ||
      //   !data2.result.recommendation ||
      //   !data2.result.keywords ||
      //   !data2.result.score_range ||
      //   !data2.result.image_prompt
      // ) {
      //   return {
      //     isValid: false,
      //     error:
      //       "필수 필드 누락 (description, recommendation, keywords, score_range, image_prompt)",
      //   };
      // }

      if (!Array.isArray(data.questions)) {
        return {
          isValid: false,
          error: "questions는 배열이어야 합니다",
        };
      }
      return { isValid: true, data };
    } catch {
      return { isValid: false, error: "유효하지 않은 JSON 형식입니다" };
    }
  };

  const handleUploadTest = async () => {
    if (!jsonInput.trim() || !jsonResultInput.trim()) return;

    // const dominantLang = detectDominantLanguage(jsonInput + jsonResultInput);
    // if (language !== "ko" && dominantLang !== language) {
    //   setUploadStatus({
    //     type: "error",
    //     message: `선택된 언어는 ${language.toUpperCase()}인데 실제 내용은 ${dominantLang.toUpperCase()}로 추정됩니다.`,
    //   });
    //   return;
    // }

    // 테스트 JSON 유효성 검사
    const validation = validateJSON(jsonInput);
    if (!validation.isValid) {
      setUploadStatus({
        type: "error",
        message: validation.error || "JSON 검증 실패",
      });
      return;
    }

    // 번역 업로드 시 testId 필요
    if (language !== "ko" && !testId) {
      setUploadStatus({
        type: "error",
        message: "번역 업로드 시 testId가 필요합니다.",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      // 병합 후 전송
      const parsed = JSON.parse(jsonResultInput);

      const mergedData = {
        ...validation.data,
        results: parsed.results,
      };
      console.log(mergedData);

      const result = await sendTestJson(mergedData, {
        language,
        testId: language === "ko" ? undefined : testId!,
      });

      const uploadedTestId = result.testId;
      if (language === "ko") setTestId(uploadedTestId);

      setUploadStatus({
        type: "success",
        message: `✅ ${language.toUpperCase()} 테스트 업로드 완료! (ID: ${uploadedTestId})`,
      });

      // 입력 초기화
      setJsonInput("");
      setJsonResultInput("");
      onUploadSuccess();
    } catch (error: any) {
      setUploadStatus({
        type: "error",
        message: error.message || "업로드 중 오류 발생",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-gray-900 dark:text-white">
          🧪 테스트 JSON 업로드
          <Button
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs"
            onClick={handleCopyTestPrompt}
          >
            {copiedTest ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-500" /> 테스트 복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" /> 테스트 복사
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="px-2 py-1 text-xs"
            onClick={handleCopyResultPrompt}
          >
            {copiedResult ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-500" /> 결과 복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" /> 결과 복사
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <Label className="text-sm">언어 선택:</Label>
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-gray-700 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
          >
            <option value="ko">한국어 (기본)</option>
            <option value="ja">일본어</option>
            <option value="en">영어</option>
            <option value="vi">베트남어</option>
          </select>
        </div>

        {language !== "ko" && (
          <div>
            <Label>업로드할 테스트 ID</Label>
            <Input
              type="number"
              value={testId ?? ""}
              onChange={(e) => setTestId(Number(e.target.value))}
              placeholder="기존에 등록한 테스트 ID를 입력하세요"
            />
          </div>
        )}

        {testId && (
          <div className="text-sm text-gray-500">
            현재 선택된 test_id:{" "}
            <span className="font-mono font-semibold">{testId}</span>{" "}
          </div>
        )}

        <div>
          <Label htmlFor="json-input">테스트 JSON</Label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="mt-2 min-h-[400px] font-mono text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <Label htmlFor="json-input">결과 JSON</Label>
          <Textarea
            id="json-input"
            value={jsonResultInput}
            onChange={(e) => setJsonResultInput(e.target.value)}
            className="mt-2 min-h-[400px] font-mono text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
        </div>

        {uploadStatus.type && (
          <Alert
            className={
              uploadStatus.type === "success"
                ? "border-green-500"
                : "border-red-500"
            }
          >
            <div className="flex items-center gap-2">
              {uploadStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription
                className={
                  uploadStatus.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {uploadStatus.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <Button
          onClick={handleUploadTest}
          disabled={isUploading || !jsonInput.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              업로드
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
