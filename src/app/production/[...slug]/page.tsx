import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function ProductionNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="production" params={params} />;
}
