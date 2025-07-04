// pages/admin/index.tsx
"use client";

import { useEffect, useState } from "react";
import TestJsonUploader from "@/components/Admin/TestJsonUploader";
import ResultImageUploader from "@/components/Admin/ResultImageUploader";
import UploadedImageManager from "@/components/Admin/UploadedImageManager";
import SnackBar from "@/components/SnackBar";
import {
  loadResultsWithoutImages,
  loadResultsWithImages,
} from "@/lib/supabase/adminResults";
import type { TestResult } from "@/types/test";

export default function AdminPage() {
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarKey, setSnackBarKey] = useState<number>(0);
  const [testsWithoutImages, setTestsWithoutImages] = useState<TestResult[]>(
    []
  );
  const [testsWithImages, setTestsWithImages] = useState<TestResult[]>([]);

  const showSnackBar = (msg: string) => {
    setSnackBarMessage(msg);
    setSnackBarKey(Date.now());
  };

  const reloadTestsWithoutImages = async () => {
    const results = await loadResultsWithoutImages();
    const converted = results.map((r) => ({
      ...r,
      title: "",
      description: "",
      recommendation: "",
      score_range: [0, 0] as [number, number],
    }));
    setTestsWithoutImages(converted);
  };

  const reloadTestsWithImages = async () => {
    const results = await loadResultsWithImages();
    const converted = results.map((r) => ({
      ...r,
      title: "",
      description: "",
      recommendation: "",
      score_range: [0, 0] as [number, number],
    }));
    setTestsWithImages(converted);
  };

  useEffect(() => {
    reloadTestsWithoutImages();
    reloadTestsWithImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            관리자 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            테스트 관리 및 이미지 등록
          </p>
        </div>

        <TestJsonUploader onUploadSuccess={reloadTestsWithoutImages} />
        <ResultImageUploader
          setSnackBarMessage={showSnackBar}
          testsWithoutImages={testsWithoutImages}
          reloadTestsWithoutImages={reloadTestsWithoutImages}
          reloadTestsWithImages={reloadTestsWithImages}
        />

        <UploadedImageManager
          setSnackBarMessage={showSnackBar}
          testsWithImages={testsWithImages}
          reloadTestsWithImages={reloadTestsWithImages}
        />
      </div>

      {snackBarMessage && (
        <SnackBar key={snackBarKey} message={snackBarMessage} duration={3000} />
      )}
    </div>
  );
}
