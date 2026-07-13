import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import PostForm from "@/components/editor/post-form";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  return <PostForm post={post} />;
}
