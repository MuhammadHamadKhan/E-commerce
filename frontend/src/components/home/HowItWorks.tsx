// HowItWorksSection: 3 steps shown as a connected path, plus a call-to-action.
// Static section: no hooks, so it renders on the server.
import Link from "next/link";

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const STEPS = [
  {
    when: "Around 4 PM",
    title: "Bakeries list what is left",
    text: "Partner bakeries post their unsold breads, cakes and pastries at a big discount.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 10l1.5-5h13L20 10" />
        <path d="M5 10v9h14v-9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    ),
  },
  {
    when: "Takes two taps",
    title: "Reserve and get your code",
    text: "Pick your items at 40 to 60% off. You get a short pickup code straight away.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V8z" />
        <path d="M14 6v12" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    when: "Before closing time",
    title: "Collect and pay at the bakery",
    text: "Show your code at the counter, pay by cash or card, and take your bag home.",
    icon: (
      <svg {...iconProps}>
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8a3 3 0 016 0" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 space-y-10">
      <div className="max-w-2xl">
        <h2 className="font-display text-2xl font-semibold text-on-surface sm:text-3xl">
          How Last Bite works
        </h2>
        <p className="mt-2 text-body text-on-surface-variant text-pretty">
          Good food belongs on your table, not in the bin. Three steps and you are done.
        </p>
      </div>

      <ol className="space-y-10 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          return (
            <li key={step.title} className="relative pl-16 md:pl-0">
              {/* Icon circle */}
              <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-secondary shadow-sm md:static">
                {step.icon}
              </div>

              {/* Dashed connector line to the next step */}
              {!isLast && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-2rem] left-6 top-14 border-l border-dashed border-outline md:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-14 right-[-2.5rem] top-6 hidden border-t border-dashed border-outline md:block"
                  />
                </>
              )}

              <div className="md:mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-label font-semibold uppercase tracking-wider text-secondary">
                    Step {index + 1}
                  </span>
                  <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm text-on-surface-variant">
                    {step.when}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-body-sm leading-relaxed text-on-surface-variant text-pretty">
                  {step.text}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Reassurance + call-to-action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-display text-lg font-semibold text-on-surface">
            New deals land every evening.
          </p>
          <p className="mt-0.5 text-body-sm text-on-surface-variant">
            No account needed, no online payment. Just reserve and collect.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/listings"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary-container px-6 text-label font-semibold text-on-primary hover:bg-[#3d2f2a] focus-visible:outline-2 focus-visible:outline-secondary"
          >
            See today&apos;s deals
          </Link>
          <Link
            href="/bakery/register"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full px-4 text-label font-semibold text-on-surface underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-secondary"
          >
            Own a bakery? Sell with us
          </Link>
        </div>
      </div>
    </section>
  );
}