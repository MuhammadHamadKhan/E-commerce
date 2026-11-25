"use client";
// Hero section: headline, call to action, and featured bake image.
import Image from "next/image";
import TonightHighlight from "./TonightHighlight";
import type { Listing } from "@/lib/api/types";

type HomeHeroProps = {
  highlight: Listing | null;
  isLoading: boolean;
  total: number;
};

export default function HomeHero({ highlight, isLoading, total }: HomeHeroProps) {
  return (
    <section className="relative -mx-gutter-mobile grid min-h-[clamp(36rem,calc(100svh-4rem),46rem)] grid-cols-1 overflow-hidden bg-surface-container-low md:-mx-gutter lg:min-h-[clamp(34rem,calc(100svh-4.5rem),44rem)] lg:grid-cols-2">
      <div className="relative order-first h-[clamp(14rem,34svh,24rem)] w-full overflow-hidden bg-surface-container-high lg:order-last lg:h-auto">
        {isLoading ? (
          <div className="h-full w-full animate-pulse bg-surface-container-high" aria-hidden="true" />
        ) : highlight ? (
          <TonightHighlight listing={highlight} />
        ) : (
          <>
            <Image
              src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1600&auto=format&fit=crop"
              alt="Fresh artisan breads from Peshawar bakeries"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-5 pt-16 font-display text-xl font-semibold text-white sm:p-8 sm:pt-20 sm:text-2xl">
              Fresh bakes, picked up from your local bakery.
            </p>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-[36rem]">
          <p className="mb-5 text-label font-semibold uppercase tracking-[0.12em] text-secondary">
            Peshawar · Fresh every evening
          </p>
          <h1 className="font-display text-balance text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-on-surface">
            Good bakes deserve a{" "}
            <span className="text-secondary">second chance.</span>
          </h1>
          <p className="mt-6 w-full max-w-[32rem] text-pretty text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Find bread, pastries and cakes from neighborhood bakeries at
            40–60% off. Reserve tonight and pay when you collect.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#all-bakes"
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-secondary px-7 text-label font-semibold text-white transition-colors hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:w-fit"
            >
              Browse tonight&apos;s bakes
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <p className="text-body-sm text-on-surface-variant">
              {total > 0 ? (
                <>
                  <span className="font-semibold text-on-surface">{total}</span> deals available
                </>
              ) : (
                "New deals arrive around 4 PM"
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
