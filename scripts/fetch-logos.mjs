// Downloads each project's largest declared icon (apple-touch-icon / icon) into public/logos.
// These become the "app icons" on the projects desktop. Run: node scripts/fetch-logos.mjs
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITES = {
  'cahari-beauty-spa': 'https://caharibeautyspa.com/',
  'easy-cleaning-atl': 'https://easycleaningatl.com/',
  'wc-painting': 'https://wc-painting.vercel.app/',
  'king-of-floors': 'https://pedroagostini.github.io/KING-OF-FLOORS/',
  'prime-depot': 'https://pedroagostini.github.io/PRIME-DEPOT/',
  'ggs-painting': 'https://pedroagostini.github.io/GGS-PAINTING/',
  'shine-house-home': 'https://pedroagostini.github.io/SHINE-HOUSE-HOME/',
  'new-england-auto-logistics': 'https://pedroagostini.github.io/NEW-ENGLAND-AUTO-LOGISTICS/',
  'qualifica-academy': 'https://pedroagostini.github.io/INSTITUTO-QUALIFICA-ACADEMY/',
  vibeget: 'https://vibeget.vercel.app/',
}

const OUT = 'public/logos'
await mkdir(OUT, { recursive: true })

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1]

for (const [slug, url] of Object.entries(SITES)) {
  try {
    const html = await (await fetch(url)).text()
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0])
    const icons = links
      .filter((t) => /rel\s*=\s*["'][^"']*icon[^"']*["']/i.test(t))
      .map((t) => {
        const rel = attr(t, 'rel') ?? ''
        const sizes = attr(t, 'sizes') ?? ''
        const px = Number(sizes.split('x')[0]) || (/apple/i.test(rel) ? 180 : /svg/i.test(attr(t, 'href') ?? '') ? 512 : 16)
        return { href: new URL(attr(t, 'href'), url).href, px }
      })
      .sort((a, b) => b.px - a.px)
    const pick = icons[0] ?? { href: new URL('/favicon.ico', url).href, px: 16 }
    const res = await fetch(pick.href)
    if (!res.ok) throw new Error(`${res.status} ${pick.href}`)
    const type = res.headers.get('content-type') ?? ''
    const ext = type.includes('svg') ? 'svg' : type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('jpeg') ? 'jpg' : type.includes('icon') ? 'ico' : path.extname(new URL(pick.href).pathname).slice(1) || 'png'
    await writeFile(path.join(OUT, `${slug}.${ext}`), Buffer.from(await res.arrayBuffer()))
    console.log(`${slug}: ${pick.px}px ${ext} <- ${pick.href}`)
  } catch (err) {
    console.log(`${slug}: FAILED ${err.message}`)
  }
}
