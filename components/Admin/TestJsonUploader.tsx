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
import { promptText } from "@/constants/AdminResult";
import type { TestData } from "@/types/test";

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

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
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
    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });
    try {
      const result = await sendTestJson(validation.data!);
      setUploadStatus({
        type: "success",
        message: `테스트 \"${validation.data?.title}\" 업로드 완료! (ID: ${result.testId})`,
      });
      setJsonInput("");
      onUploadSuccess(); // ✅ 업로드 성공 후 리스트 갱신!
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
        <div>
          <Label
            htmlFor="json-input"
            className="text-gray-700 dark:text-gray-300"
          >
            테스트 JSON 붙여넣기
          </Label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{\n  \"title\": \"테스트 제목\",\n  \"description\": \"테스트 설명\",\n  \"questions\": [...],\n  \"results\": [...]\n}`}
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
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />{" "}
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> 업로드
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
