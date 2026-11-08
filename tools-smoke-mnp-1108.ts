// Job 1108-1448-mnp: 390 px smoke check of every page carrying the one-line-per-ingredient code. bun smoke.ts <site> <out> <profile> <YYYY-MM-DD>
// bun check.ts <siteFolder> <outDir> <edgeProfileDir> <slug> <YYYY-MM-DD>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, mutes audio, blocks the
// service worker, pins the clock from the URL hash (#t=YYYY-MM-DDTHH:MM, local), 390 px phone width.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile, DAY] = process.argv.slice(2); const SLUG = "all";
if (!folder || !out || !profile) throw new Error("usage: bun check.ts <site> <outDir> <profile>");
mkdirSync(out, { recursive: true });
const SUB = "/a-texans-table/";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 18995, DBG = 18996;
const TYPES: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = Bun.serve({ port: PORT, fetch(req) {
  const u = new URL(req.url);
  if (!u.pathname.startsWith(SUB)) return new Response("nf", { status: 404 });
  let p = decodeURIComponent(u.pathname.slice(SUB.length)); if (p === "") p = "index.html";
  const f = join(folder, p);
  if (!existsSync(f) || !statSync(f).isFile()) return new Response("nf", { status: 404 });
  return new Response(Bun.file(f), { headers: { "content-type": TYPES[extname(f)] || "application/octet-stream", "cache-control": "no-store" } });
} });
const base = `http://localhost:${PORT}${SUB}`;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const edge = spawn(EDGE, ["--headless=new", "--remote-debugging-port=" + DBG, "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--mute-audio", "--hide-scrollbars", "--window-size=390,844", "about:blank"], { stdio: "ignore" });
process.on("exit", () => { try { edge.kill(); } catch {} }); process.on("uncaughtException", (e) => { console.error(e); try { edge.kill(); } catch {} process.exit(1); });
let ver: any = null;
for (let i = 0; i < 240 && !ver; i++) { try { ver = await (await fetch(`http://localhost:${DBG}/json/version`)).json(); } catch { await sleep(250); } }
if (!ver) { edge.kill(); srv.stop(); throw new Error("Edge did not start"); }
const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let seq = 0; const waits = new Map<number, (v: any) => void>(); const events: ((m: any) => void)[] = [];
ws.onmessage = (e) => { const m = JSON.parse(String(e.data)); if (m.id && waits.has(m.id)) { waits.get(m.id)!(m); waits.delete(m.id); } else if (m.method) events.forEach(h => h(m)); };
const send = (method: string, params: any = {}, sessionId?: string) => new Promise<any>((res) => { const id = ++seq; waits.set(id, res); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const { targetId } = (await send("Target.createTarget", { url: "about:blank" })).result;
const { sessionId } = (await send("Target.attachToTarget", { targetId, flatten: true })).result;
const S = async (method: string, params: any = {}) => { const r = await send(method, params, sessionId); if (r.error) throw new Error(method + ": " + JSON.stringify(r.error)); return r.result; };
const ev = async (expr: string) => { const r = await S("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error("eval: " + expr.slice(0, 80) + " " + JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
await S("Page.enable"); await S("Runtime.enable"); await S("Log.enable"); await S("Network.enable");
await S("Page.addScriptToEvaluateOnNewDocument", { source: `
window.__spoke=0;
try{Object.defineProperty(window,'speechSynthesis',{value:{speak(){window.__spoke++},cancel(){},pause(){},resume(){},getVoices(){return []}},configurable:true});}catch(e){}
(function(){var m=/t=(\\d+)-(\\d+)-(\\d+)T(\\d+):(\\d+)/.exec(location.hash);if(!m)return;var D=Date,T=new D(+m[1],+m[2]-1,+m[3],+m[4],+m[5],0).getTime(),s=D.now();function F(){var a=[].slice.call(arguments);if(!(this instanceof F))return new D(T+(D.now()-s)).toString();return a.length?new (Function.prototype.bind.apply(D,[null].concat(a)))():new D(T+(D.now()-s));}F.prototype=D.prototype;F.now=function(){return T+(D.now()-s)};F.UTC=D.UTC;F.parse=D.parse;window.Date=F;})();
try{if(navigator.serviceWorker)Object.defineProperty(navigator.serviceWorker,'register',{value:function(){return Promise.resolve()},configurable:true});}catch(e){}
` });
await S("Network.setCacheDisabled", { cacheDisabled: true });
const errors: string[] = [];
events.push((m: any) => {
  if (m.sessionId !== sessionId) return; const p = m.params;
  if (m.method === "Runtime.exceptionThrown") errors.push("exception: " + (p.exceptionDetails.exception?.description || p.exceptionDetails.text));
  else if (m.method === "Runtime.consoleAPICalled" && (p.type === "error" || p.type === "warning")) errors.push("console." + p.type + ": " + p.args.map((a: any) => a.value || a.description).join(" "));
  else if (m.method === "Log.entryAdded" && p.entry.level === "error") errors.push("log: " + p.entry.text + " " + (p.entry.url || ""));
  else if (m.method === "Network.responseReceived" && p.response.status >= 400) errors.push("http " + p.response.status + " " + p.response.url);
});
await S("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await S("Emulation.setTouchEmulationEnabled", { enabled: true });
async function go(url: string) {
  await S("Page.navigate", { url: "about:blank" }); await sleep(300);
  let done: any; const loaded = new Promise(r => done = r);
  const h = (m: any) => { if (m.sessionId === sessionId && m.method === "Page.loadEventFired") done(); };
  events.push(h);
  await S("Page.navigate", { url });
  await Promise.race([loaded, sleep(20000)]);
  events.splice(events.indexOf(h), 1);
  await ev("document.fonts.ready.then(()=>1)"); await sleep(300);
}
async function shot(name: string, full: boolean) {
  let clip: any = undefined;
  if (full) { const m = await S("Page.getLayoutMetrics"); clip = { x: 0, y: 0, width: 390, height: Math.ceil(m.cssContentSize.height), scale: 1 }; }
  const r = await S("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, clip });
  writeFileSync(join(out, name + ".png"), Buffer.from(r.data, "base64"));
}

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail = "") => { results.push({ name, ok, detail: ok ? "" : detail }); console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  " + detail)); };
const qtys = () => ev(`(function(){var o={};document.querySelectorAll('#ing .item').forEach(function(e){o[e.getAttribute('data-id')]=e.querySelector('.qty').textContent;});return o;})()`);
const rows = () => ev(`(function(){return [].map.call(document.querySelectorAll('#steps .row'),function(r){var c=r.querySelector('.clock');return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:c.firstChild.textContent,day:(c.querySelector('.day')||{}).textContent||'',tt:[].map.call(r.querySelectorAll('.tt'),function(t){return t.textContent}),uses:[].map.call(r.querySelectorAll('.ui'),function(u){return {ing:u.getAttribute('data-ing'),t:u.textContent,q:u.querySelector('b').textContent};}),txt:r.querySelector('.txt').textContent};});})()`);
const cks = () => ev(`[].map.call(document.querySelectorAll('#checklist .ck'),function(r){return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:r.querySelector('.ct').lastChild.textContent,day:(r.querySelector('.ct .cday')||{}).textContent||''};})`);
const fmt = (min: number) => { min = ((min % 1440) + 1440) % 1440; let h = Math.floor(min / 60), m = min % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
const num = (s: string) => { s = s.trim(); let m = /^(\d+) (\d+)\/(\d+)/.exec(s); if (m) return +m[1] + +m[2] / +m[3]; m = /^(\d+)\/(\d+)/.exec(s); if (m) return +m[1] / +m[2]; m = /^(\d+(?:\.\d+)?)/.exec(s); return m ? +m[1] : NaN; };
const TSP: Record<string, number> = { tsp: 1, tbsp: 3, cup: 48, cups: 48 };
const inTsp = (s: string, fallbackUnit: string) => { const u = (/ (tsp|tbsp|cups?|lb)/.exec(s) || [, fallbackUnit])[1] as string; return num(s) * (TSP[u] || 1); };
const setServings = async (n: number) => { for (let i = 0; i < 20; i++) { const cur = +(await ev(`document.getElementById('sv').textContent`)); if (cur === n) return; const before = cur; await ev(`document.getElementById('${cur < n ? "inc" : "dec"}').click()`); if (+(await ev(`document.getElementById('sv').textContent`)) === before) return; } };
const setServe = (hm: string) => ev(`(function(){var e=document.getElementById('serve');e.value='${hm}';e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('input',{bubbles:true}));return e.value;})()`);
const usesTxt = () => ev(`[].map.call(document.querySelectorAll('#steps .ui'),function(e){return e.textContent;}).join(' | ')`);
const pages = (await import("fs")).readdirSync(folder).filter((f: string) => f.endsWith(".html") && /function mergeParts/.test((require("fs") as any).readFileSync(join(folder, f), "utf8")));
for (const pg of pages) {
  errors.length = 0;
  await go(base + pg + "#t=" + DAY + "T09:00");
  const r = await ev(`(function(){var n=[].map.call(document.querySelectorAll('#ing .item .nm'),function(e){return e.firstChild.textContent;});var names={};for(var i=0;i<ING.length;i++)names[ING[i].name]=1;var u={},d=[];n.forEach(function(x){if(u[x])d.push(x);u[x]=1;});return {lines:n.length,names:Object.keys(names).length,dups:d,sw:document.documentElement.scrollWidth,bw:document.body.scrollWidth};})()`);
  check(pg + ": one line per ingredient name", r.lines === r.names && r.dups.length === 0, JSON.stringify(r));
  check(pg + ": no sideways scroll at 390", r.sw <= 390 && r.bw <= 390, JSON.stringify(r));
  check(pg + ": no console errors", errors.length === 0, errors.join(" || "));
}
check("no speech", (await ev(`window.__spoke`)) === 0, "spoke");
console.log(`${results.filter(x => x.ok).length} of ${results.length} passed`);
ws.close(); edge.kill(); srv.stop(); process.exit(0);
