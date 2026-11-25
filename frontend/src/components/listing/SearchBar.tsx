"use client";
// SearchBar: rounded search field with clean SVG search icon and warm focus state.
import { useState } from "react";

export default function SearchBar({
  initialQuery = "",
  onSearch,
  placeholder = "Search naan khatai, patties, croissants…",
  className = "",
}: {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = useState(initialQuery);

  return (
    <div
      className={`flex min-h-[44px] items-center rounded-full border border-outline-variant/60 bg-surface-container-lowest px-4 py-2 shadow-xs transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 ${className}`}
    >
      <svg
        className="mr-2.5 h-4 w-4 shrink-0 text-on-surface-variant/70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSearch(text);
        }}
        onBlur={() => onSearch(text)}
        placeholder={placeholder}
        aria-label="Search listings"
        className="w-full bg-transparent text-body-sm text-on-surface outline-none placeholder:text-outline/80"
      />
    </div>
  );
}
