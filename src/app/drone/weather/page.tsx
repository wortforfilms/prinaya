import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildWeatherCenter } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildWeatherCenter()} />;
}
