import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildDronePlanner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildDronePlanner()} />;
}
