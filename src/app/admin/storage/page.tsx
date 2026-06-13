import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildStorage } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildStorage()} />;
}
