"use client";

interface MarkdownToolbarProps {
  onAction: (action: string) => void;
}

const TOOLS = [
  { id: "bold", label: "B", title: "粗体 (Bold)" },
  { id: "italic", label: "I", title: "斜体 (Italic)" },
  { id: "heading", label: "H", title: "标题 (Heading)" },
  { id: "strikethrough", label: "S̶", title: "删除线" },
  { id: "link", label: "🔗", title: "链接 (Link)" },
  { id: "image", label: "📷", title: "图片" },
  { id: "code", label: "</>", title: "代码" },
  { id: "quote", label: "❝", title: "引用" },
  { id: "list", label: "•", title: "列表" },
  { id: "divider", label: "—", title: "分割线" },
];

export default function MarkdownToolbar({ onAction }: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-t border-gray-200 bg-gray-50 px-2 py-2 dark:border-gray-800 dark:bg-gray-950">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          title={tool.title}
          onClick={() => onAction(tool.id)}
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-700 transition-colors touch-manipulation"
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
