"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Menu, X } from "lucide-react";

// 컴포넌트
import AdminSidebar from "@/components/admin/AdminSidebar";
import TestThumbnailUploader from "@/components/admin/TestThumbnailUploader";
import TestThumbnailManager from "@/components/admin/TestThumbnailManager";
import ResultImageUploader from "@/components/admin/ResultImageUploader";
import UploadedImageManager from "@/components/admin/UploadedImageManager";
import TestJsonUploader from "@/components/admin/TestJsonUploader";
import SnackBar from "@/components/SnackBar";
import LunchImageUploader from "@/components/admin/LunchImageUploader";

// 타입
import type { TestResult, TestForUpload, LunchMenu } from "@/types/test";

// Supabase 함수
import {
  loadResultsWithoutImages,
  loadResultsWithImages,
} from "@/lib/supabase/adminResults";
import {
  loadTestsWithoutThumbnails,
  loadTestsWithThumbnails,
} from "@/lib/supabase/adminTest";
import {
  loadLunchMenusWithoutImages,
  loadLunchMenusWithImages,
} from "@/lib/supabase/admin/adminLunch";

type AdminTab =
  | "json"
  | "thumbnail-upload"
  | "result-upload"
  | "thumbnail-manage"
  | "result-manage"
  | "lunch-image";

export default function AdminPageClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>("json");
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarKey, setSnackBarKey] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 반응형 사이드바 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const [lunchMenusWithoutImages, setLunchMenusWithoutImages] = useState<
    LunchMenu[]
  >([]);
  const [lunchMenusWithImages, setLunchMenusWithImages] = useState<LunchMenu[]>(
    []
  );

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

  const reloadLunchMenusWithoutImages = useCallback(async () => {
    try {
      setLunchMenusWithoutImages(await loadLunchMenusWithoutImages());
    } catch (e) {
      console.error(e);
      showSnackBar("❌ 이미지 없는 점심 메뉴 로딩 실패");
    }
  }, []);

  const reloadLunchMenusWithImages = useCallback(async () => {
    try {
      setLunchMenusWithImages(await loadLunchMenusWithImages());
    } catch (e) {
      console.error(e);
      showSnackBar("❌ 등록된 점심 메뉴 로딩 실패");
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
        reloadLunchMenusWithoutImages(),
        reloadLunchMenusWithImages(),
      ]);
      setLoading(false);
    };
    loadInitialData();
  }, [
    reloadTestsWithoutImages,
    reloadTestsWithImages,
    reloadTestsWithoutThumbnails,
    reloadTestsWithThumbnails,
    reloadLunchMenusWithoutImages,
    reloadLunchMenusWithImages,
  ]);

  // ESC로 사이드바 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
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
      case "lunch-image":
        return (
          <LunchImageUploader
            setSnackBarMessage={showSnackBar}
            lunchMenusWithoutImages={lunchMenusWithoutImages}
            lunchMenusWithImages={lunchMenusWithImages}
            reloadLunchMenusWithoutImages={reloadLunchMenusWithoutImages}
            reloadLunchMenusWithImages={reloadLunchMenusWithImages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* 상단 바 (모바일에서 햄버거 버튼 노출) */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden bg-white/70 dark:bg-gray-900/50 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <button
          aria-label="사이드바 열기"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">메뉴</span>
        </button>
        <h1 className="text-base font-semibold">Testy 어드민</h1>
        <div className="w-5 h-5" />
      </header>

      {/* 모바일: 슬라이드 오버 사이드바 */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
      >
        {/* 오버레이 */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* 패널 */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="모바일 사이드바"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Testy 어드민</h2>
            <button
              aria-label="사이드바 닫기"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false); // 메뉴 선택 시 닫기
              }}
            />
          </div>
        </aside>
      </div>

      {/* 데스크탑: 고정 사이드바 */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-72 z-30">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 콘텐츠: 데스크탑에서 사이드바 폭만큼 패딩 */}
      <main className="px-4 md:pl-72 py-6">{renderContent()}</main>

      {snackBarMessage && (
        <SnackBar key={snackBarKey} message={snackBarMessage} duration={3000} />
      )}
    </div>
  );
}

