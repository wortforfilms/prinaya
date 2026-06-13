import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { build3dStageStudio } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={build3dStageStudio()} />;
}
