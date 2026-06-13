import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildAiObservatory } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildAiObservatory()} />;
}
