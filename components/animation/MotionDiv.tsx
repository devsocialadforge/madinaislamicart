"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import type { ComponentProps, ForwardedRef } from "react";
import { forwardRef } from "react";

type MotionDivProps = ComponentProps<typeof m.div>; // <-- perfect prop type

const MotionDiv = forwardRef(function MotionDiv(
  props: MotionDivProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div ref={ref} {...props} />
    </LazyMotion>
  );
});

export default MotionDiv;

// example usage:

// import MotionDiv from "@/components/animation/MotionDiv";
// import { fadeIn } from "@/components/animation/varients";

// <MotionDiv variants={fadeIn}>
//   <h1>Hello</h1>
// </MotionDiv>
