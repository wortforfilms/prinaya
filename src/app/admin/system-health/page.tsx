import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildSystemHealth } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildSystemHealth()} />;
}
