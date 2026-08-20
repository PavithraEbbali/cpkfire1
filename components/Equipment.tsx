'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/Primitives';
import { equipment, equipmentCopy } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Equipment() {
  return (
    <section id="equipment" className="relative border-t border-slate-200 bg-slate-50">
      <div className="shell py-24 sm:py-32 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              Equipment
            </span>
            <h2 className="display mt-6 max-w-[16ch] text-balance text-[2.1rem] leading-[1.04] sm:text-[3rem] lg:text-[3.5rem]">
              {equipmentCopy.headline}
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-slate-500 lg:pb-2">
            {equipmentCopy.body}
          </p>
        </div>

        {/* Masonry via CSS columns so each product shot keeps its proportion. */}
        <div className="mt-14 gap-5 [column-count:1] sm:mt-16 sm:[column-count:2] lg:[column-count:3]">
          {equipment.map((item, i) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -6% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
              className="group relative mb-5 block break-inside-avoid overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div
                className={cn(
                  'relative w-full overflow-hidden',
                  item.tall ? 'aspect-[4/5]' : 'aspect-[4/3]',
                )}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-9 transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              </div>

              {/* Hover-reveal label. The live site publishes these unlabelled;
                  captions describe the hardware, never a project. */}
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-slate-900/95 px-6 py-5 transition-transform duration-500 ease-out group-hover:translate-y-0">
                <span className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-400">
                  <span className="h-px w-4 bg-brand-600" aria-hidden />
                  {item.category}
                </span>
                <span className="mt-2 block text-balance font-display text-[1rem] font-semibold leading-snug text-white">
                  {item.label}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-[0.8rem] leading-relaxed text-slate-400">
          Equipment distributed by CPK Fire and Security Systems. Captions identify the
          hardware pictured.
        </p>
      </div>
    </section>
  );
}
