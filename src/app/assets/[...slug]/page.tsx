import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function AssetsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="assets" params={params} />;
}
