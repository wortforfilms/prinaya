import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function DroneNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="drone" params={params} />;
}
