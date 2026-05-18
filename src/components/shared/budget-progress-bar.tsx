import { useTheme } from "@/context/theme-context";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetProgressBarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Hardcoded until wired to react-query */
const CURRENT_AMOUNT = 120;
const MAX_AMOUNT = 1000;

/** Arc geometry — all based on the fixed 320×320 viewBox */
const VIEWBOX_SIZE = 320;
const CENTER = VIEWBOX_SIZE / 2; // 160
const RADIUS = 100;
const TRACK_RADIUS = 120;
const START_ANGLE_DEG = 135; // where the arc visually begins (bottom-left)
const DOT_START_ANGLE_DEG = -135; // same position expressed for polarToCartesian
const SWEEP_DEG = 270; // total arc sweep

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = (SWEEP_DEG / 360) * CIRCUMFERENCE;
const ANIMATION_DURATION = 1.4;

/** Color thresholds based on percentage of budget remaining */
const COLOR_RED = "#DC3318";
const COLOR_YELLOW = "#E9D502";
const COLOR_GREEN = "#C2E812";

const componentTheme = {
  light: {
    BG_COLOR: "#fff",
    TRACK_COLOR: "#E5E7EB",
    TEXT_COLOR: "#1C1B1A",
    NUMBER_COLOR: "#1C1B1A",
  },
  dark: {
    BG_COLOR: "#151921",
    TRACK_COLOR: "#101319",
    TEXT_COLOR: "#ffffff",
    NUMBER_COLOR: "#C2E812",
  },
} as const;

/**
 * Size config — viewBox stays fixed at 320×320.
 * Only the rendered canvas size and stroke/dot widths scale.
 */
