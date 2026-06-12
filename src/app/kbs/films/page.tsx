import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildFilmsExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildFilmsExplorer()} />;
}
