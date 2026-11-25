"use client";
// The server proxy checks the cookie; this keeps client navigation in sync.
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  const shouldRedirect = status === "loggedOut";

  useEffect(() => {
    if (shouldRedirect) router.replace("/bakery/login");
  }, [shouldRedirect, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (shouldRedirect) return <p>Redirecting to login...</p>;

  return <>{children}</>;
}
