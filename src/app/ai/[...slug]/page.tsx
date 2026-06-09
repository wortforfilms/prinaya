import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function AiNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="ai" params={params} />;
}
