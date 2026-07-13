import type { Metadata } from "next";
import GuestbookWall from "@/components/guestbook-wall";

export const metadata: Metadata = {
  title: "留言墙",
  description: "留下你的足迹，说点什么吧。",
};

export default function GuestbookPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          留言墙
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          留下你的足迹，说点什么吧。
        </p>
      </div>

      <GuestbookWall />
    </div>
  );
}
