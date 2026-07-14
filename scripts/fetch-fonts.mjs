import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'

// only the latin subset (English site) → smallest possible files
function latinFaces(css, family) {
  const out = []
  const re = /\/\* latin \*\/\s*@font-face\s*{([^}]*)}/g
  let m
  while ((m = re.exec(css))) {
    const block = m[1]
    const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1]
    const url = (block.match(/url\(([^)]+\.woff2)\)/) || [])[1]
    if (weight && url) out.push({ family, weight, url })
  }
  return out
}

const faces = [
  ...latinFaces(readFileSync('scripts/inter.css', 'utf8'), 'Inter'),
  ...latinFaces(readFileSync('scripts/geist.css', 'utf8'), 'Geist Mono'),
]

let cssOut = '/* Self-hosted latin subsets — no external CDN */\n'
for (const f of faces) {
  const slug = f.family.toLowerCase().replace(/\s+/g, '') + '-' + f.weight
  const file = `public/fonts/${slug}.woff2`
  execSync(`curl -sS -A "${UA}" -o ${file} "${f.url}"`)
  const bytes = readFileSync(file).length
  cssOut += `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url('/fonts/${slug}.woff2') format('woff2');}\n`
  console.log(`${slug}.woff2  ${bytes}b`)
}
writeFileSync('public/fonts/fonts.css', cssOut)
console.log('wrote public/fonts/fonts.css')
