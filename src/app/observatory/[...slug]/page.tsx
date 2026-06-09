import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function ObservatoryNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="observatory" params={params} />;
}
