import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildCalendar } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildCalendar()} />;
}
