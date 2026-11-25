"use client";
// Select: dropdown styled like the Input (white field, warm border).
import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = "", children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={`w-full appearance-none rounded-md border border-outline-soft bg-surface-container-lowest px-md py-sm text-body text-on-surface focus:border-secondary focus:outline-none focus:ring-[3px] focus:ring-secondary/10 transition-all ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
});

export default Select;
