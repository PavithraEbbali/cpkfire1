'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/components/ui/Primitives';

const SPRING: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.85 };
const SLIDE: Transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] };

/* Direction-aware. Dynamic variants because `custom` is the only channel still
   open to a slide that is already unmounting. */
const slide: Variants = {
  enter: (dir: 1 | -1) => ({ x: dir === 1 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({
    x: dir === 1 ? -64 : 64,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

export type FeatureItem = {
  src: string;
  category: string;
  label: string;
};

type Props = {
  items: readonly FeatureItem[];
  href: string;
};

export default function FeatureCarousel({ items, href }: Props) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  /** Mirrors `index` for callbacks that would close over a stale value. */
  const indexRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

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

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        advance(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        advance(-1);
      }
    },
    [advance],
  );

  /* Scroll drives the carousel: the section pins and each item gets an equal
     slice of the scrub, so continuing to scroll pages through the whole set
     before the page moves on. Arrows, dots, thumbnails and the keyboard all
     stay live throughout — they share `goTo`, and `indexRef` keeps this
     callback (which fires outside React) off a stale value.

     No parallax translate on the frame any more: ScrollTrigger pins via
     `position: fixed`, and a transform on the pinned element fights that. */
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: el,
          start: 'center center',
          end: () => `+=${Math.round(window.innerHeight * count * 0.38)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            goTo(Math.min(count - 1, Math.floor(self.progress * count)));
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [count, goTo]);

  const item = items[index];

  return (
    <div ref={trackRef} className="relative">
      <div
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Equipment showcase"
        className={cn(
          'group/frame relative rounded-3xl p-[1.5px] outline-none will-change-transform',
          'shadow-2xl shadow-orange-500/15',
          'focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-4',
        )}
      >
        {/* Gradient bed under an opaque face — the only way to get a gradient
            that follows rounded corners cleanly. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-300/70 via-[#FF5A00]/30 to-amber-300/70"
        />

        <div
          className={cn(
            'relative overflow-hidden rounded-[calc(1.5rem-1.5px)] p-5 sm:p-8',
            'border border-orange-500/20 backdrop-blur-xl',
            'bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60',
          )}
        >
          {/* Ember blooms, drifting against the frame on scroll. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#FF5A00]/15 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
          />

          {/* Fixed-height stage: slides are absolute, so switching can never
              reflow the page however long a title runs. */}
          <div className="relative h-[34rem] overflow-hidden rounded-2xl sm:h-[27rem] lg:h-[24rem]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={item.src}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduced ? { duration: 0 } : SLIDE}
                className="absolute inset-0 grid grid-cols-1 items-center gap-5 lg:grid-cols-[1.05fr_1fr] lg:gap-9"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-orange-500/15 bg-gradient-to-b from-white via-white to-amber-50/60 sm:h-full">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 1024px) 90vw, 44vw"
                    priority={index === 0}
                    className="object-contain p-6 sm:p-9"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#FF5A00]/10 blur-2xl"
                  />
                </div>

                <div className="min-w-0">
                  <span className="flex items-center gap-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                    <span className="h-px w-7 bg-brand-600" aria-hidden />
                    {item.category}
                  </span>

                  <h3 className="display mt-3.5 text-balance text-[1.45rem] leading-[1.14] sm:text-[1.95rem]">
                    {item.label}
                  </h3>

                  <p className="mt-3.5 text-[0.9rem] leading-relaxed text-slate-500">
                    Distributed by CPK Fire and Security Systems.
                  </p>

                  {/* Specification badges. Every value is drawn from the item
                      itself — the source data carries no ratings or model
                      numbers, so none are asserted here. */}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-white/70 px-3 py-1.5 text-[0.68rem] font-semibold text-slate-700 backdrop-blur-sm">
                      <span className="h-1 w-1 rounded-full bg-brand-600" aria-hidden />
                      {item.category}
                    </li>
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50/70 px-3 py-1.5 text-[0.68rem] font-semibold text-slate-700 backdrop-blur-sm">
                      Ref {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </li>
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-[0.68rem] font-semibold text-slate-700 backdrop-blur-sm">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-600" strokeWidth={2.4} />
                      Authorized distribution
                    </li>
                  </ul>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-[0.85rem] font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/35"
                  >
                    Enquire
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={2.5}
                    />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail rail. Doubles the density of the frame and gives the
              whole set a presence the single slide cannot carry alone. */}
          <div className="mt-5 hidden gap-2.5 sm:flex sm:flex-wrap">
            {items.map((it, i) => (
              <button
                key={it.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${it.label}`}
                aria-current={i === index}
                className={cn(
                  'relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border bg-white/80 transition-all duration-300',
                  i === index
                    ? 'border-orange-500/60'
                    : 'border-slate-200 opacity-55 hover:opacity-100',
                )}
              >
                <Image src={it.src} alt="" fill sizes="64px" className="object-contain p-1.5" />
                {i === index ? (
                  <motion.span
                    layoutId="equipment-thumb-ring"
                    transition={reduced ? { duration: 0 } : SPRING}
                    className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-inset ring-[#FF5A00]/70"
                  />
                ) : null}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-orange-500/15 pt-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => advance(-1)}
                aria-label="Previous equipment"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/25 bg-white/80 text-slate-700 backdrop-blur transition-colors duration-300 hover:border-[#FF5A00] hover:text-[#FF5A00]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
              </button>
              <button
                type="button"
                onClick={() => advance(1)}
                aria-label="Next equipment"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/25 bg-white/80 text-slate-700 backdrop-blur transition-colors duration-300 hover:border-[#FF5A00] hover:text-[#FF5A00]"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex flex-wrap items-center">
              {items.map((it, i) => (
                <button
                  key={it.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${it.label}`}
                  /* 44px touch target around a 10px indicator. */
                  className="group flex h-11 items-center justify-center px-2"
                >
                  <span
                    className="relative block h-2.5 rounded-full transition-all duration-500"
                    style={{ width: i === index ? 30 : 10 }}
                  >
                    {i === index ? (
                      <motion.span
                        layoutId="equipment-active-dot"
                        transition={reduced ? { duration: 0 } : SPRING}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-[#FF5A00]"
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors group-hover:bg-slate-400" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
