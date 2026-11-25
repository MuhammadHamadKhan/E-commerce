"use client";
// Spinner: small loading circle. Sizes: sm (buttons), md, lg (pages).
type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = { sm: "w-3.5 h-3.5 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-[3px]" };

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-secondary ${SIZES[size]} ${className}`}
    />
  );
}
