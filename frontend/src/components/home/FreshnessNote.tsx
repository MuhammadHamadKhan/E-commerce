// Freshness Note section: baked-today message and live deal count.
export default function FreshnessNote({ total }: { total: number }) {
  return (
    <section className="rounded-hero bg-surface-container-low px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="min-w-0 max-w-2xl">
          <h3 className="font-display text-xl font-semibold text-on-surface sm:text-2xl text-balance">
            Everything here was baked today
          </h3>
          <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant text-pretty">
            Bakeries list only what they made this morning or afternoon. When you collect it
            tonight, good food gets eaten instead of thrown away.
          </p>
        </div>

        <p className="shrink-0 text-body-sm text-on-surface-variant sm:text-right">
          <span className="block font-display text-3xl font-semibold text-on-surface">
            {total}
          </span>
          deals open right now
        </p>
      </div>
    </section>
  );
}
