"use client";

import {
  BadgeCheck,
  BookOpen,
  Camera,
  CircleDollarSign,
  Clapperboard,
  Compass,
  Crown,
  Flower2,
  Gem,
  Headphones,
  Landmark,
  Languages,
  Lightbulb,
  MapPin,
  Menu,
  MessageCircle,
  Palette,
  Phone,
  Plane,
  ShieldAlert,
  Sparkles,
  Theater,
  Users,
  Video,
  WandSparkles
} from "lucide-react";
import { useState, type ComponentType, type CSSProperties } from "react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { blockedCapabilities, releaseStatus, type CapabilityStatus } from "@/lib/status";
import { getCinematicImageForSource, type CinematicAspectId } from "@/lib/cinematic-image-assets";
import { getTlpsHomepageAsset, tlpsWeddingOsHomepage as page } from "@/lib/tlps-wedding-os-homepage";

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const ecosystemIcons: IconType[] = [
  Compass,
  Landmark,
  Gem,
  Palette,
  Flower2,
  Lightbulb,
  Users,
  BadgeCheck,
  Plane,
  Clapperboard,
  Theater,
  Headphones
];

const toolIcons: IconType[] = [Landmark, Gem, Compass, Flower2, Lightbulb, CircleDollarSign];
const actionIcons: IconType[] = [MessageCircle, Phone, WandSparkles, BookOpen];

const buyerValues = ["Risk Reduction", "Decision Authority", "Execution Capability", "Access", "Time Compression"];

const productLadder: Array<{
  tier: string;
  price: string;
  offer: string;
  status: CapabilityStatus;
  customer: string;
  inclusions: string[];
}> = [
  {
    tier: "Starter",
    price: "$499/mo",
    offer: "TLPS Wedding OS",
    status: "READY",
    customer: "Studios and planners needing local design, boards, CAD previews, and AI assistance.",
    inclusions: ["Venue Designer", "Mandap Designer", "Vedi Finder", "Guest Planner", "Boards", "VR", "AI Co-Pilot"]
  },
  {
    tier: "Professional",
    price: "$4,999/mo",
    offer: "Production Software Suite",
    status: "READY",
    customer: "High-end wedding teams that need stronger planning, budgeting, and design coordination.",
    inclusions: ["Wedding OS", "Production Planner", "Budget controls", "Board packages", "Render gallery", "Template runtime"]
  },
  {
    tier: "Production Office",
    price: "$24,999/mo",
    offer: "Wedding Command Center",
    status: "PARTIAL",
    customer: "Destination wedding companies and palace/resort teams running multiple workstreams.",
    inclusions: ["Dedicated planner", "Dedicated designer", "Dedicated producer", "Vendor coordination", "Weekly reviews", "Call sheets"]
  },
  {
    tier: "Enterprise",
    price: "$49,999/mo",
    offer: "Enterprise Wedding Office",
    status: "PARTIAL",
    customer: "Luxury resorts, palace chains, destination groups, and celebrity wedding firms.",
    inclusions: ["White label", "Custom branding", "Custom AI", "Dedicated success team", "Priority support", "Executive dashboards"]
  },
  {
    tier: "Sovereign Wedding Intelligence",
    price: "$99,999/mo",
    offer: "Digital Twin + Global Operations Layer",
    status: "PARTIAL",
    customer: "Royal, billionaire, celebrity, government, and ultra-luxury multi-country celebrations.",
    inclusions: ["Wedding digital twin", "Global command center", "Wedding war room", "AI producer", "Film intelligence", "Risk room"]
  }
];

