'use client';

import { motion, type Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Cctv,
  Fingerprint,
  Flame,
  KeyRound,
  Megaphone,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import TruckAssembly from '@/components/ui/TruckAssembly';
import CardStack from '@/components/ui/CardStack';
import { GradientPhrase } from '@/components/ui/GradientText';
import { about, systems } from '@/lib/site';

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  megaphone: Megaphone,
  fingerprint: Fingerprint,
  cctv: Cctv,
  keyRound: KeyRound,
  wind: Wind,
};

const HEADLINE = 'Six system lines, one supply partner.';

/* Reused verbatim from the previous hero headline, which the client's new
   hero copy freed up. No new capability is claimed — it stands over the same
   six lines listed in `about.distributesShort` below. */
const SUBTITLE = 'Every system that keeps a building safe.';

const badgeList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const badge: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

export default function Systems() {
  return (
    <section
      id="systems"
      className="relative overflow-hidden border-t border-slate-200 bg-white"
    >
      {/* Ambient ground. Without something behind it, frosted glass over flat
          slate reads as plain grey — these two blooms are what give the card
          faces something to actually refract. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[38rem] w-[38rem] rounded-full bg-amber-200/30 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-brand-600/10 blur-[150px]"
      />

      <div className="shell relative py-12 sm:py-16 lg:py-20">
        {/* The header gets its own viewport-height anchor so it reads as a
            chapter opener rather than a caption the eye skips on the way into
            the pinned truck sequence below. Safe to animate: this is a sibling
            of the pinned TruckAssembly, not an ancestor, so the transform
            cannot become a containing block for its `position: fixed` pin. */}
        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -18% 0px' }}
          transition={{ type: 'spring', stiffness: 110, damping: 18, mass: 0.9 }}
          className="flex min-h-[56svh] flex-col items-center justify-center text-center lg:min-h-[62svh]"
        >
          <span className="eyebrow">
            <span className="h-px w-7 bg-brand-600" aria-hidden />
            What we distribute
          </span>

          <h2 className="display mt-6 max-w-[19ch] text-balance text-[1.9rem] leading-[1.12] tracking-tight sm:text-[2.6rem] lg:text-[3rem] lg:leading-[1.08]">
            <GradientPhrase text={SUBTITLE} phrase="keeps a building safe" />
          </h2>

          <p className="mt-5 max-w-lg text-pretty leading-relaxed text-slate-500">
            Six lines, distributed and specified from Bengaluru.
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            variants={badgeList}
            className="mt-9 flex max-w-2xl flex-wrap items-center justify-center gap-2.5"
          >
            {about.distributesShort.map((line) => (
              <motion.li
                key={line}
                variants={badge}
                whileHover={{ y: -3 }}
                className="rounded-full border border-orange-500/30 bg-orange-50/50 px-4 py-2 text-[0.82rem] font-semibold text-slate-800 shadow-sm shadow-orange-500/5 backdrop-blur-md transition-colors duration-300 hover:border-[#FF5A00]/60 hover:bg-orange-100/60 hover:text-slate-900"
              >
                {line}
              </motion.li>
            ))}
          </motion.ul>

          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 inline-flex flex-col items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400"
          >
            Scroll to load
            <ChevronDown className="h-4 w-4 text-[#FF5A00]" strokeWidth={2.4} />
          </motion.span>
        </motion.div>

        {/* Stage one: the truck rolls in and the six lines load into the bay,
            locking the headline as the last crate seats. */}
        <TruckAssembly headline={HEADLINE} systems={systems} icons={ICONS} />

        {/* Phase two: the assembled set becomes something you can page through. */}
        {/* Deliberately a plain div, not a `motion.div`. Framer leaves a
            `transform` on the element after an entrance animation, and a
            transformed ancestor becomes the containing block for `position:
            fixed` — which is how ScrollTrigger pins. Wrapping the stack in one
            would quietly break its own pin. The cards carry their own entrance
            instead. */}
        <div className="mt-8 lg:mt-12">
          <CardStack systems={systems} icons={ICONS} />
        </div>

        {/* The full list in the server HTML, so crawlers and assistive tech get
            every line whether or not the stack has been paged through. */}
        <ul className="sr-only">
          {systems.map((system) => (
            <li key={system.id}>
              {system.title} — {system.tagline}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
