import Image from 'next/image';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { credentials, partners, partnersCopy } from '@/lib/site';

export default function Credentials() {
  // Duplicated once so the -50% marquee keyframe loops seamlessly.
  const loop = [...partners, ...partners];

  return (
    <section
      id="credentials"
      className="relative border-t border-slate-200 bg-white"
      aria-label="Credentials and technology partners"
    >
      <div className="shell pt-24 sm:pt-32 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          {/* Bosch credential carries the section — it is the strongest
              independently verified fact the company has. */}
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              Credentials
            </span>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <div className="relative h-9 w-[150px]">
                <Image
                  src="/images/partners/bosch.png"
                  alt="Bosch"
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                />
              </div>

              <p className="mt-7 flex items-center gap-2 font-display text-[1.35rem] font-semibold leading-snug text-slate-900">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.3} />
                Authorized distributor
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-500">
                Listed on Bosch India&rsquo;s official dealer directory for Bosch Security
                Systems CCTV.
              </p>
            </div>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {credentials
                .filter((c) => !c.title.toLowerCase().includes('bosch'))
                .map((c) => (
                  <li
                    key={c.title}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-5"
                  >
                    <BadgeCheck
                      className={
                        c.verified
                          ? 'h-[18px] w-[18px] text-brand-600'
                          : 'h-[18px] w-[18px] text-slate-300'
                      }
                      strokeWidth={2.3}
                    />
                    <p className="mt-3 font-display text-[0.98rem] font-semibold text-slate-900">
                      {c.title}
                    </p>
                    <p className="mt-1 text-[0.85rem] text-slate-500">{c.detail}</p>
                  </li>
                ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="lg:pt-14">
            <h2 className="display text-balance text-[2rem] leading-[1.06] sm:text-[2.8rem]">
              Tied up with the brands that set the standard.
            </h2>
            <p className="mt-5 max-w-lg text-pretty leading-relaxed text-slate-500">
              {partnersCopy.body}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
              {[
                ['08', 'Technology partners'],
                ['06', 'System lines'],
                ['01', 'Bengaluru base'],
                ['2018', 'Trading since'],
              ].map(([value, label]) => (
                <div key={label} className="bg-white px-5 py-6">
                  <dt className="font-display text-[1.6rem] font-bold leading-none tracking-tighter2 text-slate-900">
                    {value}
                  </dt>
                  <dd className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Partner marquee closes the section. */}
      <div className="fade-x mt-16 overflow-hidden border-t border-slate-200 py-12 sm:mt-20">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused] sm:gap-24 sm:pr-24">
          {loop.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="relative h-9 w-[132px] shrink-0 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 sm:h-10 sm:w-[152px]"
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