const sovereignPillars: Array<{
  title: string;
  note: string;
  status: CapabilityStatus;
  icon: IconType;
  items: string[];
}> = [
  {
    title: "Wedding Digital Twin",
    note: "A controlled preview model of the wedding operation, not a live tracking claim.",
    status: "PARTIAL",
    icon: Compass,
    items: ["3D Venue Twin", "Guest Twin", "Logistics Twin", "Vendor Twin", "Production Twin", "Weather Twin"]
  },
  {
    title: "Hemant Samwat Intelligence Layer",
    note: "Operational intelligence for ceremony placement and timing, not astrology.",
    status: "READY",
    icon: Lightbulb,
    items: ["Venue Orientation", "Solar Path", "Shadow Analysis", "Guest Flow", "Wind Analysis", "Drone Analysis", "Lighting Analysis", "Ceremony Timing"]
  },
  {
    title: "Global Command Center",
    note: "Preview frames exist for command-room roles; live operations staffing remains service-side.",
    status: "PARTIAL",
    icon: Headphones,
    items: ["Operations Room", "Design Room", "Film Room", "Vendor Room", "Guest Room", "Risk Room"]
  },
  {
    title: "Wedding War Room",
    note: "Local dashboards are preview-ready; live family/crew tracking needs real integrations.",
    status: "PARTIAL",
    icon: ShieldAlert,
    items: ["Flights", "Hotels", "Guest Tracking", "Crew Tracking", "Vehicle Tracking", "Artist Tracking", "Drone Tracking"]
  },
  {
    title: "AI Producer",
    note: "AI planning surfaces exist; optimization needs connected production evidence before production claims.",
    status: "PARTIAL",
    icon: WandSparkles,
    items: ["Budget Optimization", "Vendor Selection", "Schedule Optimization", "Risk Detection", "Guest Analytics", "Production Analytics"]
  },
  {
    title: "Film Intelligence",
    note: "Connected positioning for Wedding Filmy Studio with preview mapping and deliverable tracking.",
    status: "PARTIAL",
    icon: Camera,
    items: ["Shot Prediction", "Drone Planning", "Coverage Mapping", "Editor Coordination", "Deliverable Tracking"]
  },
  {
    title: "Executive Dashboards",
    note: "Role dashboards are generated as local preview frames for decision authority.",
    status: "READY",
    icon: Video,
    items: ["Family Dashboard", "Production Dashboard", "Financial Dashboard", "Guest Dashboard", "Film Dashboard"]
  }
];

const landingThemes = [
  {
    id: "maharaja-noir",
    label: "Maharaja Noir",
    tone: "Black, gold, emerald",
    className: "tlps-theme-maharaja",
    accent: "#d8a84a",
    accentStrong: "#f3cc7a",
    page: "#050504",
    band: "#080705",
    panel: "rgba(255,255,255,0.04)",
    imageFilter: "saturate(1.02) contrast(1.05)"
  },
  {
    id: "vedic-lotus",
    label: "Vedic Lotus",
    tone: "Lotus, gold, deep green",
    className: "tlps-theme-lotus",
    accent: "#f2b7c8",
    accentStrong: "#f8d78b",
    page: "#070606",
    band: "#0b0b07",
    panel: "rgba(242,183,200,0.055)",
    imageFilter: "saturate(1.08) contrast(1.03) sepia(0.08)"
  },
  {
    id: "galactic-teal",
    label: "Galactic Teal",
    tone: "Teal, gold, royal blue",
    className: "tlps-theme-galactic",
    accent: "#5ce7e7",
    accentStrong: "#f3cc7a",
    page: "#03090d",
    band: "#041013",
    panel: "rgba(92,231,231,0.055)",
    imageFilter: "saturate(1.16) contrast(1.08) hue-rotate(4deg)"
  }
] as const;

const landingLayouts = [
  {
    id: "cinematic",
    label: "Cinematic Landing",
    shortLabel: "Cinematic",
    className: "tlps-layout-cinematic",
    status: "READY",
    note: "Hero-first storytelling with destination, design, film, and consultation flow.",
    highlights: ["Immersive hero", "Story sections", "Consultation CTA"]
  },
  {
    id: "command",
    label: "Command Center",
    shortLabel: "Command",
    className: "tlps-layout-command",
    status: "READY",
    note: "Dashboard-forward layout for executive review, status, budgets, and risk signals.",
    highlights: ["KPI stack", "Risk posture", "Decision view"]
  },
  {
    id: "board-gallery",
    label: "Board Gallery",
    shortLabel: "Boards",
    className: "tlps-layout-board",
    status: "READY",
    note: "Presentation-board layout for CAD concepts, hero banners, and generated previews.",
    highlights: ["Board frames", "Asset previews", "Export context"]
  }
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  shortLabel: string;
  className: string;
  status: CapabilityStatus;
  note: string;
  highlights: string[];
}>;

