import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildGuestTwin } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildGuestTwin()} />;
}
