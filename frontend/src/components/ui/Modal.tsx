"use client";
// Modal: popup dialog. Closes on backdrop click and Escape key.
// Level-3 shadow + blurred backdrop from the design.
import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Close when pressing Escape (keyboard accessibility)
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Backdrop: dark + blur, click to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-container/45 p-gutter-mobile backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[28rem] rounded-xl bg-surface-container-lowest p-lg shadow-overlay"
      >
        <div className="mb-md flex items-start justify-between gap-md">
          <h2 className="font-display text-headline text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-secondary"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
