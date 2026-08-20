'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Phone } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import { RevealWords } from '@/components/ui/Reveal';
import { about, contact, hero } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
      {/* Real extracted photograph, full-bleed under a light wash so the page
          opens bright. GSAP drives the drift. */}
      <div className="absolute inset-0 -z-10">
        <Parallax className="absolute inset-0" distance={120} zoom>
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover object-center"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/45 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="shell">
        <div className="flex min-h-[88svh] flex-col justify-center pb-28 pt-36 sm:pb-32 sm:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="eyebrow"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            {hero.eyebrow}
          </motion.div>

          <RevealWords
            text={hero.headline}
            accentFrom={5}
            className="display mt-8 max-w-[15ch] text-balance text-[3rem] leading-[0.95] sm:text-[4.6rem] lg:text-[6.2rem]"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="mt-8 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-slate-500"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-4 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lift"
            >
              {hero.primaryCta.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </a>
            <a
              href={contact.mobiles[0].href}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-7 py-4 text-[0.92rem] font-semibold text-slate-900 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900"
            >
              <Phone className="h-4 w-4" strokeWidth={2.3} />
              {contact.mobiles[0].label}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Credential rail: overlaps the section seam so the hero resolves into
          the page rather than stopping at a hard edge. */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        className="shell relative z-10 -mb-px"
      >
        <div className="translate-y-px rounded-t-2xl border border-b-0 border-slate-200 bg-white/95 px-6 py-7 shadow-card backdrop-blur sm:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-px h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.3} />
              <p className="max-w-md text-[0.95rem] leading-snug text-slate-600">
                <span className="font-semibold text-slate-900">
                  Authorized Bosch Security Systems distributor
                </span>{' '}
                — alongside Siemens, HID, Assa Abloy, Xtralis and Micro Power.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 lg:flex lg:gap-7">
              {about.distributesShort.map((item) => (
                <li
                  key={item}
                  className="whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-slate-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
