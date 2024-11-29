import { app as r, BrowserWindow as l, screen as i } from "electron";
import { createRequire as u } from "node:module";
import { fileURLToPath as w } from "node:url";
import o from "node:path";
u(import.meta.url);
const p = o.dirname(w(import.meta.url));
process.env.APP_ROOT = o.join(p, "..");
const a = process.env.VITE_DEV_SERVER_URL, _ = o.join(process.env.APP_ROOT, "dist-electron"), d = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = a ? o.join(process.env.APP_ROOT, "public") : d;
let e;
function m() {
  const s = i.getPrimaryDisplay(), { width: n } = s.workAreaSize, t = 400, c = 300;
  e = new l({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(p, "preload.mjs")
    },
    x: n - t,
    y: 0,
    width: t,
    height: c,
    alwaysOnTop: !0
  }), e.setAlwaysOnTop(!0, "screen-saver"), e.on("focus", () => {
    e.setOpacity(1), e.setIgnoreMouseEvents(!1);
  }), e.on("blur", () => {
    e.setOpacity(0.2), e.setIgnoreMouseEvents(!0, { forward: !0 });
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), a ? e.loadURL(a) : e.loadFile(o.join(d, "index.html"));
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), e = null);
});
r.on("activate", () => {
  l.getAllWindows().length === 0 && m();
});
r.whenReady().then(() => {
  m();
  let s = Date.now(), n = i.getCursorScreenPoint();
  setInterval(() => {
    const t = i.getCursorScreenPoint();
    (Math.abs(t.x - n.x) > 200 || Math.abs(t.y - n.y) > 200) && (s = Date.now(), console.log("Mouse movement detected"), n = t), Date.now() - s > 2 * 60 * 1e3 && (console.log("No input detected for 5 seconds"), e == null || e.webContents.send("mouse-inactive", !0));
  }, 1e3);
});
export {
  _ as MAIN_DIST,
  d as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};
