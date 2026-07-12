"use client";

import { useState, useEffect, useCallback } from "react";

const WORDS = ["Developer", "Creator", "Thinker", "Builder", "Explorer"];

export default function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = WORDS[wordIndex];

    if (!deleting) {
      if (charIndex < currentWord.length) {
        setCharIndex((c) => c + 1);
      } else {
        setTimeout(() => setDeleting(true), 1500);
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((c) => c - 1);
      } else {
        setDeleting(false);
        setWordIndex((w) => (w + 1) % WORDS.length);
      }
    }
  }, [wordIndex, charIndex, deleting]);

  useEffect(() => {
    const speed = deleting ? 50 : 120;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, deleting]);

  return (
    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-violet-300">
      {WORDS[wordIndex].slice(0, charIndex)}
      <span className="animate-pulse text-gray-400 dark:text-gray-500">|</span>
    </span>
  );
}
