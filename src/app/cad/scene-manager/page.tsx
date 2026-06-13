import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildSceneManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildSceneManager()} />;
}