const SIZE_CONFIG = {
  sm: {
    canvas: 200,
    strokeWidth: 8,
    dotRadius: 5,
    fontSize: 48,
    subFontSize: 14,
  },
  md: {
    canvas: 320,
    strokeWidth: 12,
    dotRadius: 8,
    fontSize: 48,
    subFontSize: 18,
  },
  lg: {
    canvas: 420,
    strokeWidth: 16,
    dotRadius: 11,
    fontSize: 72,
    subFontSize: 22,
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts an angle in degrees to radians.
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns the {x, y} point on a circle of given radius at angleDeg.
 * Angle 0 = 12 o'clock, increasing clockwise.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = toRad(angleDeg - 90);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Clamps a number between [min, max].
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * BudgetProgressBar — animated semi-circular SVG gauge.
 *
 * Progress is expressed as a percentage of the remaining budget:
 *   100% = user hasn't spent anything  → green
 *   26–49% remaining                   → yellow
 *   0–25% remaining                    → red
 *
 * @param size      - "sm" | "md" | "lg" — controls rendered canvas size.
 * @param className - Optional wrapper class.
 */
export default function BudgetProgressBar({
  size = "sm",
  className,
}: BudgetProgressBarProps) {
  const config = SIZE_CONFIG[size];
  const { resolvedTheme } = useTheme();
  const theme = componentTheme[resolvedTheme as "light" | "dark"];

  /**
   * Normalise to [0, 1] where 1 = full budget remaining.
   * This is the value the arc and dot travel toward.
   */
  const targetProgress = clamp(CURRENT_AMOUNT / MAX_AMOUNT, 0, 1);

  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const glowRef = useRef<SVGCircleElement>(null);

  const glowAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  // ─── Motion values ───────────────────────────────────────────────────────
  const motionProgress = useMotionValue(0);

  const strokeColor = useTransform(
    motionProgress,
    [0, 0.25, 0.26, 0.49, 0.5, 1],
    [
      COLOR_RED,
      COLOR_RED,
      COLOR_YELLOW,
      COLOR_YELLOW,
      COLOR_GREEN,
      COLOR_GREEN,
    ],
  );

  /**
   * SVG strokeDasharray that draws [0 → ARC_LENGTH] of the progress arc.
   */
  const progressDashArray = useTransform(
    motionProgress,
    (p) => `${p * ARC_LENGTH} ${CIRCUMFERENCE}`,
  );

  /**
   * Dollar value displayed in the centre, rounded to nearest integer.
   * Derived directly from motionProgress × MAX_AMOUNT so it counts up smoothly.
   */
  const displayValue = useTransform(motionProgress, (p) =>
    Math.round(p * MAX_AMOUNT).toLocaleString(),
  );

  /**
   * cx of the travelling dot indicator.
   * Maps progress [0,1] → angle along the arc → cartesian x.
   */
  const dotCx = useTransform(motionProgress, (p) => {
    const angle = DOT_START_ANGLE_DEG + p * SWEEP_DEG;
    return polarToCartesian(CENTER, CENTER, RADIUS, angle).x;
  });

  /**
   * cy of the travelling dot indicator.
   */
  const dotCy = useTransform(motionProgress, (p) => {
    const angle = DOT_START_ANGLE_DEG + p * SWEEP_DEG;
    return polarToCartesian(CENTER, CENTER, RADIUS, angle).y;
  });

  // ─── Mount animation ───

  useEffect(() => {
    animationRef.current = animate(motionProgress, targetProgress, {
      duration: ANIMATION_DURATION,
      ease: "easeOut",
    });

    // Encadenar el glow loop solo cuando termina la animación principal
    animationRef.current.then(() => {
      if (!glowRef.current) return;

      glowAnimationRef.current = animate(
        glowRef.current,
        { opacity: [0.4, 1, 0.4] },
        {
          duration: targetProgress + 0.15,
          repeat: Infinity,
          ease: "easeInOut",
        },
      );
    });

    return () => {
      animationRef.current?.stop();
      glowAnimationRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived SVG values ───

  /** Full arc drawn as the muted track background. */
  const trackDashArray = `${ARC_LENGTH} ${CIRCUMFERENCE}`;

  return (
    <div
      className={className}
      role="meter"
      aria-valuenow={CURRENT_AMOUNT}
      aria-valuemin={0}
      aria-valuemax={MAX_AMOUNT}
      aria-label={`${CURRENT_AMOUNT} of ${MAX_AMOUNT} USD remaining`}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        width={config.canvas}
        height={config.canvas}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Dark background circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TRACK_RADIUS}
          fill={theme.BG_COLOR}
        />

        {/* Track arc — full 270° sweep, muted */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={theme.TRACK_COLOR}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={trackDashArray}
          transform={`rotate(${START_ANGLE_DEG} ${CENTER} ${CENTER})`}
        />

        {/* Progress arc — animates from 0 → targetProgress */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth={config.strokeWidth - 2}
          strokeLinecap="round"
          strokeDasharray={progressDashArray}
          transform={`rotate(${START_ANGLE_DEG} ${CENTER} ${CENTER})`}
        />

        {/* Dot indicator — travels along the arc */}
        <g aria-hidden="true">
          {/* Outer glow ring */}
          <motion.circle
            ref={glowRef}
            cx={dotCx}
            cy={dotCy}
            r={config.dotRadius + 2}
            fill={strokeColor}
            opacity={0.4}
          />
          {/* Solid dot */}
          <motion.circle
            cx={dotCx}
            cy={dotCy}
            r={config.dotRadius}
            fill={strokeColor}
          />
        </g>

        {/* Animated dollar counter */}
        <motion.text
          x={CENTER}
          y={CENTER - 10}
          textAnchor="middle"
          fontSize={config.fontSize}
          fontWeight={600}
          fontFamily="var(--font-sans, sans-serif)"
          className="font-mono"
          fill={theme.NUMBER_COLOR}
        >
          {displayValue}
        </motion.text>

        {/* currency label */}
        <text
          x={CENTER}
          y={CENTER + config.subFontSize + 8}
          textAnchor="middle"
          fontSize={config.subFontSize}
          fontFamily="var(--font-sans, sans-serif)"
          fill={theme.TEXT_COLOR}
        >
          USD
        </text>

        {/* Restante label */}
        <text
          x={CENTER}
          y={CENTER + 90}
          textAnchor="middle"
          fontSize={config.subFontSize}
          fontFamily="var(--font-sans, sans-serif)"
          className="font-black"
          fill={theme.TEXT_COLOR}
        >
          Restante
        </text>
      </svg>
    </div>
  );
}
