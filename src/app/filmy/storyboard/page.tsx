import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildStoryboard } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildStoryboard()} />;
}
