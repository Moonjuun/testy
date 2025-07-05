//apis/sendTestJson.ts
export const sendTestJson = async (
  jsonData: any,
  options?: { language?: string; testId?: number }
) => {
  const response = await fetch("/api/insert-test-via-rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: jsonData,
      language: options?.language ?? "ko",
      test_id: options?.testId ?? null,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "업로드 실패");
  return result;
};
