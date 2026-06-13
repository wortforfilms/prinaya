import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildClientReview } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildClientReview()} />;
}
