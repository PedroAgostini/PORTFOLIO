// Every fact here comes from the live site itself (title, meta description, hero).
const base = import.meta.env.BASE_URL

// App icons: each company's own icon (scripts/fetch-logos.mjs). `tile` is the icon's
// background; 'full' means the logo already is a filled square and bleeds to the edge.
const LOGOS = {
  'cahari-beauty-spa': { ext: 'webp', tile: '#fbf7f2' },
  'easy-cleaning-atl': { ext: 'webp', tile: '#ffffff' },
  'wc-painting': { ext: 'webp', tile: '#ffffff' },
  'king-of-floors': { ext: 'webp', tile: '#f3efe6' },
  'prime-depot': { ext: 'webp', tile: 'full' },
  'ggs-painting': { ext: 'webp', tile: '#ffffff' },
  'shine-house-home': { ext: 'webp', tile: '#1b1a17' },
  'new-england-auto-logistics': { ext: 'webp', tile: '#ffffff' },
  'qualifica-academy': { ext: 'webp', tile: 'full' },
  vibeget: { ext: 'svg', tile: '#1a0f08' },
}

const project = (p) => ({
  ...p,
  logo: `${base}logos/${p.slug}.${LOGOS[p.slug].ext}`,
  // Wordmark shown in place of the name (scripts/prepare-logos.mjs → white where it reads better).
  wordmark: `${base}logos/web/${p.slug}.webp`,
  tile: LOGOS[p.slug].tile,
  image: `${base}projects/${p.slug}.webp`,
  thumb: `${base}projects/${p.slug}-thumb.webp`,
  domain: p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  // Short, clean address label: the client's own domain, or the host for staged sites.
  label: /github\.io/.test(p.url) ? 'GitHub Pages' : p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
})

export const projects = [
  project({
    slug: 'vibeget',
    name: 'VibeGet',
    url: 'https://vibeget.vercel.app/',
    category: { en: 'Auction platform', pt: 'Plataforma de leilões' },
    place: 'Brasil',
    line: { en: 'Electronics auctions with GetCoin cashback. A full redesign concept, in Portuguese.', pt: 'Leilões de eletrônicos com cashback em GetCoin. Uma proposta completa de redesign.' },
  }),
  project({
    slug: 'cahari-beauty-spa',
    name: 'Cahari Beauty Spa',
    url: 'https://caharibeautyspa.com/',
    category: { en: 'Beauty spa', pt: 'Spa de beleza' },
    place: 'Waltham, MA',
    line: { en: 'Facials, skincare and body treatments, with booking up front.', pt: 'Faciais, skincare e tratamentos corporais, com agendamento em destaque.' },
  }),
  project({
    slug: 'wc-painting',
    name: 'WC Painting',
    url: 'https://wc-painting.vercel.app/',
    category: { en: 'House painting', pt: 'Pintura residencial' },
    place: 'Greater Boston, MA',
    line: { en: 'Interior and exterior painting, with an itemized price within 24 hours.', pt: 'Pintura interna e externa, com orçamento detalhado em 24 horas.' },
  }),
  project({
    slug: 'prime-depot',
    name: 'Prime Depot',
    url: 'https://pedroagostini.github.io/PRIME-DEPOT/',
    category: { en: 'PVC trim supplier', pt: 'Fornecedor de PVC' },
    place: 'Hyde Park, MA',
    line: { en: 'Premium PVC trim delivered to the job site, for contractors who hate lumber yards.', pt: 'Acabamentos em PVC entregues na obra, para quem não aguenta mais madeireira.' },
  }),
  project({
    slug: 'new-england-auto-logistics',
    name: 'New England Auto Logistics',
    url: 'https://pedroagostini.github.io/NEW-ENGLAND-AUTO-LOGISTICS/',
    category: { en: 'Vehicle shipping', pt: 'Transporte de veículos' },
    place: 'New England → USA',
    line: { en: 'Reliable vehicle shipping anywhere in America.', pt: 'Transporte de veículos para qualquer lugar dos EUA.' },
  }),
  project({
    slug: 'shine-house-home',
    name: 'Shine House',
    url: 'https://pedroagostini.github.io/SHINE-HOUSE-HOME/',
    category: { en: 'Home cleaning', pt: 'Limpeza residencial' },
    place: 'Cape Cod, MA',
    line: { en: 'Locally owned cleaning from South Yarmouth to Plymouth, safe for family and pets.', pt: 'Limpeza local de South Yarmouth a Plymouth, segura para família e pets.' },
  }),
  project({
    slug: 'king-of-floors',
    name: 'King of Floors',
    url: 'https://pedroagostini.github.io/KING-OF-FLOORS/',
    category: { en: 'Flooring', pt: 'Instalação de pisos' },
    place: 'North Atlanta, GA',
    line: { en: 'LVP, hardwood and laminate. “Floors fit for a king.”', pt: 'Vinílico, madeira e laminado. “Floors fit for a king.”' },
  }),
  project({
    slug: 'easy-cleaning-atl',
    name: 'Easy Cleaning',
    url: 'https://easycleaningatl.com/',
    category: { en: 'Home cleaning', pt: 'Limpeza residencial' },
    place: 'Alpharetta, GA',
    line: { en: '“Get your weekends back with a spotless home.” Free quote in one tap.', pt: '“Get your weekends back with a spotless home.” Orçamento grátis em um toque.' },
  }),
  project({
    slug: 'ggs-painting',
    name: 'GGS Painting',
    url: 'https://pedroagostini.github.io/GGS-PAINTING/',
    category: { en: 'Painting & carpentry', pt: 'Pintura e carpintaria' },
    place: 'New England',
    line: { en: 'Interior, exterior and commercial painting, trim, framing and wood repair.', pt: 'Pintura interna, externa e comercial, acabamentos, estrutura e reparo de madeira.' },
  }),
  project({
    slug: 'qualifica-academy',
    name: 'Qualifica Academy',
    url: 'https://pedroagostini.github.io/INSTITUTO-QUALIFICA-ACADEMY/',
    category: { en: 'Training platform', pt: 'Plataforma de cursos' },
    place: 'Online',
    line: { en: 'Subscription training for critical assets, energy, EV charging and BESS.', pt: 'Formação por assinatura em ativos críticos, energia, recarga de VE e BESS.' },
  }),
]
