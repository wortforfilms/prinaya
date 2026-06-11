"use client";

import { useEffect, useState } from "react";
import { sectionAnchors } from "@/lib/homepage-content";

/** Sticky in-page anchor rail with scroll-spy active-section highlighting. */
export function HomeAnchorRail() {
  const [active, setActive] = useState<string>(sectionAnchors[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    for (const anchor of sectionAnchors) {
      const el = document.getElementById(anchor.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[57px] z-30 hidden border-b border-white/5 bg-[#020908]/85 backdrop-blur lg:block">
      <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 py-2">
        {sectionAnchors.map((anchor) => (
          <a
            key={anchor.id}
            href={`#${anchor.id}`}
            aria-current={active === anchor.id ? "true" : undefined}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              active === anchor.id ? "bg-[#d9aa46]/15 text-[#f8d78b]" : "text-white/55 hover:text-[#f8d78b]"
            }`}
          >
            {anchor.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
