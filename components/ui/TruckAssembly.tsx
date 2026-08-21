'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LucideIcon } from 'lucide-react';
import type { SystemCard } from '@/lib/site';
import { GradientText } from '@/components/ui/GradientText';

/* Cargo slot centres, as a share of the stage, matching the SVG bay drawn
   below (viewBox 900x480). Three columns on a 157-unit pitch inside a bay
   padded to x 64-536, and two rows in the zone under the livery header. The
   bay is deliberately taller than the payload needs, so every crate clears the
   header rule, the floor line at y 380, and the wheels below it. */
const SLOTS = [
  { left: '15.86%', top: '37%' },
  { left: '33.33%', top: '37%' },
  { left: '50.81%', top: '37%' },
  { left: '15.86%', top: '58.4%' },
  { left: '33.33%', top: '58.4%' },
  { left: '50.81%', top: '58.4%' },
] as const;

/** Where each crate falls from, before the scroll drops it in. */
const DROP = [
  { x: -30, y: -46, r: -18 },
  { x: 6, y: -58, r: 12 },
  { x: 34, y: -44, r: 20 },
  { x: -38, y: -34, r: 16 },
  { x: 14, y: -52, r: -22 },
  { x: 40, y: -30, r: 24 },
] as const;

const SPREAD_MOBILE = 0.55;

/** Wheel centres in viewBox units, for the spin origin. */
const WHEEL_X = [178, 468, 700] as const;
const WHEEL_Y = 400;

type Props = { headline: string; systems: SystemCard[]; icons: Record<string, LucideIcon> };

