import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildStageDesigner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildStageDesigner()} />;
}
