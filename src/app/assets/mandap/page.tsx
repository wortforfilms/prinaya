import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMandapLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMandapLibrary()} />;
}
