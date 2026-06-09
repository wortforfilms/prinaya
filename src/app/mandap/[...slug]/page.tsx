import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function MandapNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="mandap" params={params} />;
}
