import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function FeaturesPage() {
  return <RoutePage route={publicRoute("/features")} />;
}
