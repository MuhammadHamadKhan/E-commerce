"use client";
// useCountdown: takes an expiry time and returns the time left,
// updated every second. ended = true once the time is up.
//
// Date.now() is dynamic on every render, so it must NOT run during the
// initial server render / hydration (it would differ between server and
// client and break Next.js hydration). It is only computed inside
// useEffect, which runs exclusively on the client after mount.
import { useEffect, useState } from "react";

export interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
  msLeft: number; // raw milliseconds, handy for "2h 15m" formatting
  ended: boolean;
}

function compute(expiresAt: string | Date): Countdown {
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  const clamped = Math.max(0, msLeft);
  return {
    hours: Math.floor(clamped / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1000),
    msLeft,
    ended: msLeft <= 0,
  };
}

export function useCountdown(expiresAt: string | Date): Countdown {
  // Neutral initial state: no Date.now() here, so the server-rendered HTML
  // and the client hydration render match exactly.
  const [countdown, setCountdown] = useState<Countdown>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    msLeft: 0,
    ended: false,
  });

  // Client-only: compute the real countdown and start the 1-second tick.
  useEffect(() => {
    const tick = () => {
      setCountdown(compute(expiresAt));
    };

    tick(); // compute immediately on mount

    if (compute(expiresAt).ended) return; // nothing left to tick

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer); // stop when the component unmounts
  }, [expiresAt]);

  return countdown;
}
