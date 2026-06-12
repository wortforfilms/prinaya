import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildDeliveryManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildDeliveryManager()} />;
}
