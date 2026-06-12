import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildRsvp } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildRsvp()} />;
}
