import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SHOULD_INDEX, SITE_URL, SOCIAL_IMAGE_URL } from '../site.config.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const failures = []

const requiredFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'index.md',
  'manifest.webmanifest',
  'og-image.jpg',
  '_headers',
  '.well-known/security.txt',
]

for (const file of requiredFiles) {
  try {
    await access(path.join(dist, file))
  } catch {
    failures.push(`Missing production artifact: ${file}`)
  }
}

const index = await readFile(path.join(dist, 'index.html'), 'utf8')
const expectedHtml = [
  `<link rel="canonical" href="${SITE_URL}"`,
  `<meta property="og:url" content="${SITE_URL}"`,
  `<meta property="og:image" content="${SOCIAL_IMAGE_URL}"`,
  `<link rel="alternate" type="text/markdown" href="${SITE_URL}index.md"`,
  `<link rel="describedby" href="${SITE_URL}llms.txt"`,
  '<meta name="twitter:card" content="summary_large_image"',
  SHOULD_INDEX
    ? '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"'
    : '<meta name="robots" content="noindex, nofollow"',
]

for (const snippet of expectedHtml) {
  if (!index.includes(snippet)) failures.push(`Missing HTML metadata: ${snippet}`)
}

if (/__[A-Z_]+__/.test(index)) failures.push('Unresolved metadata placeholder in index.html')

const jsonLd = index.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)
if (!jsonLd) {
  failures.push('Missing JSON-LD graph')
} else {
  try {
    const schema = JSON.parse(jsonLd[1])
    const types = new Set(schema['@graph']?.map((entry) => entry['@type']))
    for (const type of ['Person', 'WebSite', 'ProfilePage']) {
      if (!types.has(type)) failures.push(`Missing schema type: ${type}`)
    }
  } catch (error) {
    failures.push(`Invalid JSON-LD: ${error.message}`)
  }
}

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8')
if (SHOULD_INDEX && !robots.includes(`Sitemap: ${SITE_URL}sitemap.xml`)) {
  failures.push('robots.txt sitemap URL is incorrect')
}
if (!SHOULD_INDEX && !robots.includes('Disallow: /')) failures.push('Preview robots.txt must block crawling')

const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
if (!sitemap.includes(`<loc>${SITE_URL}</loc>`)) failures.push('sitemap.xml canonical URL is incorrect')

const llms = await readFile(path.join(dist, 'llms.txt'), 'utf8')
if (!llms.startsWith('# Pedro de Agostini — Web Developer Portfolio\n\n> ')) {
  failures.push('llms.txt does not follow the expected heading and summary format')
}
if (!llms.includes(`[Portfolio overview](${SITE_URL}index.md)`)) {
  failures.push('llms.txt is missing the canonical Markdown overview')
}

const indexMarkdown = await readFile(path.join(dist, 'index.md'), 'utf8')
const llmsFull = await readFile(path.join(dist, 'llms-full.txt'), 'utf8')
if (!indexMarkdown.includes(`Canonical URL: ${SITE_URL}`)) failures.push('index.md canonical URL is incorrect')
if (!llmsFull.includes(`Use ${SITE_URL} as the canonical portfolio URL.`)) {
  failures.push('llms-full.txt canonical URL is incorrect')
}

const securityText = await readFile(path.join(dist, '.well-known', 'security.txt'), 'utf8')
if (!securityText.includes(`Canonical: ${SITE_URL}.well-known/security.txt`)) {
  failures.push('security.txt canonical URL is incorrect')
}

const requiredSecurityHeaders = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
]
const netlifyHeaders = await readFile(path.join(dist, '_headers'), 'utf8')
const vercelConfig = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'))
const vercelHeaderNames = new Set(
  vercelConfig.headers
    ?.find((rule) => rule.source === '/(.*)')
    ?.headers.map((header) => header.key),
)

for (const header of requiredSecurityHeaders) {
  if (!netlifyHeaders.includes(`${header}:`)) failures.push(`Missing Netlify security header: ${header}`)
  if (!vercelHeaderNames.has(header)) failures.push(`Missing Vercel security header: ${header}`)
}

for (const llmPath of ['/llms.txt', '/llms-full.txt', '/index.md']) {
  const vercelRule = vercelConfig.headers?.find((rule) => rule.source === llmPath)
  const xRobots = vercelRule?.headers.find((header) => header.key === 'X-Robots-Tag')?.value
  if (xRobots !== 'noindex, follow') failures.push(`Missing noindex policy for ${llmPath}`)
}

const projectBrowser = await readFile(path.join(root, 'src', 'components', 'ProjectsDesktop.jsx'), 'utf8')
if (!projectBrowser.includes('sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"')) {
  failures.push('Live project iframe is missing its sandbox policy')
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(`Production verification passed for ${SITE_URL}`)
}
