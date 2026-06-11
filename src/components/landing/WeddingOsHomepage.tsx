import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Compass,
  Film,
  LayoutGrid,
  Network,
  Sparkles
} from "lucide-react";
import { WeddingOsNav } from "@/components/landing/WeddingOsNav";
import { buildHomepageSurface } from "@/lib/kbs/surfaces";
import { tlpsWeddingOsHomepage } from "@/lib/tlps-wedding-os-homepage";
import { releaseStatus } from "@/lib/status";

const TRUST = [
  { value: "750+", label: "Weddings Planned" },
  { value: "50+", label: "Destinations" },
  { value: "1000+", label: "Families Served" },
  { value: "24×7", label: "Production Support" }
];

const EXPERIENCES = [
  { title: "Destination Weddings", desc: "Palaces, beaches, and international venues, scouted and staged.", href: "/venues", image: "/tlps-wedding-os/homepage/destinations/udaipur.png", cta: "Explore Destinations" },
  { title: "Wedding Design Studio", desc: "Venue, mandap, floral, and lighting design in 2D, 3D, and VR.", href: "/mandap", image: "/hero-banners/hires/mandap-designer.webp", cta: "Open Design Studio" },
  { title: "Wedding Films", desc: "Pre-wedding, highlights, full films, drone, and reels.", href: "/gallery", image: "/tlps-wedding-os/homepage/film-studio/full-wedding-films.png", cta: "Watch Films" },
  { title: "AI Wedding Co-Pilot", desc: "Knowledge-graph recommendations across mandap, vedi, budget, and risk.", href: "/ai", image: "/hero-banners/hires/ai-co-pilot.webp", cta: "Meet the Co-Pilot" },
  { title: "Hemant Samwat Vedi Finder", desc: "Vastu, agni, phera, nakshatra, tithi, and muhurat intelligence.", href: "/hemant-samwat-vedi", image: "/hero-banners/hires/observatory.webp", cta: "Open Vedi Finder" },
  { title: "Board Composer", desc: "Scene → render → 17-page board → export package.", href: "/exports", image: "/hero-banners/hires/board-composer.webp", cta: "Compose a Board" }
];

const STUDIO_TOOLS = [
  { label: "Venue Designer", href: "/venue-designer" },
  { label: "Mandap Designer", href: "/mandap" },
  { label: "Layout Generator", href: "/layouts" },
  { label: "Floral Designer", href: "/floral" },
  { label: "Lighting Designer", href: "/lighting" },
  { label: "Budget Planner", href: "/budget" }
];

const STUDIO_OUTPUTS = ["2D Plans", "3D Visuals", "VR Walkthroughs", "Board Generation"];

const VEDI_CHIPS = ["Compass", "Vastu Grid", "Nakshatra", "Tithi", "Muhurat", "Vedi Placement", "Agni Placement", "Phera Path"];

const CONVERSION = ["Destination Wedding", "Luxury Wedding", "Wedding Film", "Proposal Planning", "Complete Wedding Production"];

