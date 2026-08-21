'use client';

import FeatureCarousel from '@/components/ui/FeatureCarousel';
import { GradientPhrase } from '@/components/ui/GradientText';
import { contact, equipment, equipmentCopy } from '@/lib/site';

export default function Equipment() {
  return (
    <section
      id="equipment"
      className="relative overflow-hidden border-t border-slate-200 bg-slate-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-amber-200/30 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-orange-200/25 blur-[150px]"
      />

      <div className="shell relative py-24 sm:py-28 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              Equipment
            </span>
            <h2 className="display mt-6 max-w-[16ch] text-balance text-[2.1rem] leading-[1.08] tracking-tight sm:text-[2.9rem] lg:text-[3.3rem]">
              <GradientPhrase text={equipmentCopy.headline} phrase="equipment we move" />
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-slate-500 lg:pb-2">
            {equipmentCopy.body}
          </p>
        </div>

        {/* Deliberately a plain div, not a `motion.div`. Framer leaves a
            transform on the element after an entrance animation, and a
            transformed ancestor becomes the containing block for
            `position: fixed` — which is how ScrollTrigger pins. Wrapping the
            carousel in one would silently break its own pin. */}
        <div className="mt-14 sm:mt-16">
          <FeatureCarousel items={equipment} href={contact.indiamart} />
        </div>

        {/* The full list in the server HTML, so crawlers and assistive tech get
            every item whether or not the carousel has been paged through. */}
        <ul className="sr-only">
          {equipment.map((item) => (
            <li key={item.src}>
              {item.category} — {item.label}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl text-[0.8rem] leading-relaxed text-slate-400">
          Equipment distributed by CPK Fire and Security Systems. Captions identify the
          hardware pictured.
        </p>
      </div>
    </section>
  );
}
