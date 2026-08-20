'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Total travel in pixels across the whole scroll pass. Keep it subtle. */
  distance?: number;
  /** Scrub a slight scale-down alongside the drift. */
  zoom?: boolean;
};

/**
 * Scroll-scrubbed parallax for large imagery.
 *
 * The inner element is deliberately over-sized by the caller (scale-110 etc.)
 * so the drift never exposes an edge inside its overflow-hidden frame.
 */
export default function Parallax({
  children,
  className,
  distance = 80,
  zoom = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 0, y: -distance / 2, ...(zoom ? { scale: 1.12 } : {}) },
        {
          y: distance / 2,
          ...(zoom ? { scale: 1 } : {}),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [distance, zoom]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
