import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildNakshatraExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildNakshatraExplorer()} />;
}
