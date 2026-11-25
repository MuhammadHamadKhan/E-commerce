"use client";
// TrackContent: the interactive track-order page (client component).
// See page.jsx for the server shell that exports SEO metadata.
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/utils/formatDate";

const STORAGE_KEY = "lastbite_recent_orders";
const MAX_SHOWN = 5;

// Read the saved orders list safely (returns [] if anything is wrong).
function readRecent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    if (list.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be blocked (private mode). The page still works without it.
  }
}

// Make typed or pasted codes tidy: uppercase, no spaces or odd symbols.
function cleanCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

export default function TrackContent() {
  const router = useRouter();
  const inputRef = useRef(null);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // Read saved orders synchronously (localStorage is sync), so no effect is needed.
  const [recent, setRecent] = useState(() => readRecent());
  const [showAll, setShowAll] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!code) {
      setError("Please enter your pickup code.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    router.push(`/order/${encodeURIComponent(code)}`);
  }

  function removeOne(codeToRemove) {
    const next = recent.filter((o) => o.code !== codeToRemove);
    setRecent(next);
    writeRecent(next);
  }

  function clearAll() {
    setRecent([]);
    writeRecent([]);
    setConfirmingClear(false);
  }

  const visible = showAll ? recent : recent.slice(0, MAX_SHOWN);

  return (
    <div className="mx-auto max-w-3xl space-y-xl py-xl">
      {/* Lookup form */}
      <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
        <h1 className="mb-xs font-display text-2xl font-semibold text-on-surface sm:text-3xl">
          Track your order
        </h1>
        <p className="mb-lg text-body-sm text-on-surface-variant">
          Enter the pickup code from your order confirmation to see your order status.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-sm">
          <label
            htmlFor="track-code"
            className="block text-label uppercase tracking-wider text-on-surface-variant"
          >
            Pickup code
          </label>
          <Input
            id="track-code"
            ref={inputRef}
            value={code}
            onChange={(e) => {
              setCode(cleanCode(e.target.value));
              if (error) setError("");
            }}
            placeholder="e.g. A1B2C3"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "track-error" : "track-help"}
            className="text-lg font-semibold uppercase tracking-widest"
          />
          {error ? (
            <p id="track-error" role="alert" className="text-body-sm text-error">
              {error}
            </p>
          ) : (
            <p id="track-help" className="text-body-sm text-on-surface-variant">
              Capital or small letters both work. Spaces are ignored.
            </p>
          )}
          <Button type="submit" variant="primary" className="min-h-[50px] w-full">
            Track order
          </Button>
        </form>
      </section>

      {/* Recent orders */}
      <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
        <div className="mb-md flex items-center justify-between gap-md">
          <h2 className="font-display text-headline text-on-surface">Your recent orders</h2>

          {recent.length > 0 &&
            (confirmingClear ? (
              <div className="flex items-center gap-xs">
                <span className="text-label-sm text-on-surface-variant">Clear all?</span>
                <Button variant="outline" size="sm" onClick={() => setConfirmingClear(false)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="border-error/30 text-error hover:bg-error/10"
                >
                  Yes, clear
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmingClear(true)}
                className="border-error/30 text-error hover:bg-error/10"
              >
                Clear all
              </Button>
            ))}
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="No recent orders"
            description="Place an order and it will appear here, so you can find your pickup code again."
          />
        ) : (
          <>
            <ul className="space-y-sm">
              {visible.map((order, index) => (
                <li key={order.code || index} className="flex items-stretch gap-xs">
                  <Link
                    href={`/order/${encodeURIComponent(order.code)}`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-secondary hover:shadow-sm focus-visible:outline-2 focus-visible:outline-secondary"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-xs">
                        <p className="text-label font-semibold uppercase tracking-widest tabular-nums text-on-surface">
                          {order.code}
                        </p>
                        {index === 0 && (
                          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-label-sm font-semibold text-secondary">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="truncate text-body-sm text-on-surface-variant">
                        {order.bakery || "Bakery"}
                      </p>
                      {order.date && (
                        <p className="text-label-sm text-on-surface-variant">
                          {formatDate(order.date)}
                        </p>
                      )}
                    </div>
                    <span aria-hidden="true" className="text-label-sm font-semibold text-secondary">
                      &rarr;
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeOne(order.code)}
                    aria-label={`Remove order ${order.code} from this list`}
                    className="flex w-10 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-on-surface-variant hover:bg-surface-container hover:text-error focus-visible:outline-2 focus-visible:outline-secondary"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>

            {recent.length > MAX_SHOWN && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-md text-label font-semibold text-secondary underline-offset-4 hover:underline"
              >
                {showAll ? "Show fewer" : `Show all ${recent.length} orders`}
              </button>
            )}

            <p className="mt-md text-label-sm text-on-surface-variant">
              These are saved on this device only. If you clear your browser data, they will be removed.
            </p>
          </>
        )}
      </section>
    </div>
  );
}