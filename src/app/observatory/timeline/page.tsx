import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildTimelineHealth } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildTimelineHealth()} />;
}
