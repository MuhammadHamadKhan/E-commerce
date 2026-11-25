// EmptyState: friendly message shown when a list has nothing in it.
// Uses the placeholder image so empty cards do not look broken.
import Image from "next/image";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-sm py-xl text-center" role="status">
      <Image
        src="/images/placeholder-product.svg"
        alt=""
        width={120}
        height={90}
        aria-hidden="true"
      />
      <p className="font-display text-title text-on-surface">{title}</p>
      {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
    </div>
  );
}
