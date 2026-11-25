"use client";
// Input: white field, warm hairline border, crust focus glow (like the design).
// Pair with <label> or pass aria-label for accessibility.
import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border border-outline-soft bg-surface-container-lowest px-md py-sm text-body text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-[3px] focus:ring-secondary/10 transition-all ${className}`}
      {...rest}
    />
  );
});

export default Input;
