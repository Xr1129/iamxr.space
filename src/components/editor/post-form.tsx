"use client";

import { useState, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/posts";
import { slugify } from "@/lib/editor-utils";
import MdxEditor from "./mdx-editor";
import PreviewPanel from "./preview-panel";
import DeleteButton from "./delete-button";

interface PostFormProps {
  post?: Post; // undefined = new post
}

function localDateTime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function PostForm({ post }: PostFormProps) {
  const isNew = !post;
  const router = useRouter();

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugManuallySet, setSlugManuallySet] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug || "draft");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setContent((prev) => prev + data.markdown + "\n");
      }
    } catch {}
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallySet) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlug(value);
    setSlugManuallySet(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload: Record<string, string> = {
      slug,
      title,
      date: isNew ? localDateTime() : post!.date,
      excerpt,
      content,
    };
    if (!isNew) {
      payload.updated = localDateTime();
    }

    try {
      const url = isNew ? "/api/posts" : `/api/posts/${slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/editor");
      } else {
        const data = await res.json();
        setError(data.error || "Save failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {isNew ? "New Post" : "Edit Post"}
        </h2>
        <div className="flex items-center gap-2">
          {!isNew && <DeleteButton slug={post!.slug} />}
          {/* Sticky save bar offset spacer for mobile */}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="post-slug"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description..."
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-500 resize-y"
          />
        </div>

        {/* MDX Content */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Content (MDX)
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>
          {showPreview ? (
            <PreviewPanel content={content} />
          ) : (
            <MdxEditor
              value={content}
              onChange={setContent}
              onImageUpload={handleImageUpload}
            />
          )}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-black">
        <div className="mx-auto max-w-3xl flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/editor")}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !title || !slug}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : isNew ? "Publish" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
