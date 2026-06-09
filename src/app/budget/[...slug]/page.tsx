import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function BudgetNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="budget" params={params} />;
}
