import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildVariationGenerator } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildVariationGenerator()} />;
}
