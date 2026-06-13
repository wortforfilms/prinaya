import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVendorHealth } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVendorHealth()} />;
}