export default function TruckAssembly({ headline, systems, icons }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const wheelsRef = useRef<Array<SVGGElement | null>>([]);
  const cratesRef = useRef<Array<HTMLDivElement | null>>([]);
  const wordsRef = useRef<Array<HTMLSpanElement | null>>([]);

  const words = headline.split(' ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const crates = cratesRef.current.filter((el): el is HTMLDivElement => !!el);
      const wordInners = wordsRef.current.filter((el): el is HTMLSpanElement => !!el);
      const wheels = wheelsRef.current.filter((el): el is SVGGElement => !!el);
      if (!crates.length) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([...crates, ...wordInners, truckRef.current], { clearProps: 'all' });
      });

      mm.add(
        {
          wide: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          narrow: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const spread = context.conditions?.wide ? 1 : SPREAD_MOBILE;
          gsap.set(wordInners, { yPercent: 115, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: 'center center',
              end: () => `+=${Math.round(window.innerHeight * 1.15)}`,
              pin: true,
              pinSpacing: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // The truck rolls in first — there has to be something to load into.
          tl.fromTo(
            truckRef.current,
            /* User units, not `xPercent`. On an SVG <g>, percentage translation
               resolves against the bbox and lands the truck wildly off-stage;
               the viewBox is 900 wide, so -820 is exactly one truck-length. */
            { x: -820, opacity: 0 },
            { x: 0, opacity: 1, ease: 'power2.out', duration: 1 },
            0,
          );
          tl.fromTo(
            wheels,
            { rotate: -260, svgOrigin: (i: number) => `${WHEEL_X[i]} ${WHEEL_Y}` },
            {
              rotate: 0,
              svgOrigin: (i: number) => `${WHEEL_X[i]} ${WHEEL_Y}`,
              ease: 'power2.out',
              duration: 1,
            },
            0,
          );

          // Then the payload drops into the bay, crate by crate.
          crates.forEach((crate, i) => {
            const d = DROP[i % DROP.length];
            tl.fromTo(
              crate,
              {
                x: () => (d.x / 100) * window.innerWidth * spread,
                y: () => (d.y / 100) * window.innerHeight * spread,
                rotate: d.r * spread,
                scale: 0.78,
                opacity: 0,
              },
              {
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                ease: 'power2.inOut',
                duration: 0.9,
              },
              0.75 + i * 0.13,
            );
          });

          // The headline locks as the last crate seats.
          tl.to(
            wordInners,
            { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.6, stagger: 0.06 },
            1.85,
          );
          tl.to({}, { duration: 0.3 });
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col items-center bg-white py-8 lg:py-10">
      {/* Loading bay. The SVG is pure line-art so it reads as a schematic
          rather than an illustration, and sits on flat white as specified. */}
      <div /* The 90vh term ties the bay's width to viewport HEIGHT: at 9:4 the
              rendered height is width x 4/9, so capping width at 90vh keeps the
              stage under ~40vh and leaves room for the headline beneath it on a
              short 14" screen. */
          className="relative w-full max-w-[min(52rem,82vw,75vh)]"
        style={
          {
            aspectRatio: '15 / 8',
            '--bay': 'min(52rem, 82vw, 75vh)',
          } as React.CSSProperties
        }>
        <svg
          viewBox="0 0 900 480"
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
          aria-hidden
        >
          <g
            ref={truckRef}
            stroke="#0f172a"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Cargo bay */}
            <rect x="40" y="50" width="520" height="330" rx="10" />
            {/* Header rule: everything above it is livery, everything below
                is payload. The two zones never share vertical space. */}
            <path d="M40 115h520" strokeWidth={1.6} opacity={0.28} />
            {/* Cab */}
            <path d="M570 380V220a10 10 0 0 1 10-10h108l72 78v92" />
            <path d="M596 236h74l52 56h-126z" strokeWidth={2.4} />
            {/* Chassis */}
            <path d="M40 380h720" />
            <path d="M760 380v-46" strokeWidth={2.4} />
            {/* Wheels */}
            {WHEEL_X.map((cx, i) => (
              <g
                key={cx}
                ref={(el) => {
                  wheelsRef.current[i] = el;
                }}
              >
                <circle cx={cx} cy="400" r="32" />
                <circle cx={cx} cy="400" r="12" strokeWidth={2.4} />
                <path d={`M${cx} 368v14M${cx} 418v14M${cx - 32} 400h14M${cx + 18} 400h14`} strokeWidth={2} />
              </g>
            ))}
            {/* Motion lines */}
            <path d="M8 150h34M8 205h22M8 260h30" strokeWidth={2} opacity={0.35} />

            {/* CPK livery, in the bay's dedicated header zone (y 60-112).
                The cargo grid starts at y 118, so no crate can ever reach the
                mark or the wordmark — they are separated by layout, not by
                stacking order (the crates are HTML painted over this SVG and
                would always win a z-index contest). */}
            <g stroke="none">
              <image
                href="/images/brand/logo-mark.png"
                x="56"
                y="60"
                width="44"
                height="44"
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                x="110"
                y="90"
                className="font-display"
                fontSize="14"
                fontWeight="700"
                fill="#0f172a"
                letterSpacing="0.1"
              >
                CPK FIRE &amp; SECURITY SYSTEMS PVT LTD
              </text>
              <text
                x="544"
                y="90"
                textAnchor="end"
                className="font-sans"
                fontSize="9"
                fontWeight="700"
                fill="#E42128"
                letterSpacing="1.2"
              >
                ONE SUPPLY PARTNER
              </text>
            </g>
          </g>
        </svg>

        {/* Payload. HTML rather than SVG so the icons and labels stay crisp and
            selectable, positioned on the same percentage grid as the bay. */}
        {systems.map((system, i) => {
          const Icon = icons[system.icon];
          return (
            <div
              key={system.id}
              ref={(el) => {
                cratesRef.current[i] = el;
              }}
              style={{
                left: SLOTS[i].left,
                top: SLOTS[i].top,
                width: '14%',
                fontSize: 'calc(var(--bay) * 0.019)',
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
            >
              {/* Fixed em height keeps all six identical regardless of label
                  length, so the row never straddles the deck rule. */}
              <div className="flex h-[4.4em] flex-col items-center justify-center gap-[0.3em] rounded-[0.5em] border border-amber-500/25 bg-white/95 px-[0.35em] py-[0.4em] shadow-[0_2px_4px_rgba(15,23,42,0.05),0_10px_24px_-12px_rgba(15,23,42,0.28)] backdrop-blur-sm">
                <Icon className="h-[1.15em] w-[1.15em] shrink-0 text-brand-600" strokeWidth={2.3} />
                <span className="line-clamp-2 text-center text-[0.72em] font-semibold leading-[1.15] text-slate-700">
                  {system.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="display mt-8 max-w-[16ch] text-balance text-center text-[2.1rem] leading-[1.18] sm:text-[2.6rem] lg:text-[3rem] lg:leading-[1.16]">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            {/* Space emitted as a sibling text node, not a margin: inside the
                overflow-hidden mask it would be collapsed, and a margin would
                leave textContent with no word breaks at all. */}
            <span className="inline-block -mb-[0.16em] overflow-hidden pb-[0.16em] align-bottom">
              <span
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="inline-block"
              >
                {i >= words.length - 2 ? <GradientText>{word}</GradientText> : word}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </h2>
    </div>
  );
}
