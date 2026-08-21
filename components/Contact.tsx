'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { contact, contactCopy, company } from '@/lib/site';

const FIELD = [
  'w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-3.5',
  'text-[0.95rem] text-slate-900 placeholder:text-slate-400 backdrop-blur-sm',
  'transition-all duration-300 hover:border-slate-400',
  'focus:border-[#FF5A00] focus:outline-none focus:ring-2 focus:ring-[#FF5A00]/20',
].join(' ');

const LABEL =
  'mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  // The live site's form posts nowhere, so this composes a mailto: to the two
  // real published addresses rather than faking a submission.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      `Website enquiry — ${String(data.get('subject') || 'Fire & security systems')}`,
    );
    const bodyText = encodeURIComponent(
      [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Phone: ${data.get('phone')}`,
        '',
        String(data.get('message') || ''),
      ].join('\n'),
    );
    window.location.href = `mailto:${contact.emails[0]}?cc=${contact.emails[1]}&subject=${subject}&body=${bodyText}`;
    setStatus('sent');
  };

  const details = [
    {
      icon: MapPin,
      title: 'Registered office',
      body: (
        <address className="not-italic leading-relaxed text-slate-500">
          <span className="mb-1 block font-medium text-slate-700">{company.displayName}</span>
          {contact.address.line1}
          <br />
          {contact.address.line2}
          <br />
          {contact.address.line3}
        </address>
      ),
      action: { label: 'Open in Google Maps', href: contact.mapsUrl, external: true },
    },
    {
      icon: Phone,
      title: 'Call',
      body: (
        <div className="flex flex-col gap-1.5">
          <a href={contact.landline.href} className="text-slate-500 transition-colors hover:text-brand-600">
            {contact.landline.label}
          </a>
          {contact.mobiles.map((m) => (
            <a key={m.href} href={m.href} className="text-slate-500 transition-colors hover:text-brand-600">
              {m.label}
            </a>
          ))}
        </div>
      ),
    },
    {
      icon: Mail,
      title: 'Email',
      body: (
        <div className="flex flex-col gap-1.5">
          {contact.emails.map((e) => (
            <a key={e} href={`mailto:${e}`} className="text-slate-500 transition-colors hover:text-brand-600">
              {e}
            </a>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-slate-200 bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-orange-200/25 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/25 blur-[150px]"
      />

      <div className="shell relative py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="eyebrow">
              <span className="h-px w-7 bg-brand-600" aria-hidden />
              Contact
            </span>
            <h2 className="display mt-6 max-w-[14ch] text-balance text-[2.1rem] leading-[1.04] sm:text-[3rem] lg:text-[3.5rem]">
              {contactCopy.headline}
            </h2>
            <p className="mt-6 max-w-md text-pretty text-[1.02rem] leading-relaxed text-slate-500">
              {contactCopy.body}
            </p>

            <Reveal className="mt-12 space-y-px">
              {details.map(({ icon: Icon, title, body, action }) => (
                <div
                  key={title}
                  className="group -mx-4 rounded-xl border-t border-slate-200 px-4 py-7 transition-colors duration-500 hover:border-orange-400/60 hover:bg-orange-50/40"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-50/60 transition-colors duration-500 group-hover:border-[#FF5A00]/50 group-hover:bg-orange-100/70">
                      <Icon className="h-4 w-4 text-brand-600" strokeWidth={2.3} />
                    </span>
                    <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-900">
                      {title}
                    </h3>
                  </div>
                  <div className="mt-3 text-[0.95rem]">{body}</div>
                  {action && (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-600"
                    >
                      {action.label}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2.5}
                      />
                    </a>
                  )}
                </div>
              ))}
            </Reveal>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <form
              onSubmit={onSubmit}
              className={[
                'relative overflow-hidden rounded-2xl p-8 sm:p-10',
                'border border-orange-500/20 shadow-2xl shadow-orange-500/10',
                'bg-gradient-to-br from-white via-slate-50/50 to-orange-50/20 backdrop-blur-xl',
              ].join(' ')}
            >
              {/* Ember accents behind the fields, inert to input. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#FF5A00]/10 blur-3xl"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
              />
              <div className="relative">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={LABEL}>Name</span>
                  <input name="name" required className={FIELD} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className={LABEL}>Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className={FIELD}
                    placeholder="you@company.com"
                  />
                </label>
                <label className="block">
                  <span className={LABEL}>Phone</span>
                  <input name="phone" className={FIELD} placeholder="+91" />
                </label>
                <label className="block">
                  <span className={LABEL}>System</span>
                  <input
                    name="subject"
                    className={FIELD}
                    placeholder="Fire alarm, CCTV, access…"
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className={LABEL}>Requirement</span>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className={`${FIELD} resize-none`}
                  placeholder="Building type, site location, approximate device count…"
                />
              </label>

              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
                className={[
                  'group mt-7 inline-flex w-full items-center justify-center gap-2.5 sm:w-auto',
                  'rounded-xl px-7 py-4 text-[0.92rem] font-semibold text-white',
                  'bg-gradient-to-r from-[#FF5A00] via-brand-600 to-[#FF5A00] bg-[length:200%_100%] bg-left',
                  'shadow-lg shadow-[#FF5A00]/30 transition-all duration-500',
                  'hover:bg-right hover:shadow-xl hover:shadow-[#FF5A00]/45',
                ].join(' ')}
              >
                <Send
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={2.3}
                />
                Send enquiry
              </motion.button>

              <p
                aria-live="polite"
                className={`mt-4 text-[0.82rem] ${status === 'sent' ? 'text-brand-600' : 'text-slate-400'}`}
              >
                {status === 'sent'
                  ? 'Opening your mail app with the enquiry drafted.'
                  : `Goes to ${contact.emails.join(' and ')}.`}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
