import Image from "next/image";
import Link from "next/link";
import { TestCardProps } from "@/types/test";

export function TestCard({ test, featured = false }: TestCardProps) {
  return (
    <Link href={`/test/${test.id}`}>
      <div
        className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1
        ${featured ? "border-2 border-purple-100 dark:border-purple-800" : ""}
        w-full
        `}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={test.thumbnail_url || "/placeholder.svg"}
            alt={test.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-indigo-500 dark:bg-indigo-600">
            {test.category?.name}
          </div>
          {featured && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              인기
            </div>
          )}
        </div>

        <div className="p-4">
          <h3
            className={`font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${
              featured ? "text-lg" : "text-base"
            } truncate`}
          >
            {test.test_translations.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {test.test_translations.description}
          </p>
        </div>
      </div>

      {/* <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{test.participants} 참여</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{test.duration} 소요</span>
            </div>
          </div> */}
    </Link>
  );
}
