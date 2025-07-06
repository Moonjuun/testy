import React from "react";

export function formatBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g); // '**' 로 감싸진 텍스트 구분
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-purple-600">
          {part.slice(2, -2)}
        </strong>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}
