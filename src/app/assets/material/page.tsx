import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMaterialLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMaterialLibrary()} />;
}
