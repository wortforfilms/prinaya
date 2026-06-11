/**
 * Static content for the Wedding OS homepage, extracted so it can be unit-tested
 * (every CTA href is a real route; every image path exists on disk).
 */
export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; items: NavItem[] };
export type ExperienceCard = { title: string; desc: string; href: string; image: string; cta: string };
export type SectionAnchor = { id: string; label: string };

export const navGroups: NavGroup[] = [
  {
    label: "Experiences",
    items: [
      { label: "Proposal", href: "/gallery" },
      { label: "Mehendi", href: "/gallery" },
      { label: "Haldi", href: "/gallery" },
      { label: "Sangeet", href: "/gallery" },
      { label: "Wedding", href: "/gallery" },
      { label: "Reception", href: "/gallery" }
    ]
  },
  {
    label: "Destinations",
    items: [
      { label: "India", href: "/venues" },
      { label: "International", href: "/venues" }
    ]
  },
  {
    label: "Design Studio",
    items: [
      { label: "Venue Designer", href: "/venue-designer" },
      { label: "Mandap Designer", href: "/mandap" },
      { label: "Layout Generator", href: "/layouts" },
      { label: "Floral Designer", href: "/floral" },
      { label: "Lighting Designer", href: "/lighting" }
    ]
  },
  {
    label: "Wedding Films",
    items: [
      { label: "Pre-Wedding", href: "/gallery" },
      { label: "Highlights", href: "/gallery" },
      { label: "Full Films", href: "/gallery" },
      { label: "Drone Films", href: "/drone" },
      { label: "Reels", href: "/gallery" }
    ]
  },
  {
    label: "Wedding OS",
    items: [
      { label: "AI Co-Pilot", href: "/ai" },
      { label: "Vedi Finder", href: "/hemant-samwat-vedi" },
      { label: "Observatory", href: "/observatory" },
      { label: "Board Composer", href: "/exports" }
    ]
  }
];

export const heroCtas: NavItem[] = [
  { label: "Plan My Wedding", href: "/contact" },
  { label: "Explore Design Studio", href: "/mandap" },
  { label: "Watch Wedding Films", href: "/gallery" }
];

export const trustStats = [
  { value: "750+", label: "Weddings Planned" },
  { value: "50+", label: "Destinations" },
  { value: "1000+", label: "Families Served" },
  { value: "24×7", label: "Production Support" }
];

export const experienceCards: ExperienceCard[] = [
  { title: "Destination Weddings", desc: "Palaces, beaches, and international venues, scouted and staged.", href: "/venues", image: "/tlps-wedding-os/homepage/destinations/udaipur.png", cta: "Explore Destinations" },
  { title: "Wedding Design Studio", desc: "Venue, mandap, floral, and lighting design in 2D, 3D, and VR.", href: "/mandap", image: "/hero-banners/hires/mandap-designer.webp", cta: "Open Design Studio" },
  { title: "Wedding Films", desc: "Pre-wedding, highlights, full films, drone, and reels.", href: "/gallery", image: "/tlps-wedding-os/homepage/film-studio/full-wedding-films.png", cta: "Watch Films" },
  { title: "AI Wedding Co-Pilot", desc: "Knowledge-graph recommendations across mandap, vedi, budget, and risk.", href: "/ai", image: "/hero-banners/hires/ai-co-pilot.webp", cta: "Meet the Co-Pilot" },
  { title: "Hemant Samwat Vedi Finder", desc: "Vastu, agni, phera, nakshatra, tithi, and muhurat intelligence.", href: "/hemant-samwat-vedi", image: "/hero-banners/hires/observatory.webp", cta: "Open Vedi Finder" },
  { title: "Board Composer", desc: "Scene → render → 17-page board → export package.", href: "/exports", image: "/hero-banners/hires/board-composer.webp", cta: "Compose a Board" }
];

export const studioTools: NavItem[] = [
  { label: "Venue Designer", href: "/venue-designer" },
  { label: "Mandap Designer", href: "/mandap" },
  { label: "Layout Generator", href: "/layouts" },
  { label: "Floral Designer", href: "/floral" },
  { label: "Lighting Designer", href: "/lighting" },
  { label: "Budget Planner", href: "/budget" }
];

export const studioOutputs = ["2D Plans", "3D Visuals", "VR Walkthroughs", "Board Generation"];
export const vediChips = ["Compass", "Vastu Grid", "Nakshatra", "Tithi", "Muhurat", "Vedi Placement", "Agni Placement", "Phera Path"];
export const conversionOfferings = ["Destination Wedding", "Luxury Wedding", "Wedding Film", "Proposal Planning", "Complete Wedding Production"];

export const conversionCtas: NavItem[] = [
  { label: "Book Consultation", href: "/contact" },
  { label: "Schedule Discovery Call", href: "/contact" },
  { label: "Start Planning", href: "/contact" }
];

export const heroImage = "/wedding-palace-hero.png";

// In-page section anchors for the scroll-spy rail.
export const sectionAnchors: SectionAnchor[] = [
  { id: "intelligence", label: "Intelligence" },
  { id: "experiences", label: "Experiences" },
  { id: "design-studio", label: "Design Studio" },
  { id: "films", label: "Films" },
  { id: "vedi", label: "Vedi Finder" },
  { id: "use-cases", label: "Use Cases" }
];

/** Every internal href used on the homepage (for route-coverage tests). */
export function homepageInternalHrefs(): string[] {
  const hrefs = [
    "/",
    ...navGroups.flatMap((g) => g.items.map((i) => i.href)),
    ...heroCtas.map((c) => c.href),
    ...experienceCards.map((c) => c.href),
    ...studioTools.map((t) => t.href),
    ...conversionCtas.map((c) => c.href),
    "/contact",
    "/observatory"
  ];
  return Array.from(new Set(hrefs));
}

/** Every public image path referenced by the static homepage content. */
export function homepageImagePaths(): string[] {
  return Array.from(new Set([heroImage, ...experienceCards.map((c) => c.image)]));
}
