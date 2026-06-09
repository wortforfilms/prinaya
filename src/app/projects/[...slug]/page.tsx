import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function ProjectsNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="projects" params={params} />;
}
