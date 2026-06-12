import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildSeatingPlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildSeatingPlanner()} />;
}
