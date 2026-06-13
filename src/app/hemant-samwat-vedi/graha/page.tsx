import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildGrahaExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildGrahaExplorer()} />;
}
