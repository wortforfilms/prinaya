import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildRitualExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildRitualExplorer()} />;
}
