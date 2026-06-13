import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildCoveragePlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildCoveragePlanner()} />;
}
