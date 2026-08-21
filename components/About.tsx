'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import TiltCard from '@/components/ui/TiltCard';
import { GradientText } from '@/components/ui/GradientText';
import { about, company, contact } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Headline ─────────────────────────────────────────────────────────────
   Each word rides up out of its own overflow mask. The mask carries a little
   vertical padding pulled back by a matching negative margin, so descenders
   are never clipped and the line box sits exactly where it always did.     */

const maskVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
};

const wordVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

function MaskedHeadline({
  text,
  className,
  gradientRange,
}: {
  text: string;
  className?: string;
  /** Inclusive word-index range rendered in the fire gradient. */
  gradientRange?: [number, number];
}) {
  const words = text.split(' ');
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      variants={maskVariants}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* A space INSIDE the mask is collapsed away by the overflow-hidden
              inline-block — that is what smashed the words together. Emitting
              it as a sibling text node keeps the gap and, unlike a margin,
              survives into textContent for screen readers and copy-paste. */}
          <span className="inline-block -mb-[0.16em] overflow-hidden pb-[0.16em] align-bottom">
            <motion.span className="inline-block" variants={wordVariants}>
              {gradientRange && i >= gradientRange[0] && i <= gradientRange[1] ? (
                <GradientText>{word}</GradientText>
              ) : (
                word
              )}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </motion.h2>
  );
}

/* ── Accent tag ───────────────────────────────────────────────────────────
   The rule draws itself out from the left while the letters breathe apart. */

