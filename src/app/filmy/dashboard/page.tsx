import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildFilmyDashboard } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildFilmyDashboard()} />;
}
