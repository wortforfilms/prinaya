import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildFilmProjects } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildFilmProjects()} />;
}