export function WeddingOsHomepage() {
  const surface = buildHomepageSurface();
  const films = tlpsWeddingOsHomepage.filmCards;

  return (
    <main className="min-h-screen bg-[#020908] text-[#fff6df]">
      <WeddingOsNav />

      {/* PHASE 1 — Hero */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(2,9,8,0.55) 0%, rgba(2,9,8,0.82) 70%, #020908 100%), url('/wedding-palace-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            {releaseStatus.verdict}
          </span>
          <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-[#f8d78b] lg:text-7xl">TLPS Wedding OS</h1>
          <p className="mt-4 text-2xl font-light text-white/90 lg:text-3xl">Plan. Design. Film. Execute.</p>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/70">
            The operating system for luxury weddings, destination celebrations, wedding films, and production management.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="rounded-md bg-[#d9aa46] px-6 py-3 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]">
              Plan My Wedding
            </Link>
            <Link href="/mandap" className="rounded-md border border-[#d9aa46]/50 px-6 py-3 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10">
              Explore Design Studio
            </Link>
            <Link href="/gallery" className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40">
              Watch Wedding Films
            </Link>
          </div>
        </div>
        {/* technical wording moved below hero */}
        <div className="border-t border-white/10 bg-[#02100e]/80">
          <p className="mx-auto max-w-5xl px-6 py-3 text-center text-xs text-white/45">
            Controlled preview · {releaseStatus.verdict} · PRODUCTION_READY=false · live vendors, payments, marketplace,
            DWG/DXF export, and certified compliance remain blocked.
          </p>
        </div>
      </section>

      {/* PHASE 3 — Trust */}
      <Section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[#d9aa46]/20 bg-white/[0.03] p-6 text-center">
              <p className="font-serif text-4xl font-semibold text-[#f8d78b]">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 4 — KBS surface */}
      <Section>
        <div className="rounded-2xl border border-[#d9aa46]/25 bg-gradient-to-br from-[#06201b] to-[#02100e] p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Network aria-hidden className="h-7 w-7 text-[#f8d78b]" />
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#f8d78b]">Wedding Intelligence Engine</h2>
                <p className="text-sm text-white/60">Live knowledge graph powering every surface.</p>
              </div>
            </div>
            <Link href="/observatory" className="inline-flex items-center gap-1 rounded-md border border-[#d9aa46]/40 px-4 py-2 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10">
              Explore Knowledge Graph <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Metric label="KBS Nodes" value={surface.kbs.nodes.toLocaleString("en-IN")} />
            <Metric label="Relations" value={surface.kbs.relations.toLocaleString("en-IN")} />
            <Metric label="Use Cases" value={String(surface.kbs.useCases)} />
            <Metric label="Assets" value={`${surface.kbs.assets}+`} />
            <Metric label="Status" value="READY" />
          </div>
        </div>
      </Section>

      {/* PHASE 5 — Experience cards */}
      <Section title="Signature Experiences" icon={Sparkles}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((card) => (
            <Link key={card.title} href={card.href} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#d9aa46]/40">
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold text-[#f8d78b]">{card.title}</h3>
                <p className="mt-2 text-sm text-white/65">{card.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#d9aa46]">
                  {card.cta} <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* PHASE 6 — Design Studio */}
      <Section title="Wedding Design Studio" icon={LayoutGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIO_TOOLS.map((tool) => (
            <Link key={tool.label} href={tool.href} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#d9aa46]/40">
              <span className="font-semibold text-white/85">{tool.label}</span>
              <ArrowRight aria-hidden className="h-4 w-4 text-[#d9aa46]" />
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {STUDIO_OUTPUTS.map((out) => (
            <span key={out} className="rounded-full border border-[#d9aa46]/30 bg-[#d9aa46]/10 px-3 py-1 text-xs font-semibold text-[#f8d78b]">{out}</span>
          ))}
        </div>
      </Section>

      {/* PHASE 7 — Filmy Studio */}
      <Section title="Filmy Studio" icon={Film}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {films.map((film) => (
            <div key={film.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              <div className="aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={film.image} alt={film.label} className="h-full w-full object-cover" />
              </div>
              <p className="p-3 text-center text-sm font-semibold text-white/80">{film.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 8 — Vedi Finder */}
      <Section title="Hemant Samwat Vedi Finder" icon={Compass}>
        <div className="rounded-2xl border border-[#d9aa46]/25 bg-white/[0.03] p-8">
          <p className="text-sm text-white/65">
            Orientation-aware vedi, agni, and phera guidance with full panchanga lookups —
            {" "}{surface.vedi.nakshatras} nakshatras, {surface.vedi.tithis} tithis, {surface.vedi.muhurats} muhurat windows.
            {surface.vedi.topMuhurat ? ` Top window: ${surface.vedi.topMuhurat}.` : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {VEDI_CHIPS.map((chip) => (
              <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{chip}</span>
            ))}
          </div>
          <Link href="/hemant-samwat-vedi" className="mt-6 inline-flex items-center gap-1 rounded-md bg-[#d9aa46] px-5 py-2.5 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]">
            Open Vedi Finder <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* PHASE 9 — Use cases */}
      <Section title={`${surface.kbs.useCases} Use Cases`} icon={LayoutGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {surface.useCaseGroups.map((group) => (
            <div key={group.group} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#f8d78b]">{group.group}</h3>
                <span className="text-sm font-semibold text-white/55">{group.count}</span>
              </div>
              {group.examples.length > 0 && (
                <p className="mt-2 text-xs text-white/55">{group.examples.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 10 — Conversion */}
      <section className="border-t border-[#d9aa46]/20 bg-gradient-to-b from-[#02100e] to-[#020908]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-serif text-4xl font-semibold text-[#f8d78b]">{"Let's Create Your Story"}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CONVERSION.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="rounded-md bg-[#d9aa46] px-6 py-3 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]">Book Consultation</Link>
            <Link href="/contact" className="rounded-md border border-[#d9aa46]/50 px-6 py-3 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10">Schedule Discovery Call</Link>
            <Link href="/contact" className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40">Start Planning</Link>
          </div>
          <p className="mt-10 text-xs text-white/40">
            {releaseStatus.verdict} · PRODUCTION_READY=false · This is a controlled preview. Live vendors, payments,
            marketplace commerce, DWG/DXF export, and certified engineering compliance are not available.
          </p>
        </div>
      </section>
    </main>
  );
}

function Section({ children, title, icon: Icon }: { children: React.ReactNode; title?: string; icon?: typeof Sparkles }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      {title && (
        <h2 className="mb-6 flex items-center gap-2 font-serif text-3xl font-semibold text-[#f8d78b]">
          {Icon && <Icon aria-hidden className="h-6 w-6" />}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-center">
      <p className="font-serif text-2xl font-semibold text-[#f8d78b]">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">{label}</p>
    </div>
  );
}
