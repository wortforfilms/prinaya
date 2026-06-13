import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildBackups } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildBackups()} />;
}
