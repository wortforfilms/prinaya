import type { Metadata } from "next";
import { WeddingOsNav } from "@/components/landing/WeddingOsNav";
import { releaseStatus } from "@/lib/status";

export const metadata: Metadata = {
  title: "Themes — TLPS Wedding OS",
  description: "Every design theme, style language, and signature stage in one gallery."
};

type Card = { title: string; sub: string; img: string; badge?: string };

const templates: Card[] = [
  { title: "Hemant Samwat Wedding", sub: "Vedic lotus · royal heritage", img: "/generated/royal-heritage-mandap.png", badge: "8 objects · 6 assets" },
  { title: "Vedic Lotus", sub: "Lotus motifs, ivory & gold", img: "/extracted-boards/vedic-lotus-all-pages-board.png", badge: "6 objects · 5 assets" },
  { title: "Royal Palace", sub: "Rajasthani heritage grandeur", img: "/extracted-boards/traditional-royal-cad-presentation.png", badge: "6 objects · 5 assets" },
  { title: "Temple Mandap", sub: "Nagara temple-inspired", img: "/generated/spark/stages/option-7-temple-inspired.png", badge: "5 objects · 5 assets" },
  { title: "Sci-Fi Galactic Portal", sub: "Contemporary neon futurism", img: "/extracted-boards/sci-fi-futuristic-options.png", badge: "6 objects · 5 assets" },
  { title: "Garden Mandap", sub: "Celestial garden, natural", img: "/generated/spark/stages/option-1-celestial-garden.png", badge: "5 objects · 5 assets" },
  { title: "Navagraha", sub: "Nine-planet sacred grid", img: "/extracted-boards/vedic-sacred-design-options.png", badge: "6 objects · 5 assets" },
  { title: "Panch Tatva", sub: "Five-element traditional", img: "/extracted-boards/vedic-sacred-traditional-options.png", badge: "6 objects · 5 assets" }
];

const languages: Card[] = [
  { title: "Royal Heritage", sub: "Palatial, opulent, gold", img: "/extracted-boards/traditional-royal-cad-presentation.png" },
  { title: "Vedic Sacred", sub: "Ritual-true, timeless", img: "/extracted-boards/vedic-sacred-traditional-options.png" },
  { title: "Lotus & Pastel", sub: "Soft, romantic, ivory", img: "/extracted-boards/vedic-lotus-all-pages-board.png" },
  { title: "Contemporary", sub: "Modern, dramatic lighting", img: "/extracted-boards/sci-fi-futuristic-options.png" },
  { title: "Garden & Natural", sub: "Foliage, fresh, airy", img: "/extracted-boards/general-design-options.png" },
  { title: "Bespoke Signature", sub: "Bespoke, one-of-a-kind", img: "/extracted-boards/unique-design-options.png" }
];

const stages: Card[] = [
  ["Celestial Garden", "option-1-celestial-garden.png"], ["Royal Rajasthani", "option-2-royal-rajasthani-courtyard.png"],
  ["Mystic Forest", "option-3-mystic-forest.png"], ["Minimal Monochrome", "option-4-minimal-monochrome.png"],
  ["Moroccan Nights", "option-5-moroccan-nights.png"], ["Floating Floral", "option-6-floating-floral-cloud.png"],
  ["Temple Inspired", "option-7-temple-inspired.png"], ["Contemporary Curves", "option-8-contemporary-curves.png"],
  ["Beach Front Bliss", "option-9-beach-front-bliss.png"]
].map(([title, file]) => ({ title, sub: "Signature stage", img: `/generated/spark/stages/${file}` }));

function ThemeCard({ card }: { card: Card }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d9aa46]/25 bg-white/[0.03]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.img} alt={card.title} loading="lazy" className="h-48 w-full border-b border-[#d9aa46]/20 object-cover" />
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-[#f8d78b]">{card.title}</h3>
        <p className="mt-1 text-sm text-white/65">{card.sub}</p>
        {card.badge && (
          <span className="mt-2 inline-block rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
            {card.badge} · READY
          </span>
        )}
      </div>
    </div>
  );
}

function Section({ title, sub, cards }: { title: string; sub: string; cards: Card[] }) {
  return (
    <section className="mx-auto mt-14 max-w-7xl px-6">
      <h2 className="border-b border-[#d9aa46]/20 pb-3 font-serif text-2xl font-semibold text-[#f8d78b]">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{sub}</p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <ThemeCard key={`${title}-${c.title}`} card={c} />
        ))}
      </div>
    </section>
  );
}

export default function ThemesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#020908] pb-24 text-[#fff6df]">
      <WeddingOsNav />
      <header className="mx-auto max-w-7xl px-6 pt-12">
        <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
          {releaseStatus.verdict} · PRODUCTION_READY=false
        </span>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-[#f8d78b] sm:text-5xl">Themes Gallery</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
          Every design theme, style language, and signature stage in one view. CAD templates load real scene data; imagery is controlled-preview reference, not production-certified media.
        </p>
      </header>

      <Section title="CAD Theme Templates" sub="Eight presets that load a full scene into the CAD editor — objects, budget, asset list, board package — and export to .hkd / JSON / PDF." cards={templates} />
      <Section title="Design Languages" sub="Six aesthetics we design in — traditional to avant-garde. Any style, beautifully executed." cards={languages} />
      <Section title="Bespoke Signature Stages" sub="Nine signature stage concepts — an evening that feels like a dream." cards={stages} />
    </main>
  );
}
