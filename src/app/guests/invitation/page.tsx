import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildInvitation } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildInvitation()} />;
}
