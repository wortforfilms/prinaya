import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildCommunicationCenter } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildCommunicationCenter()} />;
}
