"use client";
// OrderContent: the interactive order confirmation page (client component).
// See page.jsx for the server shell that exports SEO metadata.
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useOrderByCode } from "@/hooks/queries/useOrderByCode";
import { useCountdown } from "@/hooks/useCountdown";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import PickupCodeCard from "@/components/order/PickupCodeCard";
import OrderStatusBadge, { ORDER_STATUS_INFO } from "@/components/order/OrderStatusBadge";
import OrderItemsList from "@/components/order/OrderItemsList";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const ACTIVE_STATUSES = new Set(["pending", "confirmed"]);

export default function OrderContent({ code }) {
  const router = useRouter();
  const pickupCode = String(code ?? "").toUpperCase().trim();

  // Refetch every 30s while the order is active; stop once finished.
  const query = useOrderByCode(pickupCode, {
    refetchInterval: 30_000,
  });

  const order = query.data ? query.data.order : null;

  // Pickup deadline / countdown. Called unconditionally (before any early
  // return) to satisfy the rules of hooks. When there is no deadline we pass
  // a date in the past so the countdown is simply ended.
  const deadline = order?.expires_at || null;
  const countdown = useCountdown(deadline ?? "2000-01-01T00:00:00Z");

  // Still fetching.
  if (query.isPending) {
    return (
      <div className="space-y-lg py-xl">
        <div className="flex flex-col items-center gap-sm">
          <Spinner size="lg" />
          <p className="text-body text-on-surface-variant">
            Looking up your order…
          </p>
        </div>
      </div>
    );
  }

  // Request failed (network or HTTP error).
  if (query.isError) {
    const notFound = (query.error && query.error.status) === 404;
    return (
      <div className="space-y-lg py-xl">
        <div className="flex flex-col items-center gap-md">
          {notFound ? (
            <>
              <p className="text-body text-error">
                We could not find this order.
              </p>
              <p className="text-body-sm text-on-surface-variant">
                The pickup code doesn&rsquo;t match any order.
              </p>
              <Link
                href="/track-order"
                className="text-body-sm text-secondary hover:underline"
              >
                &rarr; Track another order
              </Link>
            </>
          ) : (
            <>
              <p className="text-body text-error">We could not load this order.</p>
              <Button variant="outline" onClick={() => query.refetch()}>
                Try again
              </Button>
              <Link
                href="/track-order"
                className="text-body-sm text-secondary hover:underline"
              >
                &larr; Track another order
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // Backend answered OK but sent no order (e.g. { success: false }).
  if (!order) {
    return (
      <div className="space-y-lg py-xl">
        <div className="flex flex-col items-center gap-md">
          <p className="text-body text-error">
            We could not find this order.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            The pickup code doesn&rsquo;t match any order.
          </p>
          <Link
            href="/track-order"
            className="text-body-sm text-secondary hover:underline"
          >
            &rarr; Track another order
          </Link>
        </div>
      </div>
    );
  }

  const status = order.status;
  const isActive = ACTIVE_STATUSES.has(status);
  const statusInfo = ORDER_STATUS_INFO[status] || ORDER_STATUS_INFO.pending;

  // Bakery info (from the first item; all items come from one bakery).
  const firstItem = order.items ? order.items[0] : null;
  const bakeryName = firstItem ? firstItem.bakery_name : "";
  const bakeryAddress = firstItem ? firstItem.bakery_address : "";

  const mapsQuery = encodeURIComponent(
    `${bakeryName}, ${bakeryAddress}`.replace(/^,/, "") || "Last Bite Peshawar"
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="space-y-xl py-xl">
      {/* Success header */}
      <div className="space-y-sm">
        <h1 className="font-display text-3xl font-semibold text-on-surface sm:text-4xl">
          Order placed
        </h1>
        {isActive && (
          <p className="text-body text-on-surface-variant">
            Your items are reserved. Pay at the counter when you collect.
          </p>
        )}
        {!isActive && status !== "pending" && status !== "confirmed" && (
          <p className="text-body text-on-surface-variant">
            Here is your order summary.
          </p>
        )}
      </div>

      <div className="grid gap-lg lg:grid-cols-12">
        {/* Left: code card + status + items */}
        <div className="lg:col-span-8 space-y-lg">
          <PickupCodeCard
            code={order.pickup_code}
            collectedBy={order.customer_name}
            expiresAt={deadline}
          />

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
            <div className="flex items-center justify-between gap-sm mb-lg">
              <h2 className="font-display text-headline text-on-surface">
                Status
              </h2>
              <OrderStatusBadge status={status} showExplanation={false} />
            </div>
            <p className="text-body-sm text-on-surface-variant">
              {statusInfo.explanation}
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
            <h2 className="font-display text-headline text-on-surface mb-md">
              Your items
            </h2>
            <OrderItemsList items={order.items} />
            <div className="mt-lg border-t border-outline-variant pt-md">
              <div className="flex items-baseline justify-between gap-xs">
                <p className="text-label uppercase tracking-wider text-on-surface-variant">
                  Total
                </p>
                <p className="text-lg font-bold text-on-surface tabular-nums">
                  {formatPrice(order.total_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Pickup deadline + live countdown */}
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
            <h2 className="font-display text-headline text-on-surface mb-md">
              Pickup deadline
            </h2>
            {deadline && countdown ? (
              <>
                <p className="text-body-sm text-on-surface-variant mb-sm">
                  Collect before&nbsp;
                  <span className="font-semibold text-on-surface">
                    {formatDate(deadline)}
                  </span>
                </p>
                {countdown.ended ? (
                  <p className="text-body text-error font-semibold">
                    The pickup window has ended.
                  </p>
                ) : (
                  <div className="flex items-center gap-sm">
                    <span className="font-mono text-lg font-bold text-secondary tabular-nums">
                      {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      left to collect
                    </span>
                  </div>
                )}
              </>
            ) : isActive ? (
              <p className="text-body-sm text-on-surface-variant">
                Active order &mdash; collect at the bakery during opening hours.
              </p>
            ) : (
              <p className="text-body-sm text-on-surface-variant">
                This order is no longer active for pickup.
              </p>
            )}
          </div>
        </div>

        {/* Right: bakery info */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card sticky top-24">
            <h2 className="font-display text-headline text-on-surface mb-md">
              Bakery
            </h2>
            {bakeryName && (
              <p className="font-semibold text-on-surface mb-xs">{bakeryName}</p>
            )}
            {bakeryAddress && (
              <p className="text-body-sm text-on-surface-variant mb-lg">
                {bakeryAddress}
              </p>
            )}
            <div className="mb-lg">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-sm rounded-full border border-outline-variant px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Get directions
              </a>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
