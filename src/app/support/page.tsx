import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function SupportPage() {
  return <RoutePage route={publicRoute("/support")} />;
}
