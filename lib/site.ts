/**
 * Single source of truth for site content.
 *
 * SOURCE LEGEND (mirrored in /ai.wing):
 *   [LIVE]     — extracted from https://www.cpkfire.com/ (Playwright render, 2026-08-20)
 *   [VERIFIED] — independently confirmed via GST records / Bosch India dealer directory
 *   [DERIVED]  — rewritten/tightened from [LIVE] copy; no new facts introduced
 *
 * No claim in this file is invented. Anything the live site does not publish is
 * either omitted or carried as a bracketed placeholder.
 */

export const company = {
  /** [LIVE] hero <strong> + footer heading */
  shortName: 'CPK Fire and Security Systems',
  /** [VERIFIED] GST registered legal name */
  legalName: 'CPK Fire and Security Systems Private Limited',
  /** [LIVE] hero + footer, as displayed */
  displayName: 'CPK FIRE AND SECURITY SYSTEMS PVT LTD',
  /** [LIVE] hero h2 */
  positioning: 'Distributors of fire and security systems',
  /** [LIVE] portfolio section paragraph */
  established: 2018,
  /** [LIVE] portfolio section paragraph */
  city: 'Bengaluru, Karnataka',
} as const;

export const contact = {
  /** [LIVE] contact + footer / [VERIFIED] matches GST registered address */
  address: {
    line1: 'C/5, 288, 4th Main Road',
    line2: 'BDA Layout, Domlur 2nd Stage, 3rd Phase',
    line3: 'Bengaluru 560071',
  },
  /** [LIVE] "open in google maps" href */
  mapsUrl: 'https://maps.google.com/?q=12.9637833,77.6350296',
  /** [LIVE] contact + footer */
  emails: ['prasanna@cpkfire.com', 'chandru@cpkfire.com'],
  /** [LIVE] contact section */
  landline: { label: '080-43029821', href: 'tel:08043029821' },
  /** [LIVE] contact section */
  mobiles: [
    { label: '+91 99805 49167', href: 'tel:+919980549167' },
    { label: '+91 99722 35411', href: 'tel:+919972235411' },
  ],
  /** [LIVE] product cards link out to this storefront */
  indiamart: 'https://www.indiamart.com/cpkfiresecuritysystem/',
} as const;

