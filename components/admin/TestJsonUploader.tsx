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
import { NewPromptText } from "@/constants/AdminResult";
import type { TestData } from "@/types/test";
import { Input } from "@/components/ui/input"; // ✅ test_id 입력용

interface UploadStatus {
  type: "success" | "error" | null;
  message: string;
}

interface Props {
  onUploadSuccess: () => void;
}

export default function TestJsonUploader({ onUploadSuccess }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    type: null,
    message: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [language, setLanguage] = useState<"ko" | "ja" | "en" | "vi">("ko");
  const [testId, setTestId] = useState<number | null>(null);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(NewPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateJSON = (
    jsonString: string
  ): { isValid: boolean; data?: TestData; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (
        !data.title ||
        !data.description ||
        !data.questions ||
        !data.results
      ) {
        return {
          isValid: false,
          error: "필수 필드 누락 (title, description, questions, results)",
        };
      }
      if (!Array.isArray(data.questions) || !Array.isArray(data.results)) {
        return {
          isValid: false,
          error: "questions/results는 배열이어야 합니다",
        };
      }
      return { isValid: true, data };
    } catch {
      return { isValid: false, error: "유효하지 않은 JSON 형식입니다" };
    }
  };

  const handleUploadTest = async () => {
    if (!jsonInput.trim()) return;
    const validation = validateJSON(jsonInput);
    if (!validation.isValid) {
      setUploadStatus({
        type: "error",
        message: validation.error || "JSON 검증 실패",
      });
      return;
    }

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
      const result = await sendTestJson(validation.data!, {
        language,
        testId: language === "ko" ? undefined : testId!,
      });

      const uploadedTestId = result.testId;
      if (language === "ko") setTestId(uploadedTestId); // ✅ 처음 업로드 시 자동 저장

      setUploadStatus({
        type: "success",
        message: `✅ ${language.toUpperCase()} 테스트 업로드 완료! (ID: ${uploadedTestId})`,
      });

      setJsonInput(""); // 입력 초기화
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
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          🧪 테스트 JSON 업로드
          <Button
            size="sm"
            variant="outline"
            className="ml-2 px-2 py-1 text-xs"
            onClick={handleCopyPrompt}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-500" /> 복사됨
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" /> 프롬프트 복사
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
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(String(testId));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="ml-2"
            >
              {copied ? (
                <Check className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              복사
            </Button>
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
