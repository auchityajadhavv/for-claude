import sharp from 'sharp'
import { statSync, unlinkSync, existsSync } from 'fs'

const A = 'public/assets'
const kb = (p) => (statSync(p).size / 1024).toFixed(0) + 'kb'

// lifestyle photo: full-bleed band → 1600px wide is plenty. webp + jpg fallback.
const src = `${A}/revora-lifestyle.png`
await sharp(src).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`${A}/revora-lifestyle.webp`)
await sharp(src).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${A}/revora-lifestyle.jpg`)
console.log(`lifestyle: ${kb(src)} → webp ${kb(`${A}/revora-lifestyle.webp`)} / jpg ${kb(`${A}/revora-lifestyle.jpg`)}`)

// video poster: re-encode a touch smaller
const poster = `${A}/revora-product-hero-marble.jpg`
await sharp(poster).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${A}/poster.jpg`)
console.log(`poster: ${kb(poster)} → ${kb(`${A}/poster.jpg`)}`)

// drop the big unused render + the original heavy png
for (const f of ['revora-product-3view.png', 'revora-lifestyle.png']) {
  if (existsSync(`${A}/${f}`)) {
    unlinkSync(`${A}/${f}`)
    console.log(`removed ${f}`)
  }
}
