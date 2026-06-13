import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildDecorDesigner } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildDecorDesigner()} />;
}
