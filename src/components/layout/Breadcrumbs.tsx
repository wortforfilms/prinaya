"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Nicer labels for segments that don't title-case well.
const LABELS: Record<string, string> = {
  cad: "CAD",
  editor: "Editor",
  studio: "Studio",
  ai: "AI Co-Pilot",
  vr: "VR Walkthrough",
  "hemant-samwat-vedi": "Vedi Finder",
  "venue-designer": "Venue Designer",
  "wedding-os": "Wedding OS",
  exports: "Board Composer"
};

function labelFor(segment: string): string {
  return (
    LABELS[segment] ??
    segment
      .split("-")
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
      .join(" ")
  );
}

export function Breadcrumbs() {
  const pathname = usePathname() || "/";
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => ({
    label: labelFor(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 overflow-x-auto border-b border-[#d9aa46]/12 bg-[#04110f]/70 px-4 py-2 text-xs text-[#b8aa8c] lg:px-6"
    >
      <Link href="/" className="inline-flex items-center gap-1 transition hover:text-[#f8d78b]">
        <Home aria-hidden className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <ChevronRight aria-hidden className="h-3.5 w-3.5 text-[#d9aa46]/50" />
            {isLast ? (
              <span aria-current="page" className="font-semibold text-[#f8f0df]">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="transition hover:text-[#f8d78b]">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