const landingLanguageCopy = {
  english: {
    label: "English",
    shortLabel: "EN",
    bookConsultation: "Book Consultation",
    menuLabel: "Menu",
    heroHeadline: "The Operating System for ultra-luxury weddings, destination events, celebrity productions, and multi-country celebrations.",
    heroSupport: "One platform. One production team. One unforgettable experience.",
    vediNote:
      "Hemant Samwat Vedi Position Finder is a feature. The flagship offer is the full Wedding OS, Digital Twin, Command Center, Filmy Studio, AI Producer, and Global Operations Layer.",
    heroActions: ["Plan My Wedding", "Open Command Center", "Explore Sovereign Intelligence"],
    statusNote: "Extracted from supplied PNG into local preview assets. Live marketplace, vendor booking, payments, and compliance remain blocked.",
    valueEyebrow: "What They Are Really Buying",
    valueHeadline: "Confidence, control, prestige, execution, and reduced failure risk.",
    valueBody:
      "A premium wedding office is not sold as software alone. It is sold as risk reduction, decision authority, execution capability, access, and time compression for complex luxury events.",
    vediFinderNote:
      "Hemant Samwat Vedi Position Finder is a placement and timing intelligence feature. It is not the $99,999/month product by itself.",
    productSubtitle: "Software at the base. Managed wedding intelligence at the top.",
    ecosystemTitle: "Plan, design, film, and execute from one preview surface",
    ctaHeadline: "Let's create your love story",
    ctaSubcopy: "From dreams to reality, we make every detail magical.",
    ctaActions: ["Book Consultation", "Schedule Discovery Call"],
    footerDescription:
      "India's advanced wedding planning, design, and filmmaking studio. We plan, design, manage, film, and create magic."
  },
  hindi: {
    label: "Hindi",
    shortLabel: "HI",
    bookConsultation: "परामर्श बुक करें",
    menuLabel: "मेन्यू",
    heroHeadline: "अल्ट्रा-लक्जरी शादियों, डेस्टिनेशन इवेंट्स, सेलिब्रिटी प्रोडक्शन्स और मल्टी-कंट्री समारोहों के लिए ऑपरेटिंग सिस्टम.",
    heroSupport: "एक प्लेटफॉर्म. एक प्रोडक्शन टीम. एक अविस्मरणीय अनुभव.",
    vediNote:
      "Hemant Samwat Vedi Position Finder एक फीचर है. मुख्य ऑफर Wedding OS, Digital Twin, Command Center, Filmy Studio, AI Producer और Global Operations Layer है.",
    heroActions: ["मेरी शादी प्लान करें", "कमांड सेंटर खोलें", "Sovereign Intelligence देखें"],
    statusNote: "दिए गए PNG से local preview assets निकाले गए हैं. Live marketplace, vendor booking, payments और compliance अभी blocked हैं.",
    valueEyebrow: "ग्राहक असल में क्या खरीदता है",
    valueHeadline: "विश्वास, नियंत्रण, प्रतिष्ठा, execution और failure risk में कमी.",
    valueBody:
      "Premium wedding office सिर्फ software नहीं है. यह risk reduction, decision authority, execution capability, access और time compression बेचता है.",
    vediFinderNote:
      "Hemant Samwat Vedi Position Finder placement और timing intelligence feature है. यह अकेला $99,999/month product नहीं है.",
    productSubtitle: "नीचे software. ऊपर managed wedding intelligence.",
    ecosystemTitle: "एक ही preview surface से plan, design, film और execute करें",
    ctaHeadline: "आपकी शाही wedding command story बनाते हैं",
    ctaSubcopy: "Dream से execution तक, हर detail controlled और memorable.",
    ctaActions: ["परामर्श बुक करें", "Discovery Call Schedule करें"],
    footerDescription:
      "India का advanced wedding planning, design और filmmaking studio. हम plan, design, manage, film और execute करते हैं."
  },
  hinglish: {
    label: "Hinglish",
    shortLabel: "HG",
    bookConsultation: "Book Karna Hai",
    menuLabel: "Menu",
    heroHeadline: "Ultra-luxury weddings, destination events aur celebrity productions ke liye complete Wedding OS.",
    heroSupport: "One platform. One production team. Full control, zero confusion.",
    vediNote:
      "Hemant Samwat Vedi Position Finder ek feature hai. Real offer hai Wedding OS + Digital Twin + Command Center + Filmy Studio + AI Producer.",
    heroActions: ["Wedding Plan Karo", "Command Center Kholo", "Sovereign Layer Dekho"],
    statusNote: "PNG references se local preview assets ready hain. Live vendors, payments, marketplace aur compliance abhi blocked hain.",
    valueEyebrow: "Customer Actually Kya Kharidta Hai",
    valueHeadline: "Confidence, control, prestige, execution aur risk kam karna.",
    valueBody:
      "Yeh sirf software nahi hai. Yeh decision authority, execution capability, access aur time compression ka managed wedding office hai.",
    vediFinderNote:
      "Vedi Position Finder placement aur timing intelligence hai. Yeh akela $99,999/month product nahi hai.",
    productSubtitle: "Base par SaaS. Top par managed sovereign wedding intelligence.",
    ecosystemTitle: "Plan, design, film aur execute ek hi surface se",
    ctaHeadline: "Chaliye aapki wedding command story banate hain",
    ctaSubcopy: "Dream se delivery tak, every detail under control.",
    ctaActions: ["Consultation Book Karo", "Discovery Call Schedule Karo"],
    footerDescription:
      "Advanced wedding planning, design aur filmmaking studio. Hum plan, design, manage, film aur execute karte hain."
  }
} as const;

