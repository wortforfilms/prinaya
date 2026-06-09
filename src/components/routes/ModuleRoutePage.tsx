import { RoutePage } from "./RoutePage";
import { moduleRoute } from "@/lib/route-helpers";

export async function ModuleRoutePage({
  segment,
  params
}: {
  segment: string;
  params?: Promise<{ slug?: string[] }>;
}) {
  const resolved = params ? await params : { slug: [] };
  return <RoutePage route={moduleRoute(segment)} slug={resolved.slug ?? []} />;
}
