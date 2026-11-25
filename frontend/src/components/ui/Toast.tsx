"use client";
// Toast: one short success/error message that disappears on its own.
// Usage: keep it mounted with a "message" state, clear after 3 seconds.
import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onDone: () => void; // called automatically after 3 seconds
};

export default function Toast({ message, type = "success", onDone }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-lg left-1/2 z-50 -translate-x-1/2 rounded-full px-lg py-sm text-body-sm shadow-lift ${
        type === "success" ? "bg-success text-on-success" : "bg-error text-on-error"
      }`}
    >
      {message}
    </div>
  );
}