export const nav = [
  { label: 'Company', href: '#about' },
  { label: 'Systems', href: '#systems' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Equipment', href: '#equipment' },
  { label: 'Contact', href: '#contact' },
] as const;

export const hero = {
  /** [DERIVED] from the live founding year + city, written for this layout */
  eyebrow: 'Bengaluru · Established 2018',
  /**
   * [CLIENT-SUPPLIED] Provided verbatim by the client for this build. It is a
   * positioning statement, not a capability claim — the six real system lines
   * it stands over are listed in `sub` and in `about.distributes`.
   */
  headline: 'Absolute Safety Engineering.',
  /** [CLIENT-SUPPLIED] Second headline line, carried in the fire gradient. */
  headlineAccent: 'Delivered Without Compromise.',
  /** [DERIVED] the six real systems, compressed to one line */
  sub: 'Fire detection and suppression, access control, CCTV, aspirating detection, voice alarm and hotel locking — distributed and specified from Bengaluru.',
  primaryCta: { label: 'See the systems', href: '#systems' },
  secondaryCta: { label: 'Request a quote', href: '#contact' },
} as const;

export const about = {
  /** [DERIVED] rewritten from the live about h3 for this layout */
  headline: 'A security engineering company, not a box shifter.',
  /** [DERIVED] tightened from the live about intro paragraph */
  lede:
    'CPK is a professionally managed security engineering company, distributing fire and security systems to Bengaluru sites since 2018.',
  /** [DERIVED] condensed from the live "Mission" paragraphs — no facts added */
  points: [
    {
      title: 'Qualified personnel',
      body: 'Equipped to deliver total solutions for fire and security requirements, to international quality standards.',
    },
    {
      title: 'Quality and cost',
      body: 'Projects executed on a straightforward promise — best service in terms of both quality and cost.',
    },
    {
      title: 'Distribution-led',
      body: 'Direct distribution of fire and security systems, backed by tie-ups with leading global manufacturers.',
    },
  ],
  /** [DERIVED] compact forms of `distributes`, for tight rails */
  distributesShort: [
    'Fire alarm',
    'Access control',
    'CCTV',
    'Aspiration',
    'Voice alarm',
    'Hotel locking',
  ],
  /** [LIVE] about "Distributors for the Products" list, verbatim order */
  distributes: [
    'Fire Alarm & Suppression system',
    'Access Control Systems',
    'CCTV Systems',
    'Aspiration Systems',
    'Public Address and Voice Alarm',
    'Hotel Lock Systems',
  ],
} as const;

export type SystemCard = {
  id: string;
  title: string;
  tagline: string;
  icon: 'flame' | 'megaphone' | 'fingerprint' | 'cctv' | 'keyRound' | 'wind';
  image: string;
  /** ordinal shown in the bento tile */
  index: string;
  /** bento span classes */
  span: string;
  href: string;
};

/**
 * The six systems. Titles and taglines are [LIVE] — verbatim from the live
 * Products section — because they are the company's own product claims.
 * Ordering, numbering and the bento sizing below are new to this build.
 * Images are live-site assets matched by visual identification (see ai.wing).
 */
export const systems: SystemCard[] = [
  {
    id: 'fire-alarm',
    title: 'Fire Alarm & Suppression',
    tagline: 'Safety & security at your fingertips',
    icon: 'flame',
    image: '/images/gallery/fa_3.jpg',
    index: '01',
    span: 'md:col-span-7 lg:col-span-7',
    href: contact.indiamart,
  },
  {
    id: 'cctv',
    title: 'CCTV Systems',
    tagline: 'For all your video surveillance and security camera equipment',
    icon: 'cctv',
    image: '/images/gallery/cc_3.jpg',
    index: '02',
    span: 'md:col-span-5 lg:col-span-5',
    href: contact.indiamart,
  },
  {
    id: 'access-control',
    title: 'Access Control Systems',
    tagline: 'For better management of business operations',
    icon: 'fingerprint',
    image: '/images/gallery/ac_2.jpg',
    index: '03',
    span: 'md:col-span-5 lg:col-span-5',
    href: contact.indiamart,
  },
  {
    id: 'pava',
    title: 'Public Address & Voice Alarm',
    tagline: 'Selective announcements through loud speakers connected and voice alarms',
    icon: 'megaphone',
    image: '/images/gallery/pava_1.jpg',
    index: '04',
    span: 'md:col-span-7 lg:col-span-7',
    href: contact.indiamart,
  },
  {
    id: 'aspiration',
    title: 'Aspiration Systems',
    tagline: 'Highly sensitive fire detection that catches a fire at an early stage',
    icon: 'wind',
    image: '/images/gallery/aa.jpg',
    index: '05',
    span: 'md:col-span-6 lg:col-span-6',
    href: 'https://www.ebss.org.in/',
  },
  {
    id: 'hotel-lock',
    title: 'Hotel Lock Systems',
    tagline: 'Smart locks for every door',
    icon: 'keyRound',
    image: '/images/gallery/dd.jpg',
    index: '06',
    span: 'md:col-span-6 lg:col-span-6',
    href: 'https://www.ebss.org.in/',
  },
];

/**
 * [LIVE] Eight partner logos lifted from the live "Technology Partners" strip.
 * `name` values come from each image's alt text on the live site, except
 * Micro Power — the live alt attribute reads "EBSS" but the asset is mp.jpg and
 * the live About copy names "Micro Power" as a partner. Corrected accordingly.
 */
export const partners = [
  { name: 'Bosch', src: '/images/partners/bosch.png' },
  { name: 'Siemens', src: '/images/partners/Siemens.png' },
  { name: 'HID', src: '/images/partners/hid.png' },
  { name: 'Assa Abloy', src: '/images/partners/aa.png' },
  { name: 'Xtralis', src: '/images/partners/xtralis.svg' },
  { name: 'Micro Power', src: '/images/partners/mp.jpg' },
  { name: 'EBSS', src: '/images/partners/ebss.png' },
  { name: 'Security Shells', src: '/images/partners/ss.jpeg' },
] as const;

/** [LIVE] features section h3 + paragraph */
export const partnersCopy = {
  headline: 'Our partners are top brands',
  body:
    'We have tied up with the best brands in the market and provide the best product to our customers.',
} as const;

/**
 * [LIVE] Every image below is a real asset downloaded from cpkfire.com.
 * The live site publishes these unlabelled (alt="") with no project names,
 * clients or dates. Labels here are visual identifications of the hardware
 * pictured — no project is claimed anywhere. See ai.wing.
 */
export const equipment = [
  {
    src: '/images/gallery/fa_3.jpg',
    category: 'Fire alarm',
    label: 'Fire alarm panel & field devices',
    tall: true,
  },
  {
    src: '/images/gallery/ac_2.jpg',
    category: 'Access control',
    label: 'HID iCLASS SE readers & credentials',
    tall: false,
  },
  {
    src: '/images/gallery/pava_1.jpg',
    category: 'Public address',
    label: 'Bosch PAVA amplifiers & call station',
    tall: false,
  },
  {
    src: '/images/gallery/cc_3.jpg',
    category: 'CCTV',
    label: 'IR dome surveillance camera',
    tall: false,
  },
  {
    src: '/images/gallery/ac_7.jpg',
    category: 'Access control',
    label: 'Assa Abloy proximity reader',
    tall: true,
  },
  {
    src: '/images/gallery/1.jpeg',
    category: 'Fire alarm',
    label: 'Optical smoke & heat detector',
    tall: false,
  },
  {
    src: '/images/gallery/dd.jpg',
    category: 'Hotel locking',
    label: 'RFID hotel door lock',
    tall: true,
  },
  {
    src: '/images/gallery/4.jpeg',
    category: 'Access control',
    label: 'HID AERO access controller',
    tall: false,
  },
  {
    src: '/images/gallery/aa.jpg',
    category: 'Aspiration',
    label: 'VESDA aspirating smoke detection',
    tall: false,
  },
] as const;

/** [DERIVED] from the live portfolio paragraph, rewritten for this section */
export const equipmentCopy = {
  headline: 'The equipment we move',
  body: `Traders for fire and security systems since ${company.established}, out of ${company.city}.`,
} as const;

/** [DERIVED] from the live contact paragraph, rewritten for this layout */
export const contactCopy = {
  headline: 'Tell us about the site.',
  body:
    'Send the building type, the systems you need and a rough device count. We come back with a package priced against your budget.',
} as const;

/**
 * Trust credentials.
 * Bosch line is [VERIFIED] via Bosch India's official dealer directory; the live
 * site independently lists Bosch as a technology partner.
 * The remaining two restate facts published on the live site.
 */
export const credentials = [
  {
    title: 'Authorized Bosch distributor',
    detail: 'Bosch Security Systems — CCTV',
    verified: true,
  },
  { title: `Established ${company.established}`, detail: company.city, verified: false },
  { title: 'Private limited company', detail: 'GST-registered, Bengaluru', verified: true },
] as const;
