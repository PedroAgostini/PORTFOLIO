import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logoPath = path.join(root, 'public', 'logos', 'web', 'devagostini-logo-header.png')
const outputPath = path.join(root, 'public', 'og-image.jpg')

const logo = await sharp(logoPath)
  .resize({ width: 940, fit: 'inside', withoutEnlargement: true })
  .png()
  .toBuffer()

const background = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="58%">
      <stop offset="0" stop-color="#5d0018" stop-opacity="0.72"/>
      <stop offset="0.52" stop-color="#27000a" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#141414" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e60039" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#e60039" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#e60039" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#141414"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <path d="M72 72H1128M72 558H1128" stroke="#343434" stroke-width="1"/>
  <path d="M184 420H1016" stroke="url(#rule)" stroke-width="1"/>
  <path d="M72 72V558M1128 72V558" stroke="#262626" stroke-width="1"/>
  <circle cx="72" cy="72" r="4" fill="#e60039"/>
  <circle cx="1128" cy="558" r="4" fill="#e60039"/>
</svg>`)

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#141414' },
})
  .composite([
    { input: background, left: 0, top: 0 },
    { input: logo, gravity: 'centre' },
  ])
  .jpeg({ quality: 90, progressive: true, chromaSubsampling: '4:4:4' })
  .toFile(outputPath)

console.log(`Generated ${outputPath}`)
