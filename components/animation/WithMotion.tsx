"use client";

import React, {
  forwardRef,
  useEffect,
  useState,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";
import { motion, type MotionProps } from "motion/react";

const MOTION_ONLY_PROPS = new Set([
  "variants",
  "initial",
  "animate",
  "exit",
  "whileInView",
  "whileTap",
  "whileHover",
  "transition",
  "viewport",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "transformTemplate",
]);

function omitMotionOnlyProps<T extends Record<string, any>>(props: T) {
  const clean: Record<string, any> = {};
  for (const k in props) if (!MOTION_ONLY_PROPS.has(k)) clean[k] = props[k];
  return clean as T;
}

type AnyComponent = ElementType;

export function withMotion<T extends AnyComponent>(Base: T) {
  type Props = ComponentPropsWithoutRef<T> & MotionProps;

  const WithMotion = forwardRef<any, Props>((props, ref) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
      const clean = omitMotionOnlyProps(props as Record<string, any>);
      return React.createElement(Base as any, { ref, ...clean });
    }

    // Use motion.create() instead of deprecated motion()
    const MotionBase = motion.create(Base as any);
    return <MotionBase ref={ref} {...(props as any)} />;
  });

  WithMotion.displayName = `withMotion(${
    typeof Base === "string"
      ? Base
      : (Base as any).displayName || (Base as any).name || "Component"
  })`;

  return WithMotion as unknown as React.ForwardRefExoticComponent<
    Props & React.RefAttributes<any>
  >;
}

export const MotionDiv = withMotion("div");
export const MotionSpan = withMotion("span");
export const MotionSection = withMotion("section");
export const MotionArticle = withMotion("article");
export const MotionA = withMotion("a");
export const MotionButton = withMotion("button");
