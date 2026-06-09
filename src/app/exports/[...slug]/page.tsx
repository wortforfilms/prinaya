import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function ExportsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="exports" params={params} />;
}
