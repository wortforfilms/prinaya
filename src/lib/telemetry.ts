/**
 * Local preview telemetry.
 *
 * Records interaction events to in-memory + localStorage ONLY. Nothing is
 * transmitted anywhere — there is no analytics endpoint, no network call, and no
 * third-party SDK. This is a controlled-preview instrument so the local session
 * can inspect what was clicked; it is not production analytics.
 */
export type PreviewEvent = { name: string; meta?: Record<string, unknown>; at: string };

const STORAGE_KEY = "tlps-preview-events";
const MAX_EVENTS = 100;

type PreviewWindow = Window & { __tlpsPreviewEvents?: PreviewEvent[] };

export function recordPreviewEvent(name: string, meta?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const event: PreviewEvent = { name, meta, at: new Date().toISOString() };
  const w = window as PreviewWindow;
  w.__tlpsPreviewEvents = w.__tlpsPreviewEvents ?? [];
  w.__tlpsPreviewEvents.push(event);
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as PreviewEvent[];
    stored.push(event);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(-MAX_EVENTS)));
  } catch {
    // localStorage unavailable — keep the in-memory copy only.
  }
}

export function getPreviewEvents(): PreviewEvent[] {
  if (typeof window === "undefined") return [];
  return (window as PreviewWindow).__tlpsPreviewEvents ?? [];
}
