import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildTemplatesExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildTemplatesExplorer()} />;
}
