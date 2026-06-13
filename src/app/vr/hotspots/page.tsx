import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildHotspotManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildHotspotManager()} />;
}
