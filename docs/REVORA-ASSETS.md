# REVORA — Asset Checklist & Generation Prompts

Everything the project needs, who makes it, where it goes. Put all finished files in `/public/assets/` for Claude Code.

Legend: ✅ ready · 🟡 you generate (prompts below) · 🟦 Claude Code makes it in-build · ⬜ optional

---

## 1. Assets list

| Asset | File | Who | Status | Notes |
|---|---|---|---|---|
| Logo (wordmark) | `revora-logo.png` | me | ✅ | Transparent white. An `.svg` vector is better if you have it. |
| Product 3-view | `revora-product-3view.png` | you (have it) | ✅ | Front/back/side. Reference for the 3D model + card-face texture. |
| Product hero shot | `revora-product-hero.jpg` | you (have it) | ✅ | Dark-marble shot. Used as the WebGL fallback poster. |
| **3D model of the stand** | `stand.glb` | you (image-to-3D) **or** Claude Code | 🟡 / 🟦 | See your question above — route 1 (generate) or route 2 (procedural). |
| Studio HDRI (lighting) | `studio.hdr` | you (free download) | 🟡 | Poly Haven → a *warm studio* HDRI so gold reads as gold. |
| Card-face texture | `card-face.png` | Claude Code | 🟦 | Gold/white graphics on transparent, from the front-view spec. |
| Starfield | — | Claude Code | 🟦 | Generated in code (points), no file. |
| Favicon | `favicon.png` | me | ⬜ | I can crop from the logo/orbit mark. |
| Social share image | `og-image.jpg` | me | ⬜ | 1200×630 hero card for link previews. |
| AI product video | `product.mp4` | you (text-to-video) | ⬜ | Only if you want a video moment. A real 3D model usually beats this. |
| Fonts | — | link | ✅ | Satoshi (Fontshare), Inter + Geist Mono (Google). Free. |

**Must-source before "final" 3D:** just `stand.glb` (route 1) + `studio.hdr`. Everything else is ready, in-code, or optional.

---

## 2. Prompt — generate `stand.glb` (image-to-3D)

Use **Meshy / Tripo / Luma Genie**. Upload `revora-product-3view.png` (or crop the front view). Settings: **PBR / metallic-roughness materials ON**, symmetry ON, quality High. Prompt:

> Premium tabletop NFC feedback stand. A thin black matte acrylic card with a thin brushed-gold metal trim around its edge, seated upright at a slight backward lean in a solid brushed-gold metal base with a slot. The card front shows gold and white printed graphics; the gold base has an engraved "REVORA" wordmark on its front. Materials: matte neutral-black card, brushed metallic gold trim and base. Studio product render, clean, photoreal, neutral background.

Then in Blender (optional cleanup): confirm the card is a separate object from the base (so it can lift/detach), scale to real-world size, export **glTF Binary (.glb)** with materials.

---

## 3. Prompt — optional AI product video (`product.mp4`)

Only if you want a video section. Tool: Runway / Kling / Veo / Seedance. Prompt:

> Cinematic product shot of a black-and-gold NFC feedback stand on dark polished marble. The black card slowly lifts and detaches straight up out of its brushed-gold base, floats and rotates gently to reveal its gold-trimmed edges, then descends and clicks back into the base. Warm gold rim light, soft reflections, shallow depth of field, deep dark background, slow elegant motion, luxury advertisement style. No text overlays.

Keep it 4–8s, loopable, dark background (so it blends into the site).

---

## 4. Prompt — favicon / social image (tell me and I'll make these)

Just say the word and I'll crop a favicon from the orbit mark and build a 1200×630 share image from the hero.

---

## 5. Where each goes
```
/public/assets/
  revora-logo.png
  revora-product-3view.png
  revora-product-hero.jpg
  stand.glb            ← route 1 output (or Claude Code builds procedurally)
  studio.hdr
  product.mp4          ← optional
  og-image.jpg         ← optional
  favicon.png          ← optional
```

---

## 6. Accounts for Phase 3 (logic) — free tiers
- **Supabase** — database + auth + realtime (powers signups and the live map).
- **Vercel** or **Netlify** — hosting.
- **Geocoding** — Nominatim (free) or Google Geocoding (address → map pin).
- **Google Business Profile** — for real review deep-links per venue.

*None needed for Phase 1 (the look) or Phase 2 (buttons).*
