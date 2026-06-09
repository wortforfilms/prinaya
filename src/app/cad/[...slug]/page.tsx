import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function CadNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="cad" params={params} />;
}
