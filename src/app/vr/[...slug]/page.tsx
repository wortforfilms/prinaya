import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function VrNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="vr" params={params} />;
}
