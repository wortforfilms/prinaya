import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMilestones } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMilestones()} />;
}
