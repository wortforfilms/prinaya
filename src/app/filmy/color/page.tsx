import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildColorGrading } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildColorGrading()} />;
}
