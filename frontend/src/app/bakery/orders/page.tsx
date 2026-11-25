"use client";

// Bakery Orders page: list orders + update status.
import OrdersTable from "@/components/dashboard/OrdersTable";

export default function Page() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-headline font-semibold text-on-surface">Orders</h1>
        <p className="text-body-sm text-on-surface-variant">
          Orders containing your bakery’s items. Update status as you prepare
          and hand them over.
        </p>
      </div>

      <OrdersTable />
    </section>
  );
}
