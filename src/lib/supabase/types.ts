// src/lib/supabase/types.ts
// Supabase Database 타입 정의
// 
// 이 파일은 Supabase CLI를 통해 자동 생성됩니다:
// npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts
//
// 또는 로컬 개발 환경에서:
// npx supabase gen types typescript --local > src/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // 테이블 타입 정의는 Supabase CLI로 자동 생성됩니다
      // 예시:
      // users: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     created_at: string;
      //   };
      //   Insert: {
      //     id?: string;
      //     email: string;
      //     created_at?: string;
      //   };
      //   Update: {
      //     id?: string;
      //     email?: string;
      //     created_at?: string;
      //   };
      // };
    };
    Views: {
      // 뷰 타입 정의
    };
    Functions: {
      // 함수 타입 정의
    };
    Enums: {
      // Enum 타입 정의
    };
  };
}

// 타입 헬퍼 유틸리티
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// 사용 예시:
// import type { Database, Tables } from "@/lib/supabase/types";
// 
// type User = Tables<"users">;
// type NewUser = TablesInsert<"users">;
// type UserUpdate = TablesUpdate<"users">;

