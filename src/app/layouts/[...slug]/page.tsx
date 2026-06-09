import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function LayoutsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="layouts" params={params} />;
}
