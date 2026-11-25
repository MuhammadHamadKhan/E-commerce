"use client";
// Delays a changing value (e.g. search text) so we wait for the user
// to stop typing before sending a request.
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel when value changes again
  }, [value, delay]);

  return debounced;
}
