// components/AdminPage.tsx (또는 pages/admin/index.tsx)
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, ImageIcon, Eye } from "lucide-react";
import type { TestData } from "@/types/test";
import SnackBar from "@/components/SnackBar";

// api
import { sendTestJson } from "@/apis/sendTestJson";
// Supabase 클라이언트 임포트
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // 클라이언트 컴포넌트용

// 또는 import { supabase } from "@/utils/supabase"; // 서버 컴포넌트용

interface TestResult {
  id: string; // result_id
  test_id: string; // test 테이블의 id
  test_name: string; // test_translations.title
  result_title: string; // result_translations.title
  image_url?: string | null; // results.result_image_url
  image_prompt: string; // results.image_prompt
}

export default function AdminPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [testsWithoutImages, setTestsWithoutImages] = useState<TestResult[]>(
    []
  );
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [testsWithImages, setTestsWithImages] = useState<TestResult[]>([]);

  // Supabase 클라이언트 초기화 (클라이언트 컴포넌트용)
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTestsWithoutImages();
    loadTestsWithImages();
  }, []);

  // 이미지 없는 테스트 결과 로드
  const loadTestsWithoutImages = async () => {
    setIsLoadingTests(true);

    try {
      // 1. result_image_url이 없는 결과만 가져오기
      const { data: resultsData, error: resultsError } = await supabase
        .from("results")
        .select("id, test_id, result_image_url, image_prompt")
        .is("result_image_url", null);

      if (resultsError || !resultsData) {
        throw resultsError || new Error("결과 데이터 불러오기 실패");
      }

      // 2. 관련된 test_id만 추출
      const uniqueTestIds = [...new Set(resultsData.map((r) => r.test_id))];
      const uniqueResultIds = resultsData.map((r) => r.id);

      // 3. result_translations 불러오기
      const { data: resultTranslations, error: resultTranslationsError } =
        await supabase
          .from("result_translations")
          .select("result_id, title")
          .eq("language", "ko")
          .in("result_id", uniqueResultIds);

      if (resultTranslationsError) {
        throw resultTranslationsError;
      }

      // 4. test_translations 불러오기
      const { data: testTranslations, error: testTranslationsError } =
        await supabase
          .from("test_translations")
          .select("test_id, title")
          .eq("language", "ko")
          .in("test_id", uniqueTestIds);

      if (testTranslationsError) {
        throw testTranslationsError;
      }

      // 5. 맵핑 테이블 생성
      const testTitleMap = Object.fromEntries(
        testTranslations.map((t) => [t.test_id, t.title])
      );

      const resultTitleMap = Object.fromEntries(
        resultTranslations.map((r) => [r.result_id, r.title])
      );

      // 6. 최종 데이터 포맷 구성
      const formattedData: TestResult[] = resultsData.map((item) => ({
        id: item.id,
        test_id: item.test_id,
        test_name: testTitleMap[item.test_id],
        result_title: resultTitleMap[item.id],
        image_url: item.result_image_url,
        image_prompt: item.image_prompt,
      }));

      setTestsWithoutImages(formattedData);
    } catch (error: any) {
      console.error("loadTestsWithoutImages 에러:", error);
      setUploadStatus({
        type: "error",
        message:
          "결과 이미지 없는 테스트 불러오기 실패: " +
          (error.message || "알 수 없는 오류"),
      });
    } finally {
      setIsLoadingTests(false); // ✅ 꼭 호출
    }
  };

  // 등록된 이미지
  const loadTestsWithImages = async () => {
    try {
      const { data: resultsData, error: resultsError } = await supabase
        .from("results")
        .select("id, test_id, result_image_url, image_prompt")
        .not("result_image_url", "is", null);

      if (resultsError || !resultsData) throw resultsError;

      const uniqueTestIds = [...new Set(resultsData.map((r) => r.test_id))];
      const uniqueResultIds = resultsData.map((r) => r.id);

      const { data: resultTranslations } = await supabase
        .from("result_translations")
        .select("result_id, title")
        .eq("language", "ko")
        .in("result_id", uniqueResultIds);

      const { data: testTranslations } = await supabase
        .from("test_translations")
        .select("test_id, title")
        .eq("language", "ko")
        .in("test_id", uniqueTestIds);

      const testTitleMap = Object.fromEntries(
        testTranslations!.map((t) => [t.test_id, t.title])
      );
      const resultTitleMap = Object.fromEntries(
        resultTranslations!.map((r) => [r.result_id, r.title])
      );
      const formattedData: TestResult[] = resultsData.map((item) => ({
        id: item.id,
        test_id: item.test_id,
        test_name: testTitleMap[item.test_id],
        result_title: resultTitleMap[item.id],
        image_url: item.result_image_url,
        image_prompt: item.image_prompt,
      }));

      setTestsWithImages(formattedData);
    } catch (err) {
      console.error("loadTestsWithImages 에러:", err);
    }
  };

  const validateJSON = (
    jsonString: string
  ): { isValid: boolean; data?: TestData; error?: string } => {
    try {
      const data = JSON.parse(jsonString);

      // 기본 구조 검증
      if (
        !data.title ||
        !data.description ||
        !data.questions ||
        !data.results
      ) {
        return {
          isValid: false,
          error:
            "필수 필드가 누락되었습니다 (title, description, questions, results)",
        };
      }

      if (!Array.isArray(data.questions) || !Array.isArray(data.results)) {
        return {
          isValid: false,
          error: "questions와 results는 배열이어야 합니다",
        };
      }

      // 질문 구조 검증
      for (const question of data.questions) {
        if (
          !question.question ||
          !question.options ||
          !Array.isArray(question.options)
        ) {
          return { isValid: false, error: "질문 구조가 올바르지 않습니다" };
        }
      }

      // 결과 구조 검증
      for (const result of data.results) {
        if (!result.title || !result.description || !result.score_range) {
          return { isValid: false, error: "결과 구조가 올바르지 않습니다" };
        }
      }

      return { isValid: true, data };
    } catch (error) {
      return { isValid: false, error: "유효하지 않은 JSON 형식입니다" };
    }
  };

  const handleUploadTest = async () => {
    if (!jsonInput.trim()) {
      setUploadStatus({ type: "error", message: "JSON 데이터를 입력해주세요" });
      return;
    }

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
      // sendTestJson 함수는 이제 Next.js API Route를 호출합니다.
      const result = await sendTestJson(validation.data);

      setUploadStatus({
        type: "success",
        message: `테스트 "${validation.data?.title}"이 성공적으로 업로드되었습니다! (ID: ${result.testId})`,
      });
      setJsonInput("");

      // 이미지 없는 테스트 목록 새로고침
      await loadTestsWithoutImages(); // 데이터베이스에서 최신 상태를 다시 불러옵니다.
    } catch (error: any) {
      setUploadStatus({
        type: "error",
        message: error.message || "업로드 중 오류가 발생했습니다",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (resultId: string, file: File) => {
    setUploadingImages((prev) => new Set(prev).add(resultId));

    try {
      // 1. 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("result-images")
        .upload(`${resultId}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 2. 공개 URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from("result-images")
        .getPublicUrl(uploadData.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL for image.");
      }

      // 3. DB 업데이트
      const { error: updateError } = await supabase
        .from("results")
        .update({ result_image_url: publicUrlData.publicUrl })
        .eq("id", resultId);

      if (updateError) throw updateError;

      // ✅ 4. 목록 동기화 (업로드 성공 후)
      await loadTestsWithoutImages(); // 대기 목록 갱신
      await loadTestsWithImages(); // 등록된 목록 갱신

      // ✅ 5. 스낵바 알림
      setSnackBarMessage(`결과 ID ${resultId}의 이미지가 업로드되었습니다!`);
    } catch (error: any) {
      console.error("Image upload failed:", error);
      setUploadStatus({
        type: "error",
        message: `이미지 업로드 실패: ${error.message || "알 수 없는 오류"}`,
      });
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
    if (file) {
      handleImageUpload(resultId, file);
    }
  };

  const getTestGroups = () => {
    const groups: Record<string, TestResult[]> = {};
    testsWithoutImages.forEach((test) => {
      if (!groups[test.test_id]) {
        groups[test.test_id] = [];
      }
      groups[test.test_id].push(test);
    });
    return groups;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              관리자 대시보드
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              테스트 관리 및 이미지 등록
            </p>
          </div>

          {/* 테스트 JSON 업로드 섹션 */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                🧪 테스트 JSON 업로드
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
                  placeholder={`{
  "title": "테스트 제목",
  "description": "테스트 설명",
  "questions": [...],
  "results": [...]
}`}
                  className="mt-2 min-h-[200px] font-mono text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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

          {/* 결과 이미지 관리 섹션 */}
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
              {isLoadingTests ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    로딩 중...
                  </span>
                </div>
              ) : testsWithoutImages.length === 0 ? (
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
                          <Badge variant="outline">
                            {results.length}개 결과
                          </Badge>
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
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {result.image_prompt}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                      이미지 없음
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm text-gray-700 dark:text-gray-300">
                                      이미지 업로드
                                    </Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleFileSelect(result.id, e)
                                      }
                                      disabled={uploadingImages.has(result.id)}
                                      className="mt-1 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
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
              {testsWithImages.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {result.test_name} - {result.result_title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {result.image_prompt}
                      </p>
                      <img
                        src={result.image_url || ""}
                        alt="이미지"
                        className="w-full h-auto max-w-xs border rounded"
                      />
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
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {snackBarMessage && (
        <SnackBar
          key={snackBarMessage} // 👈 key로 강제 리렌더링 유도
          message={snackBarMessage}
          duration={3000}
        />
      )}
    </div>
  );
}
