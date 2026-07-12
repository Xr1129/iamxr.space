"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  baseX: number; baseY: number; size: number;
}

const PARTICLE_COUNT = 60;
const CONNECT_DIST = 100;
const MOUSE_RADIUS = 150;

interface Props {
  theme?: "blue" | "green";
}

export default function HeroBackground({ theme = "blue" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);

  const isGreen = theme === "green";
  const baseHue = isGreen ? 140 : 240;
  const dotBase = isGreen ? "rgba(34,197,94," : "rgba(99,102,241,";
  const lineBase = isGreen ? "34,197,94" : "99,102,241";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reset = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (canvas.width / canvas.height)));
      const rows = Math.ceil(PARTICLE_COUNT / cols);
      const gapX = canvas.width / (cols + 1);
      const gapY = canvas.height / (rows + 1);

      particlesRef.current = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (particlesRef.current.length >= PARTICLE_COUNT) break;
          particlesRef.current.push({
            x: gapX * (c + 1) + (Math.random() - 0.5) * 30,
            y: gapY * (r + 1) + (Math.random() - 0.5) * 30,
            vx: 0, vy: 0,
            baseX: gapX * (c + 1),
            baseY: gapY * (r + 1),
            size: Math.random() * 1.5 + 1,
          });
        }
      }
    };

    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    reset();
    window.addEventListener("resize", reset);
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (const p of particles) {
        const dxB = p.baseX - p.x;
        const dyB = p.baseY - p.y;
        p.vx += dxB * 0.004;
        p.vy += dyB * 0.004;

        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (distM < MOUSE_RADIUS && distM > 0) {
          const force = (MOUSE_RADIUS - distM) / MOUSE_RADIUS;
          p.vx += (dxM / distM) * force * 0.1;
          p.vy += (dyM / distM) * force * 0.1;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = dotBase + "0.3)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineBase},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", reset);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [baseHue, dotBase, lineBase]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" style={{ opacity: 0.3 }} />
    </>
  );
}
