import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildRisks } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildRisks()} />;
}
