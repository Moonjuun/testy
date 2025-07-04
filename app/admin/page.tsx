// pages/admin/index.tsx
"use client";

import { useEffect, useState } from "react";
import TestJsonUploader from "@/components/admin/TestJsonUploader";
import ResultImageUploader from "@/components/admin/ResultImageUploader";
import UploadedImageManager from "@/components/admin/UploadedImageManager";
import SnackBar from "@/components/SnackBar";
import {
  loadResultsWithoutImages,
  loadResultsWithImages,
} from "@/lib/supabase/adminResults";
import type { TestResult } from "@/types/test";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"json" | "upload" | "manage">(
    "json"
  );
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
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {activeTab === "json" && (
          <TestJsonUploader onUploadSuccess={reloadTestsWithoutImages} />
        )}

        {activeTab === "upload" && (
          <ResultImageUploader
            setSnackBarMessage={showSnackBar}
            testsWithoutImages={testsWithoutImages}
            reloadTestsWithoutImages={reloadTestsWithoutImages}
            reloadTestsWithImages={reloadTestsWithImages}
          />
        )}

        {activeTab === "manage" && (
          <UploadedImageManager
            setSnackBarMessage={showSnackBar}
            testsWithImages={testsWithImages}
            reloadTestsWithImages={reloadTestsWithImages}
          />
        )}
      </main>

      {snackBarMessage && (
        <SnackBar key={snackBarKey} message={snackBarMessage} duration={3000} />
      )}
    </div>
  );
}
