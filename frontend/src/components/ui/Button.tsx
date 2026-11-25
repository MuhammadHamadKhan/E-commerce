"use client";
// Button: pill-shaped like the design. Variants: primary (dark espresso),
// secondary (toasted crust), outline, ghost, success (sage rescue).
// Sizes: sm, md, lg. Loading state shows a spinner and blocks clicks.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean; // shows a spinner and disables the button
  children: ReactNode;
}

// Style pieces per variant, straight from the design.
const VARIANT_STYLES: Record<Variant, string> = {
  // dark espresso, cream text, slightly lighter + lift on hover
  primary:
    "bg-primary-container text-on-primary hover:bg-[#3d2f2a] shadow-sm hover:-translate-y-px active:translate-y-0",
  // toasted crust, white text
  secondary: "bg-secondary text-on-secondary hover:bg-[#7d3f1e] shadow-sm hover:-translate-y-px active:translate-y-0",
  // 1px crust border, transparent bg, crust text; linen wash on hover
  outline:
    "border border-secondary text-secondary bg-transparent hover:bg-surface-container hover:bg-surface-container-low",
  // no border, muted text; used for quiet actions
  ghost: "bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
  // botanical sage: rescue actions
  success: "bg-success text-on-success hover:bg-[#26443a] shadow-sm hover:-translate-y-px active:translate-y-0",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-label",
  md: "px-4 py-2 text-label",
  lg: "px-lg py-3 text-label",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      // pill geometry for ALL buttons (design rule)
      className={`inline-flex items-center justify-center gap-xs rounded-full font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
