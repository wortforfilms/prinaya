// Electron main process — wraps the TLPS Wedding OS (Next.js) app in a desktop shell.
// CommonJS (.cjs) so it runs regardless of package.json "type": "module".
const { app, BrowserWindow, shell } = require("electron");

// In dev/start this points at the local Next server. Override with ELECTRON_START_URL.
const START_URL = process.env.ELECTRON_START_URL || "http://localhost:3000";

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#020908",
    title: "TLPS Wedding OS",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadURL(START_URL);

  // Open external (non-localhost) links in the OS browser rather than new app windows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(START_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  if (process.env.ELECTRON_DEVTOOLS) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
