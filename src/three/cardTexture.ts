import * as THREE from 'three'

/**
 * Draws the REVORA card face to a canvas → CanvasTexture, matching the product
 * 3-view: gold wordmark, eyebrow, NFC "tap" waves, a faux QR, "SCAN HERE" and a
 * privacy line. Gold + white on matte black only — never purple (product rule).
 */
export function makeCardFaceTexture(): THREE.CanvasTexture {
  const W = 620
  const H = 1024
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  const GOLD = '#c9a24b'
  const GOLD_L = '#e3c780'
  const WHITE = '#f4f1ea'

  // matte black base with the faintest top sheen
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)
  const sheen = ctx.createLinearGradient(0, 0, W, H)
  sheen.addColorStop(0, 'rgba(255,255,255,0.05)')
  sheen.addColorStop(0.4, 'rgba(255,255,255,0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2

  // --- wordmark REVORA (letter-spaced) ---
  ctx.fillStyle = GOLD_L
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '900 76px Satoshi, Inter, sans-serif'
  drawTracked(ctx, 'REVORA', cx, 150, 14)

  // eyebrow
  ctx.fillStyle = WHITE
  ctx.font = '500 22px Inter, sans-serif'
  drawTracked(ctx, 'EXPERIENCES THAT MATTER', cx, 205, 6)

  // divider
  goldRule(ctx, cx, 250, 220)

  // --- NFC "tap here" waves ---
  const wx = cx - 70
  const wy = 340
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.arc(wx, wy, i * 15, -Math.PI * 0.35, Math.PI * 0.35)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(wx, wy, 5, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
  ctx.fillStyle = GOLD_L
  ctx.textAlign = 'left'
  ctx.font = '700 30px Satoshi, Inter, sans-serif'
  ctx.fillText('TAP HERE', cx - 10, wy - 12)
  ctx.fillStyle = WHITE
  ctx.font = '400 22px Inter, sans-serif'
  ctx.fillText('for NFC', cx - 10, wy + 20)

  goldRule(ctx, cx, 415, 220)

  // --- faux QR block ---
  const qr = 190
  const qx = cx - qr / 2
  const qy = 460
  ctx.fillStyle = WHITE
  roundRect(ctx, qx - 12, qy - 12, qr + 24, qr + 24, 10)
  ctx.fill()
  drawFauxQR(ctx, qx, qy, qr)

  // scan labels
  ctx.textAlign = 'center'
  ctx.fillStyle = GOLD_L
  ctx.font = '700 30px Satoshi, Inter, sans-serif'
  drawTracked(ctx, 'SCAN HERE', cx, qy + qr + 55, 3)
  ctx.fillStyle = WHITE
  ctx.font = '400 22px Inter, sans-serif'
  ctx.fillText('for non-NFC devices', cx, qy + qr + 90)

  // --- privacy line with shield ---
  const py = qy + qr + 155
  drawShield(ctx, cx - 150, py, GOLD)
  ctx.textAlign = 'left'
  ctx.fillStyle = WHITE
  ctx.font = '400 20px Inter, sans-serif'
  ctx.fillText('Your feedback is private', cx - 120, py - 8)
  ctx.fillText('and helps us improve.', cx - 120, py + 18)

  // gold hairline frame just inside the edge
  ctx.strokeStyle = 'rgba(201,162,75,0.55)'
  ctx.lineWidth = 3
  roundRect(ctx, 16, 16, W - 32, H - 32, 40)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Gold "REVORA" engraved wordmark on transparent — for the base front. */
export function makeWordmarkTexture(): THREE.CanvasTexture {
  const W = 512
  const H = 128
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '900 62px Satoshi, Inter, sans-serif'
  // engraved look: dark inset + light top edge
  ctx.fillStyle = '#6b5423'
  drawTracked(ctx, 'REVORA', W / 2, H / 2 + 2, 12)
  ctx.fillStyle = '#e9d089'
  drawTracked(ctx, 'REVORA', W / 2, H / 2 - 1, 12)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  tracking: number,
) {
  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'
  const widths = [...text].map((ch) => ctx.measureText(ch).width + tracking)
  const total = widths.reduce((a, b) => a + b, 0) - tracking
  let x = cx - total / 2
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y)
    x += widths[i]
  }
  ctx.textAlign = prevAlign
}

function goldRule(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number) {
  const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0)
  g.addColorStop(0, 'rgba(201,162,75,0)')
  g.addColorStop(0.5, 'rgba(201,162,75,0.9)')
  g.addColorStop(1, 'rgba(201,162,75,0)')
  ctx.strokeStyle = g
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - w / 2, y)
  ctx.lineTo(cx + w / 2, y)
  ctx.stroke()
}

function drawFauxQR(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const n = 11
  const cell = size / n
  ctx.fillStyle = '#0a0a0a'
  // deterministic pseudo-pattern
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if ((i * 7 + j * 3 + ((i * j) % 5)) % 2 === 0) {
        ctx.fillRect(x + i * cell, y + j * cell, cell - 1, cell - 1)
      }
    }
  }
  // finder squares
  const finder = (fx: number, fy: number) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(fx, fy, cell * 3, cell * 3)
    ctx.fillStyle = '#fff'
    ctx.fillRect(fx + cell * 0.6, fy + cell * 0.6, cell * 1.8, cell * 1.8)
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(fx + cell, fy + cell, cell, cell)
  }
  finder(x, y)
  finder(x + size - cell * 3, y)
  finder(x, y + size - cell * 3)
}

function drawShield(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y - 20)
  ctx.lineTo(x + 18, y - 12)
  ctx.lineTo(x + 18, y + 6)
  ctx.quadraticCurveTo(x + 18, y + 20, x, y + 26)
  ctx.quadraticCurveTo(x - 18, y + 20, x - 18, y + 6)
  ctx.lineTo(x - 18, y - 12)
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
