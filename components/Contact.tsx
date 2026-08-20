'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { contact, contactCopy, company } from '@/lib/site';

const FIELD =
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-[0.95rem] text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/15';

const LABEL =
  'mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500';

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
    <section id="contact" className="relative border-t border-slate-200 bg-white">
      <div className="shell py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
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
                <div key={title} className="border-t border-slate-200 py-7">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-brand-600" strokeWidth={2.3} />
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
          </div>

          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-card sm:p-10"
            >
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
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-7 py-4 text-[0.92rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-700 hover:shadow-lift sm:w-auto"
              >
                <Send className="h-4 w-4" strokeWidth={2.3} />
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
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
