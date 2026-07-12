"use client";

import Link from "next/link";
import ProjectCard from "@/components/project-card";
import SkillCloud from "@/components/skill-cloud";
import { projects } from "@/data/projects";

export default function GuiHome({ onSwitchToTerminal }: { onSwitchToTerminal?: () => void }) {
  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-black">
      <div className="absolute top-2 right-4 z-20">
        <button onClick={onSwitchToTerminal}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
          <span className="font-mono">{">_"}</span> 终端模式
        </button>
      </div>

      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl text-center space-y-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">开发者 · 创造者</p>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            你好，我是 <span className="text-gray-900 dark:text-white">XR</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
            欢迎来到我的个人空间。热衷于构建产品、探索技术、分享想法。
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-md bg-gray-900 dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">阅读博客 <span>→</span></Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-colors">关于我</Link>
            <a href="https://github.com/Xr1129" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-colors">GitHub</a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">技术栈</h2>
          <SkillCloud />
        </div>
      </section>

      <section className="py-16 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">项目</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">我做过的一些东西</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.slice(0, 2).map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
          <div className="text-center">
            <Link href="/projects" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">查看全部项目 →</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-lg text-center space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">博客</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">关于开发与技术的思考和分享。</p>
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-md bg-gray-900 dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">阅读博客 →</Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-900 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Xr—Space
      </footer>
    </div>
  );
}
