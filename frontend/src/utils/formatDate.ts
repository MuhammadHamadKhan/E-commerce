// Time helpers. Main use: time left on a listing, e.g. "2h 15m".
export function formatTimeLeft(msLeft: number): string {
  if (msLeft <= 0) return "Ended";
  const totalMinutes = Math.floor(msLeft / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// A full date in a short readable way (e.g. for order history).
export function formatDate(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
}
