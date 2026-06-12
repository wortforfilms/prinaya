import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildTimeline } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildTimeline()} />;
}
