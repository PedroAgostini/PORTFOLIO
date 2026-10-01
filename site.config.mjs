const FALLBACK_SITE_URL = 'https://pedroagostini.vercel.app/'

function normalizeSiteUrl(value) {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const url = new URL(candidate)
  url.hash = ''
  url.search = ''
  return url.toString().replace(/\/?$/, '/')
}

// Keep one stable canonical URL across production and preview deployments.
// SITE_URL is an explicit escape hatch for a future custom-domain migration.
const environmentUrl = process.env.SITE_URL || FALLBACK_SITE_URL

export const SITE_URL = normalizeSiteUrl(environmentUrl)
export const SOCIAL_IMAGE_URL = new URL('og-image.jpg', SITE_URL).href
export const SITE_NAME = 'DevAgostini'
export const SITE_TITLE = 'Pedro de Agostini | Web Developer Portfolio'
export const SITE_DESCRIPTION =
  "Explore Pedro de Agostini's portfolio: corporate websites, e-commerce experiences and web systems built for companies in Brazil and the United States."

export const SHOULD_INDEX = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.CONTEXT
    ? process.env.CONTEXT === 'production'
    : true
