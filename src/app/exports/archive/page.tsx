import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildArchiveExport } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildArchiveExport()} />;
}
