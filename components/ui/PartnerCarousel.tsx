'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import { cn } from '@/components/ui/Primitives';

/* The slide has to finish inside the autoplay interval, or every
   card lands mid-flight and the stack reads as a blur. A short tween is
   predictable where a spring's settle time is not. */
const SLIDE: Transition = { duration: 0.34, ease: [0.22, 1, 0.36, 1] };
const AUTOPLAY_MS = 900;

/* Direction-aware slide. Dynamic variants because `custom` is the only channel
   still open to an element that is already unmounting. */
const slide: Variants = {
  enter: (dir: 1 | -1) => ({ x: dir === 1 ? 64 : -64, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: 1 | -1) => ({
    x: dir === 1 ? -64 : 64,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  }),
};

export type Partner = { name: string; src: string };

type Props = {
  partners: readonly Partner[];
  /** Partner names carrying an independently verified distributor credential. */
  verified?: readonly string[];
};

export default function PartnerCarousel({ partners, verified = [] }: Props) {
  const count = partners.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const indexRef = useRef(0);

  const goTo = useCallback((next: number, dir?: 1 | -1) => {
    if (next === indexRef.current) return;
    setDirection(dir ?? (next > indexRef.current ? 1 : -1));
    indexRef.current = next;
    setIndex(next);
  }, []);

  const advance = useCallback(
    (dir: 1 | -1) => goTo((indexRef.current + dir + count) % count, dir),
    [count, goTo],
  );

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => advance(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reduced]);

  const partner = partners[index];
  const isVerified = verified.includes(partner.name);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <TiltCard className="group/tilt" maxTilt={7} lift={16}>
        {/* Fixed height: the card must not resize as names of different
            lengths cycle through it, or the stats beside it would jump. */}
        <div
          className={cn(
            'relative h-[21rem] overflow-hidden rounded-2xl sm:h-[23rem]',
            'border border-amber-500/20 bg-white/90 backdrop-blur-md',
            'shadow-xl shadow-slate-900/5 transition-shadow duration-500',
            'group-hover/tilt:shadow-2xl group-hover/tilt:shadow-slate-900/15',
          )}
        >
          {/* Warm glow, revealed on hover. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.45),0_0_60px_-12px_rgba(234,88,12,0.45)] transition-opacity duration-500 group-hover/tilt:opacity-100"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-300/25 blur-3xl"
          />

          {/* No `mode="wait"`: that defers mounting the incoming slide until the
              outgoing one finishes exiting, so a stalled exit strands the card
              on a stale partner while the index has already moved on. Both are
              `absolute inset-0` in a fixed-height box, so they cross-dissolve
              without fighting over layout. */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={partner.name}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0 } : SLIDE}
              className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="numeral">
                  {String(index + 1).padStart(2, '0')}
                  <span className="text-slate-300"> / {String(count).padStart(2, '0')}</span>
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-600/25 bg-brand-600/5 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-brand-600">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                    Authorized
                  </span>
                ) : null}
              </div>

              <div className="relative mx-auto h-20 w-full max-w-[16rem] sm:h-24">
                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 640px) 70vw, 16rem"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover/tilt:scale-[1.07]"
                />
              </div>

              <div>
                <p className="font-display text-[1.5rem] font-semibold leading-tight text-slate-900">
                  {partner.name}
                </p>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-500">
                  {isVerified
                    ? 'Authorized distributor — Bosch Security Systems CCTV.'
                    : 'Technology partner.'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </TiltCard>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => advance(-1)}
            aria-label="Previous partner"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-colors duration-300 hover:border-amber-500 hover:text-amber-600"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => advance(1)}
            aria-label="Next partner"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-colors duration-300 hover:border-amber-500 hover:text-amber-600"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex items-center">
          {partners.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === index}
              /* The painted dot is only 6px tall; the button around it is
                 44px so the touch target is usable on a phone. */
              className="group flex h-11 items-center justify-center px-2"
            >
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-500',
                  i === index
                    ? 'w-7 bg-amber-500'
                    : 'w-1.5 bg-slate-300 group-hover:bg-slate-400',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
