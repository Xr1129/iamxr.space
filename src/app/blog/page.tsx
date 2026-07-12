import { getAllPosts, getAllTags } from "@/lib/posts";
import BlogSearch from "@/components/blog-search";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Thoughts, learnings, and stories.
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <Link
                key={t.tag}
                href={`/blog/tag/${encodeURIComponent(t.tag.toLowerCase())}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
              >
                {t.tag}
                <span className="text-gray-300 dark:text-gray-600">({t.count})</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-8 py-16 text-center">
          <p className="text-gray-400 dark:text-gray-500">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <BlogSearch posts={posts} />
      )}
    </div>
  );
}
