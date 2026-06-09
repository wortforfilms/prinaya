import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function DashboardNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="dashboard" params={params} />;
}
