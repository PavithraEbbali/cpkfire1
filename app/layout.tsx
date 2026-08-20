import type { Metadata, Viewport } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { company, contact } from '@/lib/site';

/* New typography for this build. Sora is a geometric grotesque — precise and
   engineered-feeling, which suits life-safety systems; Inter carries the body.
   Deliberately NOT the old site's Nunito/Open Sans pairing. */
const display = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cpkfire.com'),
  title: {
    default: 'CPK Fire and Security Systems — Distributors of fire and security systems',
    template: '%s | CPK Fire and Security Systems',
  },
  description:
    'CPK Fire and Security Systems Pvt Ltd, Bengaluru. Distributors of fire alarm and suppression, access control, CCTV, aspiration, public address and hotel lock systems.',
  keywords: [
    'fire alarm Bengaluru',
    'CCTV distributor Bangalore',
    'access control systems',
    'aspiration systems',
    'public address and voice alarm',
    'hotel lock systems',
    'Bosch security distributor',
  ],
  icons: { icon: '/images/brand/favicon.png' },
  openGraph: {
    type: 'website',
    title: 'CPK Fire and Security Systems',
    description: company.positioning,
    siteName: company.shortName,
    locale: 'en_IN',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#E42128',
  width: 'device-width',
  initialScale: 1,
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: company.legalName,
  alternateName: company.shortName,
  description: company.positioning,
  foundingDate: String(company.established),
  email: contact.emails[0],
  telephone: contact.mobiles[0].label,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${contact.address.line1}, ${contact.address.line2}`,
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560071',
    addressCountry: 'IN',
  },
  hasMap: contact.mapsUrl,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
