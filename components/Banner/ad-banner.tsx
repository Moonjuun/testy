interface AdBannerProps {
  type: "side" | "center"
  size: "300x600" | "728x90" | "336x280"
}

export function AdBanner({ type, size }: AdBannerProps) {
  const dimensions = {
    "300x600": { width: 300, height: 600 },
    "728x90": { width: 728, height: 90 },
    "336x280": { width: 336, height: 280 },
  }

  const { width, height } = dimensions[size]

  return (
    <div
      className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center ${
        type === "center" ? "mx-auto" : ""
      }`}
      style={{ width, height }}
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="text-sm font-medium">광고 영역</div>
        <div className="text-xs">{size}</div>
      </div>
    </div>
  )
}
