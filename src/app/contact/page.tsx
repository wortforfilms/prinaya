import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function ContactPage() {
  return <RoutePage route={publicRoute("/contact")} />;
}
