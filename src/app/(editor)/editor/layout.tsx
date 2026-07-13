"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white dark:bg-black">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            📝 Editor
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
