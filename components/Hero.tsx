'use client';

import { Fragment } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BadgeCheck, Phone } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import { GradientText } from '@/components/ui/GradientText';
import { about, contact, hero } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

const headlineStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const wordRise: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.85, ease: EASE } },
};

/**
 * One masked headline line.
 *
 * Word spaces are emitted as sibling text nodes rather than living inside the
 * mask: an overflow-hidden inline-block collapses a trailing space, and a
 * margin would fix the look while leaving `textContent` with no word breaks
 * for screen readers or copy-paste.
 */
function MaskLine({ text, gradient = false }: { text: string; gradient?: boolean }) {
  const words = text.split(' ');
  return (
    <span className="block">
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block -mb-[0.16em] overflow-hidden pb-[0.16em] align-bottom">
            <motion.span className="inline-block" variants={wordRise}>
              {gradient ? <GradientText>{word}</GradientText> : word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      {/* Full-bleed intro film. No `poster` — the old hero photograph it pointed
          at is gone, and a missing poster 404s and flashes transparent; the
          slate base below covers the frame or two before the film paints
          instead. GSAP drives the drift. */}
      <div className="absolute inset-0 -z-10 bg-slate-100">
        {/* `scale-110` on top of Parallax's own `zoom` (1.12) compounded to
            ~1.23, which cropped the 848x480 source hard on a short 14" hero.
            One modest overscale, and no zoom scrub, keeps the framing honest
            at 100% and 90% while still hiding the drift's edges. */}
        <Parallax className="absolute inset-0" distance={70}>
          <video
            className="h-full w-full scale-[1.06] object-cover object-center"
            src="/cpkintrovideo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
          />
        </Parallax>

        {/*
          Nothing below covers the whole frame. Each scrim is narrow and
          purpose-built — one behind the copy, one under the nav strip, one at
          the section seam — so everywhere else the film plays completely
          unobstructed.

          Every opacity is a /5 step on purpose: Tailwind's default scale has
          no /88-style value, and a single off-scale stop makes the entire
          gradient resolve to `none`.
        */}

        {/* 1. The copy scrim, and the only thing carrying the headline's
            contrast. Width-capped so it can never reach the right of the
            frame: near-opaque under the text column, fully transparent by its
            own trailing edge. The `via-75%` matters — the longest headline
            line runs to ~78% of the scrim, so an evenly spaced midpoint would
            leave its last word sitting on bare film. Holding /50 out to 75%
            puts the whole fade in the empty margin past the text. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-full max-w-[34rem] bg-gradient-to-r from-white/90 via-white/50 via-75% to-transparent sm:max-w-[44rem] lg:max-w-[54rem]"
        />

        {/* 2. Nav strip only. The bar runs transparent until scroll and its
            links are slate, so the top ~7rem needs a lift the rest of the
            frame does not. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 via-white/35 to-transparent"
        />

        {/* 3. Section seam. Lands on solid white exactly where the next
            section starts, so the cut is invisible. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-white/60 to-white sm:h-48"
        />

        {/* 4. Below `sm` the copy spans the full width, where a lateral scrim
            alone cannot carry it — this vertical companion covers the text
            band and clears well above the fold's lower third. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[76%] bg-gradient-to-b from-white/85 via-white/70 via-55% to-transparent sm:hidden"
        />
      </div>

      <div className="shell relative z-10">
        <div className="flex min-h-[70svh] flex-col justify-center pb-10 pt-28 sm:min-h-[72svh] sm:pt-32 lg:min-h-[70svh] lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            {hero.eyebrow}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={headlineStagger}
            className="display mt-6 max-w-[15ch] text-balance text-[2.3rem] leading-[1.07] tracking-tight text-[#0A1F44] sm:mt-7 sm:text-[3.05rem] sm:leading-[1.05] lg:text-[3.55rem] lg:leading-[1.04] xl:text-[3.9rem]"
          >
            <MaskLine text={hero.headline} />
            <MaskLine text={hero.headlineAccent} gradient />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-5 max-w-md text-pretty text-[0.98rem] font-medium leading-relaxed text-slate-700 sm:mt-6 sm:max-w-lg sm:text-[1.02rem]"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: EASE }}
            className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-[0.9rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lift sm:px-7 sm:py-4 sm:text-[0.92rem]"
            >
              {hero.primaryCta.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </a>
            <a
              href={contact.mobiles[0].href}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-6 py-3.5 text-[0.9rem] font-semibold text-slate-900 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900 sm:px-7 sm:py-4 sm:text-[0.92rem]"
            >
              <Phone className="h-4 w-4" strokeWidth={2.3} />
              {contact.mobiles[0].label}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Credential ticker. Floats clear of the section seam now rather than
          bridging it, so it reads as an instrument panel over the film instead
          of a card taped to the edge. */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="shell relative z-10 pb-12 sm:pb-14"
        transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-white/80 px-5 py-5 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:px-7">
          {/* Ember hairline along the top edge. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5A00]/60 to-transparent"
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-3.5">
              {/* Glowing authority badge. */}
              <span className="relative mt-px flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5A00] to-brand-700 shadow-lg shadow-brand-600/35">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-[#FF5A00]/40 blur-md"
                />
                <BadgeCheck className="relative h-[18px] w-[18px] text-white" strokeWidth={2.5} />
              </span>
              <p className="max-w-md text-[0.92rem] leading-snug text-slate-600">
                <span className="font-semibold text-slate-900">
                  Authorized Bosch Security Systems distributor
                </span>{' '}
                — alongside Siemens, HID, Assa Abloy, Xtralis and Micro Power.
              </p>
            </div>

            <ul className="flex flex-wrap items-center gap-2 lg:justify-end">
              {about.distributesShort.map((item) => (
                <motion.li
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-orange-500/25 bg-white/70 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-slate-600 backdrop-blur-sm transition-colors duration-300 hover:border-[#FF5A00]/60 hover:bg-orange-50/80 hover:text-slate-900"
                >
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-[#FF5A00]/60 transition-colors duration-300 group-hover:bg-[#FF5A00]"
                  />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
