"use client";

// StatCard: one number card on the dashboard (e.g. orders today).
type StatCardProps = {
  title: string;
  value: string | number;
  change?: number; // percent change vs previous period
  icon: React.ReactNode;
};

export default function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-on-surface-variant">{title}</p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-on-surface">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <p className="mt-3 text-body-sm">
          <span
            className={`font-semibold ${
              change >= 0 ? "text-success" : "text-error"
            }`}
          >
            {change >= 0 ? "+" : ""}{change}%
          </span>{" "}
          <span className="text-on-surface-variant">vs last week</span>
        </p>
      )}
    </div>
  );
}
