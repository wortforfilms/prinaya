import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildProductionTwin } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildProductionTwin()} />;
}
