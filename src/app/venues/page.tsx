import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function VenuesPage() {
  return <RoutePage route={publicRoute("/venues")} />;
}
