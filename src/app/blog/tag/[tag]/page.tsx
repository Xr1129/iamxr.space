import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";

interface Props {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.tags?.some((t) => t.toLowerCase() === decodedTag.toLowerCase()));

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>{" "}
          Back to Blog
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">
          Tag: <span className="text-primary dark:text-blue-400">{decodedTag}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-gray-900/50"
          >
            <article>
              <time className="text-xs font-medium text-gray-400 dark:text-gray-500">{post.date}</time>
              <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-gray-500 leading-relaxed dark:text-gray-400 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t: string) => (
                    <span
                      key={t}
                      className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
