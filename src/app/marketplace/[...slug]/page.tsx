import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function MarketplaceNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="marketplace" params={params} />;
}
