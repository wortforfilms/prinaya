import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildBudgetHealth } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildBudgetHealth()} />;
}
