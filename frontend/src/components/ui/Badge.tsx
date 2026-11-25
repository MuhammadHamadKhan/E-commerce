// Badge: small pill label. Variants match the design:
// - "discount": red -40% style badge (on product photos)
// - "rescue": sage pill (zero-waste / harvest)
// - "accent": amber urgency tag
// - "neutral": linen dietary/other pill
type BadgeProps = {
  variant?: "discount" | "rescue" | "accent" | "neutral";
  children: React.ReactNode;
  className?: string;
};

const STYLES = {
  // bold red, white text (top-left of product images)
  discount: "bg-discount text-on-discount font-bold",
  // sage, white uppercase tiny text
  rescue: "bg-success text-on-success uppercase",
  // amber urgency: espresso text
  accent: "bg-accent text-white uppercase",
  // linen pill with hairline border (dietary tags etc.)
  neutral:
    "bg-surface-container-low text-on-surface border border-outline-soft",
};

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-sm ${STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
