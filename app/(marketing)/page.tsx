"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { usePathname } from "next/navigation";

const defaultVariants: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.995, filter: "blur(6px)" },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.997,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: [0.4, 0.0, 0.2, 1] },
  },
};

const reducedVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? reducedVariants : defaultVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
