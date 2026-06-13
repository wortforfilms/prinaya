import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildRashiExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildRashiExplorer()} />;
}
