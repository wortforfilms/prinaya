import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildPanchangaExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildPanchangaExplorer()} />;
}