function AccentTag({ label }: { label: string }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="inline-flex items-center gap-3 font-sans text-[0.7rem] font-semibold uppercase text-slate-500"
    >
      <motion.span
        aria-hidden
        className="block h-px w-9 origin-left bg-brand-600"
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
        }}
      />
      <motion.span
        className="block"
        variants={{
          hidden: { letterSpacing: '0.08em', opacity: 0 },
          show: {
            letterSpacing: '0.24em',
            opacity: 1,
            transition: { duration: 0.9, ease: EASE, delay: 0.12 },
          },
        }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

/* ── Numbered rail ────────────────────────────────────────────────────────
   The rows carry no entrance animation of their own — the pinned GSAP
   timeline in the section owns their transform and opacity, so the two
   animation systems never fight over the same properties.

   Hover is CSS only: an amber wash and a glow, both painted on absolutely
   positioned layers behind the copy, so the rail can never reflow.         */

type PointRowProps = {
  index: number;
  title: string;
  body: string;
  registerRef: (el: HTMLLIElement | null) => void;
};

function PointRow({ index, title, body, registerRef }: PointRowProps) {
  return (
    <li
      ref={registerRef}
      data-reveal-item
      className="group relative isolate -mx-4 rounded-xl border-t border-slate-200 px-4 py-6 transition-[border-color] lg:py-[1.15rem] duration-500 will-change-transform hover:border-amber-400/70 sm:grid sm:grid-cols-[auto_1fr] sm:gap-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 shadow-[0_0_0_1px_rgba(251,191,36,0.45),0_18px_40px_-24px_rgba(217,119,6,0.55)] transition-opacity duration-500 group-hover:opacity-100"
      />

      <span className="numeral block pt-1 transition-colors duration-500 group-hover:text-amber-600">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="mt-2 sm:mt-0">
        <h3 className="font-display text-[1.05rem] font-semibold text-slate-900">{title}</h3>
        <p className="mt-1.5 max-w-lg text-[0.95rem] leading-relaxed text-slate-500">{body}</p>
      </div>
    </li>
  );
}

/* ── Stat badge ───────────────────────────────────────────────────────────
   Spring-scale pop, fired once the card itself is in view.                 */

type StatBadgeProps = {
  value: string | number;
  label: string;
  delay: number;
  inView: boolean;
  accent?: boolean;
};

function StatBadge({ value, label, delay, inView, accent = false }: StatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay }}
      className={accent ? 'text-right' : undefined}
    >
      <p
        className={`font-display text-[2.6rem] font-bold leading-none tracking-tightest ${
          accent ? 'text-brand-600' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
    </motion.div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const cardInView = useInView(cardRef, { once: true, margin: '0px 0px -18% 0px' });
  const reduced = useReducedMotion();

  /* Pin the section when it reaches the centre of the viewport, then drop the
     three rows in one at a time against raw scroll progress.

     `useLayoutEffect` runs before the browser paints, so the rows are already
     hidden on the first frame after hydration — they never flash in fully
     formed and then jump back up.                                          */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter((el): el is HTMLLIElement => el !== null);
      if (items.length === 0) return;

      const mm = gsap.matchMedia();

      /* Reduced motion, or anything narrower than `lg`. Pinning a tall rail on
         a phone hijacks the scroll for no real gain, so the rows just sit
         where they belong and the section scrolls normally. */
      mm.add('(prefers-reduced-motion: reduce), (max-width: 1023px)', () => {
        gsap.set(items, { clearProps: 'transform,opacity' });
      });

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(items, { y: -30, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            /* The desktop layout is `min-h-svh`, so the section is normally
               exactly one viewport tall and `center center` lands flush. The
               fallback stops a taller section from being cropped by the pin. */
            start: () =>
              section.offsetHeight <= window.innerHeight ? 'center center' : 'top top',
            end: () => `+=${Math.round(window.innerHeight * 1.15)}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        items.forEach((item) => {
          tl.to(item, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
        });

        /* A beat of dead scroll after the third row lands, so the finished
           section holds for a moment before the pin releases. */
        tl.to({}, { duration: 0.4 });

        return () => {
          gsap.set(items, { clearProps: 'transform,opacity' });
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex items-center overflow-hidden border-t border-slate-200 bg-white lg:min-h-svh"
    >
      {/* Faint warm bloom behind the rail, so the white never reads as flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-amber-100/40 blur-[140px]"
      />

      <div className="shell relative w-full py-24 sm:py-28 lg:py-14">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
          {/* Copy leads on the left — the reverse of the usual photo-first split. */}
          <div className="lg:pr-8">
            <AccentTag label="The company" />

            {/* "security engineering" carries the gradient. */}
            <MaskedHeadline
              text={about.headline}
              gradientRange={[1, 2]}
              className="display mt-6 text-balance text-[2.05rem] leading-[1.12] tracking-tight sm:text-[2.8rem] lg:text-[3.05rem] lg:leading-[1.08]"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              className="mt-6 max-w-xl text-pretty lg:mt-5 text-[1.05rem] leading-relaxed text-slate-500"
            >
              {about.lede}
            </motion.p>

            <ul className="mt-10 space-y-px lg:mt-8">
              {about.points.map((point, i) => (
                <PointRow
                  key={point.title}
                  index={i}
                  title={point.title}
                  body={point.body}
                  registerRef={(el) => {
                    itemsRef.current[i] = el;
                  }}
                />
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
              <a
                href={contact.indiamart}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex lg:mt-7 items-center gap-2 border-b-2 border-brand-600 pb-1 font-display text-[0.95rem] font-semibold text-slate-900 transition-colors hover:text-brand-600"
              >
                Browse the catalogue
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </a>
            </motion.div>
          </div>

          {/* Hardware card: enters on a spring, then tilts to the cursor. */}
          <div ref={cardRef} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.94 }}
              animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <TiltCard className="group/tilt">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-card transition-shadow duration-500 group-hover/tilt:shadow-lift">
                  <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[4/3.9]">
                    <motion.div
                      animate={reduced ? undefined : { y: [0, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0"
                    >
                      <Image
                        src="/images/gallery/fa_3.jpg"
                        alt="Addressable fire alarm panel with detectors, sounder and manual call point"
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="scale-105 object-contain p-10 transition-transform duration-[900ms] ease-out group-hover/tilt:scale-[1.14] sm:p-12"
                      />
                    </motion.div>
                  </div>

                  <div className="relative border-t border-slate-200 bg-white px-7 py-6">
                    <div className="flex items-end justify-between gap-6">
                      <StatBadge
                        value={company.established}
                        label="Trading since"
                        delay={0.35}
                        inView={cardInView}
                      />
                      <StatBadge
                        value="06"
                        label="System lines"
                        delay={0.47}
                        inView={cardInView}
                        accent
                      />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
