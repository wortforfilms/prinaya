import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function LightingNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="lighting" params={params} />;
}
