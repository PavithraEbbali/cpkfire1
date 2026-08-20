import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import Parallax from '@/components/ui/Parallax';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { about, company, contact } from '@/lib/site';

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-slate-200 bg-white">
      <div className="shell py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Copy leads on the left — the reverse of the usual photo-first split. */}
          <div className="lg:pr-8">
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              The company
            </span>

            <Reveal>
              <h2 className="display mt-6 text-balance text-[2.1rem] leading-[1.04] sm:text-[3rem] lg:text-[3.5rem]">
                {about.headline}
              </h2>
              <p className="mt-6 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-slate-500">
                {about.lede}
              </p>
            </Reveal>

            {/* Numbered rail rather than a bulleted list. */}
            <RevealGroup as="ul" className="mt-12 space-y-px">
              {about.points.map((point, i) => (
                <RevealItem
                  as="li"
                  key={point.title}
                  className="group grid gap-2 border-t border-slate-200 py-6 sm:grid-cols-[auto_1fr] sm:gap-8"
                >
                  <span className="numeral pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display text-[1.05rem] font-semibold text-slate-900">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 max-w-lg text-[0.95rem] leading-relaxed text-slate-500">
                      {point.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <a
                href={contact.indiamart}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-2 border-b-2 border-brand-600 pb-1 font-display text-[0.95rem] font-semibold text-slate-900 transition-colors hover:text-brand-600"
              >
                Browse the catalogue
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.4}
                />
              </a>
            </Reveal>
          </div>

          {/* Real extracted photography in a tall stacked frame. */}
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/5] w-full">
                <Parallax className="absolute inset-0" distance={48}>
                  <Image
                    src="/images/gallery/fa_3.jpg"
                    alt="Addressable fire alarm panel with detectors, sounder and manual call point"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="scale-105 object-contain p-10 sm:p-14"
                  />
                </Parallax>
              </div>

              <div className="border-t border-slate-200 bg-white px-7 py-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="font-display text-[2.6rem] font-bold leading-none tracking-tightest text-slate-900">
                      {company.established}
                    </p>
                    <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Trading since
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[2.6rem] font-bold leading-none tracking-tightest text-brand-600">
                      06
                    </p>
                    <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      System lines
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
