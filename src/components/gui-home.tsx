"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";
import HeroGeometry from "@/components/hero-geometry";
import ProjectCard from "@/components/project-card";
import { projects } from "@/data/projects";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Python",
  "Docker",
  "Git",
  "PostgreSQL",
  "Linux",
];

export default function GuiHome({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-white dark:bg-black scroll-smooth"
    >
      {/* ====== Hero | 全屏 ====== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroGeometry />

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6"
          >
            开发者 · 创造者
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            你好，我是{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Xr
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed"
          >
            构建产品 · 探索技术 · 分享想法
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              阅读博客 <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
            >
              关于我
            </Link>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 dark:text-gray-600"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">
            向下滚动
          </span>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.div>
      </section>

      {/* ====== Blog | 文章预览 ====== */}
      <section className="py-32 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-center font-mono">
              {"<"}博客 {" />"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">
              最近的想法与分享
            </p>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-8 py-16 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  还没有文章，敬请期待。
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.slice(0, 3).map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-900 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <time className="shrink-0 text-xs text-gray-400 dark:text-gray-500 font-mono">
                          {post.date}
                        </time>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-6 py-3 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                阅读全部文章 →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== Projects | 项目卡片 ====== */}
      <section className="py-32 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-center font-mono">
              {"<"}项目 {" />"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">
              我做过的东西
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard key={p.title} project={p} index={i} />
              ))}
            </div>

            {projects.length > 2 && (
              <div className="text-center mt-10">
                <Link
                  href="/projects"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  查看全部项目 →
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ====== Skills | 代码块美学 ====== */}
      <section className="py-32 px-4 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-12 text-center font-mono">
              {"<"}技能栈 {" />"}
            </h2>

            <div className="relative rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              {/* title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                  skills.ts
                </span>
              </div>

              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="flex">
                  <div className="select-none text-right pr-5 text-gray-300 dark:text-gray-700 shrink-0">
                    {Array.from({ length: skills.length + 3 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <div className="text-gray-800 dark:text-gray-200">
                    <div>
                      <span className="text-purple-500 dark:text-purple-400">const</span>{" "}
                      <span className="text-blue-500 dark:text-blue-400">skills</span>
                      <span>: </span>
                      <span className="text-green-500 dark:text-green-400">string</span>
                      <span className="text-gray-500">[]</span>
                      <span> = </span>
                      <span className="text-gray-500">[</span>
                    </div>
                    {skills.map((skill) => (
                      <div key={skill} className="ml-4">
                        <span className="text-orange-400 dark:text-orange-300">
                          &quot;{skill}&quot;
                        </span>
                        <span className="text-gray-500">,</span>
                      </div>
                    ))}
                    <div>
                      <span className="text-gray-500">];</span>
                    </div>
                    <div className="mt-3 text-gray-400 dark:text-gray-600">
                      <span className="text-purple-500 dark:text-purple-400">export</span>{" "}
                      <span className="text-purple-500 dark:text-purple-400">default</span>{" "}
                      skills;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* bottom spacer */}
      <div className="h-24" />
    </div>
  );
}
