import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildShotPlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildShotPlanner()} />;
}
