"use client";

import Link from "next/link";
import { recordPreviewEvent } from "@/lib/telemetry";

/**
 * A Link that records a local-only preview event on click (see lib/telemetry).
 * No data leaves the browser.
 */
export function CtaLink({
  href,
  event,
  className,
  children
}: {
  href: string;
  event: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-cta={event}
      className={className}
      onClick={() => recordPreviewEvent("cta_click", { cta: event, href })}
    >
      {children}
    </Link>
  );
}
