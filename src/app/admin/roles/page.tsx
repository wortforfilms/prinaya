import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildRoles } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildRoles()} />;
}
