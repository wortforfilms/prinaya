import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function FloralNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="floral" params={params} />;
}
