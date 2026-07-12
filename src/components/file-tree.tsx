"use client";

import { useRouter } from "next/navigation";

interface TreeNode { name: string; path?: string; icon: string; children?: TreeNode[]; }

const tree: TreeNode[] = [
  { name: "页面", icon: "📁", children: [
    { name: "about.tsx", path: "/about", icon: "📄" },
    { name: "projects.tsx", path: "/projects", icon: "📄" },
    { name: "博客", icon: "📁", children: [
      { name: "index.tsx", path: "/blog", icon: "📄" },
      { name: "[slug].tsx", icon: "📄" },
      { name: "hello-world.mdx", path: "/blog/hello-world", icon: "📝" },
    ]},
  ]},
  { name: "组件", icon: "📁", children: [
    { name: "header.tsx", icon: "⚛️" },
    { name: "terminal.tsx", icon: "⚛️" },
    { name: "file-tree.tsx", icon: "⚛️" },
  ]},
  { name: "工具库", icon: "📁", children: [{ name: "posts.ts", icon: "📄" }] },
  { name: "github", path: "https://github.com/Xr1129", icon: "🔗" },
];

function TreeNodeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const router = useRouter();
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-0.5 px-1 rounded text-xs transition-colors ${
          node.path
            ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300 font-medium"
            : "text-gray-400 dark:text-gray-500"
        }`}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        onClick={() => node.path && (node.path.startsWith("http") ? window.open(node.path, "_blank") : router.push(node.path))}
      >
        <span className="shrink-0 w-3.5 text-center text-[11px]">{node.icon}</span>
        <span className="truncate">{node.name}</span>
      </div>
      {node.children?.map((c) => <TreeNodeItem key={c.name} node={c} depth={depth + 1} />)}
    </div>
  );
}

export default function FileTree() {
  return (
    <div className="h-full bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-gray-800 font-mono text-xs select-none overflow-y-auto py-2 px-2">
      <div className="text-gray-400 dark:text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-2 px-1">资源管理器</div>
      {tree.map((node) => <TreeNodeItem key={node.name} node={node} />)}
    </div>
  );
}
