import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildYogaExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildYogaExplorer()} />;
}
