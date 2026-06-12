import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildProjects } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildProjects()} />;
}
