import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function AboutPage() {
  return <RoutePage route={publicRoute("/about")} />;
}
