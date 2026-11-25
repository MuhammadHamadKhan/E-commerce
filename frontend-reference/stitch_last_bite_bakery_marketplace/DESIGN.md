---
name: Artisanal Bakehouse & Harvest
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#4e4542'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#807571'
  outline-variant: '#d1c4bf'
  surface-tint: '#685c58'
  primary: '#0b0504'
  on-primary: '#ffffff'
  primary-container: '#261d1a'
  on-primary-container: '#92847f'
  inverse-primary: '#d3c3be'
  secondary: '#934a24'
  on-secondary: '#ffffff'
  secondary-container: '#fd9e71'
  on-secondary-container: '#76340f'
  tertiary: '#000905'
  on-tertiary: '#ffffff'
  tertiary-container: '#002519'
  on-tertiary-container: '#6a8f7d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dfda'
  primary-fixed-dim: '#d3c3be'
  on-primary-fixed: '#221a17'
  on-primary-fixed-variant: '#504441'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb694'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#76330e'
  tertiary-fixed: '#c4ebd7'
  tertiary-fixed-dim: '#a9cfbc'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#2b4d3f'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 46px
    letterSpacing: -0.015em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses the balance between heritage craft baking and conscious food sustainability. The identity unites the quiet luxury of an old-world viennoiserie with the pragmatic clarity of an eco-conscious harvest marketplace.

### Aesthetic Direction
- **Tactile Editorial Minimalism:** Combines high-end culinary publication layouts with functional transactional clarity.
- **Atmosphere:** Warm, grounded, aromatic, and deliberate. Interfaces feel textured and inviting rather than sterile or algorithmic.
- **Emotional Intent:** Convey craftsmanship, culinary prestige, environmental stewardship, and gentle culinary urgency (such as morning bake drops or end-of-day rescue boxes) without resorting to cheap discount tropes.

## Colors

The palette draws directly from the bakehouse environment: caramelized dough crusts, dark roast espresso beans, parchment, and wild field botanical herbs.

### Role Assignments
- **Primary (`#261D1A` - Roasted Espresso):** Primary typographic hierarchy, dominant brand moments, high-contrast actions, solid icon treatments.
- **Secondary (`#843E19` - Toasted Crust):** Key active elements, supporting brand tags, section dividers, hover states for dark interactive components.
- **Tertiary (`#2F5243` - Botanical Sage):** Sustainability markers, "Harvest Rescue" inventory badges, carbon-offset counters, organic ingredient certifications.
- **Accent / Alert (`#E68228` - Golden Amber):** Real-time bake alerts, countdown timers, remaining quantity indicators, dynamic price tags.
- **Neutral Canvas (`#FAF7F2` - Oat Cream):** Base canvas background, creating an organic, unbleached paper warmth across screens.
- **Surface Containers (`#F3ECE2` - Soft Linen):** Recessed containers, table headers, filter bars, and card backdrops.
- **Elevated Canvas (`#FFFFFF` - Crisp Flour White):** Interactive cards, modal sheets, and popovers requiring visual float.
- **Structural Lines (`#E7DDD1` - Warm Stone):** Subdued borders, hairpins, and dividers designed to provide definition without rigid digital grids.

## Typography

The type system pairs an evocative, high-contrast transitional serif (`Playfair Display`) with an engineered, legible geometric sans (`Plus Jakarta Sans`).

### Usage Rules
- `Playfair Display` is strictly for editorial titles, product names, featured headlines, and narrative quotes. Do not use for transactional labels, buttons, or technical metrics.
- `Plus Jakarta Sans` handles all UI operations, nutritional facts, pricing, inventory alerts, and dense ingredient compositions.
- Uppercase tracking (`letterSpacing: 0.06em - 0.08em`) is reserved exclusively for `label-md` and `label-sm` to maintain crisp utility across metadata tags, status pills, and dietary indicators.

## Layout & Spacing

A responsive 12-column grid system governs desktop views, adapting to 8 columns on tablet and 4 columns on mobile. 

### Spacing Principles
- **Editorial Breathers:** Layouts rely on asymmetric margins to let bakery imagery and typography coexist harmoniously. Section transitions employ generous `space-xl` gaps.
- **Compact Data Clusters:** Product card metadata (calories, allergens, harvest window) binds closely using `space-xs` and `space-sm` to establish clear gestalt grouping.
- **Max Content Width:** Constrained at `1280px` for optimal readability of long-form origin stories and single-row product showcases.

