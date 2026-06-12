import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildProcurement } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildProcurement()} />;
}
