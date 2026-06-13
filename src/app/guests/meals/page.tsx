import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMealPlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMealPlanner()} />;
}
