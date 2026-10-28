"use client";

import { motion } from "motion/react";

type PillProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

export function Pill({ onClick, children, variant = "ghost" }: PillProps) {
  const styles =
    variant === "primary"
      ? "bg-fg text-bg hover:bg-white"
      : "border border-hairline text-muted hover:border-faint hover:text-fg";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`cursor-pointer rounded-full px-6 py-3 text-sm tracking-wide transition-colors duration-300 ${styles}`}
    >
      {children}
    </motion.button>
  );
}
