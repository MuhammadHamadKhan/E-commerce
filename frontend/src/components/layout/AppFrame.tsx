"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBakeryWorkspace =
    pathname.startsWith("/bakery/") &&
    pathname !== "/bakery/login" &&
    pathname !== "/bakery/register";

  if (isBakeryWorkspace) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <Container as="main">{children}</Container>
      <Footer />
    </>
  );
}
