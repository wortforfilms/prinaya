import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildLightingLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildLightingLibrary()} />;
}
