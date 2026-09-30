// Turns the owner's logo files in public/logos into web-ready wordmarks in public/logos/web.
// Trims transparent margins, caps the size, and (where it reads better on the dark site)
// recolours the logo to solid white while keeping its alpha. Run: node scripts/prepare-logos.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'public/logos'
const OUT = 'public/logos/web'

// white: true  → solid white silhouette (dark or low-contrast originals)
// white: false → keep the original colours (already light, or detail lives in inner colour)
const LOGOS = {
  'cahari-beauty-spa': { file: 'cahari.png', white: true },
  'easy-cleaning-atl': { file: 'logo-easycleaning.webp', white: true },
  'wc-painting': { file: 'wc-painting.webp', white: true },
  'king-of-floors': { file: 'king-of-floors.webp', white: false },
  'prime-depot': { file: 'prime-depot.webp', white: true },
  'ggs-painting': { file: 'ggs-painting.webp', white: true },
  'shine-house-home': { file: 'shine-house.png', white: true },
  'new-england-auto-logistics': { file: 'neauto.webp', white: true },
  'qualifica-academy': { file: 'qualifica-academy.webp', white: true },
  vibeget: { file: 'vibeget.png', white: false },
}

await mkdir(OUT, { recursive: true })

for (const [slug, { file, white }] of Object.entries(LOGOS)) {
  const trimmed = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .trim({ threshold: 1 })
    .resize({ width: 900, height: 320, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer()

  let out = sharp(trimmed)
  if (white) {
    const { data, info } = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i + 1] = data[i + 2] = 255
    }
    out = sharp(data, { raw: info })
  }
  const dest = path.join(OUT, `${slug}.webp`)
  const meta = await out.webp({ quality: 90, alphaQuality: 100 }).toFile(dest)
  console.log(`${slug}: ${meta.width}x${meta.height} ${white ? 'white' : 'original'}`)
}
