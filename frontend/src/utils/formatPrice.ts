// Shows a number as money, e.g. formatPrice("250.5") -> "Rs. 250.50".
// Backend prices arrive as strings (Postgres NUMERIC).
export function formatPrice(amount: number | string | null | undefined): string {
  const n = Number(amount);
  return Number.isFinite(n) ? `Rs. ${n.toFixed(2)}` : "";
}
