"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import MarkdownToolbar from "./markdown-toolbar";
import SlashCommands from "./slash-commands";

interface MdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: () => void;
}

export default function MdxEditor({
  value,
  onChange,
  placeholder,
  onImageUpload,
}: MdxEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionMenu, setSelectionMenu] = useState<{ top: number; left: number } | null>(null);
  const [slashState, setSlashState] = useState<{
    visible: boolean;
    filter: string;
    top: number;
    left: number;
  }>({ visible: false, filter: "", top: 0, left: 0 });
  const selTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Cursor helpers ──────────────────────────────────

  function getTextarea() {
    return textareaRef.current;
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    const el = getTextarea();
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const selected = value.slice(s, e);
    const text = selected || placeholder;
    const newVal = value.slice(0, s) + before + text + after + value.slice(e);
    onChange(newVal);
    const cursor = s + before.length + (selected ? text.length : 0);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = selected ? s + before.length + text.length + after.length : cursor;
    });
  }

  function prefixLine(prefix: string) {
    const el = getTextarea();
    if (!el) return;
    const s = el.selectionStart;
    // Find start of current line
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = lineStart + prefix.length;
      el.selectionStart = el.selectionEnd = cursor;
    });
  }

  function insertBlock(before: string, after: string) {
    const el = getTextarea();
    if (!el) return;
    const s = el.selectionStart;
    // Ensure we're at a new line
    const prefix = s === 0 || value[s - 1] === "\n" ? "" : "\n";
    const suffix = value[s] === "\n" || s === value.length ? "" : "\n";
    const newVal = value.slice(0, s) + prefix + before + "\n\n" + after + suffix + value.slice(s);
    onChange(newVal);
    const cursor = s + prefix.length + before.length + 1;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = cursor;
    });
  }

  // ── Tool actions ────────────────────────────────────

  const handleToolAction = useCallback(
    (action: string) => {
      switch (action) {
        case "bold":
          wrapSelection("**", "**", "粗体");
          break;
        case "italic":
          wrapSelection("*", "*", "斜体");
          break;
        case "strikethrough":
          wrapSelection("~~", "~~", "删除线");
          break;
        case "heading":
          prefixLine("## ");
          break;
        case "link":
          wrapSelection("[", "]()", "链接文字");
          break;
        case "code": {
          const el = getTextarea();
          if (el && el.selectionStart !== el.selectionEnd) {
            wrapSelection("`", "`", "code");
          } else {
            insertBlock("```", "```");
          }
          break;
        }
        case "quote":
          prefixLine("> ");
          break;
        case "list":
          prefixLine("- ");
          break;
        case "divider":
          prefixLine("\n---\n");
          break;
        case "image":
          onImageUpload?.();
          break;
      }
      setSelectionMenu(null);
    },
    [value, onChange, onImageUpload]
  );

  // ── Slash commands ──────────────────────────────────

  const slashCommands = [
    {
      id: "image",
      label: "/image",
      description: "插入图片",
      apply: () => {
        removeSlash();
        onImageUpload?.();
      },
    },
    { id: "heading", label: "/heading", description: "二级标题", apply: () => { removeSlash(); prefixLine("## "); } },
    { id: "bold", label: "/bold", description: "粗体", apply: () => { removeSlash(); wrapSelection("**", "**", "粗体"); } },
    { id: "italic", label: "/italic", description: "斜体", apply: () => { removeSlash(); wrapSelection("*", "*", "斜体"); } },
    { id: "link", label: "/link", description: "链接", apply: () => { removeSlash(); wrapSelection("[", "]()", "链接文字"); } },
    {
      id: "code",
      label: "/code",
      description: "代码块",
      apply: () => {
        removeSlash();
        insertBlock("```", "```");
      },
    },
    { id: "list", label: "/list", description: "无序列表", apply: () => { removeSlash(); prefixLine("- "); } },
    { id: "quote", label: "/quote", description: "引用", apply: () => { removeSlash(); prefixLine("> "); } },
    { id: "divider", label: "/divider", description: "分割线", apply: () => { removeSlash(); prefixLine("\n---\n"); } },
    {
      id: "strikethrough",
      label: "/strikethrough",
      description: "删除线",
      apply: () => { removeSlash(); wrapSelection("~~", "~~", "删除线"); },
    },
  ];

  function removeSlash() {
    const el = getTextarea();
    if (!el) return;
    const s = el.selectionStart;
    // Find the '/' that opened the menu
    const before = value.slice(0, s);
    const slashIdx = before.lastIndexOf("/");
    if (slashIdx === -1) return;
    // Check that / is preceded by space or start-of-line
    const charBefore = slashIdx > 0 ? before[slashIdx - 1] : "\n";
    if (charBefore !== " " && charBefore !== "\n") return;
    const newVal = value.slice(0, slashIdx) + value.slice(s);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = slashIdx;
    });
  }

  // ── Selection menu ──────────────────────────────────

  function handleSelect() {
    const el = getTextarea();
    if (!el) return;
    if (el.selectionStart !== el.selectionEnd) {
      // Show floating menu near selection
      setSelectionMenu({ top: -48, left: 0 }); // Position above toolbar
    } else {
      setSelectionMenu(null);
    }
  }

  // Detect selection changes
  function handleMouseUp() {
    if (selTimerRef.current) clearTimeout(selTimerRef.current);
    selTimerRef.current = setTimeout(handleSelect, 100);
  }

  // ── Slash detection on input ────────────────────────

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    onChange(newValue);

    const el = e.target;
    const cursor = el.selectionStart;
    const textBefore = newValue.slice(0, cursor);

    // Check for slash command trigger
    const slashMatch = textBefore.match(/(?:^|[\s\n])\/(\w*)$/);
    if (slashMatch) {
      const filter = slashMatch[1];
      // Approximate position
      setSlashState({ visible: true, filter, top: -240, left: 0 });
    } else {
      setSlashState((s) => (s.visible ? { ...s, visible: false } : s));
    }

    // Clear selection menu
    setSelectionMenu(null);
  }

  // ── Keyboard ────────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent) {
    if (slashState.visible) {
      if (e.key === "Escape") {
        e.preventDefault();
        setSlashState((s) => ({ ...s, visible: false }));
      }
      if (e.key === "Enter") {
        // Let the first filtered command apply
        const filter = slashState.filter;
        const matched = slashCommands.filter(
          (c) => c.id.includes(filter) || c.label.includes(filter)
        );
        if (matched.length > 0) {
          e.preventDefault();
          matched[0].apply();
          setSlashState({ visible: false, filter: "", top: 0, left: 0 });
        }
      }
    }
  }

  // ── Selection menu buttons ──────────────────────────

  const selBtns = [
    { id: "bold", label: "B" },
    { id: "italic", label: "I" },
    { id: "heading", label: "H" },
    { id: "code", label: "</>" },
    { id: "link", label: "🔗" },
    { id: "strikethrough", label: "S̶" },
  ];

  return (
    <div className="relative">
      {/* Slash commands panel */}
      <SlashCommands
        commands={slashCommands}
        filter={slashState.filter}
        visible={slashState.visible}
        position={{ top: slashState.top, left: slashState.left }}
        onSelect={() => setSlashState({ visible: false, filter: "", top: 0, left: 0 })}
      />

      {/* Floating selection menu */}
      {selectionMenu && (
        <div className="absolute z-50 -top-12 left-0 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {selBtns.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => handleToolAction(btn.id)}
              className="w-9 h-9 flex items-center justify-center rounded text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onMouseUp={handleMouseUp}
        onKeyUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setTimeout(() => setSelectionMenu(null), 200);
        }}
        placeholder={placeholder || "Write your MDX content..."}
        className="w-full min-h-[50vh] rounded-t-xl border border-b-0 border-gray-200 bg-white px-4 py-3 font-mono text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500 resize-y rounded-b-none"
        spellCheck={false}
      />

      {/* Bottom toolbar */}
      <MarkdownToolbar onAction={handleToolAction} />
    </div>
  );
}
