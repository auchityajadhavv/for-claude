# REVORA

Marketing site for **REVORA** — a premium NFC + QR customer-feedback & reputation
platform. Built to the `docs/REVORA-BUILD-HANDOFF.md` spec: 3D, immersive,
scroll-driven, fully responsive.

This is **Phase 1 (the look)** — every section built, pixel-right and responsive,
with an interactive 3D hero, the cinematic scroll story, and a boxed Mumbai map
placeholder. Buttons are present but inert; no backend yet (Phases 2–3).

## Stack

- **Vite + React + TypeScript**
- **@react-three/fiber + @react-three/drei** — the procedural black-and-gold stand
- **GSAP + ScrollTrigger** — the pinned magnetic-detach scroll story
- **MapLibre GL** — the boxed, keyless Mumbai map (OpenFreeMap dark)

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run preview    # preview the build
```

Assets live in `public/assets/`. Fonts (Satoshi, Inter, Geist Mono) load from
Fontshare + Google Fonts.

## Design system (the sacred rules)

- **Two colours, never crossed:** UI is **purple + black**; the product (card +
  holder) is **black + gold**, lit warm/neutral — purple never touches it.
- **Signature:** the scroll-driven magnetic detach — the card lifts from its base,
  gold field-line rings intensify, it turns to reveal the magnets, then snaps back.
  Every other section stays quiet (one restrained reveal each).
- Ratings shown as **numbers, never star glyphs**. No emojis. Deep-space starfield,
  not pure black. Full reduced-motion + keyboard-focus support.

Design decisions were run through the `ui-ux-pro-max` and `frontend-design` skills
(Modern-Dark / Cinema style, Expo.out signature easing, Subtle-tier content reveals).

## Structure

```
src/
  components/   Nav, HeroStory, HowItWorks, RatingsDemo, WhyReviews,
                InTheWild, WhyRevora, Products, Pricing, Faq, Cta, Footer,
                Starfield, Logo, Reveal
  three/        Scene, Stand (procedural), cardTexture, progress
  map/          MumbaiMap (lazy-loaded)
  styles/       tokens.css, global.css
docs/           REVORA build handoff + asset docs
```
