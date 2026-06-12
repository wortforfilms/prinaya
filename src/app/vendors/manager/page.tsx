import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVendorManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVendorManager()} />;
}
