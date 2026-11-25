"use client";
// PickupCodeCard: big ticket-style pickup code card.
// - Large readable code.
// - "Copy code" button (copies to clipboard).
// - Hint: show this code at the counter, take a screenshot.
import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";

export default function PickupCodeCard({
  code,
  collectedBy,
  expiresAt,
}) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative rounded-lg border border-outline-variant bg-surface-container-lowest shadow-card p-lg overflow-hidden">
      {/* Ticket top band */}
      <div className="border-b border-outline-variant pb-md mb-lg">
        <p className="text-label uppercase tracking-wider text-on-surface-variant">
          Your pickup code
        </p>
        <p className="font-display text-3xl font-bold text-on-surface tracking-wider tabular-nums">
          {code}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-lg">
        <div className="space-y-sm">
          <p className="text-body-sm text-on-surface-variant">
            Show this code at the counter.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Take a screenshot to save it.
          </p>
          {collectedBy && (
            <p className="text-body-sm text-on-surface-variant">
              Collected by: {collectedBy}
            </p>
          )}
        </div>

        <div className="flex items-center gap-sm">
          <Button
            variant="outline"
            onClick={copyCode}
            className="text-lg min-w-fit"
          >
            {copied ? "Copied!" : "Copy code"}
          </Button>
        </div>
      </div>

      {expiresAt && (
        <p className="mt-lg text-body-sm text-on-surface-variant text-center">
          Pickup deadline&nbsp;
          <span className="font-semibold text-on-surface">
            {formatDate(expiresAt)}
          </span>
        </p>
      )}
    </section>
  );
}
