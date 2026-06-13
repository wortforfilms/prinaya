import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildKaranaExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildKaranaExplorer()} />;
}
