import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildUseCasesExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildUseCasesExplorer()} />;
}
