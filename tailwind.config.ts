import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    // 모바일 우선 브레이크포인트 (기본값이지만 명시적으로 설정)
    screens: {
      sm: "640px",   // 모바일 가로
      md: "768px",   // 태블릿
      lg: "1024px",  // 데스크탑
      xl: "1280px",  // 큰 데스크탑
      "2xl": "1536px", // 매우 큰 데스크탑
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Testy 브랜드 Purple/Pink 그라디언트 컬러 팔레트
        brand: {
          // Purple 계열
          purple: {
            50: "#faf5ff",   // 매우 밝은 보라
            100: "#f3e8ff",  // 밝은 보라
            200: "#e9d5ff",  // 연한 보라
            300: "#d8b4fe",  // 부드러운 보라
            400: "#c084fc",  // 중간 보라
            500: "#a855f7",  // 기본 보라 (Primary Purple)
            600: "#9333ea",  // 진한 보라
            700: "#7e22ce",  // 더 진한 보라
            800: "#6b21a8",  // 매우 진한 보라
            900: "#581c87",  // 가장 진한 보라
            950: "#3b0764",  // 거의 검은 보라
          },
          // Pink 계열
          pink: {
            50: "#fdf2f8",   // 매우 밝은 핑크
            100: "#fce7f3",  // 밝은 핑크
            200: "#fbcfe8",  // 연한 핑크
            300: "#f9a8d4",  // 부드러운 핑크
            400: "#f472b6",  // 중간 핑크
            500: "#ec4899",  // 기본 핑크 (Primary Pink)
            600: "#db2777",  // 진한 핑크
            700: "#be185d",  // 더 진한 핑크
            800: "#9f1239",  // 매우 진한 핑크
            900: "#831843",  // 가장 진한 핑크
            950: "#500724",  // 거의 검은 핑크
          },
          // 그라디언트 조합용 색상
          gradient: {
            start: "#a855f7",  // Purple 500
            end: "#ec4899",    // Pink 500
            "start-light": "#c084fc",  // Purple 400 (라이트 모드)
            "end-light": "#f472b6",    // Pink 400 (라이트 모드)
            "start-dark": "#9333ea",   // Purple 600 (다크 모드)
            "end-dark": "#db2777",    // Pink 600 (다크 모드)
          },
        },
      },
      // Purple/Pink 그라디언트 유틸리티
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "gradient-brand-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        "gradient-brand-conic": "conic-gradient(from 180deg, var(--tw-gradient-stops))",
      },
      gradientColorStops: {
        "brand-purple": "#a855f7",
        "brand-pink": "#ec4899",
        "brand-purple-light": "#c084fc",
        "brand-pink-light": "#f472b6",
        "brand-purple-dark": "#9333ea",
        "brand-pink-dark": "#db2777",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