type LandingThemeId = (typeof landingThemes)[number]["id"];
type LandingLayoutId = (typeof landingLayouts)[number]["id"];
type LandingLanguageId = keyof typeof landingLanguageCopy;
type LandingLanguageCopy = (typeof landingLanguageCopy)[LandingLanguageId];

export function TlpsWeddingOsHomepage() {
  const hero = getTlpsHomepageAsset("hero");
  const whyAi = getTlpsHomepageAsset("why-ai");
  const [themeId, setThemeId] = useState<LandingThemeId>("maharaja-noir");
  const [layoutId, setLayoutId] = useState<LandingLayoutId>("cinematic");
  const [languageId, setLanguageId] = useState<LandingLanguageId>("english");
  const theme = landingThemes.find((option) => option.id === themeId) ?? landingThemes[0];
  const layout = landingLayouts.find((option) => option.id === layoutId) ?? landingLayouts[0];
  const copy = landingLanguageCopy[languageId];
  const themeStyle = {
    "--tlps-accent": theme.accent,
    "--tlps-accent-strong": theme.accentStrong,
    "--tlps-page": theme.page,
    "--tlps-band": theme.band,
    "--tlps-panel": theme.panel,
    "--tlps-image-filter": theme.imageFilter
  } as CSSProperties;

  return (
    <div
      className={`tlps-landing ${theme.className} ${layout.className} min-h-screen bg-[#050504] text-[#f7ead2]`}
      data-language={languageId}
      data-layout={layoutId}
      style={themeStyle}
    >
      <section className="relative min-h-[700px] overflow-hidden border-b border-[#d8a84a]/25">
        <img src={cinematicImage(hero?.image ?? page.fullPageImage, "cinematic-21x9")} alt="" className="tlps-hero-image absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,0.96)_0%,rgba(3,3,3,0.68)_42%,rgba(3,3,3,0.15)_78%,rgba(3,3,3,0.7)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050504] to-transparent" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 lg:px-8">
          <a href="/" className="tlps-accent-text text-[#e3b259]">
            <span className="block font-serif text-4xl font-semibold leading-8">TLPS</span>
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-white">Wedding OS</span>
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-5 text-[11px] font-bold uppercase tracking-[0.1em] text-white/78 xl:flex">
            {page.navigation.map((item, index) => (
              <a key={item} href={index === 0 ? "/wedding-os" : `#${slug(item)}`} className={index === 0 ? "border-b border-[#e0ad4f] pb-2 text-white" : "pb-2 hover:text-[#f3cc7a]"}>
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeLanguageControls themeId={themeId} languageId={languageId} onThemeChange={setThemeId} onLanguageChange={setLanguageId} />
            <a href="#consultation" className="tlps-accent-border rounded-md border border-[#d8a84a]/65 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#f0c76d]">
              {copy.bookConsultation}
            </a>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/25" aria-label={copy.menuLabel}>
              <Menu aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:px-8 xl:grid-cols-[minmax(0,0.7fr)_minmax(320px,0.3fr)]">
          <div className="max-w-2xl">
            <p className="tlps-accent-text font-serif text-7xl font-semibold leading-none text-[#d8a84a] md:text-8xl">TLPS</p>
            <h1 className="mt-1 font-serif text-4xl font-semibold uppercase tracking-[0.16em] text-white md:text-5xl">
              Wedding OS
            </h1>
            <p className="tlps-accent-strong mt-5 text-sm font-bold uppercase tracking-[0.24em] text-[#f3cc7a]">{page.hero.tagline}</p>
            <p className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-white md:text-4xl">
              {copy.heroHeadline}
            </p>
            <p className="mt-5 max-w-md text-base leading-7 text-white/82">{copy.heroSupport}</p>
            <p className="tlps-accent-strong mt-4 max-w-xl text-sm leading-6 text-[#f3cc7a]/82">
              {copy.vediNote}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {copy.heroActions.map((action, index) => (
                <a
                  key={action}
                  href={index === 0 ? "#consultation" : index === 1 ? "#product-ladder" : "#sovereign-intelligence"}
                  className={index === 0 ? "tlps-primary-button rounded-md bg-[#d8a84a] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#120d05]" : "tlps-accent-border rounded-md border border-[#d8a84a]/45 bg-black/32 px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"}
                >
                  {action}
                </a>
              ))}
            </div>
            <LayoutOptionsPanel layoutId={layoutId} onLayoutChange={setLayoutId} />
          </div>

          <aside className="hidden content-center justify-self-end xl:grid">
            <HeroLayoutPreview layout={layout} />
          </aside>
        </div>
      </section>

      <ExtractedStatusStrip copy={copy} />
      <SovereignPositioningSection copy={copy} />
      <ProductLadderSection copy={copy} />
      <EcosystemSection copy={copy} />
      <DestinationSection />
      <DesignStudioSection />
      <FilmStudioSection />
      <SignatureExperiencesSection />
      <WhyAiSection background={whyAi?.image} />
      <ConsultationSection copy={copy} />
      <FooterSection copy={copy} />
    </div>
  );
}

function LayoutOptionsPanel({
  layoutId,
  onLayoutChange
}: {
  layoutId: LandingLayoutId;
  onLayoutChange: (layout: LandingLayoutId) => void;
}) {
  return (
    <div className="tlps-layout-options mt-8 rounded-md border border-[#d8a84a]/24 bg-black/30 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="tlps-accent-text text-[11px] font-bold uppercase tracking-[0.18em] text-[#d8a84a]">Layout Options</p>
          <p className="mt-1 text-xs text-white/58">Preview how the landing page can present the same honest runtime data.</p>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {landingLayouts.map((layout) => (
          <button
            key={layout.id}
            type="button"
            aria-pressed={layoutId === layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`tlps-layout-option-card rounded-md border p-3 text-left transition ${
              layoutId === layout.id
                ? "is-active border-[#d8a84a]/65 bg-[#d8a84a]/14"
                : "border-white/12 bg-white/[0.035] hover:border-[#d8a84a]/35 hover:bg-white/[0.055]"
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white">{layout.shortLabel}</span>
              <StatusBadge status={layout.status} />
            </span>
            <span className="mt-2 block text-[11px] leading-5 text-white/58">{layout.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HeroLayoutPreview({ layout }: { layout: (typeof landingLayouts)[number] }) {
  if (layout.id === "command") {
    return (
      <div className="tlps-hero-preview w-[360px] rounded-md border border-[#d8a84a]/28 bg-black/42 p-4 backdrop-blur">
        <p className="tlps-accent-text text-xs font-bold uppercase tracking-[0.16em] text-[#d8a84a]">Command Preview</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["92", "Readiness"],
            ["₹1.28Cr", "Budget"],
            ["18", "Open Issues"],
            ["245", "Vendors"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
              <p className="text-2xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/52">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-emerald-300/18 bg-emerald-300/[0.08] p-3 text-xs leading-5 text-emerald-100">
          Local preview command posture only. Live tracking integrations remain blocked without provider evidence.
        </div>
      </div>
    );
  }

  if (layout.id === "board-gallery") {
    return (
      <div className="tlps-hero-preview w-[380px] rounded-md border border-[#d8a84a]/28 bg-black/42 p-4 backdrop-blur">
        <p className="tlps-accent-text text-xs font-bold uppercase tracking-[0.16em] text-[#d8a84a]">Board Gallery Preview</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {page.designStudio.cards.slice(0, 4).map((card) => {
            const asset = getTlpsHomepageAsset(card.assetId);
            return (
              <div key={card.label} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.045]">
                <img src={cinematicImage(asset?.image ?? page.fullPageImage, "desktop-16x9")} alt="" className="h-24 w-full object-cover" />
                <p className="px-2 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white/72">{card.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[#d8a84a]/45 bg-black/42 p-3 backdrop-blur">
      {page.floatingActions.map((action, index) => {
        const Icon = actionIcons[index] ?? Sparkles;
        return (
          <a key={action} href="#contact" className="flex w-24 flex-col items-center gap-2 border-b border-[#d8a84a]/18 py-3 text-[11px] font-semibold text-[#f3cc7a] last:border-b-0">
            <Icon aria-hidden className="h-5 w-5" />
            {action}
          </a>
        );
      })}
    </div>
  );
}

function ThemeLanguageControls({
  themeId,
  languageId,
  onThemeChange,
  onLanguageChange
}: {
  themeId: LandingThemeId;
  languageId: LandingLanguageId;
  onThemeChange: (theme: LandingThemeId) => void;
  onLanguageChange: (language: LandingLanguageId) => void;
}) {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <div className="tlps-control-panel flex items-center gap-1 rounded-full border border-white/14 bg-black/28 p-1 backdrop-blur">
        <Palette aria-hidden className="ml-2 h-4 w-4 text-[#f3cc7a]" />
        {landingThemes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            title={`${theme.label}: ${theme.tone}`}
            aria-pressed={themeId === theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`tlps-control-button rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition ${
              themeId === theme.id ? "is-active text-[#100b05]" : "text-white/66 hover:text-white"
            }`}
          >
            {theme.label}
          </button>
        ))}
      </div>
      <div className="tlps-control-panel flex items-center gap-1 rounded-full border border-white/14 bg-black/28 p-1 backdrop-blur">
        <Languages aria-hidden className="ml-2 h-4 w-4 text-[#f3cc7a]" />
        {Object.entries(landingLanguageCopy).map(([id, language]) => (
          <button
            key={id}
            type="button"
            aria-label={`Switch language to ${language.label}`}
            aria-pressed={languageId === id}
            onClick={() => onLanguageChange(id as LandingLanguageId)}
            className={`tlps-control-button rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] transition ${
              languageId === id ? "is-active text-[#100b05]" : "text-white/66 hover:text-white"
            }`}
          >
            {language.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function ExtractedStatusStrip({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <section className="border-y border-[#d8a84a]/18 bg-[#090806] px-5 py-4 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={page.status} />
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100">
            {releaseStatus.verdict}
          </span>
          <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-100">
            PRODUCTION_READY=false
          </span>
        </div>
        <p className="text-xs leading-5 text-white/58">
          {copy.statusNote}
        </p>
      </div>
    </section>
  );
}

function SovereignPositioningSection({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <section id="sovereign-intelligence" className="border-b border-[#d8a84a]/18 bg-[#050504] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-md border border-[#d8a84a]/24 bg-[radial-gradient(circle_at_top_left,rgba(216,168,74,0.16),transparent_36%),rgba(255,255,255,0.04)] p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="PARTIAL" />
              <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-rose-100">
                Managed-service preview
              </span>
            </div>
            <p className="tlps-accent-text mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#d8a84a]">{copy.valueEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-white">
              {copy.valueHeadline}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              {copy.valueBody}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {buyerValues.map((value) => (
                <div key={value} className="rounded-md border border-[#d8a84a]/18 bg-black/26 px-4 py-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#f3cc7a]">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-md border border-[#d8a84a]/18 bg-black/24 p-4 text-sm leading-6 text-white/68">
              {copy.vediFinderNote}
            </p>
          </article>

          <div className="grid gap-3 md:grid-cols-2">
            {sovereignPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="rounded-md border border-[#d8a84a]/18 bg-white/[0.035] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[#d8a84a]/25 bg-black/30 text-[#e2b457]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <StatusBadge status={pillar.status} />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/58">{pillar.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pillar.items.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-black/28 px-3 py-1 text-[11px] font-semibold text-white/70">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductLadderSection({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <section id="product-ladder" className="border-b border-[#d8a84a]/18 bg-[#080705] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTop title="Product Ladder" subtitle={copy.productSubtitle} cta="Open Pricing" />
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {productLadder.map((tier) => (
            <article key={tier.tier} className="flex min-h-[420px] flex-col rounded-md border border-[#d8a84a]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d8a84a]">{tier.tier}</p>
                  <p className="mt-2 font-serif text-3xl text-white">{tier.price}</p>
                </div>
                <StatusBadge status={tier.status} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#f3cc7a]">{tier.offer}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{tier.customer}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {tier.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-5 text-white/70">
                    <BadgeCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#d8a84a]" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="mt-5 inline-flex justify-center rounded-md border border-[#d8a84a]/35 bg-black/24 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
                View Tier
              </a>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-md border border-rose-300/18 bg-rose-300/[0.055] p-4 text-sm leading-6 text-white/65">
          Live payments, live marketplace commerce, live vendor networks, certified structural/electrical/fire validation, native DWG, and production DXF remain BLOCKED until real provider, engineering, authority, and file-roundtrip evidence exists.
        </div>
      </div>
    </section>
  );
}

function EcosystemSection({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <section id="services" className="border-b border-[#d8a84a]/18 bg-[#080705] px-5 py-8 lg:px-8">
      <SectionHeading eyebrow="The Complete Wedding Ecosystem" title={copy.ecosystemTitle} center />
      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12">
        {page.ecosystemModules.map((module, index) => {
          const Icon = ecosystemIcons[index] ?? Sparkles;
          return (
            <a key={module} href={`#${slug(module)}`} className="group rounded-md border border-[#d8a84a]/18 bg-white/[0.04] p-3 text-center transition hover:border-[#d8a84a]/55 hover:bg-[#d8a84a]/10">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-md border border-[#d8a84a]/22 bg-black/25 text-[#e2b457]">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <span className="mt-3 block text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-white/82">{module}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function DestinationSection() {
  return (
    <section id="destinations" className="border-b border-[#d8a84a]/18 bg-[#050504] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTop title="Destination Weddings" subtitle="Exotic locations. Unforgettable celebrations." cta="View All Destinations" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {page.destinations.map((destination) => {
            const asset = getTlpsHomepageAsset(destination.assetId);
            return (
              <a key={destination.label} href="/venues" className="group overflow-hidden rounded-md border border-[#d8a84a]/22 bg-white/[0.035]">
                <div className="relative h-44 overflow-hidden">
                  <img src={cinematicImage(asset?.image, "square-1x1")} alt={destination.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-white">{destination.label}</p>
                    <p className="mt-1 text-[11px] text-white/74">{destination.subtitle}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DesignStudioSection() {
  return (
    <section id="design-studio" className="border-b border-[#d8a84a]/18 bg-[#080705] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTop title="Wedding Design Studio" subtitle="Plan. Visualize. Perfect." cta="Explore Design Studio" />
        <div className="mt-5 grid gap-5 lg:grid-cols-[240px_1fr]">
          <div className="grid content-start gap-2">
            {page.designStudio.tools.map((tool, index) => {
              const Icon = toolIcons[index] ?? Sparkles;
              return (
                <a key={tool} href="/cad/editor" className="flex items-center gap-3 rounded-md border border-[#d8a84a]/14 bg-black/28 px-3 py-2 text-sm font-semibold text-white/82">
                  <Icon aria-hidden className="h-4 w-4 text-[#e2b457]" />
                  {tool}
                </a>
              );
            })}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {page.designStudio.cards.map((card) => {
              const asset = getTlpsHomepageAsset(card.assetId);
              return <ImageCard key={card.label} label={card.label} image={asset?.image} href="/cad/editor" />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilmStudioSection() {
  return (
    <section id="wedding-films" className="border-b border-[#d8a84a]/18 bg-[#050504] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTop title="Wedding Filmy Studio" subtitle="Cinematic emotions. Timeless memories." cta="View Film Gallery" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
          {page.filmStudio.map((film) => {
            const asset = getTlpsHomepageAsset(film.assetId);
            return <ImageCard key={film.label} label={film.label} image={asset?.image} href="/gallery" compact />;
          })}
        </div>
      </div>
    </section>
  );
}

function SignatureExperiencesSection() {
  return (
    <section id="experiences" className="border-b border-[#d8a84a]/18 bg-[#080705] px-5 py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTop title="Signature Experiences" subtitle="Every moment, beautifully curated." cta="Explore All Experiences" />
        <div className="mt-8 grid gap-5 md:grid-cols-7">
          {page.signatureExperiences.map((experience, index) => (
            <div key={experience} className="relative text-center">
              {index < page.signatureExperiences.length - 1 && <span className="absolute left-1/2 top-7 hidden h-px w-full bg-[#d8a84a]/50 md:block" />}
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d8a84a]/55 bg-[#080705] text-[#e2b457]">
                <Crown aria-hidden className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-[#f3cc7a]">{experience}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {page.stats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-[#d8a84a]/16 bg-white/[0.035] p-4">
              <p className="font-serif text-3xl text-[#d8a84a]">{stat.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase leading-4 tracking-[0.08em] text-white/76">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyAiSection({ background }: { background?: string }) {
  return (
    <section id="about-us" className="border-b border-[#d8a84a]/18 bg-[#050504] px-5 py-9 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.72fr_1fr_1fr]">
        <div className="min-h-72 overflow-hidden rounded-md border border-[#d8a84a]/18 bg-black/25">
          <img src={cinematicImage(background ?? page.fullPageImage, "board-4x3")} alt="" className="h-full w-full object-cover" />
        </div>
        <article className="rounded-md border border-[#d8a84a]/18 bg-white/[0.04] p-5">
          <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[#f3cc7a]">Why Choose TLPS Wedding OS?</h2>
          <ul className="mt-5 space-y-3">
            {page.whyChoose.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/78">
                <BadgeCheck aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#d8a84a]" />
                {item}
              </li>
            ))}
          </ul>
          <a href="/about" className="mt-6 inline-flex rounded-md bg-[#d8a84a] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#150f06]">
            Discover the TLPS Advantage
          </a>
        </article>
        <article className="rounded-md border border-[#d8a84a]/18 bg-[radial-gradient(circle_at_76%_48%,rgba(216,168,74,0.22),transparent_32%),rgba(255,255,255,0.04)] p-5">
          <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[#f3cc7a]">AI Wedding Co-Pilot</h2>
          <p className="mt-2 text-sm text-white/66">Smart suggestions. Perfect decisions.</p>
          <ul className="mt-5 space-y-3">
            {page.aiCoPilot.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/78">
                <Sparkles aria-hidden className="h-4 w-4 text-[#d8a84a]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid place-items-center rounded-md border border-[#d8a84a]/22 bg-black/24 p-8">
            <span className="grid h-24 w-24 place-items-center rounded-full border border-[#d8a84a]/60 text-2xl font-bold text-[#f3cc7a] shadow-[0_0_50px_rgba(216,168,74,0.22)]">AI</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function ConsultationSection({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <section id="consultation" className="bg-[#070506] px-5 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-md border border-[#d8a84a]/30 bg-[linear-gradient(90deg,rgba(70,20,45,0.34),rgba(216,168,74,0.08),rgba(17,8,20,0.6))] p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <h2 className="tlps-accent-text font-serif text-3xl uppercase text-[#e3b259]">{copy.ctaHeadline}</h2>
            <p className="mt-2 text-sm text-white/72">{copy.ctaSubcopy}</p>
          </div>
          <div>
            <div className="grid gap-2 sm:grid-cols-3">
              {page.cta.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-[#d8a84a]/24 bg-black/18 px-3 py-3 text-center text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-[#f3cc7a]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {copy.ctaActions.map((action, index) => (
                <a key={action} href="/contact" className={index === 0 ? "tlps-primary-button rounded-md bg-[#d8a84a] px-12 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#150f06]" : "rounded-md border border-white/30 bg-black/20 px-12 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"}>
                  {action}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ copy }: { copy: LandingLanguageCopy }) {
  return (
    <footer id="contact" className="border-t border-[#d8a84a]/16 bg-[#050504] px-5 py-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <p className="tlps-accent-text font-serif text-4xl text-[#d8a84a]">TLPS</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Wedding OS</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/58">{copy.footerDescription}</p>
        </div>
        <FooterList title="Quick Links" items={page.footer.links} />
        <FooterList title="Our Services" items={page.footer.services} />
        <FooterList title="Resources" items={page.footer.resources} />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3cc7a]">Get In Touch</h3>
          <div className="mt-4 space-y-3 text-sm text-white/68">
            {page.footer.contact.map((item) => (
              <p key={item} className="flex items-start gap-2">
                <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-[#d8a84a]" />
                {item}
              </p>
            ))}
          </div>
          <a href="/contact" className="tlps-primary-button mt-5 inline-flex rounded-md bg-[#d8a84a] px-10 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#150f06]">Enquire Now</a>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/42">
        <span>© 2024 TLPS Wedding OS. Extracted local preview.</span>
        <span>{blockedCapabilities.length} production capabilities remain explicitly blocked.</span>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, center }: { eyebrow: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : ""}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a84a]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl text-white">{title}</h2>
    </div>
  );
}

function SectionTop({ title, subtitle, cta }: { title: string; subtitle: string; cta: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-3xl uppercase tracking-[0.06em] text-[#f3cc7a]">{title}</h2>
        <p className="mt-1 text-sm text-white/58">{subtitle}</p>
      </div>
      <a href="/features" className="rounded-md border border-[#d8a84a]/35 bg-black/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white">
        {cta}
      </a>
    </div>
  );
}

function ImageCard({ label, image, href, compact }: { label: string; image?: string; href: string; compact?: boolean }) {
  return (
    <a href={href} className="group overflow-hidden rounded-md border border-[#d8a84a]/20 bg-white/[0.035]">
      <div className={compact ? "relative h-40" : "relative h-44"}>
        <img src={cinematicImage(image ?? page.fullPageImage, compact ? "portrait-4x5" : "desktop-16x9")} alt={label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <p className="absolute bottom-3 left-3 right-3 text-center text-xs font-bold uppercase leading-4 tracking-[0.08em] text-white">{label}</p>
      </div>
    </a>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#f3cc7a]">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-white/58">
        {items.map((item) => (
          <li key={item}>
            <a href="/wedding-os" className="hover:text-[#f3cc7a]">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function cinematicImage(source: string | undefined, aspectId: CinematicAspectId) {
  return getCinematicImageForSource(source ?? page.fullPageImage, aspectId);
}
