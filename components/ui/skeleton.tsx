// components/ui/skeleton.tsx
type SkeletonProps = {
  className?: string;
  variant?: "text" | "button" | "circle";
};

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const base = "animate-pulse bg-gray-300 dark:bg-gray-700";

  const variantStyle =
    variant === "button"
      ? "rounded-full h-8 w-20"
      : variant === "circle"
      ? "rounded-full w-10 h-10"
      : "rounded h-4 w-16";

  return <div className={`${base} ${variantStyle} ${className}`} />;
}
