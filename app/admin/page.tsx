// pages/admin/index.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import TestJsonUploader from "@/components/admin/TestJsonUploader";
import ResultImageUploader from "@/components/admin/ResultImageUploader";
import UploadedImageManager from "@/components/admin/UploadedImageManager";
import SnackBar from "@/components/SnackBar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";
import TestThumbnailUploader from "@/components/admin/TestThumbnailUploader";
import type { TestResult, TestForUpload } from "@/types/test";
import {
  loadResultsWithoutImages,
  loadResultsWithImages,
} from "@/lib/supabase/adminResults";
import {
  loadTestsWithoutThumbnails,
  loadTestsWithThumbnails,
} from "@/lib/supabase/adminTest";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "json" | "upload" | "manage" | "thumbnail"
  >("json");
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarKey, setSnackBarKey] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 결과 이미지 상태
  const [testsWithoutImages, setTestsWithoutImages] = useState<TestResult[]>(
    []
  );
  const [testsWithImages, setTestsWithImages] = useState<TestResult[]>([]);

  // 테스트 썸네일 상태
  const [testsWithoutThumbnails, setTestsWithoutThumbnails] = useState<
    TestForUpload[]
  >([]);
  const [testsWithThumbnails, setTestsWithThumbnails] = useState<
    TestForUpload[]
  >([]);

  const showSnackBar = (msg: string) => {
    setSnackBarMessage(msg);
    setSnackBarKey(Date.now());
  };

  // 데이터 로딩 함수들
  const reloadTestsWithoutImages = useCallback(async () => {
    try {
      setTestsWithoutImages(await loadResultsWithoutImages());
    } catch (error) {
      console.error(error);
      showSnackBar("❌ 이미지 없는 결과 로딩 실패");
    }
  }, []);

  const reloadTestsWithImages = useCallback(async () => {
    try {
      setTestsWithImages(await loadResultsWithImages());
    } catch (error) {
      console.error(error);
      showSnackBar("❌ 등록된 결과 이미지 로딩 실패");
    }
  }, []);

  const reloadTestsWithoutThumbnails = useCallback(async () => {
    try {
      setTestsWithoutThumbnails(await loadTestsWithoutThumbnails());
    } catch (error) {
      console.error(error);
      showSnackBar("❌ 썸네일 없는 테스트 로딩 실패");
    }
  }, []);

  const reloadTestsWithThumbnails = useCallback(async () => {
    try {
      setTestsWithThumbnails(await loadTestsWithThumbnails());
    } catch (error) {
      console.error(error);
      showSnackBar("❌ 등록된 테스트 썸네일 로딩 실패");
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        reloadTestsWithoutImages(),
        reloadTestsWithImages(),
        reloadTestsWithoutThumbnails(),
        reloadTestsWithThumbnails(),
      ]);
      setLoading(false);
    };
    loadInitialData();
  }, [
    reloadTestsWithoutImages,
    reloadTestsWithImages,
    reloadTestsWithoutThumbnails,
    reloadTestsWithThumbnails,
  ]);

  // 탭에 따라 다른 컴포넌트를 보여주는 함수
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            데이터를 불러오는 중입니다...
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "json":
        return (
          <TestJsonUploader
            onUploadSuccess={() =>
              Promise.all([
                reloadTestsWithoutImages(),
                reloadTestsWithoutThumbnails(),
              ])
            }
          />
        );
      case "thumbnail":
        return (
          <TestThumbnailUploader
            setSnackBarMessage={showSnackBar}
            testsWithoutThumbnails={testsWithoutThumbnails}
            reloadTestsWithoutThumbnails={reloadTestsWithoutThumbnails}
            reloadTestsWithThumbnails={reloadTestsWithThumbnails}
          />
        );
      case "upload":
        return (
          <ResultImageUploader
            setSnackBarMessage={showSnackBar}
            testsWithoutImages={testsWithoutImages}
            reloadTestsWithoutImages={reloadTestsWithoutImages}
            reloadTestsWithImages={reloadTestsWithImages}
          />
        );
      case "manage":
        return (
          <UploadedImageManager
            setSnackBarMessage={showSnackBar}
            testsWithImages={testsWithImages}
            reloadTestsWithImages={reloadTestsWithImages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">{renderContent()}</main>
      {snackBarMessage && (
        <SnackBar key={snackBarKey} message={snackBarMessage} duration={3000} />
      )}
    </div>
  );
}
