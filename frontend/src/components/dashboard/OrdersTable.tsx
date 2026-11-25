"use client";

// OrdersTable: responsive list of orders containing the bakery's items.
import { useState } from "react";
import type { ReactNode } from "react";
import { useMyOrders } from "@/hooks/queries/useMyOrders";
import { useUpdateOrderStatus } from "@/hooks/mutations/useUpdateOrderStatus";
import { ORDER_STATUS_LABELS } from "@/utils/constants";
import { formatDate } from "@/utils/formatDate";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { Order } from "@/lib/api/types";

type OrderStatus = keyof typeof ORDER_STATUS_LABELS;
const ALL_ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function OrdersTable() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const { data, isPending, isFetching, error } = useMyOrders({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const orders: Order[] = data?.orders ?? [];

  return (
    <section className="space-y-5">
      <div className="flex justify-end">
        <div className="w-full sm:w-56">
          <label
            htmlFor="order-status-filter"
            className="mb-1 block text-label font-medium text-on-surface-variant"
          >
            Filter by status
          </label>
          <Select
            id="order-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.currentTarget.value as OrderStatus | "all")
            }
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked_up">Picked up</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </Select>
        </div>
      </div>

      {isPending || isFetching ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant bg-surface py-16">
          <Spinner size="lg" />
          <p className="mt-3 text-body-sm text-on-surface-variant">
            Loading orders…
          </p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <ErrorMessage message={error.message || "Failed to load orders."} />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface px-5 py-12 text-center">
          <p className="text-body-sm text-on-surface-variant">
            No orders
            {statusFilter !== "all"
              ? ` with status “${ORDER_STATUS_LABELS[statusFilter]}”`
              : ""}{" "}
            yet.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden xl:block">
            <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low">
                      <th className="px-5 py-4 text-label font-medium text-on-surface-variant">
                        Order
                      </th>
                      <th className="px-5 py-4 text-label font-medium text-on-surface-variant">
                        Customer
                      </th>
                      <th className="w-28 px-5 py-4 text-right text-label font-medium text-on-surface-variant">
                        Total
                      </th>
                      <th className="w-36 px-5 py-4 text-center text-label font-medium text-on-surface-variant">
                        Status
                      </th>
                      <th className="w-44 px-5 py-4 text-right text-label font-medium text-on-surface-variant">
                        Update
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-surface-container-low"
                      >
                        <td className="px-5 py-4 text-body text-on-surface">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">#{order.id}</span>
                            <span className="text-body-sm text-on-surface-variant">
                              {order.pickup_code}
                            </span>
                          </div>
                          <p className="mt-1 text-body-sm text-on-surface-variant">
                            {formatDate(order.created_at)}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-body text-on-surface">
                          {order.customer_name || "Guest customer"}
                          <br />
                          <span className="text-body-sm text-on-surface-variant">
                            {order.customer_phone || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-body font-medium text-on-surface">
                          ₹{order.total_price}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <StatusBadge status={order.status as OrderStatus} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <StatusSelector
                            orderId={order.id}
                            currentStatus={order.status as OrderStatus}
                            className="ml-auto w-36"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-3 xl:hidden">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border border-outline-variant bg-surface p-4 shadow-card sm:p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body font-semibold leading-tight text-on-surface">
                      Order #{order.id}
                    </p>
                    <p className="mt-1 break-all text-body-sm text-on-surface-variant">
                      Pickup code: {order.pickup_code}
                    </p>
                  </div>
                  <StatusBadge status={order.status as OrderStatus} />
                </div>

                <dl className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <OrderDetail label="Customer">
                    {order.customer_name || "Guest customer"}
                  </OrderDetail>
                  <OrderDetail label="Total">₹{order.total_price}</OrderDetail>
                  <OrderDetail label="Phone">
                    <span className="break-all">{order.customer_phone || "—"}</span>
                  </OrderDetail>
                  <OrderDetail label="Date">
                    {formatDate(order.created_at)}
                  </OrderDetail>
                </dl>

                <StatusSelector
                  orderId={order.id}
                  currentStatus={order.status as OrderStatus}
                  className="w-full"
                />
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-label-sm font-semibold ${getStatusClasses(status)}`}
    >
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  );
}

function getStatusClasses(status: OrderStatus): string {
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
    default:
      return "bg-surface-container-low text-on-surface border border-outline-variant";
  }
}

function OrderDetail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-container-low p-3">
      <dt className="text-label text-on-surface-variant">{label}</dt>
      <dd className="mt-1 break-words text-body-sm text-on-surface">{children}</dd>
    </div>
  );
}

function StatusSelector({
  orderId,
  currentStatus,
  className = "",
}: {
  orderId: number | string;
  currentStatus: OrderStatus;
  className?: string;
}) {
  const updateOrderStatus = useUpdateOrderStatus();
  const nextStatuses = ALL_ORDER_STATUSES.filter(
    (status) => status !== currentStatus
  );

  return (
    <div className={className}>
      <div className="relative">
        <Select
          aria-label={`Update status for order ${orderId}`}
          value=""
          disabled={updateOrderStatus.isPending}
          onChange={(event) => {
            const nextStatus = nextStatuses.find(
              (status) => status === event.currentTarget.value
            );
            if (!nextStatus) return;
            updateOrderStatus.mutate({ id: orderId, status: nextStatus });
          }}
          className="min-w-0 appearance-none pr-9 text-body-sm disabled:cursor-wait"
        >
          <option value="" disabled>
            {updateOrderStatus.isPending ? "Updating…" : "Change status"}
          </option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {updateOrderStatus.error && (
        <p role="alert" className="mt-1 text-left text-xs text-error">
          {updateOrderStatus.error instanceof Error
            ? updateOrderStatus.error.message
            : "Could not update order status."}
        </p>
      )}
    </div>
  );
}
