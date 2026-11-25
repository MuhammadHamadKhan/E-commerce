"use client";
// Combines all providers into one wrapper used by app/layout.tsx.
// React Query handles SERVER data; Redux handles CLIENT state.
import type { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
