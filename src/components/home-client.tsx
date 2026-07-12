"use client";

import { useState } from "react";
import type { Post } from "@/lib/posts";
import Terminal from "@/components/terminal";
import FileTree from "@/components/file-tree";
import BlogPreview from "@/components/blog-preview";
import GuiHome from "@/components/gui-home";

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [mode, setMode] = useState<"terminal" | "gui">("terminal");
  const isTerminal = mode === "terminal";

  return (
    <div className="flex h-full">
      {isTerminal && (
        <div className="w-52 shrink-0 hidden sm:block">
          <FileTree />
        </div>
      )}

      <div className="flex-1 overflow-hidden min-w-0">
        {isTerminal ? (
          <Terminal onSwitchToGui={() => setMode("gui")} />
        ) : (
          <GuiHome onSwitchToTerminal={() => setMode("terminal")} />
        )}
      </div>

      {isTerminal && (
        <div className="w-52 shrink-0 hidden lg:block">
          <BlogPreview posts={posts} />
        </div>
      )}
    </div>
  );
}
