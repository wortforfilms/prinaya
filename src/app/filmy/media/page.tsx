import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMediaLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMediaLibrary()} />;
}
