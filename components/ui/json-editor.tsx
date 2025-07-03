"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Copy, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonEditorProps {
  value?: string
  onChange?: (value: string, isValid: boolean, parsed?: any) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
  showValidation?: boolean
  showActions?: boolean
}

export function JsonEditor({
  value = "",
  onChange,
  placeholder = "JSON을 입력하세요...",
  className,
  readOnly = false,
  showValidation = true,
  showActions = true,
}: JsonEditorProps) {
  const [jsonValue, setJsonValue] = useState(value)
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState<string>("")
  const [parsed, setParsed] = useState<any>(null)

  useEffect(() => {
    setJsonValue(value)
  }, [value])

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setIsValid(true)
      setError("")
      setParsed(null)
      return
    }

    try {
      const parsedJson = JSON.parse(jsonString)
      setIsValid(true)
      setError("")
      setParsed(parsedJson)
      onChange?.(jsonString, true, parsedJson)
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setParsed(null)
      onChange?.(jsonString, false)
    }
  }

  const handleChange = (newValue: string) => {
    setJsonValue(newValue)
    validateJson(newValue)
  }

  const formatJson = () => {
    if (parsed) {
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonValue(formatted)
      onChange?.(formatted, true, parsed)
    }
  }

  const minifyJson = () => {
    if (parsed) {
      const minified = JSON.stringify(parsed)
      setJsonValue(minified)
      onChange?.(minified, true, parsed)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonValue)
  }

  const downloadJson = () => {
    const blob = new Blob([jsonValue], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Actions */}
      {showActions && !readOnly && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={formatJson}
            disabled={!isValid || !parsed}
            className="bg-white dark:bg-gray-800"
          >
            포맷팅
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={minifyJson}
            disabled={!isValid || !parsed}
            className="bg-white dark:bg-gray-800"
          >
            압축
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!jsonValue}
            className="bg-white dark:bg-gray-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            복사
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadJson}
            disabled={!jsonValue}
            className="bg-white dark:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <Textarea
          value={jsonValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "font-mono text-sm min-h-[200px] bg-white dark:bg-gray-800",
            !isValid && "border-red-500 focus:border-red-500",
            isValid && jsonValue && "border-green-500",
          )}
        />

        {/* Validation Indicator */}
        {showValidation && jsonValue && (
          <div className="absolute top-3 right-3">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showValidation && error && (
        <Alert className="border-red-500">
          <XCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">JSON 오류: {error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {showValidation && isValid && jsonValue && !error && (
        <Alert className="border-green-500">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-400">유효한 JSON입니다</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
