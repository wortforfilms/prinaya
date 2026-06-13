import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildThemeManager } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildThemeManager()} />;
}
