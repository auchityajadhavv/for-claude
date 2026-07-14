# REVORA — Build Handoff for Claude Code

Complete spec to build the REVORA marketing site: **3D, immersive, scroll-driven, fully responsive.**
Unzip `revora-assets.zip` into `/public/assets/`, then build in the three phases below.

> **Why Claude Code:** you get a real dev server + hot reload, can load a real 3D model, use proper libraries (react-three-fiber, GSAP ScrollTrigger, MapLibre), and *see* each change live. The chat sandbox couldn't preview reliably — that's why we moved here.

---

## PHASE PLAN (build in this order — don't skip ahead)

1. **PHASE 1 — THE LOOK.** Every section built, pixel-right, responsive, with the 3D hero, animations, and a **placeholder map**. Nothing has to "work" yet. Get sign-off on the look first.
2. **PHASE 2 — BUTTONS.** Wire all navigation + interactions: nav links, mobile menu, Book-a-demo / CTA (open a form/modal), pricing → signup, FAQ accordion, the ratings→review demo. Still no backend.
3. **PHASE 3 — LOGIC.** Real data: business signup, the live map, the feedback→Google-review flow, dashboards. Needs Supabase (see §8).

---

## 0. Kickoff prompt (paste into Claude Code)

> Build the REVORA site per `REVORA-BUILD-HANDOFF.md`. Stack: Vite + React + TypeScript, @react-three/fiber + @react-three/drei for 3D, GSAP + ScrollTrigger for scroll, MapLibre GL for the map. Do **Phase 1 (the look) only** for now, and show me a running dev server after each milestone in the build order (§9). Assets are in `/public/assets`. Keep the two-colour rule sacred: UI purple, product gold.

---

## 1. What REVORA is

A premium **NFC + QR customer-feedback & reputation platform** for restaurants, cafés, salons, hotels, gyms, clinics, retail. A guest **taps** the stand (or scans the QR) → private feedback page → REVORA drafts a **Google review** from their answers → they post it in one tap. Happy guests grow public reviews; unhappy ones are routed to private feedback. The product is a **black acrylic card in a brushed-gold magnetic base** — the card detaches (magnets at its bottom seat into the gold holder).

---

## 2. Brand & design system (follow exactly)

**Personality:** premium, luxurious, minimal, "Apple × Linear". Restrained, elegant motion.

### The two-colour rule (this repeatedly went wrong — get it right)
- **Website UI = PURPLE + BLACK.**
- **Product (card + holder) = BLACK + GOLD, never purple.** Never let purple light/reflections tint the product; light it warm/neutral.

### Tokens
```css
/* UI (purple + black) */
--bg:#08080d;
--bg-grad:radial-gradient(105% 90% at 60% 30%,#15151f 0%,#0d0d15 50%,#08080d 100%);
--card:#0E0E10; --glass:linear-gradient(150deg,#ffffff0e,#ffffff03); --border:#ffffff18;
--purple:#7C3AED; --purple2:#8B5CF6; --lilac:#9A7FD6; --lilac2:#C4A6FF;
--text:#ffffff; --text2:#a99bcb; --text3:#8f83ac;
--btn:linear-gradient(92deg,#e7e0f5,#c3b6e6); /* pale-lavender pill, dark text #0c0a14 */
/* PRODUCT ONLY (black + gold) */
--gold:#C9A24B; --gold-dark:#B08A3E; --card-black:#0a0a0a; /* matte NEUTRAL, no blue/purple */
```
### Type
- **Satoshi** (Fontshare) — display/headings/brand, 700–900, tight tracking.
- **Inter** (Google) — body. **Geist Mono** (Google) — eyebrows, stat labels, small caps.
### Rules
No emojis. No literal star glyphs (ratings as numbers, e.g. `4.9 · 340`). No bright/rainbow gradients. Generous whitespace, rounded cards (16–20px), soft glass with subtle sheen.

---

## 3. Assets (in `revora-assets.zip` → `/public/assets/`)

| File | What it is | Use it for |
|---|---|---|
| `revora-logo.png` | REVORA wordmark, transparent white | Nav + footer (white on dark). Tint gold for the product card texture. |
| `revora-product-3view.png` | Front / back / side studio render | Reference for the 3D model + the card-face texture. |
| `revora-lifestyle.png` | The stand on a dark restaurant table | A "see it in the wild" showcase band, section background, WebGL fallback poster, and the social/OG image. |
| `revora-tap.mp4` | Hand tapping the card (short clip) | The **"Tap the card" step** in How-it-works, or a looping accent. Muted, autoplay, loop, `playsinline`. |

No GLB is included yet — see §5 for how to handle the 3D model.

---

