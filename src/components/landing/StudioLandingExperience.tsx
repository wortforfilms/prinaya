"use client";

import { useEffect, useState } from "react";
import { Gem } from "lucide-react";
import { TlpsWeddingOsHomepage } from "@/components/tlps/TlpsWeddingOsHomepage";
import { releaseStatus } from "@/lib/status";

type LandingStage = "splash" | "transition" | "landing";

export function StudioLandingExperience() {
  const [stage, setStage] = useState<LandingStage>("splash");

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setStage("transition"), 1500);
    const transitionTimer = window.setTimeout(() => setStage("landing"), 2800);
    return () => {
      window.clearTimeout(splashTimer);
      window.clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#020908] text-[#fff6df]">
      {stage !== "landing" && (
        <button
          type="button"
          onClick={() => setStage("landing")}
          className="fixed right-5 top-5 z-[70] rounded-md border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur transition hover:border-[#d9aa46]/55 hover:text-[#f8d78b]"
        >
          Skip
        </button>
      )}

      <SplashOverlay visible={stage === "splash"} />
      <TransitionOverlay visible={stage === "transition"} />
      <LandingPage />
    </main>
  );
}

function SplashOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[60] grid place-items-center bg-[#020908] transition duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative grid place-items-center">
        <div className="absolute h-40 w-40 animate-ping rounded-full border border-[#d9aa46]/25" />
        <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(217,170,70,0.18),transparent_66%)]" />
        <div className="relative grid h-32 w-32 place-items-center rounded-full border border-[#d9aa46]/50 bg-[#071916] shadow-[0_0_80px_rgba(217,170,70,0.3)]">
          <Gem aria-hidden className="h-14 w-14 text-[#f8d78b]" />
        </div>
        <div className="mt-8 text-center">
          <p className="font-serif text-4xl font-semibold tracking-[0.12em] text-[#f8d78b]">TLP</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Wedding CAD Studio</p>
        </div>
      </div>
    </div>
  );
}

function TransitionOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 grid place-items-center bg-[#02100e]/96 transition duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="w-full max-w-3xl px-8">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div className="h-full w-2/3 animate-[pulse_1.4s_ease-in-out_infinite] bg-[#d9aa46]" />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f8d78b]">Loading Controlled Preview</p>
            <h1 className="mt-3 font-serif text-4xl text-white">Hemant Samwat Wedding</h1>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            {releaseStatus.verdict}
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return <TlpsWeddingOsHomepage />;
}
