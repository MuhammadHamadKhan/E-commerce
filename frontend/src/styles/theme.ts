// Single place to look up design values from TypeScript code
// (inline styles, charts, etc.). The canonical Tailwind theme lives in
// app/globals.css under @theme; these are the same values as constants.
export const theme = {
  colors: {
    background: "#ffffff", // pure white page background
    card: "#ffffff", // clean card surface
    cardMuted: "#fafafa", // soft neutral container
    text: "#000000", // pure black text
    textMuted: "#525252", // neutral gray
    primary: "#000000", // black for strong emphasis / buttons
    secondary: "#000000", // monochrome secondary action
    accent: "#000000", // monochrome urgency accents
    success: "#15803d",
    discount: "#b3261e", // bold sticker discount badge
    error: "#ba1a1a",
    border: "#e5e5e5", // hairline neutral border
    borderSoft: "#f0f0f0",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem", // fields, thumbnails
    lg: "0.875rem",
    card: "1rem", // cards
    hero: "1.5rem", // hero modules
    pill: "9999px", // buttons, badges
  },
  shadows: {
    card: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0,0.03)",
    lift: "0 10px 26px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0,0.04)",
    overlay: "0 20px 40px rgba(0,0,0,0.14), 0 6px 12px rgba(0,0,0,0.06)",
    header: "0 1px 6px rgba(0,0,0,0.03)",
  },
  fonts: {
    display: "var(--font-fraunces), Georgia, serif", // warm characterful headings
    body: "var(--font-dm-sans), system-ui, sans-serif", // body + UI
  },
} as const;
