// pages/admin/index.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

// 컴포넌트
import AdminSidebar from "@/components/admin/AdminSidebar";
import TestThumbnailUploader from "@/components/admin/TestThumbnailUploader";
import TestThumbnailManager from "@/components/admin/TestThumbnailManager";
import ResultImageUploader from "@/components/admin/ResultImageUploader";
import UploadedImageManager from "@/components/admin/UploadedImageManager";
import TestJsonUploader from "@/components/admin/TestJsonUploader";
import SnackBar from "@/components/SnackBar";

// 타입
import type { TestResult, TestForUpload } from "@/types/test";

// Supabase 함수
import {
  loadResultsWithoutImages,
  loadResultsWithImages,
} from "@/lib/supabase/adminResults";
import {
  loadTestsWithoutThumbnails,
  loadTestsWithThumbnails,
} from "@/lib/supabase/adminTest";

type AdminTab =
  | "json"
  | "thumbnail-upload"
  | "result-upload"
  | "thumbnail-manage"
  | "result-manage";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("json");
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarKey, setSnackBarKey] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 상태 변수
  const [testsWithoutImages, setTestsWithoutImages] = useState<TestResult[]>(
    []
  );
  const [testsWithImages, setTestsWithImages] = useState<TestResult[]>([]);
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

  // 데이터 로딩 함수
  const reloadTestsWithoutImages = useCallback(async () => {
    try {
      setTestsWithoutImages(await loadResultsWithoutImages());
    } catch (e) {
      console.error(e);
      showSnackBar("❌ 이미지 없는 결과 로딩 실패");
    }
  }, []);

  const reloadTestsWithImages = useCallback(async () => {
    try {
      setTestsWithImages(await loadResultsWithImages());
    } catch (e) {
      console.error(e);
      showSnackBar("❌ 등록된 결과 이미지 로딩 실패");
    }
  }, []);

  const reloadTestsWithoutThumbnails = useCallback(async () => {
    try {
      setTestsWithoutThumbnails(await loadTestsWithoutThumbnails());
    } catch (e) {
      console.error(e);
      showSnackBar("❌ 썸네일 없는 테스트 로딩 실패");
    }
  }, []);

  const reloadTestsWithThumbnails = useCallback(async () => {
    try {
      setTestsWithThumbnails(await loadTestsWithThumbnails());
    } catch (e) {
      console.error(e);
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
      case "thumbnail-upload":
        return (
          <TestThumbnailUploader
            setSnackBarMessage={showSnackBar}
            testsWithoutThumbnails={testsWithoutThumbnails}
            reloadTestsWithoutThumbnails={reloadTestsWithoutThumbnails}
            reloadTestsWithThumbnails={reloadTestsWithThumbnails}
          />
        );
      case "result-upload":
        return (
          <ResultImageUploader
            setSnackBarMessage={showSnackBar}
            testsWithoutImages={testsWithoutImages}
            reloadTestsWithoutImages={reloadTestsWithoutImages}
            reloadTestsWithImages={reloadTestsWithImages}
          />
        );
      case "thumbnail-manage":
        return (
          <TestThumbnailManager
            setSnackBarMessage={showSnackBar}
            testsWithThumbnails={testsWithThumbnails}
            reloadTestsWithThumbnails={reloadTestsWithThumbnails}
          />
        );
      case "result-manage":
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* 사이드바를 왼쪽 상단에 고정 */}
      <div className="fixed left-0 h-screen w-64">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="flex-1 p-8">{renderContent()}</main>
      {snackBarMessage && (
        <SnackBar key={snackBarKey} message={snackBarMessage} duration={3000} />
      )}
    </div>
  );
}
