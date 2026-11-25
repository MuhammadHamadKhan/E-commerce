// Dashboard layout for the protected bakery owner area.
import type { ReactNode } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Container from "@/components/ui/Container";

export default function BakeryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-surface">
      <DashboardHeader />
      <div className="flex min-h-0 flex-1">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 bg-surface-container-low">
          <Container as="div" className="min-h-full py-4 sm:py-6 lg:py-8">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}
