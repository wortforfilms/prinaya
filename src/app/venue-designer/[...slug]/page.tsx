import { ModuleRoutePage } from "@/components/routes/ModuleRoutePage";

export default function VenueDesignerNestedPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  return <ModuleRoutePage segment="venue-designer" params={params} />;
}
