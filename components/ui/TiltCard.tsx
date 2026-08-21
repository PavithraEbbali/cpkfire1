'use client';

import { useCallback, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
} from 'framer-motion';

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Maximum rotation on either axis, in degrees. Keep it restrained. */
  maxTilt?: number;
  /** How far the card lifts toward the viewer on hover, in px. */
  lift?: number;
  /** Render the specular sheen that tracks the cursor. */
  glare?: boolean;
};

const SPRING = { stiffness: 220, damping: 26, mass: 0.7 } as const;

/**
 * Mouse-tracked 3D tilt.
 *
 * The wrapper owns the `perspective` and never transforms, so the card can
 * rotate without nudging anything around it — the section's layout is measured
 * from the wrapper, not from the animated child.
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 9,
  lift = 22,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // -0.5 … 0.5, normalised cursor position within the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const z = useMotionValue(0);

  const rotateX = useSpring(py, SPRING);
  const rotateY = useSpring(px, SPRING);
  const translateZ = useSpring(z, SPRING);

  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareX = useSpring(gx, SPRING);
  const glareY = useSpring(gy, SPRING);
  const glareBg = useMotionTemplate`radial-gradient(60% 60% at ${glareX}% ${glareY}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)`;

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || reduced) return;
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      px.set(nx * maxTilt * 2);
      py.set(-ny * maxTilt * 2);
      gx.set(50 + nx * 100);
      gy.set(50 + ny * 100);
    },
    [gx, gy, maxTilt, px, py, reduced],
  );

  const handleEnter = useCallback(() => {
    if (!reduced) z.set(lift);
  }, [lift, reduced, z]);

  const handleLeave = useCallback(() => {
    px.set(0);
    py.set(0);
    z.set(0);
    gx.set(50);
    gy.set(50);
  }, [gx, gy, px, py, z]);

  const style: MotionStyle = {
    rotateX,
    rotateY,
    translateZ,
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className={className}
    >
      <motion.div style={style} className="relative h-full w-full will-change-transform">
        {children}
        {glare ? (
          <motion.div
            aria-hidden
            style={{ backgroundImage: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover/tilt:opacity-100"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
