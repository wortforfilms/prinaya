import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildStageLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildStageLibrary()} />;
}
