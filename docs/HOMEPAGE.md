# Wedding OS Homepage

KBS-powered command surface at `/` (`WeddingOsHomepage`). Release gate preserved:
CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false.

## Structure

- `src/app/page.tsx` → `WeddingOsHomepage` (server component; reads live KBS via
  `buildHomepageSurface`).
- `src/lib/homepage-content.ts` — static content (nav groups, hero/conversion CTAs,
  experience cards, studio tools, vedi chips, section anchors). Extracted so every
  CTA href and image path is unit-testable.
- `src/components/landing/WeddingOsNav.tsx` — sticky nav with desktop dropdowns
  (hover + click, outside-click + Escape close) and a mobile hamburger menu.
- `src/components/landing/HomeAnchorRail.tsx` — sticky in-page anchor rail with
  IntersectionObserver scroll-spy active-section highlighting.
- `src/components/landing/CtaLink.tsx` + `src/lib/telemetry.ts` — CTA clicks record
  **local-only** preview events (in-memory + localStorage). Nothing is transmitted;
  there is no analytics endpoint or third-party SDK.

## SPRINT-HOME-02 polish

1. Mobile nav — hamburger toggle, accordion groups, closes on navigation/Escape.
2. Dropdowns — hover-open on desktop, click-toggle, outside-click + Escape close,
   chevron rotation.
3. Active section anchors — `id`s on each section + scroll-spy rail.
4. CTA telemetry — `recordPreviewEvent` on every CTA (local preview only).
5. Smoke test — `tests/homepage.test.ts` validates the command surface builds.
6. No-broken-image — unit test asserts every referenced public asset exists on disk;
   e2e asserts no `naturalWidth === 0` images at runtime.
7. No-horizontal-overflow — `e2e/homepage.spec.ts` checks `scrollWidth <= clientWidth`
   at desktop (1440) and mobile (390); the page root uses `overflow-x-hidden`.
8. **next/image** — card and film images use `next/image` with `fill` + `sizes`
   inside fixed-aspect containers. **The hero is intentionally a CSS background**
   image (full-bleed with a gradient overlay), where `next/image` does not apply;
   that single decorative raster stays a CSS `background-image`.
9. CTA routes — all hrefs verified against the route matrix + standalone runtime
   routes (`/cad/editor`, `/hemant-samwat-vedi`) in `tests/homepage.test.ts`.
10. Blocked messaging — visible in the hero strip and the conversion footer, and
    asserted by the e2e spec.

## Running the checks

```bash
npm run typecheck
npm test                       # unit: smoke, broken-image (fs), CTA routes, telemetry
npm run build                  # production build
npx playwright test            # e2e: overflow, broken images, blocker text, mobile nav
                               #   (needs `npm run dev` or `npm run start` running)
```
