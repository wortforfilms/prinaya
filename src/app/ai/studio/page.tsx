import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TLPS AI Generator Studio"
};

/**
 * AI Generator Studio — self-contained preview page served from
 * /public/ai-generator.html, embedded full-bleed. Preview mockup only: the
 * credits/Generate affordances are illustrative; no live AI generation, billing,
 * or payment runtime exists (CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false).
 */
export default function AiGeneratorStudioPage() {
  return (
    <iframe
      src="/ai-generator.html"
      title="TLPS AI Generator Studio"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
