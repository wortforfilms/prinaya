import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildFloralLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildFloralLibrary()} />;
}
