'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import PartnerCarousel from '@/components/ui/PartnerCarousel';
import { GradientPhrase } from '@/components/ui/GradientText';
import { cn } from '@/components/ui/Primitives';
import { credentials, partners, partnersCopy } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Only Bosch carries an independently verified distributor credential. */
const VERIFIED = ['Bosch'] as const;

const STATS = [
  ['08', 'Technology partners'],
  ['06', 'System lines'],
  ['01', 'Bengaluru base'],
  ['2018', 'Trading since'],
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const riseUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Credentials() {
  // Duplicated once so the -50% marquee keyframe loops seamlessly.
  const loop = [...partners, ...partners];

  return (
    <section
      id="credentials"
      className="relative overflow-hidden border-t border-slate-200 bg-white"
      aria-label="Credentials and technology partners"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-amber-200/25 blur-[150px]"
      />

      <div className="shell relative pt-24 sm:pt-32 lg:pt-40">
        {/* Asymmetric bento: the carousel anchors the left, the headline and
            stats take the wider right column. */}
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              Credentials
            </span>
            <div className="mt-6">
              <PartnerCarousel partners={partners} verified={VERIFIED} />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            variants={container}
          >
            <motion.h2
              variants={riseUp}
              className="display text-balance text-[2rem] leading-[1.12] tracking-tight sm:text-[2.6rem] lg:text-[2.8rem]"
            >
              <GradientPhrase
                text="Tied up with the brands that set the standard."
                phrase="set the standard"
              />
            </motion.h2>

            <motion.p
              variants={riseUp}
              className="mt-5 max-w-lg text-pretty leading-relaxed text-slate-500"
            >
              {partnersCopy.body}
            </motion.p>

            {/* Credential chips */}
            <motion.ul variants={riseUp} className="mt-8 flex flex-wrap gap-2.5">
              {credentials.map((c) => (
                <li
                  key={c.title}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2',
                    'text-[0.78rem] font-semibold transition-colors duration-500',
                    c.verified
                      ? 'border-amber-500/30 bg-amber-50/60 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-600',
                  )}
                >
                  <BadgeCheck
                    className={cn('h-4 w-4 shrink-0', c.verified ? 'text-brand-600' : 'text-slate-300')}
                    strokeWidth={2.3}
                  />
                  {c.title}
                </li>
              ))}
            </motion.ul>

            {/* Four-grid statistics block */}
            <motion.dl
              variants={container}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {STATS.map(([value, label]) => (
                <motion.div
                  key={label}
                  variants={riseUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className={cn(
                    'group relative overflow-hidden rounded-xl px-5 py-6',
                    'border border-amber-500/30 bg-gradient-to-br from-white via-slate-50 to-amber-50/30',
                    'shadow-lg shadow-slate-900/5 backdrop-blur-md transition-all duration-500',
                    'hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-900/15',
                  )}
                >
                  {/* Fire-orange accent wipes across the top edge on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] w-0 bg-gradient-to-r from-amber-400 via-orange-500 to-brand-600 transition-all duration-500 group-hover:w-full"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <dt className="font-display text-[1.7rem] font-bold leading-none tracking-tighter2 text-slate-900 transition-colors duration-500 group-hover:text-brand-600">
                    {value}
                  </dt>
                  <dd className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </div>

      {/* Infinite partner ticker closes the section. The array is duplicated
          once and the keyframe travels exactly -50%, so the seam lands on an
          identical frame and the loop is invisible. */}
      <div className="fade-x mt-16 overflow-hidden border-t border-slate-200 py-12 sm:mt-20">
        {/* No `hover:[animation-play-state:paused]` — the ticker runs
            continuously, including while the pointer is over it. */}
        <div className="flex w-max animate-marquee items-center gap-16 pr-16 sm:gap-24 sm:pr-24">
          {loop.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="relative h-9 w-[132px] shrink-0 opacity-60 grayscale transition-all duration-500 hover:scale-105 hover:opacity-100 hover:grayscale-0 sm:h-10 sm:w-[152px]"
            >
              <Image
                src={p.src}
                alt={p.name}
                fill
                sizes="152px"
                loading="eager"
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
