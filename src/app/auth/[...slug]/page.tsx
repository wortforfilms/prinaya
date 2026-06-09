import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function AuthNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="auth" params={params} />;
}
