"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function EditorDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Posts ({posts.length})
        </h2>
        <Link
          href="/editor/new"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400 dark:text-gray-500 py-8 text-center">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-8 py-16 text-center">
          <p className="text-gray-400 dark:text-gray-500">No posts yet.</p>
          <Link
            href="/editor/new"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {post.date} · /blog/{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/editor/${post.slug}`}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
