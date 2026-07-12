import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于", description: "关于 XR — 开发者与创造者。" };

const timeline = [
  { year: "2026", title: "上线个人博客", desc: "使用 Next.js 构建并部署了这个网站，用于分享想法和记录学习历程。" },
  { year: "2025", title: "深入全栈开发", desc: "专注于现代 Web 开发，掌握 React、Next.js 和云基础设施。" },
  { year: "2024", title: "开启开源之旅", desc: "开始参与开源项目，在公开平台上构建和分享。" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">关于我</h1>
        <p className="text-gray-500 dark:text-gray-400">简单介绍一下我是谁、我在做什么。</p>
      </div>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="h-32 w-32 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-5xl">👨‍💻</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">XR</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">开发者 · 创造者</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">热爱用代码构建产品。喜欢打磨精致的用户界面，探索新技术，并分享学习过程中的收获。</p>
            <div className="flex gap-3 text-sm">
              <a href="https://github.com/Xr1129" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">GitHub →</a>
              <a href="mailto:admin@iamxr.space" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">邮件 →</a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">经历</h2>
          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-10">
            {timeline.map((item) => (
              <div key={item.year} className="relative pl-8">
                <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full border-2 border-gray-900 dark:border-white bg-white dark:bg-black" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">{item.year}</span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
