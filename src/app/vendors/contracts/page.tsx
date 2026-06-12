import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildContractManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildContractManager()} />;
}
