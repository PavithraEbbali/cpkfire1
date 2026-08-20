import Image from 'next/image';
import { about, company, contact, nav } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1.2fr]">
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

            <address className="mt-6 max-w-xs not-italic text-[0.92rem] leading-relaxed text-slate-500">
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.line3}
            </address>
          </div>

          <div>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Navigate
            </h3>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.92rem] text-slate-500 transition-colors hover:text-brand-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-900">
              Systems
            </h3>
            <ul className="mt-5 space-y-2.5">
              {about.distributes.map((item) => (
                <li key={item}>
                  <a
                    href="#systems"
                    className="text-[0.92rem] text-slate-500 transition-colors hover:text-brand-600"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-1.5 text-[0.92rem]">
              <a
                href={contact.landline.href}
                className="block text-slate-500 transition-colors hover:text-brand-600"
              >
                {contact.landline.label}
              </a>
              {contact.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="block text-slate-500 transition-colors hover:text-brand-600"
                >
                  {e}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="shell flex flex-col items-center justify-between gap-2 py-6 sm:flex-row">
          <p className="text-[0.8rem] text-slate-400">
            &copy; {new Date().getFullYear()} {company.shortName}. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-slate-400">Bengaluru, Karnataka · India</p>
        </div>
      </div>
    </footer>
  );
}
