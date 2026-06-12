import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVendorTwin } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVendorTwin()} />;
}
