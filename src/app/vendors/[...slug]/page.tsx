import { RoutePage } from "@/components/routes/RoutePage";
import { publicRoute } from "@/lib/route-helpers";

export default async function VendorsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  return <RoutePage route={publicRoute("/vendors")} slug={resolved.slug ?? []} />;
}
