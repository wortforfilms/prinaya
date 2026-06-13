import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildGuestHealth } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildGuestHealth()} />;
}
