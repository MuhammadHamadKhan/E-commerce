"use client";
// FilterBar: city and sorting selector with accessible touch targets.
import Select from "@/components/ui/Select";
import { LISTING_SORTS, CITIES } from "@/utils/constants";
import type { ListingFilters } from "@/lib/api/listings";

type FilterBarProps = {
  city: string;
  sort: string;
  onChange: (next: { city?: string; sort?: ListingFilters["sort"] }) => void;
};

export default function FilterBar({ city, sort, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* City / Area filter */}
      <Select
        aria-label="Filter by location"
        value={city}
        onChange={(event) => onChange({ city: event.target.value })}
        className="min-h-[44px] w-40! rounded-full! py-2! text-body-sm! bg-surface-container-lowest"
      >
        <option value="">All of Peshawar</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      {/* Sort dropdown */}
      <Select
        aria-label="Sort listings"
        value={sort}
        onChange={(event) => {
          const selected = LISTING_SORTS.find(({ value }) => value === event.target.value);
          if (selected) onChange({ sort: selected.value });
        }}
        className="min-h-[44px] w-48! rounded-full! py-2! text-body-sm! bg-surface-container-lowest"
      >
        {LISTING_SORTS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
