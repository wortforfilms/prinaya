import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function VendorsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="vendors" params={params} />;
}
