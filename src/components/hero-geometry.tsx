"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// ── Particle ──────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const PARTICLE_COUNT_PC = 180;
const PARTICLE_COUNT_ANDROID = 50;
const REPEL_RADIUS = 180;
const MAX_SPEED = 0.8;

function getParticleCount(): number {
  if (typeof document === "undefined") return PARTICLE_COUNT_PC;
  return document.documentElement.dataset.os === "android"
    ? PARTICLE_COUNT_ANDROID
    : PARTICLE_COUNT_PC;
}

interface Props {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function HeroGeometry({ containerRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const darkRef = useRef(false);
  const seededRef = useRef(false);

  // ── Track dark mode ──
  useEffect(() => {
    darkRef.current = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      darkRef.current = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // ── Particle canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sizeTarget = containerRef?.current ?? wrapperRef.current?.parentElement;
    if (!sizeTarget) return;

    let w = 0;
    let h = 0;

    function seed(w: number, h: number) {
      const particles: Particle[] = [];
      for (let i = 0; i < getParticleCount(); i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 3.5 + 1.5,
          opacity: Math.random() * 0.4 + 0.12,
        });
      }
      particlesRef.current = particles;
    }

    const ro = new ResizeObserver(() => {
      const rect = sizeTarget.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = w;
      canvas.height = h;

      if (!seededRef.current && h > 0) {
        seed(w, h);
        seededRef.current = true;
      }
    });
    ro.observe(sizeTarget);

    function getMouseRelative() {
      const rect = sizeTarget!.getBoundingClientRect();
      return {
        mx: mouseRef.current.x - rect.left,
        my: mouseRef.current.y - rect.top,
      };
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);

      const { mx, my } = getMouseRelative();
      const isDark = darkRef.current;
      const dotColor = isDark ? "210, 220, 235" : "100, 110, 130";

      for (const p of particlesRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REPEL_RADIUS && dist > 1) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * 0.07;
          p.vy += (dy / dist) * force * 0.07;
        }

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.997;
        p.vy *= 0.997;

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${dotColor}, ${p.opacity})`;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [containerRef]);

  // ── Mouse tracking ──
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── Layer 1: dot grid ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Layer 2: gradient orbs — each anchored to a different page region ── */}

      {/* 🔵 蓝紫 — Hero 区（top 8%） */}
      <motion.div
        animate={{ x: [0, 120, -60, 40, 0], y: [0, -80, 80, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[5%] w-[40%] aspect-square rounded-full
                   bg-gradient-to-br from-blue-500/30 to-purple-500/20
                   dark:from-blue-400/18 dark:to-purple-400/10 blur-3xl"
      />

      {/* 🟣 紫粉 — Hero 下部 / Blog 上部（top 30%） */}
      <motion.div
        animate={{ x: [0, -100, 80, -40, 0], y: [0, 150, -100, 80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] right-[3%] w-[35%] aspect-square rounded-full
                   bg-gradient-to-tl from-purple-500/25 to-pink-500/16
                   dark:from-purple-400/14 dark:to-pink-400/8 blur-3xl"
      />

      {/* 🟢 青蓝 — Blog / Projects 区（top 50%） */}
      <motion.div
        animate={{ x: [0, 150, -80, 100, 0], y: [0, -120, 150, -60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-[8%] w-[36%] aspect-square rounded-full
                   bg-gradient-to-tr from-cyan-500/22 to-blue-500/22
                   dark:from-cyan-400/10 dark:to-blue-400/6 blur-3xl"
      />

      {/* 🟠 琥珀玫红 — Projects / Skills 区（top 68%） */}
      <motion.div
        animate={{ x: [0, -120, 60, -80, 0], y: [0, 100, -80, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[68%] right-[8%] w-[32%] aspect-square rounded-full
                   bg-gradient-to-bl from-amber-500/20 to-rose-500/16
                   dark:from-amber-400/10 dark:to-rose-400/6 blur-3xl"
      />

      {/* 🟣 靛蓝 — Skills 底部区（top 85%） */}
      <motion.div
        animate={{ x: [0, 80, -100, 50, 0], y: [0, -60, 40, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[85%] left-[25%] w-[30%] aspect-square rounded-full
                   bg-gradient-to-r from-indigo-500/18 to-violet-500/14
                   dark:from-indigo-400/9 dark:to-violet-400/5 blur-3xl"
      />

      {/* ── Layer 3: particle canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
