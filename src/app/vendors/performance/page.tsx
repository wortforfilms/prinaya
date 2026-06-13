import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVendorPerformance } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVendorPerformance()} />;
}
