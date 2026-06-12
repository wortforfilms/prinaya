import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildBoardsExplorer } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildBoardsExplorer()} />;
}
