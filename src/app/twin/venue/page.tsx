import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVenueTwin } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVenueTwin()} />;
}
