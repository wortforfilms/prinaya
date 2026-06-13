import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildSecurity } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildSecurity()} />;
}
