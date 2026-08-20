'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Cctv,
  Fingerprint,
  Flame,
  KeyRound,
  Megaphone,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/components/ui/Primitives';
import { systems } from '@/lib/site';

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  megaphone: Megaphone,
  fingerprint: Fingerprint,
  cctv: Cctv,
  keyRound: KeyRound,
  wind: Wind,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Systems() {
  return (
    <section id="systems" className="relative border-t border-slate-200 bg-slate-50">
      <div className="shell py-24 sm:py-32 lg:py-40">
        {/* Heading sits beside the intro rather than stacked above it. */}
        <div className="grid gap-8 border-b border-slate-200 pb-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              What we distribute
            </span>
            <h2 className="display mt-6 max-w-[18ch] text-balance text-[2.1rem] leading-[1.04] sm:text-[3rem] lg:text-[3.5rem]">
              Six system lines, one supply partner.
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-slate-500 lg:pb-2">
            Fire detection and suppression, access control, CCTV, aspirating detection,
            voice alarm and hotel locking.
          </p>
        </div>

        {/* Bento on a 12-column grid: 7/5, 5/7, 6/6. */}
        <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-12">
          {systems.map((system, i) => {
            const Icon = ICONS[system.icon];
            const wide = system.span.includes('span-7');

            return (
              <motion.a
                key={system.id}
                href={system.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 2) * 0.08 }}
                className={cn(
                  'group relative flex flex-col bg-white p-8 transition-colors duration-500 hover:bg-slate-50 sm:p-10',
                  system.span,
                )}
              >
                {/* Accent rule wipes in on hover. */}
                <span className="absolute inset-x-0 top-0 h-[3px] w-0 bg-brand-600 transition-all duration-500 group-hover:w-full" />

                <div className="flex items-start justify-between gap-6">
                  <span className="numeral">{system.index}</span>
                  <Icon
                    className="h-5 w-5 text-slate-300 transition-colors duration-500 group-hover:text-brand-600"
                    strokeWidth={2}
                  />
                </div>

                <div className="mt-9">
                  <h3
                    className={cn(
                      'display text-balance leading-[1.12]',
                      wide ? 'text-[1.6rem] sm:text-[1.9rem]' : 'text-[1.35rem]',
                    )}
                  >
                    {system.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-pretty text-[0.92rem] leading-relaxed text-slate-500">
                    {system.tagline}
                  </p>
                </div>

                {/* Image absorbs the leftover row height, so tiles of differing
                    copy length still bottom out evenly across a row. */}
                <div className="relative mt-8 w-full flex-1 overflow-hidden" style={{ minHeight: 132 }}>
                  <Image
                    src={system.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-contain object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>

                <span className="mt-8 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-slate-400 transition-colors duration-300 group-hover:text-brand-600">
                  Enquire
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.6}
                  />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
