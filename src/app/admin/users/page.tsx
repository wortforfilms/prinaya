import { SurfaceScaffold } from "@/components/surface/SurfaceScaffold";
import { buildUsers } from "@/lib/surfaces/runtime-surfaces";

export default function Page() {
  return <SurfaceScaffold panel={buildUsers()} />;
}
