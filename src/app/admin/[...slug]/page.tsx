import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function AdminNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="admin" params={params} />;
}