## 4. Stack
Vite + React + TS · **@react-three/fiber** + **@react-three/drei** · **GSAP + ScrollTrigger** · **maplibre-gl** · Tailwind (or CSS modules). Install: `three @react-three/fiber @react-three/drei gsap maplibre-gl`.

---

## 5. The 3D stand (hero centerpiece)

No `.glb` is provided, so:
- **Now:** build the stand **procedurally** in react-three-fiber — rounded-box card + slightly larger gold rounded frame + gold base with a slot + two small gold magnet cylinders at the card's bottom edge. Use `revora-product-3view.png` to match proportions, and generate the **card-face texture** from the front view (gold/white graphics).
- **Later (optional upgrade):** drop in a real `stand.glb` (generate via an image-to-3D tool from the 3-view) and swap it into the same component.

**Materials:** gold = `metalness ~0.95, roughness ~0.28`; black card = matte **neutral** `#0a0a0a, roughness ~0.55`. Use a warm/neutral `Environment` (drei) so gold reads as gold. **No purple light on the product.**

**Interactions:** drag to rotate (grab-and-spin + inertia); scroll-driven camera + card detach; gentle idle float when untouched.

**Magnetic detach (signature):** card lifts straight out of the base → gold **field-line rings** intensify → card faces camera → turns to show the **magnets** → descends and **snaps back** with a gold pulse.

**Fallback:** if WebGL is unavailable, show `revora-lifestyle.png` as a static poster so the hero never breaks.

---

## 6. The logo mark (orbit ring — animated)

Keep the wordmark (`revora-logo.png`) plus the small **orbit-ring icon** beside it. Animate the icon so a **glowing white dot travels around the ring** (like an electron orbiting), with a soft fading trail. The ring itself stays still; only the dot orbits (~4s loop). Reduced-motion: static dot.

---

## 7. Page structure + scroll choreography

Deep-space **starfield** behind everything (subtle, drifting, comforting — not pure black, no purple). Fixed glass nav (hamburger < 900px).

**A. Hero (split):** text **left** (eyebrow · `H1 "Experiences that matter."` with "matter." in purple gradient · subtitle · Book a demo / See how it works · 3 mono stats: `2× Google reviews` · `60s to go live` · `One tap for guests`). 3D stand **right**, interactive. Mobile: stack (product, then text, centered). Never overlap.

**B. Cinematic scroll story** (scroll = the timeline; pin a stage, drive the 3D from scroll progress `p`):
1. `0.00–0.12` docked, camera low — "Experiences that matter."
2. `0.12–0.34` card lifts out, field lines — "It starts with one tap."
3. `0.34–0.58` card faces camera, glows — "Private feedback, in seconds."
4. `0.58–0.80` card turns to show magnets — "Magnetic. Detachable."
5. `0.80–1.00` card snaps back — "Then it clicks right back." → release into content.

**C. How it works** — 4 steps (Tap the card → Private feedback → Suggested review → Google review). Use **`revora-tap.mp4`** as the visual for step 1. Include the live **ratings→review** demo (sliders fill, review types out).

**D. Why Google reviews matter** — explanation + a "top-rated ranks #1" widget:
1. Higher-rated places rank first on Maps/local search.
2. Rating + review count = instant trust; more/better reviews win the click.
3. Fresh reviews keep you on top (recency).
4. Visibility compounds into walk-ins; REVORA starts the loop.
Ranking widget: 4 rows, your venue #1 highlighted purple (`Your venue · Revora-powered · 4.9 · 340`), others below. **Numbers only, no star glyphs.**

**E. See it in the wild** — a band using **`revora-lifestyle.png`** (the stand on a restaurant table) with a short line of copy. Recommended — it's a beautiful shot.

**F. Why Revora** — bento benefits (2× more reviews · catch issues privately · see what guests think · live in <60s · built for every counter).

**G. Live map** — see §8.

**H. Products** — NFC Card · Acrylic Stand (use the real render/photo) · Custom Branding.

**I. Pricing** — Starter ₹499 · Growth ₹999 (featured) · Managed ₹2,499. No fake enterprise tier.

**J. FAQ** (accordion) → **CTA band** → **Footer**.

---

## 8. The map (placeholder now → live later)

