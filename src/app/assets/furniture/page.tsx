import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildFurnitureLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildFurnitureLibrary()} />;
}
