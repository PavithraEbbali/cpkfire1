'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { contact, nav } from '@/lib/site';
import { cn } from '@/components/ui/Primitives';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-nav backdrop-blur-xl'
          : 'border-b border-transparent bg-white/55 backdrop-blur-md',
      )}
    >
      <div className="shell">
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500',
            scrolled ? 'h-[66px]' : 'h-[86px]',
          )}
        >
          <Link
            href="#top"
            className="flex items-center gap-3"
            aria-label="CPK Fire and Security Systems — top of page"
          >
            <Image
              src="/images/brand/logo-mark.png"
              alt=""
              width={512}
              height={512}
              priority
              className={cn('transition-all duration-500', scrolled ? 'h-8 w-8' : 'h-10 w-10')}
            />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[1.15rem] font-bold tracking-tighter2 text-slate-900">
                CPK
              </span>
              <span className="mt-[3px] block text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Fire &amp; Security
              </span>
            </span>
            <span className="sr-only">CPK Fire and Security Systems</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[0.875rem] font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-brand-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={contact.mobiles[0].href}
              className="flex items-center gap-2 text-[0.875rem] font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              <Phone className="h-[15px] w-[15px]" strokeWidth={2.2} />
              {contact.mobiles[0].label}
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-all duration-300 hover:-translate-y-px hover:bg-brand-700 hover:shadow-lift"
            >
              Request quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-900 lg:hidden"
          >
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="shell flex flex-col py-5">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-slate-100 py-4 font-display text-lg font-semibold text-slate-900"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-5 rounded-lg bg-brand-600 px-6 py-3.5 text-center font-semibold text-white"
              >
                Request quote
              </a>
              <a
                href={contact.mobiles[0].href}
                className="mt-3 flex items-center justify-center gap-2 py-2 font-medium text-slate-600"
              >
                <Phone className="h-4 w-4" />
                {contact.mobiles[0].label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
