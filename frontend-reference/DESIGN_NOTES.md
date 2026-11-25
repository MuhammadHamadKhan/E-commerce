# Last Bite — Design Notes

Written after studying `stitch_last_bite_bakery_marketplace/` (screen.png, DESIGN.md, code.html).
Simple words, so you can correct anything that is wrong.

## Overall feel
Warm bakery marketplace: cream/parchment background, dark-espresso text, toasted-crust and
golden-amber accents. "Warm editorial minimalism" — soft rounded cards, gentle warm shadows,
pill-shaped buttons, uppercase small labels.

## Colors (from the Stitch theme + the screenshot)

| Name | Hex | Used for |
|---|---|---|
| Background / surface | `#FCF9F4` | page background (oat cream) |
| Card / lowest surface | `#FFFFFF` | cards, modals, search field |
| Soft linen container | `#F3ECE2` | filter bars, subtle chips, table headers |
| Container low | `#F6F3EE` | lighter recessed blocks, chips |
| Container high / highest | `#EBE8E3` / `#E5E2DD` | hover fills, deeper recesses |
| Text (on-surface) | `#1C1C19` | main text, near-black warm |
| Muted text (on-surface-variant) | `#4E4542` | secondary text |
| Primary container | `#261D1A` | dark buttons ("Add to Cart", "Find Bakes Near Me"), hero badges |
| Secondary | `#934A24` | toasted crust: price highlights, key active elements |
| Accent / amber | `#E68228` | urgency/countdown tags, "Register Your Bakery" button, timer text |
| Success / sage | `#2F5243` | "Harvest/rescue" badges, "Zero food waste" pill, footer stat |
| Discount badge | `#A3221B` | the red "-40%" / "-65%" badges on product photos |
| Error | `#BA1A1A` | error states |
| Border (outline-variant) | `#D1C4BF` | hairline card/field borders (often at 40–60% opacity) |

## Fonts
- **Headings / product names:** Playfair Display (serif), weights 500–600, tight letter-spacing.
- **Body / UI / buttons / prices:** Plus Jakarta Sans (sans), weights 400–700.
- Uppercase labels (11–12px, letter-spacing 0.06–0.08em) for badges and metadata.

## Corner roundness
- Buttons, chips, badges, search field: **pill (9999px)**.
- Cards: **large rounding (~16px)**; hero/feature modules even larger (~24px).
- Form fields / small thumbnails: **~8px**.
- NOTE (unsure): the Stitch code file defines `rounded-lg` as 8px while DESIGN.md describes
  card rounding as 16px (and its own table says lg = 1rem = 16px). The screenshot cards look
  closer to 16px, so the theme uses: sm 4px, default 8px, md 12px, lg 16px, xl 24px, full pill.

## Shadows
Warm, espresso-tinted (never cool gray):
- Level 1 (cards): `0 2px 8px rgba(38,29,26,0.04), 0 1px 2px rgba(38,29,26,0.03)` + 1px border `#E7DDD1`
- Level 2 (hover/float): `0 8px 24px rgba(38,29,26,0.08), 0 2px 6px rgba(38,29,26,0.04)`
- Level 3 (modals/drawers): `0 20px 40px rgba(38,29,26,0.14), 0 6px 12px rgba(38,29,26,0.06)` + dark blurred backdrop
- Header: very subtle `0 1px 6px rgba(38,29,26,0.03)`

## Spacing
- Generous, asymmetric; large section gaps (~2.5rem). Max content width 1280px.
- Small spacing scale: 4 / 8 / 16 / 24 / 40 px (`space-xs/sm/md/lg/xl`).

## Buttons
- All **pill-shaped**, semibold small text (label style).
- **Primary (dark):** espresso `#261D1A` bg, cream text; hover slightly lighter, lifts 1px.
- **Secondary (crust):** toasted crust `#934A24` bg, white text.
- **Outline/ghost:** 1px crust border, transparent bg, crust text; hover = linen wash.
- **Sage/harvest:** sage `#2F5243` bg, cream text (rescue actions).

## Badges
- **Discount:** red `#A3221B` bg, white bold small text, pill, top-left over image.
- **Rescue/sage:** sage bg, white uppercase tiny text, sometimes pulsing dot.
- **Dietary/neutral pill:** linen bg, espresso text, hairline border.

## Forms
- White field, 1px `#E7DDD1` border, ~8px radius, 8/16px padding.
- Focus: crust `#843E19` border + soft outer glow `rgba(132,62,25,0.12)`.

## Things I was unsure about
1. The rounded-lg mismatch described above (used 16px for cards).
2. The exact accent red for the discount badge: sampled `#A3221B` from the badges in the screenshot.
3. The reference nav links (Ending Soon / Explore Bakeries / Impact & Mission / How It Works) point
   at pages that don't exist yet — the Navbar keeps those labels but links to existing routes.
4. Fonts are loaded with next/font (self-hosted) instead of the Google Fonts <link> in the Stitch code.
