import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default function GalleryPage() {
  return <RoutePage route={publicRoute("/gallery")} />;
}
