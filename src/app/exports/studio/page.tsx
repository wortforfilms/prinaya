import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TLPS Board Composer Studio"
};

/**
 * Board Composer Studio — self-contained preview page served from
 * /public/board-composer.html, embedded full-bleed. Export is preview only;
 * native DWG/DXF and certified handoff remain blocked.
 */
export default function BoardComposerStudioPage() {
  return (
    <iframe
      src="/board-composer.html"
      title="TLPS Board Composer Studio"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