## Elevation & Depth

Visual hierarchy combines low-contrast borders with warm, tinted drop shadows. Instead of cool digital grays, depth draws from the warm espresso tones of the palette.

### Elevation Hierarchy
- **Level 0 (Flat Ground):** Base oat background (`#FAF7F2`) with optional hairline border (`#E7DDD1`, 1px solid). Used for persistent headers, in-line lists, and footer surfaces.
- **Level 1 (Subtle Lift):** Pure white cards (`#FFFFFF`) sitting over oat backgrounds.
  - Shadow: `0px 2px 8px rgba(38, 29, 26, 0.04), 0px 1px 2px rgba(38, 29, 26, 0.03)`
  - Border: 1px solid `#E7DDD1`
- **Level 2 (Active & Floating):** Hovered product cards, floating action buttons, sticky bag summaries.
  - Shadow: `0px 8px 24px rgba(38, 29, 26, 0.08), 0px 2px 6px rgba(38, 29, 26, 0.04)`
  - Border: 1px solid `#DECFC0`
- **Level 3 (Overlays & Dialogs):** Cart drawers, quick-view bakery modals, harvest reservation alerts.
  - Shadow: `0px 20px 40px rgba(38, 29, 26, 0.14), 0px 6px 12px rgba(38, 29, 26, 0.06)`
  - Backdrop: `rgba(38, 29, 26, 0.45)` with `backdrop-filter: blur(6px)`

## Shapes

The geometric identity balances organic curve transitions with structured containment.

### Corner Radius Implementation
- **Base Rounding (0.5rem / 8px):** Form fields, quantity incrementers, compact thumbnails.
- **Card Rounding (`rounded-lg` / 1rem / 16px):** Product display tiles, nutritional sheets, cart panels.
- **Large Containers (`rounded-xl` / 1.5rem / 24px):** Hero banners, featured daily harvest highlight modules.
- **Full Radius (Pill / 9999px):** All buttons, interaction chips, status tags, and countdown counters.

## Components

### Buttons
- **Primary:** Espresso (`#261D1A`) background, oat white (`#FAF7F2`) text, pill geometry. Subtle warm elevation on hover with `transform: translateY(-1px)`.
- **Secondary / Crust Action:** Toasted crust (`#843E19`) fill, crisp white text, pill geometry.
- **Outline / Ghost:** 1px solid border (`#843E19`), clear background, toasted crust text. On hover: shifts to subtle `#F3ECE2` wash.
- **Harvest Action:** Deep botanical sage (`#2F5243`) background, `#FAF7F2` text, accompanied by zero-waste rescue icons.

### Badges & Urgency Tags
- **Rescue / Harvest Badge:** Botanical sage background (`#2F5243`), white text, pill shape, uppercase `label-sm`.
- **Urgency / Time-Sensitive Drops:** Golden amber fill (`#E68228`), espresso (`#261D1A`) text, pulse indicator dot. Displays active countdowns (e.g., "RESCUE WINDOW: 38 MIN").
- **Dietary Pills:** Linen background (`#F3ECE2`), warm espresso text (`#261D1A`), hairline outline (`#E7DDD1`).

### Cards
- **Pastry & Bread Display Card:** White surface (`#FFFFFF`), `rounded-lg` radius, Level 1 shadow, top-anchored aspect-ratio 4:3 image with softened corners, followed by `Playfair Display` item title, price, and floating rescue badge.
- **Harvest Bundle Card:** Two-tone container featuring an oat top with a soft linen bottom split, highlighting batch number, pick-up timeframe, and original vs. rescued pricing.

### Form Inputs & Selectors
- **Fields:** Background `#FFFFFF`, 1px solid `#E7DDD1`, rounded-md geometry (`0.5rem`), padding `space-sm space-md`. Focus state uses `#843E19` border with a 3px outer glow in `rgba(132, 62, 25, 0.12)`.
- **Checkboxes & Radios:** Roasted espresso check fills when selected, custom rounded toggle mechanics for dietary/allergen filters.

### Lists & Inventory Meters
- **Inventory Progress Track:** Background `#F3ECE2`, fill color dynamically changes from `#2F5243` (abundant) to `#E68228` (under 5 left available). Pill container profile.