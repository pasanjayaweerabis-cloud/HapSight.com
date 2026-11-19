"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/a11yPrefs";

/**
 * A short, staggered reveal for the static (non-stage) sections right after the 3D story, so the
 * page keeps a little rhythm once the device stops moving. Respects the project's own
 * useReducedMotion (OS setting + the accessibility panel), not framer-motion's own hook.
 */
export function Reveal({
  index = 0,
  children,
  className = "",
}: {
  index?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
