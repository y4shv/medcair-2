"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Decorative "pulse flow" canvas: layered sine-wave lines in care teal and mint, plus three
// small ECG-style blips with a soft glowing dot travelling left to right.
// Ported from design-assets/medcair-flow-hero-demo.html. Never receives focus or pointer events.

type Theme = "light" | "ink";

interface Line {
  k: number;
  a1: number;
  a2: number;
  f1: number;
  f2: number;
  s1: number;
  s2: number;
  p1: number;
  p2: number;
}
interface Pulse {
  line: number;
  x: number;
  v: number;
  w: number;
  a: number;
}

const N = 22;
const SEED = [
  0.13, 0.71, 0.42, 0.88, 0.27, 0.55, 0.93, 0.34, 0.62, 0.08, 0.79, 0.47, 0.21, 0.66, 0.38, 0.84,
  0.19, 0.51, 0.97, 0.3, 0.74, 0.05,
];
const PULSE_LINES = [3, 5, 7, 9, 11, 13, 15, 17];

const LINES: Line[] = Array.from({ length: N }, (_, i) => ({
  k: i / (N - 1),
  a1: 34 + SEED[i] * 40,
  a2: 12 + SEED[(i + 5) % N] * 22,
  f1: 0.0042 + SEED[(i + 2) % N] * 0.0022,
  f2: 0.0095 + SEED[(i + 7) % N] * 0.004,
  s1: 0.35 + SEED[(i + 3) % N] * 0.35,
  s2: 0.25 + SEED[(i + 9) % N] * 0.3,
  p1: SEED[i] * 6.28,
  p2: SEED[(i + 4) % N] * 6.28,
}));

export function FlowBackground({
  theme = "light",
  paused = false,
  animate = true,
  className,
}: {
  theme?: Theme;
  /** Stops the animation and leaves one still frame. */
  paused?: boolean;
  /** false: draw one still frame and never start a loop (used inside the app). */
  animate?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The effect below reads these, so a change does not rebuild the canvas.
  const pausedRef = useRef(paused);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    kick.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let t = 2.2;
    let last = 0;
    let raf = 0;
    let visible = true;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceQuery.matches;
    const pulses: Pulse[] = [
      { line: 4, x: -80, v: 150, w: 30, a: 38 },
      { line: 9, x: 0, v: 120, w: 26, a: 30 },
      { line: 14, x: -400, v: 170, w: 34, a: 34 },
    ];

    const yAt = (L: Line, x: number) => {
      const env = 0.3 + 0.7 * Math.min(1, x / (W * 0.9));
      const base = H * (0.24 + 0.7 * L.k);
      return (
        base +
        env * (L.a1 * Math.sin(x * L.f1 + t * L.s1 + L.p1) + L.a2 * Math.sin(x * L.f2 - t * L.s2 + L.p2))
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = theme === "ink" ? "lighter" : "source-over";
      const byLine = new Map(pulses.map((p) => [p.line, p]));
      for (let i = 0; i < N; i++) {
        const L = LINES[i];
        const p = byLine.get(i);
        const m = i % 3;
        let col: string;
        let lw = 1.5;
        if (theme === "light") {
          col = m === 0 ? "rgba(11,110,143,0.42)" : m === 1 ? "rgba(60,207,176,0.85)" : "rgba(11,110,143,0.22)";
        } else {
          col = m === 0 ? "rgba(60,207,176,0.55)" : m === 1 ? "rgba(110,190,225,0.42)" : "rgba(60,207,176,0.22)";
        }
        if (p) {
          lw = 2;
          col = theme === "light" ? "rgba(11,110,143,0.75)" : "rgba(120,235,210,0.9)";
        }
        ctx.beginPath();
        ctx.lineWidth = lw;
        ctx.strokeStyle = col;
        for (let x = -10; x <= W + 10; x += 6) {
          let y = yAt(L, x);
          if (p) {
            const d = (x - p.x) / p.w;
            y -= p.a * d * Math.exp(-d * d);
          }
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      for (const p of pulses) {
        const y = yAt(LINES[p.line], p.x);
        const g = ctx.createRadialGradient(p.x, y, 0, p.x, y, 16);
        if (theme === "light") {
          g.addColorStop(0, "rgba(60,207,176,0.95)");
          g.addColorStop(1, "rgba(60,207,176,0)");
        } else {
          g.addColorStop(0, "rgba(180,255,235,1)");
          g.addColorStop(1, "rgba(60,207,176,0)");
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const shouldRun = () => animate && !reduce && !pausedRef.current && visible && !document.hidden;

    const frame = (ts: number) => {
      if (!shouldRun()) {
        raf = 0;
        return;
      }
      const dt = Math.min(0.05, (ts - last) / 1000 || 0); // cap the step so tab switches don't jump
      last = ts;
      t += dt;
      for (const p of pulses) {
        p.x += p.v * dt;
        if (p.x > W + 120) {
          p.x = -120 - Math.random() * 300;
          p.line = PULSE_LINES[Math.floor(Math.random() * PULSE_LINES.length)];
        }
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      if (shouldRun()) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      } else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        draw();
      }
    };
    kick.current = sync;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pulses[1].x = W * 0.3;
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      sync();
    });
    io.observe(canvas);
    const onReduce = () => {
      reduce = reduceQuery.matches;
      sync();
    };
    reduceQuery.addEventListener("change", onReduce);
    document.addEventListener("visibilitychange", sync);

    resize();
    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduceQuery.removeEventListener("change", onReduce);
      document.removeEventListener("visibilitychange", sync);
      kick.current = () => {};
    };
  }, [theme, animate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn("pointer-events-none absolute inset-0 block size-full", className)}
    />
  );
}
