import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildLogs } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildLogs()} />;
}
