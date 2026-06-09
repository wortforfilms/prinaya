import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function VendorsPage() {
  return <RoutePage route={publicRoute("/vendors")} />;
}
