import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildOrganization } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildOrganization()} />;
}
