import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Film, LayoutGrid, Network, Sparkles } from "lucide-react";
import { WeddingOsNav } from "@/components/landing/WeddingOsNav";
import { HomeAnchorRail } from "@/components/landing/HomeAnchorRail";
import { CtaLink } from "@/components/landing/CtaLink";
import { buildHomepageSurface } from "@/lib/kbs/surfaces";
import { tlpsWeddingOsHomepage } from "@/lib/tlps-wedding-os-homepage";
import { releaseStatus } from "@/lib/status";
import {
  conversionCtas,
  conversionOfferings,
  experienceCards,
  heroCtas,
  heroImage,
  studioOutputs,
  studioTools,
  trustStats,
  vediChips
} from "@/lib/homepage-content";

export function WeddingOsHomepage() {
  const surface = buildHomepageSurface();
  const films = tlpsWeddingOsHomepage.filmCards;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020908] text-[#fff6df]">
      <WeddingOsNav />
      <HomeAnchorRail />

      {/* PHASE 1 — Hero */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2,9,8,0.55) 0%, rgba(2,9,8,0.82) 70%, #020908 100%), url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            {releaseStatus.verdict}
          </span>
          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[#f8d78b] sm:text-5xl lg:text-7xl">TLPS Wedding OS</h1>
          <p className="mt-4 text-xl font-light text-white/90 sm:text-2xl lg:text-3xl">Plan. Design. Film. Execute.</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-white/70 sm:text-base">
            The operating system for luxury weddings, destination celebrations, wedding films, and production management.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <CtaLink href={heroCtas[0].href} event="hero_plan_my_wedding" className="rounded-md bg-[#d9aa46] px-6 py-3 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]">
              {heroCtas[0].label}
            </CtaLink>
            <CtaLink href={heroCtas[1].href} event="hero_design_studio" className="rounded-md border border-[#d9aa46]/50 px-6 py-3 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10">
              {heroCtas[1].label}
            </CtaLink>
            <CtaLink href={heroCtas[2].href} event="hero_watch_films" className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40">
              {heroCtas[2].label}
            </CtaLink>
          </div>
        </div>
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
          {trustStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[#d9aa46]/20 bg-white/[0.03] p-6 text-center">
              <p className="font-serif text-3xl font-semibold text-[#f8d78b] sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 4 — KBS surface */}
      <Section id="intelligence">
        <div className="rounded-2xl border border-[#d9aa46]/25 bg-gradient-to-br from-[#06201b] to-[#02100e] p-6 sm:p-8">
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
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <Metric label="KBS Nodes" value={surface.kbs.nodes.toLocaleString("en-IN")} />
            <Metric label="Relations" value={surface.kbs.relations.toLocaleString("en-IN")} />
            <Metric label="Use Cases" value={String(surface.kbs.useCases)} />
            <Metric label="Assets" value={`${surface.kbs.assets}+`} />
            <Metric label="Status" value="READY" />
          </div>
        </div>
      </Section>

      {/* PHASE 5 — Experience cards */}
      <Section id="experiences" title="Signature Experiences" icon={Sparkles}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experienceCards.map((card) => (
            <Link key={card.title} href={card.href} className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#d9aa46]/40">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
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
      <Section id="design-studio" title="Wedding Design Studio" icon={LayoutGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studioTools.map((tool) => (
            <Link key={tool.label} href={tool.href} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#d9aa46]/40">
              <span className="font-semibold text-white/85">{tool.label}</span>
              <ArrowRight aria-hidden className="h-4 w-4 text-[#d9aa46]" />
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {studioOutputs.map((out) => (
            <span key={out} className="rounded-full border border-[#d9aa46]/30 bg-[#d9aa46]/10 px-3 py-1 text-xs font-semibold text-[#f8d78b]">{out}</span>
          ))}
        </div>
      </Section>

      {/* PHASE 7 — Filmy Studio */}
      <Section id="films" title="Filmy Studio" icon={Film}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {films.map((film) => (
            <div key={film.id} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={film.image} alt={film.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <p className="p-3 text-center text-sm font-semibold text-white/80">{film.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 8 — Vedi Finder */}
      <Section id="vedi" title="Hemant Samwat Vedi Finder" icon={Compass}>
        <div className="rounded-2xl border border-[#d9aa46]/25 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-sm text-white/65">
            Orientation-aware vedi, agni, and phera guidance with full panchanga lookups —
            {" "}{surface.vedi.nakshatras} nakshatras, {surface.vedi.tithis} tithis, {surface.vedi.muhurats} muhurat windows.
            {surface.vedi.topMuhurat ? ` Top window: ${surface.vedi.topMuhurat}.` : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {vediChips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">{chip}</span>
            ))}
          </div>
          <CtaLink href="/hemant-samwat-vedi" event="open_vedi_finder" className="mt-6 inline-flex items-center gap-1 rounded-md bg-[#d9aa46] px-5 py-2.5 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]">
            Open Vedi Finder <ArrowRight aria-hidden className="h-4 w-4" />
          </CtaLink>
        </div>
      </Section>

      {/* PHASE 9 — Use cases */}
      <Section id="use-cases" title={`${surface.kbs.useCases} Use Cases`} icon={LayoutGrid}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {surface.useCaseGroups.map((group) => (
            <div key={group.group} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#f8d78b]">{group.group}</h3>
                <span className="text-sm font-semibold text-white/55">{group.count}</span>
              </div>
              {group.examples.length > 0 && <p className="mt-2 text-xs text-white/55">{group.examples.join(" · ")}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* PHASE 10 — Conversion */}
      <section className="border-t border-[#d9aa46]/20 bg-gradient-to-b from-[#02100e] to-[#020908]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-semibold text-[#f8d78b] sm:text-4xl">{"Let's Create Your Story"}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {conversionOfferings.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {conversionCtas.map((cta, index) => (
              <CtaLink
                key={cta.label}
                href={cta.href}
                event={`conversion_${cta.label.toLowerCase().replace(/\s+/g, "_")}`}
                className={
                  index === 0
                    ? "rounded-md bg-[#d9aa46] px-6 py-3 text-sm font-semibold text-[#02100e] transition hover:bg-[#f8d78b]"
                    : index === 1
                      ? "rounded-md border border-[#d9aa46]/50 px-6 py-3 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10"
                      : "rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40"
                }
              >
                {cta.label}
              </CtaLink>
            ))}
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

function Section({ children, id, title, icon: Icon }: { children: React.ReactNode; id?: string; title?: string; icon?: typeof Sparkles }) {
  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-28 px-6 py-14">
      {title && (
        <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold text-[#f8d78b] sm:text-3xl">
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
