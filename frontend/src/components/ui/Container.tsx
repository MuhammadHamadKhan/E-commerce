import type { ElementType, ComponentPropsWithoutRef, ReactNode } from "react";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

// Single shared page-width wrapper so the header, hero, main sections and
// footer all line up on the exact same edges at every screen size and zoom.
// Only uses max-width — never 100vw or w-screen — so there is no horizontal scrollbar.
export default function Container<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...props
}: ContainerProps<T>) {
  const Component = as || "div";
  return (
    <Component
      className={`mx-auto w-full max-w-[1440px] px-gutter-mobile md:px-gutter ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
