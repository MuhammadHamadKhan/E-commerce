"use client";

// Bakery Pickup Code page: look up customer orders by pickup code at the counter.
import PickupCodeChecker from "@/components/dashboard/PickupCodeChecker";

export default function Page() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-headline font-semibold text-on-surface">Pickup Code</h1>
        <p className="text-body-sm text-on-surface-variant">
          Enter a customer pickup code to look up their order at the counter.
        </p>
      </div>

      <PickupCodeChecker />
    </section>
  );
}
