"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Line { id: number; type: "system" | "input" | "output" | "error"; text: string; }

const BOOT_SEQUENCE: { delay: number; type: Line["type"]; text: string }[] = [
  { delay: 200, type: "system", text: "[BOOT] Initializing... OK" },
  { delay: 300, type: "system", text: "[BOOT] Loading profile... DONE" },
  { delay: 400, type: "input", text: "guest@iamxr:~$ cat about.txt" },
  { delay: 200, type: "output", text: "> Developer · Creator · Explorer" },
  { delay: 400, type: "input", text: "guest@iamxr:~$ ls skills/" },
  { delay: 150, type: "output", text: "TypeScript  React  Next.js  Node.js  Python  Docker  Git  Linux" },
  { delay: 400, type: "input", text: "guest@iamxr:~$ ls projects/" },
  { delay: 150, type: "output", text: "[personal-website]  [coming-soon]" },
  { delay: 300, type: "input", text: "guest@iamxr:~$ █" },
  { delay: 400, type: "system", text: "┌──────────────────────────────────────────┐" },
  { delay: 150, type: "system", text: "│  about     — 关于我                     │" },
  { delay: 150, type: "system", text: "│  skills    — 技术栈                     │" },
  { delay: 150, type: "system", text: "│  projects  — 我的项目                   │" },
  { delay: 150, type: "system", text: "│  blog      — 阅读博客                   │" },
  { delay: 150, type: "system", text: "│  contact   — 联系方式                   │" },
  { delay: 150, type: "system", text: "│  clear     — 清屏                       │" },
  { delay: 150, type: "system", text: "│  gui       — 切换到图形界面             │" },
  { delay: 150, type: "system", text: "└──────────────────────────────────────────┘" },
];

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => ["about    关于我","skills   技术栈","projects 我的项目","blog     阅读博客","contact  联系方式","clear    清屏","gui      切换到图形界面"],
  about: () => ["嗨，我是 XR — 一名开发者与创造者。","GitHub: https://github.com/Xr1129","Email:  admin@iamxr.space"],
  skills: () => ["语言:     TypeScript  Python  SQL  Bash","前端:     React  Next.js  Tailwind CSS","后端:     Node.js  Express  PostgreSQL","运维:     Docker  Linux  Nginx"],
  projects: () => ["[personal-website] — 本站！Next.js + Tailwind + MDX","[coming-soon]      — 更多项目开发中..."],
  blog: () => ["正在打开博客..."],
  contact: () => ["GitHub: https://github.com/Xr1129","Email:  admin@iamxr.space","欢迎联系！"],
  gui: () => ["正在切换到图形界面..."],
};

export default function Terminal({ onSwitchToGui }: { onSwitchToGui?: () => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const addLine = useCallback((type: Line["type"], text: string) => {
    setLines((prev) => { const next = [...prev, { id: nextId.current++, type, text }]; return next.length > 20 ? next.slice(-20) : next; });
  }, []);

  useEffect(() => {
    if (bootIndex >= BOOT_SEQUENCE.length) { setBootDone(true); return; }
    const item = BOOT_SEQUENCE[bootIndex];
    const timer = setTimeout(() => { addLine(item.type, item.text); setBootIndex((i) => i + 1); }, item.delay);
    return () => clearTimeout(timer);
  }, [bootIndex, addLine]);

  useEffect(() => { if (bootDone) inputRef.current?.focus(); }, [bootDone]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    addLine("input", `guest@iamxr:~$ ${trimmed}`);
    if (!trimmed) return;
    const [name, ...args] = trimmed.split(/\s+/);
    if (name === "clear") { setLines([]); return; }
    if (name === "blog") { addLine("output", "正在打开博客..."); setTimeout(() => router.push("/blog"), 300); return; }
    if (name === "gui" && onSwitchToGui) { addLine("output", "正在切换到图形界面..."); setTimeout(() => onSwitchToGui(), 400); return; }
    const handler = COMMANDS[name];
    if (handler) { handler(args).forEach((line) => addLine("output", line)); }
    else { addLine("error", `bash: ${name}: 命令未找到`); addLine("error", '输入 "help" 查看可用命令。'); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim()) return; handleCommand(input); setInput(""); };
  const handleClick = () => { if (bootDone) inputRef.current?.focus(); };

  return (
    <div className="relative bg-white dark:bg-black font-mono text-xs sm:text-sm h-full overflow-hidden selection:bg-gray-200 dark:selection:bg-gray-800">
      <div className="flex flex-col h-full max-w-4xl mx-auto px-4">
        <div ref={outputRef} className="flex-1 flex flex-col justify-start overflow-hidden">
          <div className="space-y-0 pb-1">
            {lines.map((line) => (
              <div key={line.id} className={`leading-snug ${
                line.type === "system" ? "text-gray-400 dark:text-gray-500" :
                line.type === "input" ? "text-gray-800 dark:text-gray-200 font-medium" :
                line.type === "output" ? "text-gray-600 dark:text-gray-400" :
                "text-red-500 dark:text-red-400"
              }`}>
                {line.text === "guest@iamxr:~$ █" && !bootDone ? (
                  <>guest@iamxr:~$ <span className="inline-block w-2 h-3.5 bg-gray-400 dark:bg-gray-500 align-middle animate-pulse" /></>
                ) : <span>{line.text}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="shrink-0 py-2 border-t border-gray-200 dark:border-gray-800">
          {bootDone ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">guest@iamxr:~$</span>
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 outline-none border-none caret-gray-500 placeholder:text-gray-300 dark:placeholder:text-gray-700"
                autoFocus autoComplete="off" spellCheck="false" aria-label="Terminal input" />
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-300 dark:text-gray-600">guest@iamxr:~$</span>
              <span className="text-gray-300 dark:text-gray-600 animate-pulse">Initializing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
