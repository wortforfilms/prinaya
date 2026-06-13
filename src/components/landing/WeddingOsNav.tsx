"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Gem, Globe, Menu, Palette, X } from "lucide-react";
import { navGroups } from "@/lib/homepage-content";
import { CtaLink } from "@/components/landing/CtaLink";

export function WeddingOsNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [utility, setUtility] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns / utility on outside click and Escape.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(null);
        setUtility(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
        setUtility(false);
        setMobile(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-40 border-b border-[#d9aa46]/20 bg-[#02100e]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobile(false)}>
          <Gem aria-hidden className="h-6 w-6 text-[#f8d78b]" />
          <span className="font-serif text-lg font-semibold tracking-[0.12em] text-[#f8d78b]">TLPS Wedding OS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
          <Link href="/" className="rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]">
            Home
          </Link>
          <Link href="/themes" className="rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]">
            Themes
          </Link>
          {navGroups.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setOpen(group.label)}>
              <button
                type="button"
                onClick={() => setOpen(open === group.label ? null : group.label)}
                aria-expanded={open === group.label}
                className="flex items-center gap-1 rounded px-3 py-2 text-sm text-white/80 transition hover:text-[#f8d78b]"
              >
                {group.label}
                <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition ${open === group.label ? "rotate-180" : ""}`} />
              </button>
              {open === group.label && (
                <div className="absolute left-0 top-full min-w-48 rounded-md border border-[#d9aa46]/25 bg-[#02100e] p-2 shadow-xl">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(null)}
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
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setUtility(!utility)}
              aria-label="Utility menu"
              aria-expanded={utility}
              className="rounded-md border border-white/15 p-2 text-white/70 transition hover:border-[#d9aa46]/50 hover:text-[#f8d78b]"
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
          <CtaLink
            href="/contact"
            event="nav_plan_my_wedding"
            className="hidden rounded-md bg-[#d9aa46] px-4 py-2 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b] sm:block"
          >
            Plan My Wedding
          </CtaLink>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobile(!mobile)}
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            className="rounded-md border border-white/15 p-2 text-white/80 lg:hidden"
          >
            {mobile ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobile && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-white/10 bg-[#02100e] px-5 py-4 lg:hidden">
          <Link href="/" onClick={() => setMobile(false)} className="block rounded px-2 py-2 text-sm font-semibold text-white/85">
            Home
          </Link>
          <Link href="/themes" onClick={() => setMobile(false)} className="block rounded px-2 py-2 text-sm font-semibold text-white/85">
            Themes
          </Link>
          {navGroups.map((group) => (
            <div key={group.label} className="mt-2">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">{group.label}</p>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobile(false)}
                    className="rounded px-2 py-2 text-sm text-white/75 transition hover:bg-[#d9aa46]/10 hover:text-[#f8d78b]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/contact" onClick={() => setMobile(false)} className="mt-3 block rounded px-2 py-2 text-sm font-semibold text-white/85">
            Contact
          </Link>
          <CtaLink
            href="/contact"
            event="nav_plan_my_wedding_mobile"
            className="mt-3 block rounded-md bg-[#d9aa46] px-4 py-2.5 text-center text-sm font-semibold text-[#02100e]"
          >
            Plan My Wedding
          </CtaLink>
          <p className="mt-3 px-2 text-[10px] text-white/40">Theme: Royal Gold · Language: English</p>
        </div>
      )}
    </header>
  );
}
