import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildBatteryPlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildBatteryPlanner()} />;
}
