# Electron desktop wrapper

Runs the TLPS Wedding OS (Next.js) app in a desktop window.

- `electron/main.cjs` — main process; opens a 1600×1000 `BrowserWindow` and loads
  the Next server (default `http://localhost:3000`, override with
  `ELECTRON_START_URL`). External links open in the OS browser; secure defaults
  (`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`).
- `package.json` → `"main": "electron/main.cjs"`.

## Run (on your machine)

```bash
npm install                 # pulls electron, concurrently, wait-on

# one command — starts Next dev + waits for it + launches the desktop window:
npm run electron:dev

# production desktop window (after a build):
npm run build && npm run electron:start

# attach to an already-running server:
npm run dev          # in one terminal
npm run electron     # in another (loads http://localhost:3000)
```

Set `ELECTRON_DEVTOOLS=1` to open detached DevTools.

Notes:
- This wraps the live Next app, so it's a thin desktop shell, not a self-contained
  bundle. To ship a distributable `.app`/`.dmg`, add `electron-builder` and a
  Next standalone build — out of scope for this preview.
- The CAD Studio (`public/cad-studio.html`) is fully self-contained (three.js
  vendored, no CDNs), so it also runs offline inside the window.
- Release gate unchanged: CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false.
