import { useEffect, useState } from "react";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";
import { Category } from "@/types/categories";

export function useActiveCategories(
  language: "ko" | "en" | "ja" | "vi" = "ko"
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const result = await getActiveCategories(language);
        setCategories(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [language]);

  return { categories, loading };
}
