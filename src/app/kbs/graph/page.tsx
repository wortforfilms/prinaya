import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildGraphExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildGraphExplorer()} />;
}
