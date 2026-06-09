import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function PricingPage() {
  return <RoutePage route={publicRoute("/pricing")} />;
}
