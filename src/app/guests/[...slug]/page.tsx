import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function GuestsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="guests" params={params} />;
}
