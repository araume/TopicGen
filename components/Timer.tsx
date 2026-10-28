"use client";

import { motion } from "motion/react";

const RADIUS = 150;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function format(ms: number) {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

type TimerProps = {
  remaining: number;
  total: number;
  label: string;
  /** Below this many ms the ring brightens and pulses. */
  urgentBelow?: number;
};

export function Timer({ remaining, total, label, urgentBelow }: TimerProps) {
  const progress = total > 0 ? remaining / total : 0;
  const urgent = urgentBelow !== undefined && remaining > 0 && remaining <= urgentBelow;

  return (
    <div
      role="timer"
      aria-label={`${label}: ${format(remaining)} remaining`}
      className="relative grid size-[min(78vw,320px)] place-items-center"
    >
      <svg viewBox="0 0 320 320" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="160" cy="160" r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth="2" />
        <motion.circle
          cx="160"
          cy="160"
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          stroke={urgent ? "var(--fg)" : "var(--muted)"}
          style={{ transition: "stroke-dashoffset 300ms linear, stroke 600ms ease" }}
          animate={urgent ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
          transition={urgent ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted">{label}</p>
        <p className="text-5xl font-extralight tabular-nums tracking-tight text-fg sm:text-6xl">
          {format(remaining)}
        </p>
      </div>
    </div>
  );
}
