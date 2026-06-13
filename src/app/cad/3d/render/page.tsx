import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { build3dRenderStudio } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={build3dRenderStudio()} />;
}
