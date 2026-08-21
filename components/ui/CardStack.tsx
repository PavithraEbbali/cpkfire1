'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
  type Transition,
  type Variants,
} from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/components/ui/Primitives';
import type { SystemCard } from '@/lib/site';

/** How many cards are mounted at once. The rest wait off-stack. */
const VISIBLE = 4;
/** Throw distance, in px, that commits to the next card. */
const COMMIT_PX = 90;
/** Maximum cursor tilt on either axis, in degrees. */
const MAX_TILT = 11;

const SPRING: Transition = { type: 'spring', stiffness: 260, damping: 30, mass: 0.85 };
const TILT_SPRING = { stiffness: 200, damping: 24, mass: 0.6 } as const;

/* The outgoing card leaves in the direction of travel. This has to be a
   dynamic variant rather than an inline `exit` object, because the card is
   already unmounting by the time it animates — `custom` is the only channel
   still open to tell it which way to go. */
const exitVariants: Variants = {
  exit: (dir: 1 | -1) => ({
    x: dir === 1 ? -440 : 440,
    rotate: dir === 1 ? -13 : 13,
    opacity: 0,
    transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
  }),
};

/** Resting transform for a card at a given depth in the stack. */
function depthStyle(depth: number) {
  return {
    y: depth * -18,
    scale: 1 - depth * 0.05,
    rotate: depth === 0 ? 0 : depth % 2 === 0 ? 1.5 : -1.5,
    opacity: depth >= VISIBLE - 1 ? 0 : 1,
  };
}

type CardStackProps = {
  systems: SystemCard[];
  icons: Record<string, LucideIcon>;
};

/**
 * Interactive system showcase.
 *
 * Only the top `VISIBLE` cards are mounted. Advancing drops the old top card
 * out of that window, so `AnimatePresence` catches it on the way out and flies
 * it off in the direction of travel while the next card settles forward.
 *
 * Every card is `absolute inset-0` inside a stage of fixed height, so the
 * stack animates purely on transform and opacity — the surrounding page never
 * reflows, whatever the copy length of the card on top.
 */
