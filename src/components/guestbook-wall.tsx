"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

interface Message {
  id: number;
  name: string;
  message: string;
  image?: string;
  date: string;
}

export default function GuestbookWall() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ["😀","😂","🤣","😍","🥰","😎","🤩","😭","😤","🤯","🥳","😴","🤔","🙄","😬","👍","👎","👏","🙌","💪","🤝","❤️","🧡","💛","💚","💙","💜","🔥","⭐","🎉","🎊","✨","💡","📝","💬","🫶","🌸","🌻","🍀","🐶","🐱","🦊","🐼"];

  function insertEmoji(emoji: string) {
    const el = textRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const newVal = text.slice(0, s) + emoji + text.slice(e);
    setText(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = s + emoji.length;
    });
  }

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => {});
  }, []);

  function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError("图片不能超过 10MB"); return; }
    setImage(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
    setError("");
  }

  function removeImage() {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSending(true);
    setError("");
    try {
      let res: Response;
      if (image) {
        const fd = new FormData();
        fd.append("name", name.trim());
        fd.append("message", text.trim());
        fd.append("image", image);
        res = await fetch("/api/guestbook", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/guestbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), message: text.trim() }),
        });
      }
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [data.message, ...prev]);
        setText("");
        setImage(null);
        setImagePreview(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setError(data.error || "Failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSending(false);
    }
  }

  const cardColors = [
    "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900",
    "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-900",
    "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900",
    "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900",
    "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-900",
    "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-900",
  ];

  return (
    <div className="space-y-8">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          写下留言
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="大侠留名"
          maxLength={50}
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500"
        />

        <div className="relative flex gap-3 items-start">
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="说点什么... 支持 Emoji 表情 🎉"
            maxLength={1000}
            required
            rows={3}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:placeholder:text-gray-500 resize-y"
          />
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="absolute right-1 top-2 w-7 h-7 flex items-center justify-center rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            😊
          </button>

          {/* Emoji picker popover */}
          {showEmoji && (
            <div className="absolute right-0 top-10 z-50 rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900 w-72">
              <div className="flex flex-wrap gap-1">
                {emojis.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { insertEmoji(e); setShowEmoji(false); }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-24 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            📷 图片
          </button>
          <span className="text-xs text-gray-400">{text.length}/1000</span>
          <button
            type="submit"
            disabled={sending || !name.trim() || !text.trim()}
            className="ml-auto rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {sending ? "..." : "发送"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {/* Messages */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 px-8 py-16 text-center">
            <p className="text-gray-400 dark:text-gray-500">还没有留言，来当第一个吧 🎉</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`rounded-xl border px-5 py-4 ${cardColors[i % cardColors.length]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {msg.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{msg.date}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap break-words">
                {msg.message}
              </p>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="留言图片"
                  className="mt-3 max-h-64 rounded-lg object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
