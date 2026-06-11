"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Gem, Globe, Palette } from "lucide-react";

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: "Experiences",
    items: [
      { label: "Proposal", href: "/gallery" },
      { label: "Mehendi", href: "/gallery" },
      { label: "Haldi", href: "/gallery" },
      { label: "Sangeet", href: "/gallery" },
      { label: "Wedding", href: "/gallery" },
      { label: "Reception", href: "/gallery" }
    ]
  },
  {
    label: "Destinations",
    items: [
      { label: "India", href: "/venues" },
      { label: "International", href: "/venues" }
    ]
  },
  {
    label: "Design Studio",
    items: [
      { label: "Venue Designer", href: "/venue-designer" },
      { label: "Mandap Designer", href: "/mandap" },
      { label: "Layout Generator", href: "/layouts" },
      { label: "Floral Designer", href: "/floral" },
      { label: "Lighting Designer", href: "/lighting" }
    ]
  },
  {
    label: "Wedding Films",
    items: [
      { label: "Pre-Wedding", href: "/gallery" },
      { label: "Highlights", href: "/gallery" },
      { label: "Full Films", href: "/gallery" },
      { label: "Drone Films", href: "/drone" },
      { label: "Reels", href: "/gallery" }
    ]
  },
  {
    label: "Wedding OS",
    items: [
      { label: "AI Co-Pilot", href: "/ai" },
      { label: "Vedi Finder", href: "/hemant-samwat-vedi" },
      { label: "Observatory", href: "/observatory" },
      { label: "Board Composer", href: "/exports" }
    ]
  }
];

export function WeddingOsNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [utility, setUtility] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d9aa46]/20 bg-[#02100e]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Gem aria-hidden className="h-6 w-6 text-[#f8d78b]" />
          <span className="font-serif text-lg font-semibold tracking-[0.12em] text-[#f8d78b]">TLPS Wedding OS</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
          <Link href="/" className="rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]">
            Home
          </Link>
          {GROUPS.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setOpen(group.label)}>
              <button
                type="button"
                onClick={() => setOpen(open === group.label ? null : group.label)}
                className="flex items-center gap-1 rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]"
              >
                {group.label}
                <ChevronDown aria-hidden className="h-3.5 w-3.5" />
              </button>
              {open === group.label && (
                <div className="absolute left-0 top-full min-w-48 rounded-md border border-[#d9aa46]/25 bg-[#02100e] p-2 shadow-xl">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded px-3 py-2 text-sm text-white/75 transition hover:bg-[#d9aa46]/10 hover:text-[#f8d78b]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/contact" className="rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUtility(!utility)}
              className="rounded-md border border-white/15 p-2 text-white/70 transition hover:border-[#d9aa46]/50 hover:text-[#f8d78b]"
              aria-label="Utility menu"
            >
              <Globe aria-hidden className="h-4 w-4" />
            </button>
            {utility && (
              <div className="absolute right-0 top-full mt-1 min-w-44 rounded-md border border-[#d9aa46]/25 bg-[#02100e] p-2 text-sm shadow-xl">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">Utility</p>
                <div className="flex items-center gap-2 rounded px-3 py-2 text-white/75">
                  <Palette aria-hidden className="h-4 w-4" /> Theme: Royal Gold
                </div>
                <div className="flex items-center gap-2 rounded px-3 py-2 text-white/75">
                  <Globe aria-hidden className="h-4 w-4" /> Language: English
                </div>
              </div>
            )}
          </div>
          <Link
            href="/contact"
            className="rounded-md bg-[#d9aa46] px-4 py-2 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]"
          >
            Plan My Wedding
          </Link>
        </div>
      </nav>
    </header>
  );
}