export default function CardStack({ systems, icons }: CardStackProps) {
  const count = systems.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  /* Mirrors `index` for the ScrollTrigger callback, which fires outside React
     and would otherwise close over a stale value on every scroll frame. */
  const indexRef = useRef(0);

  const goTo = useCallback((next: number) => {
    if (next === indexRef.current) return;
    setDirection(next > indexRef.current ? 1 : -1);
    indexRef.current = next;
    setIndex(next);
  }, []);

  /* Cursor tilt. The wrapper owns the perspective and never transforms, so the
     card can rotate without nudging its own hit area around under the cursor. */
  const tiltX = useSpring(0, TILT_SPRING);
  const tiltY = useSpring(0, TILT_SPRING);

  /* Sheen follows the cursor across the face of the top card. */
  const sheenX = useSpring(50, TILT_SPRING);
  const sheenY = useSpring(50, TILT_SPRING);
  const sheen = useMotionTemplate`radial-gradient(58% 58% at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.72), rgba(255,255,255,0) 72%)`;

  /* The glow ring is a conic gradient turning slowly behind the card's edge. */
  const glowSpin = useMotionValue(0);
  const glowRing = useMotionTemplate`conic-gradient(from ${glowSpin}deg, transparent 0deg, rgba(251,191,36,0.95) 70deg, rgba(234,88,12,0.95) 140deg, transparent 220deg, transparent 360deg)`;

  useEffect(() => {
    if (reduced) return;
    const controls = animate(glowSpin, 360, {
      duration: 6,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => controls.stop();
  }, [glowSpin, reduced]);

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = stageRef.current;
      if (!el || reduced) return;
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      tiltY.set(nx * MAX_TILT * 2);
      tiltX.set(-ny * MAX_TILT * 2);
      sheenX.set(50 + nx * 90);
      sheenY.set(50 + ny * 90);
    },
    [reduced, sheenX, sheenY, tiltX, tiltY],
  );

  const handleLeave = useCallback(() => {
    setHovered(false);
    tiltX.set(0);
    tiltY.set(0);
    sheenX.set(50);
    sheenY.set(50);
  }, [sheenX, sheenY, tiltX, tiltY]);

  const advance = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      const next = (indexRef.current + dir + count) % count;
      indexRef.current = next;
      setIndex(next);
    },
    [count],
  );

  /* Scroll drives the stack: the section pins and each card gets an equal
     slice of the scrub, so continuing to scroll pages through all six before
     the page moves on. Drag and the nav buttons stay live throughout. */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: el,
          start: 'center center',
          end: () => `+=${Math.round(window.innerHeight * count * 0.5)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(count - 1, Math.floor(self.progress * count));
            goTo(next);
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [count, goTo]);

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const thrown = info.offset.x + info.velocity.x * 0.12;
      if (thrown <= -COMMIT_PX) advance(1);
      else if (thrown >= COMMIT_PX) advance(-1);
    },
    [advance],
  );

  const stack = Array.from({ length: VISIBLE }, (_, depth) => ({
    depth,
    system: systems[(index + depth) % count],
  }));

  return (
    <div ref={wrapRef} className="mx-auto flex w-full max-w-[31rem] flex-col max-h-[85vh]">
      {/* The outgoing card throws to ±440px, which on a narrow viewport would
          reach past the right edge and raise a horizontal scrollbar — there is
          no global `overflow-x` guard on this site. Clipping here contains it.
          The negative margins buy back bleed so the card still visibly leaves
          the stack before it is cut, and they cancel the shell's own padding
          exactly at each breakpoint so this never exceeds the viewport. Safe
          to clip at this level: the pinned ScrollTrigger lives in a sibling
          component, not inside this subtree. */}
      <div className="-mx-5 shrink-0 overflow-x-clip px-5 pb-4 pt-3 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14">
        <div
          ref={stageRef}
          onMouseMove={handleMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleLeave}
          /* Viewport-relative so the card, its image and the pills below all fit
             a 14" laptop at 100% and 90% zoom without scrolling. */
          className="relative h-[clamp(17rem,54vh,30rem)] select-none"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            {stack.map(({ depth, system }) => {
              const Icon = icons[system.icon];
              const isTop = depth === 0;
              const rest = depthStyle(depth);

              return (
                <motion.article
                  key={system.id}
                  custom={direction}
                  variants={exitVariants}
                  initial={{ ...depthStyle(VISIBLE - 1), opacity: 0 }}
                  animate={rest}
                  exit="exit"
                  transition={reduced ? { duration: 0 } : SPRING}
                  drag={isTop && !reduced ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.55}
                  onDragEnd={isTop ? handleDragEnd : undefined}
                  whileDrag={{ cursor: 'grabbing' }}
                  style={{
                    zIndex: VISIBLE - depth,
                    rotateX: isTop ? tiltX : 0,
                    rotateY: isTop ? tiltY : 0,
                    transformStyle: 'preserve-3d',
                    cursor: isTop ? 'grab' : 'default',
                    pointerEvents: isTop ? 'auto' : 'none',
                  }}
                  className="absolute inset-0 will-change-transform"
                >
                  {/* Glow ring. A slowly turning conic gradient sitting one
                      pixel proud of the card, revealed on hover. The card's
                      own opaque face covers all but that one-pixel edge. */}
                  <motion.span
                    aria-hidden
                    style={{ backgroundImage: glowRing }}
                    className={cn(
                      'pointer-events-none absolute -inset-[1.5px] rounded-[1.05rem] blur-[0.5px]',
                      'transition-opacity duration-500',
                      isTop && hovered ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {/* Warm bloom cast outward from behind the card. */}
                  <span
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-amber-400/25 blur-3xl',
                      'transition-opacity duration-700',
                      isTop && hovered ? 'opacity-100' : 'opacity-0',
                    )}
                  />

                  <div
                    className={cn(
                      'relative flex h-full flex-col overflow-hidden rounded-2xl',
                      'border border-amber-500/20 bg-white/90 backdrop-blur-md',
                      'ring-1 ring-inset ring-white/70',
                      isTop
                        ? 'shadow-2xl shadow-slate-900/15'
                        : 'shadow-xl shadow-slate-900/5',
                    )}
                  >
                    {/* Equipment preview. `object-contain` because these are
                        cut-out product shots, not full-bleed photography. */}
                    <div className="relative h-[44%] w-full shrink-0 overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-white">
                      <Image
                        src={system.image}
                        alt={system.title}
                        fill
                        sizes="(max-width: 640px) 92vw, 31rem"
                        priority={depth === 0}
                        className="object-contain p-6 sm:p-8"
                      />
                      <span className="absolute left-5 top-5 font-display text-[0.7rem] font-bold tracking-[0.18em] text-slate-400">
                        {system.index}
                      </span>
                      <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur">
                        <Icon className="h-4 w-4 text-brand-600" strokeWidth={2.2} />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between border-t border-amber-500/15 p-6 sm:p-7">
                      <div>
                        <h3 className="display text-balance text-[1.25rem] leading-[1.15] sm:text-[1.4rem]">
                          {system.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-3 text-pretty text-[0.86rem] leading-relaxed text-slate-500 sm:text-[0.9rem]">
                          {system.tagline}
                        </p>
                      </div>

                      <a
                        href={system.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDownCapture={(event) => event.stopPropagation()}
                        className="group mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-[0.86rem] font-semibold text-white shadow-lg shadow-brand-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/35"
                      >
                        Enquire
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={2.5}
                        />
                      </a>
                    </div>

                    {/* Cursor-tracked sheen, over everything, inert to input. */}
                    {isTop ? (
                      <motion.span
                        aria-hidden
                        style={{ backgroundImage: sheen }}
                        className={cn(
                          'pointer-events-none absolute inset-0 mix-blend-overlay',
                          'transition-opacity duration-500',
                          hovered ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation. The amber pill is a single element that travels between
          entries via `layoutId`, so switching reads as one object moving
          rather than two crossfading. */}
      <div className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-1.5">
        {systems.map((system, i) => (
          <button
            key={system.id}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === index}
            className={cn(
              'relative rounded-full px-3 py-2.5 text-[0.7rem] font-semibold transition-colors duration-300 sm:py-1.5',
              i === index ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {i === index ? (
              <motion.span
                layoutId="system-nav-pill"
                transition={reduced ? { duration: 0 } : SPRING}
                className="absolute inset-0 rounded-full border border-amber-400/70 bg-amber-50"
              />
            ) : null}
            <span className="relative">{system.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex shrink-0 items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label="Previous system"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/70 text-slate-700 backdrop-blur transition-colors duration-300 hover:border-slate-900 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Drag or tap to browse
        </span>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next system"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/70 text-slate-700 backdrop-blur transition-colors duration-300 hover:border-slate-900 hover:text-slate-900"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
