import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import Comments from "@/components/comments";
import MdxImage from "@/components/mdx-image";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <article>
        <header className="mb-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>{" "}
            Back to Blog
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <time className="text-sm text-gray-400 dark:text-gray-500">{post.date}</time>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {Math.ceil(post.content.split(/\s+/).length / 200)} min read
            </span>
          </div>
        </header>

        <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary dark:prose-a:text-blue-400 prose-pre:rounded-xl prose-pre:shadow-sm prose-img:rounded-xl">
          <MDXRemote
            source={post.content}
            components={{ Image: MdxImage }}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeHighlight as any, rehypeSlug],
              },
            }}
          />
        </div>
      </article>

      <Comments />

      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>{" "}
          Back to all posts
        </Link>
      </div>
    </div>
  );
}
