"use client";

import { useState, useEffect, useRef } from "react";

interface PreviewPanelProps {
  content: string;
}

export default function PreviewPanel({ content }: PreviewPanelProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function loadPreview() {
    if (!content.trim()) {
      setHtml("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.ok) {
        setHtml(data.html);
      } else {
        setError(data.error || "Preview failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  // Auto-refresh preview when content changes (debounced 800ms)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      loadPreview();
    }, 800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preview {loading && <span className="text-gray-400 font-normal">· rendering...</span>}
        </h3>
      </div>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {html ? (
        <div
          className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary dark:prose-a:text-blue-400 prose-pre:rounded-xl prose-img:rounded-xl rounded-xl border border-gray-200 dark:border-gray-800 p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 px-8 py-12 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {content.trim() ? "Rendering..." : "Nothing to preview yet"}
          </p>
        </div>
      )}
    </div>
  );
}
