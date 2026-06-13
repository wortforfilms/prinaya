import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildBranding } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildBranding()} />;
}
