import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildEvidence } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildEvidence()} />;
}