**Phase 1 (now):** a **real interactive 3D greyscale Mumbai map**, contained in a rounded box, with **hard-coded placeholder pins** so it looks finished at zero cost:
- **MapLibre GL** + **OpenFreeMap dark** style (`https://tiles.openfreemap.org/styles/dark`) — free, **no API key**.
- Center Mumbai `[72.8777,19.0760]`, `zoom ~11`, `pitch 55`, slow auto-rotate bearing.
- `fill-extrusion` on the `building` source-layer, greyscale (`#26242c`) — real 3D buildings.
- ~12 hard-coded purple pulsing pins across Mumbai; one labelled `REVORA · Live`. Glass badge top-left: green dot + **"Active in Mumbai."**
- Must stay **inside its box** (position:relative + overflow:hidden + fixed height; call `map.resize()` on load). Never a full-page background.
- *(If you want it even simpler for now, a static Mumbai map image inside the box is fine — but the live map is nearly free and looks better.)*

**Phase 3 (live) — how "a business joins → a pin appears":**
- A **database** (Supabase) holds each business: name, logo, **lat/lng**, join date, approved flag.
- Signup form asks for the address; a **geocoder** (Nominatim free, or Google Geocoding) converts address → lat/lng and saves it.
- The map reads the DB and drops a pin per approved business. Two modes: **refresh** (load current list on page open — simplest) or **realtime** (Supabase realtime → new pins appear live).
- Optional **admin approve** step before a business shows publicly.

**Accounts for Phase 3 (all free to start):** Supabase (DB + auth + realtime), Vercel/Netlify (hosting), a geocoder, and Google Business Profile for real per-venue review links.

---

## 9. Responsive (phone → laptop, non-negotiable)
Hero 2-col ≥900px, single column stacked below (product then text, centered). Steps 4→2→1; bento/products/pricing 3→1; nav → hamburger <900px. Use `svh`, `clamp()`, test 1440/1024/768/390. Respect `prefers-reduced-motion` (freeze scroll story, docked stand, static orbit dot). Perf: cap DPR at 2, lazy-init the map on scroll-into-view, pause the R3F loop when offscreen; `revora-tap.mp4` muted+playsinline+loop.

---

## 10. Copy (verbatim)
- **Hero H1:** "Experiences that matter." · **Sub:** "The premium way your guests tell you how it really went — one tap, private feedback, then a Google review." · Buttons: "Book a demo" / "See how it works".
- **Why reviews H2:** "Google reviews decide who walks in."
- **Why Revora H2:** "Protect your reputation. Grow it in public."
- **Pricing H2:** "Simple plans for real businesses."
- **CTA:** "Ready to grow your reputation?" / "Place your first Revora stand this week and watch the reviews follow."
- Footer tagline: "Experiences that matter."

---

## 11. Do / Don't
**Do:** procedural (or GLB) 3D stand · warm/neutral product lighting · purple only in UI · numbers for ratings · deep-space starfield · orbiting-dot logo · fully responsive · WebGL fallback image · map boxed & Mumbai-only.
**Don't:** purple on the product · a flat static image *instead of* the 3D model in the hero · star glyphs · pure-black harsh background · full-bleed map · text overlapping the product.

---

## 12. File structure
```
revora/
├─ public/assets/  (revora-logo.png, revora-product-3view.png, revora-lifestyle.png, revora-tap.mp4, [stand.glb later])
├─ src/
│  ├─ styles/tokens.css
│  ├─ components/{Nav,Hero,HowItWorks,WhyReviews,InTheWild,WhyRevora,Products,Pricing,Faq,Cta,Footer}.tsx
│  ├─ three/{Stand,Scene,Starfield,scrollStory}.ts(x)
│  └─ map/MumbaiMap.tsx
└─ package.json
```

---

## 13. Build order (Phase 1 — run the dev server after each)
1. Scaffold Vite+React+TS, fonts, `tokens.css`, layout.
2. **Nav (with orbiting-dot logo) + Hero (static)** — text left, image placeholder right, responsive. Confirm layout before adding 3D.
3. **Starfield** background.
4. **3D stand** (procedural), warm lighting, drag-to-rotate, idle float. Confirm it reads black+gold.
5. **Scroll story** (§7B) with beat text.
6. **Content sections** C–F, H–J. (Use `revora-tap.mp4` in C, `revora-lifestyle.png` in E.)
7. **Map** placeholder (§8, hard-coded pins).
8. **Responsive + reduced-motion + perf pass.**
9. Polish. → then Phase 2 (buttons), then Phase 3 (logic).

---

## 14. What was already tried (don't repeat)
Single-file HTML worked but couldn't be iterated (no preview; caching hid changes). Purple product light made gold read purple → light warm/neutral. Camera `lookAt(rig.x)` re-centred the stand over the hero text → look near centre, offset the rig, don't track it. Grey-bg cutout of the product was unreliable → use procedural/GLB, or `revora-lifestyle.png` as the poster. Map must be boxed, Mumbai-only, keyless via OpenFreeMap.

*Keep the two-colour rule sacred: UI purple, product gold. Build Phase 1 fully before wiring anything.*
