import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildSketchToImage } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildSketchToImage()} />;
}
