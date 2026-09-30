// Turns the full-page captures in materiais/capturas into GPU-friendly textures.
// <slug>.webp        tall screen texture for the MacBook (1024 wide, max 8192 tall)
// <slug>-sm.webp     phone version (640 wide, max 4096 tall)
// <slug>-thumb.webp  first viewport at 16:10 for the index hover preview
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'materiais/capturas'
const OUT = 'public/projects'
const TEX_W = 1024
const TEX_MAX_H = 8192

await mkdir(OUT, { recursive: true })

for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue
  const slug = path.parse(file).name
  const input = path.join(SRC, file)
  const { width, height } = await sharp(input).metadata()

  const scale = TEX_W / width
  const cropH = Math.min(height, Math.floor(TEX_MAX_H / scale))

  await sharp(input)
    .extract({ left: 0, top: 0, width, height: cropH })
    .resize({ width: TEX_W })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, `${slug}.webp`))

  // Phones: half the width and a 4096 cap, so the texture fits every mobile GPU.
  const smScale = 640 / width
  const smCropH = Math.min(height, Math.floor(4096 / smScale))
  await sharp(input)
    .extract({ left: 0, top: 0, width, height: smCropH })
    .resize({ width: 640 })
    .webp({ quality: 74 })
    .toFile(path.join(OUT, `${slug}-sm.webp`))

  await sharp(input)
    .extract({ left: 0, top: 0, width, height: Math.round(width / 1.6) })
    .resize({ width: 800 })
    .webp({ quality: 80 })
    .toFile(path.join(OUT, `${slug}-thumb.webp`))

  console.log(`${slug}: ${width}x${height} -> ${TEX_W}x${Math.round(cropH * scale)}`)
}
