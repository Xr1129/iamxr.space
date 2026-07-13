import { getAllPosts } from "@/lib/posts";
import GuiHome from "@/components/gui-home";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const posts = getAllPosts();
  return <GuiHome posts={posts} />;
}
