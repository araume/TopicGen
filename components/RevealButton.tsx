"use client";

import { motion, useReducedMotion } from "motion/react";

export function RevealButton({ onClick }: { onClick: () => void }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative grid place-items-center">
      {/* Breathing glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute size-[340px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 65%)" }}
        animate={reduce ? { opacity: 0.6 } : { opacity: [0.4, 0.8, 0.4], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative grid size-52 cursor-pointer place-items-center rounded-full border border-hairline bg-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-faint sm:size-56"
      >
        <span className="flex flex-col items-center">
          <span className="font-serif text-4xl italic text-fg">Reveal</span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted">one topic</span>
        </span>
      </motion.button>
    </div>
  );
}
