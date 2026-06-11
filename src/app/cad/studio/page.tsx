import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TLPS CAD Studio — Wedding Layout Editor"
};

/**
 * TLPS CAD Studio (Three.js). The editor is a self-contained static page served
 * from /public/cad-studio.html; this route embeds it full-bleed. It carries its
 * own chrome, so it is intentionally rendered outside StudioShell. Export remains
 * preview JSON only (CONTROLLED_PREVIEW_READY); native DWG/DXF stay blocked.
 */
export default function CadStudioPage() {
  return (
    <iframe
      src="/cad-studio.html"
      title="TLPS CAD Studio"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
