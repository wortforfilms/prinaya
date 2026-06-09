import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function TemplatesPage() {
  return <RoutePage route={publicRoute("/templates")} />;
}
