import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildPromptLibrary } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildPromptLibrary()} />;
}
