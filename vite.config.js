import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  SHOULD_INDEX,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE_URL,
} from './site.config.mjs'
import { createIndexMarkdown, createLlmsFullTxt, createLlmsTxt } from './scripts/seo-content.mjs'

const escapeXml = (value) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character])

function productionMetadata() {
  return {
    name: 'production-metadata',
    transformIndexHtml(html) {
      const replacements = {
        __SITE_URL__: SITE_URL,
        __SOCIAL_IMAGE_URL__: SOCIAL_IMAGE_URL,
        __SITE_NAME__: SITE_NAME,
        __SITE_TITLE__: SITE_TITLE,
        __SITE_DESCRIPTION__: SITE_DESCRIPTION,
        __ROBOTS_CONTENT__: SHOULD_INDEX
          ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          : 'noindex, nofollow',
      }

      return Object.entries(replacements).reduce(
        (output, [token, value]) => output.replaceAll(token, value),
        html,
      )
    },
    generateBundle() {
      const escapedUrl = escapeXml(SITE_URL)
      const lastModified = new Date().toISOString().slice(0, 10)
      const robots = SHOULD_INDEX
        ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n'

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: createLlmsTxt(SITE_URL) })
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: createLlmsFullTxt(SITE_URL) })
      this.emitFile({ type: 'asset', fileName: 'index.md', source: createIndexMarkdown(SITE_URL) })
      this.emitFile({
        type: 'asset',
        fileName: '.well-known/security.txt',
        source: `Contact: mailto:contatopedrodeagostini@gmail.com
Expires: 2027-10-01T23:59:59Z
Preferred-Languages: pt, en
Canonical: ${SITE_URL}.well-known/security.txt
`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      })
    },
  }
}

// base: './' keeps the build portable (Vercel root or a GitHub Pages sub-path).
export default defineConfig({
  base: './',
  plugins: [react(), productionMetadata()],
  server: {
    // Browser downloads in progress (.crdownload/.part/.tmp) are locked on Windows and crash the watcher.
    watch: { ignored: ['**/.impeccable/**', '**/materiais/**', '**/*.crdownload', '**/*.part', '**/*.tmp'] },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('lenis')) return 'lenis'
        },
      },
    },
  },
})
