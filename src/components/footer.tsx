"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/editor") || pathname.startsWith("/login")) return null;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 text-sm text-gray-400 dark:text-gray-500">
            <a href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">首页</a>
            <a href="/blog" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">博客</a>
            <a href="/about" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">关于</a>
            <a href="/projects" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">项目</a>
            <a href="/blog/rss.xml" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">RSS</a>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} Xr-Space</p>
        </div>
      </div>
    </footer>
  );
}
