# End-to-end tests + video recording

Playwright drives the running app and **records a video of every test run**.

## Config (`playwright.config.ts`)

- `use.video: "on"` — a `.webm` is captured for every test → `./test-results/<test>/video.webm`.
- `use.screenshot: "only-on-failure"`, `use.trace: "on-first-retry"`.
- `reporter`: list + HTML report (`./playwright-report`).
- `webServer`: auto-starts `npm run dev` and waits for `http://127.0.0.1:3000`
  (reused if a server is already running), so the suite is self-contained.

Both `test-results/` and `playwright-report/` are gitignored — video artifacts
are never committed.

## Specs (`e2e/`)

- `homepage.spec.ts` — no horizontal overflow (1440 + 390), no broken images,
  blocked-capability messaging visible, CTA hrefs internal, mobile nav opens/closes.
- `walkthrough.spec.ts` — a guided tour (homepage → /surfaces → /mandap →
  /hemant-samwat-vedi → /cad/studio → /cad/3d) so the recorded video captures a
  full surface tour; plus a studios-load smoke check.

## Run

```bash
npm install          # ensures playwright is present
npx playwright install chromium   # first time: download the browser
npm run test:e2e            # runs specs, records videos to ./test-results
npm run test:e2e:report     # open the HTML report (videos embedded per test)
```

Each test's video is also linked from the HTML report. To record video only on
failure instead of every run, set `use.video: "retain-on-failure"`.
