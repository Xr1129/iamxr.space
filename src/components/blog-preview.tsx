import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function BlogPreview({ posts }: { posts: Post[] }) {
  const recent = posts.slice(0, 5);
  return (
    <div className="h-full bg-gray-50 dark:bg-black border-l border-gray-200 dark:border-gray-800 font-mono text-xs overflow-y-auto py-3 px-3">
      <div className="text-gray-400 dark:text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-3 px-1">最新文章</div>
      {recent.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-xs px-1">暂无文章</p>
      ) : (
        <div className="space-y-0.5">
          {recent.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <div className="text-gray-700 dark:text-gray-200 text-xs font-medium truncate">{post.title}</div>
              <div className="text-gray-400 dark:text-gray-500 text-[10px] mt-0.5">{post.date}</div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
        <Link href="/blog" className="block text-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-[10px] font-medium">全部文章 →</Link>
      </div>
    </div>
  );
}
