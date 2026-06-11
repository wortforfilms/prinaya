import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TLPS 3D Designer Studio"
};

/**
 * 3D Designer Studio (Three.js) — self-contained preview served from
 * /public/3d-designer.html (three vendored locally, no CDNs), embedded
 * full-bleed. Export is preview only; gate preserved.
 */
export default function ThreeDDesignerStudioPage() {
  return (
    <iframe
      src="/3d-designer.html"
      title="TLPS 3D Designer Studio"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
