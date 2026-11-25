"use client";

// PickupCodeChecker: search box to check a customer pickup code at the counter.
// Looks up the order via the bakery's pickup-code endpoint and shows order details.
import { useState, type FormEvent } from "react";
import { findMyOrderByPickupCode } from "@/lib/api/bakeryOrders";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { Order } from "@/lib/api/types";

export default function PickupCodeChecker() {
  const [code, setCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setOrder(null);
    setIsChecking(true);

    findMyOrderByPickupCode(code.trim())
      .then((res) => {
        setIsChecking(false);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError(res.message || "No order found for this pickup code.");
        }
      })
      .catch((err: Error) => {
        setIsChecking(false);
        setError(err.message || "Failed to look up order. Please try again.");
      });
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-body-sm text-on-surface-variant">
          Look up a customer order by their pickup code at the counter.
        </p>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface shadow-card p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="pickup-code">
              Pickup code
            </label>
            <Input
              id="pickup-code"
              name="code"
              onChange={(event) => setCode(event.currentTarget.value)}
              placeholder="e.g. ABC123"
              required
              value={code}
            />
          </div>

          <Button type="submit" loading={isChecking} className="w-full sm:w-auto">
            Check order
          </Button>
        </form>
      </div>

      {error && <ErrorMessage message={error} />}

      {order && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low shadow-card p-5 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-headline font-semibold text-on-surface">
                Order #{order.id}
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Pickup code: {order.pickup_code}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm font-semibold ${
                getStatusClasses(order.status)
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-surface rounded-lg p-3">
              <p className="text-label text-on-surface-variant">Customer</p>
              <p className="text-body text-on-surface">
                {order.customer_name || "Guest customer"}
              </p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-label text-on-surface-variant">Phone</p>
              <p className="text-body text-on-surface">
                {order.customer_phone || "—"}
              </p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-label text-on-surface-variant">Total</p>
              <p className="text-body font-medium text-on-surface">
                ₹{order.total_price}
              </p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-label text-on-surface-variant">Date</p>
              <p className="text-body text-on-surface">
                {order.created_at}
              </p>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mt-5">
              <h3 className="text-label text-on-surface-variant mb-3">
                Items ({order.items.length})
              </h3>
              <div className="rounded-lg border border-outline-variant overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-4 py-3 text-label font-medium text-on-surface-variant">
                        Product
                      </th>
                      <th className="px-4 py-3 text-label font-medium text-on-surface-variant text-right w-20">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-label font-medium text-on-surface-variant text-right w-24">
                        Price
                      </th>
                      <th className="px-4 py-3 text-label font-medium text-on-surface-variant text-right w-24">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {order.items.map((item) => (
                      <tr key={item.order_item_id || item.product_name}>
                        <td className="px-4 py-3 text-body text-on-surface">
                          {item.product_name}
                        </td>
                        <td className="px-4 py-3 text-body text-on-surface text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-body text-on-surface text-right">
                          ₹{item.price_at_purchase}
                        </td>
                        <td className="px-4 py-3 text-body font-medium text-on-surface text-right">
                          ₹{item.line_total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow text-black";
    case "confirmed":
      return "bg-blue text-on-secondary";
    case "picked_up":
      return "bg-success text-on-success";
    case "cancelled":
      return "bg-error text-on-error";
    case "expired":
      return "bg-surface-container-low text-on-surface border border-outline-variant";
    default:
      return "bg-surface-container-low text-on-surface border border-outline-variant";
  }
}
