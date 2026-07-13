import { getAllPosts } from "@/lib/posts";
import BlogSearch from "@/components/blog-search";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Thoughts, learnings, and stories.
        </p>
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
