import { getAllPosts } from "@/lib/posts";
import HomeClient from "@/components/home-client";

export default function HomePage() {
  const posts = getAllPosts();

  return <HomeClient posts={posts} />;
}
