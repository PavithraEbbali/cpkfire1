# CPK Fire and Security Systems

A premium one-page site for **CPK Fire and Security Systems Private Limited**, Bengaluru —
distributors of fire alarm and suppression, access control, CCTV, aspirating detection,
public address and voice alarm, and hotel locking systems.

## Stack

- **Next.js 15** (App Router) · **TypeScript** (strict) · **Tailwind CSS 3.4**
- **Lenis** — global smooth scroll, driven off the GSAP ticker so ScrollTrigger and
  Lenis share one clock
- **GSAP + ScrollTrigger** — scroll-scrubbed parallax on large imagery
- **Framer Motion** — headline word reveals, `whileInView` fade-ups, hover states
- **lucide-react** — system icons

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

```bash
npm run build   # production build
npm start       # serve the production build
```

## Structure

```
app/                 layout, page, global styles
components/          section components
components/ui/       motion + layout primitives
lib/site.ts          all site content, with per-item source annotations
public/images/       first-party imagery (brand, partners, product)
ai.wing              content/image source log + open blockers
```

## Content provenance

Every fact and image on this site traces to a documented source. `lib/site.ts`
annotates each item inline, and [`ai.wing`](./ai.wing) carries the full log:
what was extracted from the client's live site, what is independently verified
(GST records, Bosch India dealer directory), what was rewritten for this layout,
and what remains an open blocker.

Nothing is invented. All imagery is first-party — no stock, no placeholders.
