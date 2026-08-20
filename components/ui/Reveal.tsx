'use client';

import { motion, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Render children as staggered siblings rather than one block. */
  as?: 'div' | 'section' | 'ul' | 'li' | 'span';
};

/** Fade-up on scroll-into-view. Fires once, 15% into the viewport. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
      }}
    >
      {children}
    </Tag>
  );
}

/** Wrapper that staggers its direct <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  as = 'div',
}: Omit<RevealProps, 'delay'>) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={stagger}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: Omit<RevealProps, 'delay'>) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}

/** Word-by-word headline reveal for the two hero-scale headings. */
export function RevealWords({
  text,
  className,
  accentFrom,
}: {
  text: string;
  className?: string;
  /** Word index from which the accent colour takes over. */
  accentFrom?: number;
}) {
  const words = text.split(' ');
  return (
    <motion.h1
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={
              accentFrom !== undefined && i >= accentFrom
                ? 'inline-block text-brand-600'
                : 'inline-block'
            }
            variants={{
              hidden: { y: '110%' },
              show: { y: 0, transition: { duration: 0.85, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}
