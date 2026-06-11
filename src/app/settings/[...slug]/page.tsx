import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function SettingsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="settings" params={params} />;
}
