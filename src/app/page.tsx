import { getAllPosts } from "@/lib/posts";
import GuiHome from "@/components/gui-home";

export default function HomePage() {
  const posts = getAllPosts();
  return <GuiHome posts={posts} />;
}
