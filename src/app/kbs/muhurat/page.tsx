import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildMuhuratExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildMuhuratExplorer()} />;
}
