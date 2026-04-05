"use client";

import { motion, useReducedMotion } from "framer-motion";

function circleOffsets(r: number, phase: number, steps = 10) {
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2 + phase;
    x.push(Math.cos(a) * r);
    y.push(Math.sin(a) * r);
  }
  return { x, y };
}

function DartIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path fill="#0175C2" d="M16 2L4 10v12l12 8 12-8V10L16 2z" />
      <path fill="#45D1FD" d="M16 6L8 11v10l8 5 8-5V11l-8-5z" />
      <path fill="#fff" d="M16 9l-5 3v8l5 3 5-3v-8l-5-3z" opacity=".25" />
    </svg>
  );
}

function FirebaseIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path fill="#FFA000" d="M4 24l4-14 6 10-4 4H4z" />
      <path fill="#F57C00" d="M14 30l-4-6 4-4 8 10h-8z" />
      <path fill="#FFCA28" d="M14 10l6 10-6-16-6 6 6 10 6-10-6-10z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path
        fill="#3DDC84"
        d="M8 12c0-4.4 3.6-8 8-8s8 3.6 8 8v10c0 2.2-1.8 4-4 4h-2v3h-4v-3h-2c-2.2 0-4-1.8-4-4V12z"
      />
      <circle cx="12" cy="14" r="1.5" fill="#fff" />
      <circle cx="20" cy="14" r="1.5" fill="#fff" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" aria-hidden>
      <path d="M16.5 3.5c.9 1.2.9 2.8 0 4.1-.9 1.2-2.4 2-4 2h-.5c-.2-1.6.3-3.2 1.3-4.4 1-1.2 2.5-1.9 3.2-1.7zM13.2 9.2c2.6 0 3.7 1.6 5.5 1.6.7 0 1.4-.2 2-.5-.1 2.3-1.3 4.3-2.8 5.5-1.6 1.3-3.4 2.2-5.2 2.2-1.9 0-2.8-1.2-5.3-1.2-2.4 0-3.4 1.2-5.3 1.2-2 0-4-1.4-5.5-3.4C.4 12.8-.5 10.5.3 8.3c.7-2 2.5-3.4 4.6-3.4 1.7 0 3.1.9 4.1.9 1 0 2.9-1.1 5-1.1.8 0 1.6.1 2.2.5z" />
    </svg>
  );
}

function VSCodeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden>
      <path fill="#0065A9" d="M28.4 4.2L16 2 3.6 4.2v23.6L16 30l12.4-2.2V4.2z" />
      <path fill="#007ACC" d="M16 4.5L6 6.8v18.4l10 2.3V4.5z" />
      <path fill="#fff" d="M13 10l8 6-8 6v-4l5-2-5-2v-4z" opacity=".9" />
    </svg>
  );
}

type OrbConfig = {
  label: string;
  left: string;
  top: string;
  /** Orbit radius in px (small circular drift). */
  r: number;
  phase: number;
  duration: number;
  delay: number;
  children: React.ReactNode;
  className?: string;
};

function Orb({ label, left, top, r, phase, duration, delay, children, className }: OrbConfig) {
  const reduce = useReducedMotion();
  const { x, y } = circleOffsets(r, phase, 12);

  return (
    <motion.div
      className="pointer-events-none absolute z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-14 sm:w-14"
      style={{
        left,
        top,
      }}
      animate={reduce ? { x: 0, y: 0 } : { x, y }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration,
              repeat: Infinity,
              ease: "linear",
              delay,
            }
      }
      role="img"
      aria-label={label}
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-lg shadow-violet-500/20 backdrop-blur-md ${className ?? ""}`}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function FloatingTechIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      <Orb label="Dart" left="6%" top="6%" r={11} phase={0} duration={14} delay={0}>
        <DartIcon />
      </Orb>
      <Orb label="Firebase" left="88%" top="14%" r={13} phase={1.2} duration={17} delay={0.4}>
        <FirebaseIcon />
      </Orb>
      <Orb label="Android" left="4%" top="48%" r={10} phase={2.1} duration={12} delay={0.2}>
        <AndroidIcon />
      </Orb>
      <Orb
        label="iOS"
        left="90%"
        top="52%"
        r={12}
        phase={0.7}
        duration={16}
        delay={0.6}
        className="text-slate-800"
      >
        <AppleIcon />
      </Orb>
      <Orb label="VS Code" left="50%" top="88%" r={9} phase={3} duration={15} delay={0.1}>
        <VSCodeIcon />
      </Orb>
    </div>
  );
}
