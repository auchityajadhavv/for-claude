# REVORA — Start Here (Claude Code)

This is the master doc. Read order: **this file → `REVORA-BUILD-HANDOFF.md`** (full section specs, scroll story, map config) → `REVORA-ASSETS.md` (generation prompts). All assets are in `public/assets/`.

---

## Kickoff prompt (paste into Claude Code)

> Build the REVORA site. Read `REVORA-CLAUDE-CODE.md` then `REVORA-BUILD-HANDOFF.md`. Stack: Vite + React + TypeScript, @react-three/fiber + @react-three/drei, GSAP + ScrollTrigger, MapLibre GL. Assets are in `public/assets`. Work in **three phases — LOOK, then BUTTONS, then LOGIC** (below). Do Phase 1 first: every section built, pixel-right and responsive, with the map area as a placeholder and no backend. Show me a running dev server after each section. Keep the two-colour rule sacred: **UI is purple + black, the product is black + gold (never purple).**

---

## The three-phase plan (build in this order)

### Phase 1 — LOOK (do this first, fully)
Every section designed, animated, responsive. Nothing needs real data yet.
- Nav, hero (text left / 3D product right), the cinematic scroll story, How it works, Why Google reviews matter, Why Revora, Products, Pricing, FAQ, CTA, Footer.
- 3D stand (procedural or GLB), deep-space starfield, all micro-interactions.
- **Map area = placeholder** (see "Map" below).
- Buttons are visible but inert.
✅ Checkpoint: the whole site looks finished on phone + laptop.

### Phase 2 — BUTTONS
Wire every interaction, still no backend: nav links + smooth scroll, mobile menu, "Book a demo" / CTA → a demo form or mailto, pricing → signup route, FAQ accordions, the ratings→review demo, hover/drag states. Routing between any sub-pages.
✅ Checkpoint: nothing is a dead end.

### Phase 3 — LOGIC (real data)
Backend + real features: business signup, the **live map** (see below), the feedback → Google-review flow, dashboards, auth. Uses Supabase + hosting.
✅ Checkpoint: a business can sign up and appear on the map.

---

## Logo — orbiting-dot animation (new)

Keep the REVORA wordmark (`revora-logo.png`) as-is. Beside it, the **orbit-ring icon** should animate: the **ring stays still and the white/lilac dot travels continuously around the orbit**, with a soft glowing trail — like an electron orbiting. (Two rings, one upright + one tilted for a 3D feel; the dot rides the tilted orbit.) Smooth, slow, endless loop. `favicon.png` is this same mark.

---

## Assets (in `public/assets/`)

| File | Where it's used |
|---|---|
| `revora-logo.png` | Nav + footer (white wordmark); tint gold on the 3D card texture. |
| `revora-product-3view.png` | Reference for the 3D model (front/back/side) + card-face texture. |
| `revora-lifestyle.png` | **Hero or a feature section** — the stand on a dark restaurant table. Great atmospheric shot. |
| `revora-product-hero-marble.jpg` | WebGL **fallback poster** if the 3D can't load. |
| `revora-tap.mp4` | The **"Tap the card" / How-it-works** moment, or a hero background loop (dark bg, blends in). Muted, autoplay, loop, `playsinline`. |
| `favicon.png` | Browser tab icon (orbit mark). |
| `og-image.jpg` | Social/link-preview image. |
| `stand.glb` | **Not included** — generate via image-to-3D from the 3-view (prompt in `REVORA-ASSETS.md`), or Claude Code builds it procedurally. |
| `studio.hdr` | **Not included** — free warm studio HDRI from polyhaven.com, so gold reads as gold. |

Everything else (copy, tokens, sections, scroll story, map config) is fully specified in `REVORA-BUILD-HANDOFF.md`.

---

## Map — placeholder now, live later

**Phase 1 (now):** keep the **real interactive 3D greyscale Mumbai map** (MapLibre + OpenFreeMap, keyless — config in the handoff), but with **a few hard-coded placeholder pins** and the "Active in Mumbai" badge. It looks finished, costs nothing.
*(If you'd rather, a static Mumbai map image also works as the placeholder — but the live 3D map is the "wow" and is free, so keep it.)*

**Phase 3 (live map — how it works):**
1. **Database (Supabase):** a `businesses` table — `name, logo, address, lat, lng, approved, created_at`.
2. **Signup → geocode:** business enters its address; a **geocoder** (Nominatim = free, or Google) converts address → `lat/lng`, saved to the row.
3. **Map reads the DB:** on load, fetch approved businesses and drop a pin per row. For true "pops up as they join," subscribe to Supabase **realtime** so new pins appear without a refresh.
4. **Optional admin approve:** a business only shows after you approve it.

**What you'll need for Phase 3:** a free **Supabase** project, **hosting** (Vercel/Netlify), a **geocoder** (Nominatim free), and per-venue **Google review deep-links** (Google Business Profile). None needed for Phases 1–2.

---

## The non-negotiables (recap)

- **UI purple + black; product black + gold. Never purple on the product.** Light it warm/neutral.
- Real interactive 3D stand (drag-to-spin, scroll-driven detach) — not a flat image in the hero.
- Text left / product right; stacks on mobile. No overlap.
- Deep-space starfield background (subtle, comforting, no purple).
- No emojis, no star glyphs (ratings as numbers), no bright gradients.
- Fully responsive, phone → laptop. Respect reduced-motion. WebGL fallback = `revora-product-hero-marble.jpg`.
- Copy stays positive (hero trust stat is **"One tap for guests"**).

---

*Fonts: Satoshi (Fontshare), Inter + Geist Mono (Google) — free, via link. Build Phase 1 first and show the dev server each step.*
