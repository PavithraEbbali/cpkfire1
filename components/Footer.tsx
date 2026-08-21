import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { about, company, contact, nav } from '@/lib/site';

/* Shared link treatment. Kept as one constant so every link in the footer
   highlights identically — the CTA colour is the fire orange, not the brand
   red, which reads warmer against the muted slate body copy. */
const LINK =
  'text-slate-500 transition-colors duration-300 hover:text-[#FF5A00]';

const HEADING =
  'text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-900';

export default function Footer() {
  return (
    <footer className="relative border-t border-orange-500/20 bg-gradient-to-b from-white to-slate-50/80">
      {/* Ember glow riding the top border, so the seam with the contact
          section reads as a deliberate edge rather than a plain rule. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#FF5A00]/50 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-orange-50/50 to-transparent"
      />

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/brand/logo-mark.png"
                alt=""
                width={512}
                height={512}
                className="h-10 w-10"
              />
              <span className="leading-none">
                <span className="block font-display text-[1.25rem] font-bold tracking-tighter2 text-slate-900">
                  CPK
                </span>
                <span className="mt-[3px] block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Fire &amp; Security
                </span>
              </span>
            </div>

            <p className="mt-7 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-slate-500">
              {company.legalName} — distributors of fire and security systems, Bengaluru.
            </p>

            <address className="mt-6 flex max-w-xs gap-2.5 not-italic text-[0.92rem] leading-relaxed text-slate-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF5A00]" strokeWidth={2.2} />
              <span>
                {contact.address.line1}
                <br />
                {contact.address.line2}
                <br />
                {contact.address.line3}
              </span>
            </address>
          </div>

          <div>
            <h3 className={HEADING}>Navigate</h3>
            <span aria-hidden className="mt-3 block h-px w-8 bg-[#FF5A00]/60" />
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-[0.92rem] ${LINK}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={HEADING}>Systems</h3>
            <span aria-hidden className="mt-3 block h-px w-8 bg-[#FF5A00]/60" />
            <ul className="mt-5 space-y-2.5">
              {about.distributes.map((item) => (
                <li key={item}>
                  <a
                    href="#systems"
                    className={`text-[0.92rem] ${LINK}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-2.5 border-t border-orange-500/15 pt-6 text-[0.92rem]">
              <a
                href={contact.landline.href}
                className={`group flex items-center gap-2.5 ${LINK}`}
              >
                <Phone
                  className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors duration-300 group-hover:text-[#FF5A00]"
                  strokeWidth={2.3}
                />
                {contact.landline.label}
              </a>
              {contact.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className={`group flex items-center gap-2.5 break-all ${LINK}`}
                >
                  <Mail
                    className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors duration-300 group-hover:text-[#FF5A00]"
                    strokeWidth={2.3}
                  />
                  {e}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-orange-500/15 bg-white/60">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-[0.78rem] tracking-[0.01em] text-slate-400">
            &copy; Copyright {company.shortName}. All Rights Reserved.
          </p>
          <p className="flex items-center gap-2 text-[0.78rem] font-medium tracking-[0.06em] text-slate-500">
            <span className="h-1 w-1 rounded-full bg-[#FF5A00]/70" aria-hidden />
            Bengaluru, Karnataka
            <span className="text-slate-300" aria-hidden>
              &bull;
            </span>
            India
          </p>
        </div>
      </div>
    </footer>
  );
}
