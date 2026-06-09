import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function BlogPage() {
  return <RoutePage route={publicRoute("/blog")} />;
}
