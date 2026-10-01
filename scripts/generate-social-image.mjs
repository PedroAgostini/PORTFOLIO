import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const portraitPath = path.join(root, 'public', 'img', 'pedro.png')
const outputPath = path.join(root, 'public', 'og-image.jpg')

const portrait = await sharp(portraitPath)
  .resize(520, 520, { fit: 'cover', position: 'north' })
  .jpeg({ quality: 94 })
  .toBuffer()

const textLayer = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#141414"/>
      <stop offset="0.6" stop-color="#141414" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#141414" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M72 72H1128M72 558H1128" stroke="#333333" stroke-width="1"/>
  <circle cx="82" cy="114" r="6" fill="#e60039"/>
  <text x="102" y="121" fill="#a6a6a6" font-family="Arial, sans-serif" font-size="20" letter-spacing="2">AVAILABLE FOR PROJECTS</text>
  <text x="72" y="242" fill="#fafafa" font-family="Arial, sans-serif" font-size="68" font-weight="700" letter-spacing="-2">Pedro de Agostini</text>
  <text x="72" y="324" fill="#fafafa" font-family="Arial, sans-serif" font-size="68" font-weight="700" letter-spacing="-2">Web Developer</text>
  <text x="76" y="394" fill="#a6a6a6" font-family="Arial, sans-serif" font-size="26">Websites · Web systems · E-commerce</text>
  <text x="76" y="510" fill="#fafafa" font-family="Courier New, monospace" font-size="18" letter-spacing="1">DEVAGOSTINI / PORTFOLIO</text>
  <rect x="590" y="0" width="230" height="630" fill="url(#fade)"/>
</svg>`)

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: '#141414' },
})
  .composite([
    { input: portrait, left: 680, top: 55 },
    { input: textLayer, left: 0, top: 0 },
  ])
  .jpeg({ quality: 90, progressive: true, chromaSubsampling: '4:4:4' })
  .toFile(outputPath)

console.log(`Generated ${outputPath}`)
