"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Upload, CheckCircle, XCircle, ImageIcon, Eye } from "lucide-react"
import type { TestData } from "@/types/test"

interface TestResult {
  id: string
  test_id: string
  test_name: string
  result_title: string
  image_url?: string
  image_prompt: string
}

export default function AdminPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isUploading, setIsUploading] = useState(false)
  const [testsWithoutImages, setTestsWithoutImages] = useState<TestResult[]>([])
  const [isLoadingTests, setIsLoadingTests] = useState(true)
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set())

  // 이미지 없는 테스트 결과 로드
  useEffect(() => {
    loadTestsWithoutImages()
  }, [])

  const loadTestsWithoutImages = async () => {
    setIsLoadingTests(true)
    try {
      // 실제로는 Supabase에서 데이터를 가져와야 하지만, 데모용으로 mock 데이터 사용
      const mockData: TestResult[] = [
        {
          id: "1",
          test_id: "summer-vacation-style",
          test_name: "나에게 어울리는 여름 휴가 스타일",
          result_title: "자연 속 힐링러",
          image_prompt: "숲속 나무 아래 명상하는 여성, 고요하고 평화로운 분위기, 2D 일러스트",
        },
        {
          id: "2",
          test_id: "summer-vacation-style",
          test_name: "나에게 어울리는 여름 휴가 스타일",
          result_title: "럭셔리 휴식러",
          image_prompt: "인피니티 풀에서 칵테일 마시는 우아한 여성, 햇살 가득한 리조트, 2D 일러스트",
        },
        {
          id: "3",
          test_id: "love-style",
          test_name: "나의 연애 스타일은?",
          result_title: "로맨틱한 연인",
          image_prompt: "장미꽃을 들고 미소짓는 로맨틱한 여성, 따뜻한 조명, 2D 일러스트",
        },
      ]
      setTestsWithoutImages(mockData)
    } catch (error) {
      console.error("Failed to load tests:", error)
    } finally {
      setIsLoadingTests(false)
    }
  }

  const validateJSON = (jsonString: string): { isValid: boolean; data?: TestData; error?: string } => {
    try {
      const data = JSON.parse(jsonString)

      // 기본 구조 검증
      if (!data.title || !data.description || !data.questions || !data.results) {
        return { isValid: false, error: "필수 필드가 누락되었습니다 (title, description, questions, results)" }
      }

      if (!Array.isArray(data.questions) || !Array.isArray(data.results)) {
        return { isValid: false, error: "questions와 results는 배열이어야 합니다" }
      }

      // 질문 구조 검증
      for (const question of data.questions) {
        if (!question.question || !question.options || !Array.isArray(question.options)) {
          return { isValid: false, error: "질문 구조가 올바르지 않습니다" }
        }
      }

      // 결과 구조 검증
      for (const result of data.results) {
        if (!result.title || !result.description || !result.score_range) {
          return { isValid: false, error: "결과 구조가 올바르지 않습니다" }
        }
      }

      return { isValid: true, data }
    } catch (error) {
      return { isValid: false, error: "유효하지 않은 JSON 형식입니다" }
    }
  }

  const handleUploadTest = async () => {
    if (!jsonInput.trim()) {
      setUploadStatus({ type: "error", message: "JSON 데이터를 입력해주세요" })
      return
    }

    const validation = validateJSON(jsonInput)
    if (!validation.isValid) {
      setUploadStatus({ type: "error", message: validation.error || "JSON 검증 실패" })
      return
    }

    setIsUploading(true)
    setUploadStatus({ type: null, message: "" })

    try {
      // 실제로는 /functions/v1/insert-test API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 시뮬레이션

      setUploadStatus({
        type: "success",
        message: `테스트 "${validation.data?.title}"이 성공적으로 업로드되었습니다!`,
      })
      setJsonInput("")

      // 이미지 없는 테스트 목록 새로고침
      loadTestsWithoutImages()
    } catch (error) {
      setUploadStatus({ type: "error", message: "업로드 중 오류가 발생했습니다" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (resultId: string, file: File) => {
    setUploadingImages((prev) => new Set(prev).add(resultId))

    try {
      // 실제로는 Supabase Storage 또는 OpenAI API 호출
      await new Promise((resolve) => setTimeout(resolve, 3000)) // 시뮬레이션

      // 성공 시 해당 항목을 목록에서 제거
      setTestsWithoutImages((prev) => prev.filter((test) => test.id !== resultId))
    } catch (error) {
      console.error("Image upload failed:", error)
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(resultId)
        return newSet
      })
    }
  }

  const handleFileSelect = (resultId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(resultId, file)
    }
  }

  const getTestGroups = () => {
    const groups: Record<string, TestResult[]> = {}
    testsWithoutImages.forEach((test) => {
      if (!groups[test.test_id]) {
        groups[test.test_id] = []
      }
      groups[test.test_id].push(test)
    })
    return groups
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">관리자 대시보드</h1>
            <p className="text-gray-600 dark:text-gray-400">테스트 관리 및 이미지 등록</p>
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
                <Label htmlFor="json-input" className="text-gray-700 dark:text-gray-300">
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
                <Alert className={uploadStatus.type === "success" ? "border-green-500" : "border-red-500"}>
                  <div className="flex items-center gap-2">
                    {uploadStatus.type === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={uploadStatus.type === "success" ? "text-green-700" : "text-red-700"}>
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
                  <span className="text-gray-600 dark:text-gray-400">로딩 중...</span>
                </div>
              ) : testsWithoutImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">이미지가 필요한 테스트 결과가 없습니다</p>
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
                          <span className="font-medium text-gray-900 dark:text-white">{results[0].test_name}</span>
                          <Badge variant="outline">{results.length}개 결과</Badge>
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
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{result.image_prompt}</p>
                                  <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs text-gray-500">이미지 없음</span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm text-gray-700 dark:text-gray-300">이미지 업로드</Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileSelect(result.id, e)}
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
        </div>
      </div>
    </div>
  )
}
