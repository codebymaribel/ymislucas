"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  onAnimationComplete,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
  onAnimationComplete?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("es-AR", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    });

    // Subscribe to animation completion
    // We check if value matches target and velocity is near zero, or use a timeout as fallback if needed.
    // However, framer-motion springs don't have a simple "onComplete".
    // A workaround is to check when the value is close enough to the target.
    // OR allow the parent to just wait a fixed time.
    // BUT the user asked to "wait for the new totalBalance animation to complete".

    // Let's us use springValue.on("change") to detect completion?
    // A better way with framer-motion is usually adding `onUpdate` or similar to `<motion.span>` but here we are using hooks.
    // `useSpring` doesn't have an onComplete.

    // Alternative: explicit timeout based on expected duration? No, spring duration varies.

    // Let's use a check in the change handler.
    const unsubscribeFinish = springValue.on("change", (latest) => {
      const target = direction === "down" ? 0 : value;
      const isComplete = Math.abs(latest - target) < 0.01;
      if (isComplete && onAnimationComplete) {
        onAnimationComplete();
        unsubscribeFinish(); // Ensure it only fires once per animation cycle
      }
    });

    return () => {
      unsubscribe();
      unsubscribeFinish();
    };
  }, [springValue, decimalPlaces, value, direction, onAnimationComplete]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-slate-100 dark:text-white tracking-wider",
        className,
      )}
      ref={ref}
    />
  );
}
