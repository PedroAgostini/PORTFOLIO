// Turns the full-page captures in materiais/capturas/site into the images the MacBook screen plays.
// <slug>.webp        desktop screen (1024 wide, the whole page)
// <slug>-sm.webp     phone version (640 wide, the whole page)
// <slug>-thumb.webp  first viewport at 16:10 for the index hover preview
//
// prime-depot: its pinned "We sell. You build. We deliver." section renders as empty space in a
// full-page screenshot, so primedepot.png is stitched by hand: page top, the three animation
// frames, page bottom (frames in materiais/capturas/prime-why-*.png).
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'materiais/capturas/site' // originals stay out of public/: they are never shipped
const OUT = 'public/projects'
const WEBP_MAX = 16383 // WebP's hard limit per side

// capture file → project slug (src/data/projects.js)
const CAPTURES = {
  'cahari.png': 'cahari-beauty-spa',
  'easycleaning.png': 'easy-cleaning-atl',
  'ggspainting.png': 'ggs-painting',
  'kingfloors.png': 'king-of-floors',
  'neauto.png': 'new-england-auto-logistics',
  'primedepot.png': 'prime-depot',
  'qualifica-academy.png': 'qualifica-academy',
  'shinehouse.png': 'shine-house-home',
  'vibeget.png': 'vibeget',
  'wcpainting.png': 'wc-painting',
}

await mkdir(OUT, { recursive: true })
sharp.cache(false)

const fitWidth = async (input, width, height, targetW, quality, dest) => {
  const scale = targetW / width
  const cropH = Math.min(height, Math.floor(WEBP_MAX / scale))
  await sharp(input, { limitInputPixels: false })
    .extract({ left: 0, top: 0, width, height: cropH })
    .resize({ width: targetW })
    .webp({ quality })
    .toFile(dest)
  return Math.round(cropH * scale)
}

for (const [file, slug] of Object.entries(CAPTURES)) {
  const input = path.join(SRC, file)
  const { width, height } = await sharp(input, { limitInputPixels: false }).metadata()

  const h = await fitWidth(input, width, height, 1024, 78, path.join(OUT, `${slug}.webp`))
  await fitWidth(input, width, height, 640, 72, path.join(OUT, `${slug}-sm.webp`))

  await sharp(input, { limitInputPixels: false })
    .extract({ left: 0, top: 0, width, height: Math.round(width / 1.6) })
    .resize({ width: 800 })
    .webp({ quality: 80 })
    .toFile(path.join(OUT, `${slug}-thumb.webp`))

  console.log(`${slug}: ${width}x${height} -> 1024x${h}`)
}
