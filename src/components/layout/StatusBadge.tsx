import clsx from "clsx";
import type { CapabilityStatus } from "@/lib/status";

const styles: Record<CapabilityStatus, string> = {
  READY: "border-neem/30 bg-neem/10 text-neem",
  PARTIAL: "border-marigold/40 bg-marigold/10 text-copper",
  BLOCKED: "border-lotus/35 bg-lotus/10 text-lotus"
};

export function StatusBadge({ status }: { status: CapabilityStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
