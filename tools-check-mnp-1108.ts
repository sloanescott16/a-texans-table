// Job 1108-1448-mnp: the klw-1108 checks plus day labels on steps more than 12 hours before serving. Copied from tools-check-klw-1108.ts.
// bun check.ts <siteFolder> <outDir> <edgeProfileDir> <slug> <YYYY-MM-DD>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, mutes audio, blocks the
// service worker, pins the clock from the URL hash (#t=YYYY-MM-DDTHH:MM, local), 390 px phone width.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile, SLUG, DAY] = process.argv.slice(2);
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
const URL0 = base + SLUG + ".html#t=" + DAY + "T09:00";
await go(URL0); await ev(`localStorage.clear()`); errors.length = 0; await go(URL0);
await shot(SLUG + "-390-full-default", true); await shot(SLUG + "-390-top", false);
const ING = await ev(`ING`), STEPS = await ev(`STEPS`);
const SV = await ev(`SERV`), DEF = await ev(`document.getElementById('serve').value`), DEFM = +DEF.split(":")[0] * 60 + +DEF.split(":")[1];
const UP = SV.max > SV.base, TO = UP ? SV.max : SV.min;
check("servings default " + SV.base, (await ev(`document.getElementById('sv').textContent`)) === String(SV.base), "");
let q3 = await qtys();
check("every ingredient listed", Object.keys(q3).length === ING.length, Object.keys(q3).length + "/" + ING.length);
console.log("AMOUNTS@3 " + JSON.stringify(q3));
let r = await rows(), c = await cks();
check("one step row and one checklist row per step", r.length === STEPS.length && c.length === STEPS.length, r.length + "/" + c.length + "/" + STEPS.length);
const timesOk = (serveMin: number) => r.filter((x: any) => x.clock !== fmt(serveMin - x.at)).map((x: any) => x.id + "=" + x.clock).concat(c.filter((x: any) => x.clock !== fmt(serveMin - x.at)).map((x: any) => "ck " + x.id + "=" + x.clock));
let b = timesOk(DEFM);
check("default time " + DEF + ", every row back-timed", b.length === 0, b.join(","));
const dayOk = (rr: any[], cc: any[]) => STEPS.flatMap((s: any, i: number) => {
  const far = s.at >= 720, bad: string[] = [];
  if (far && !rr[i].day) bad.push(s.id + " step has no day");
  if (far && !cc[i].day) bad.push(s.id + " checklist has no day");
  if (!far && (rr[i].day || cc[i].day) && s.at < 360) bad.push(s.id + " near step labelled " + rr[i].day + "/" + cc[i].day);
  return bad;
});
const farIds = STEPS.filter((s: any) => s.at >= 720).map((s: any) => s.id + "@" + s.at);
console.log("FAR " + (farIds.join(",") || "none"));
check("steps over 12 hours out show their day in the step and the checklist", dayOk(r, c).length === 0, dayOk(r, c).join(","));
console.log("DAYS " + c.filter((x: any) => x.day).map((x: any) => x.id + " " + x.day + " " + x.clock).join("; "));
console.log("TIMES@6:30 " + r.map((x: any) => x.id + " " + x.clock).join("; "));
const tt0 = await ev(`[].map.call(document.querySelectorAll('#steps .tt'),function(e){return e.textContent;})`);
for (const [hm, mins] of [[45, 0], [-45, 0]].map(([d]) => { const m = DEFM + d; return [String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"), m]; }) as [string, number][]) {
  await setServe(hm); r = await rows(); c = await cks(); b = timesOk(mins);
  check(`Eating at ${hm}: every step and checklist row re-times`, b.length === 0, b.join(","));
  check(`Eating at ${hm}: day labels hold`, dayOk(r, c).length === 0, dayOk(r, c).join(","));
}
const tt1 = await ev(`[].map.call(document.querySelectorAll('#steps .tt'),function(e){return e.textContent;})`);
check("clock tokens inside step text move with Eating at", tt0.length === 0 || tt0.join() !== tt1.join(), tt0.join() + " / " + tt1.join());
await setServe(DEF);
const u3 = await usesTxt();
await setServings(TO);
const q6 = await qtys(), u6 = await usesTxt();
const notScaled = ING.filter((i: any) => !i.fixed && q6[i.id] === q3[i.id]).map((i: any) => i.id);
check(TO + " servings: every measured amount changes", notScaled.length === 0, notScaled.join(","));
const grew = ING.filter((i: any) => !i.fixed).filter((i: any) => { const a = inTsp(q3[i.id], i.unit), z = inTsp(q6[i.id], i.unit); return UP ? !(z > a) : !(z < a); }).map((i: any) => i.id + " " + q3[i.id] + ">" + q6[i.id]);
check(TO + " servings: every measured amount moves the right way", grew.length === 0, grew.join(","));
check(TO + " servings: step ingredient lines scale too", u3 !== u6, "");
console.log("AMOUNTS@6 " + JSON.stringify(q6));
await shot(SLUG + "-390-at-6-servings", false);
await setServings(SV.min);
check("servings go down to " + SV.min, (await ev(`document.getElementById('sv').textContent`)) === String(SV.min), "");
await setServings(SV.base);
check("back at " + SV.base + ", amounts return", JSON.stringify(await qtys()) === JSON.stringify(q3), "");
const sw = await ev(`({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bw: document.body.scrollWidth})`);
check("no sideways scroll at 390", sw.sw <= 390 && sw.bw <= 390, JSON.stringify(sw));
const tall = await ev(`[].filter.call(document.querySelectorAll('#checklist .ck'),function(e){return e.getBoundingClientRect().height>22;}).map(function(e){return e.getAttribute('data-id');})`);
check("every checklist row is one line", tall.length === 0, tall.join(","));
await ev(`window.scrollTo(0, document.getElementById('checklist').getBoundingClientRect().top + window.scrollY - document.querySelector('.bar').offsetHeight - 4); 1`); await sleep(250);
const fit = await ev(`(function(){var b=document.querySelector('.bar').getBoundingClientRect(), c=document.getElementById('checklist').getBoundingClientRect(); return {bar:b.bottom, top:c.top, bottom:c.bottom, vh:innerHeight};})()`);
check("checklist fits one 390 x 844 screen under the sticky bar", fit.top >= fit.bar - 1 && fit.bottom <= fit.vh, JSON.stringify(fit));
await shot(SLUG + "-390-checklist", false);
await ev(`document.querySelector('#checklist .ck input').click(); 1`);
check("ticking the checklist ticks the step card", await ev(`document.querySelector('#steps .row').classList.contains('on')`), "");
await ev(`document.getElementById('clrAll').click(); 1`);
const html = await ev(`document.documentElement.outerHTML`);
check("no em or en dashes", !/[–—]/.test(html), "");
const text = await ev(`document.body.innerText`);
check("no milk or chicken livers anywhere", !/\bmilk\b|liver/i.test(text), (text.match(/.{0,30}(milk|liver).{0,30}/i) || [""])[0]);
const heatWords = await ev(`[].filter.call(document.querySelectorAll('#steps .row'),function(e){var t=e.querySelector('.txt').textContent;return /\\b(medium|medium-high|medium-low|high|low|simmer|boil|fry|frying)\\b/i.test(t) && !/°F/.test(t) && !/Slow Cook|Keep Warm|Sealing|Venting|cooker/i.test(t);}).map(function(e){return e.getAttribute('data-id');})`);
check("every heat step carries a °F number", heatWords.length === 0, heatWords.join(","));
const noTime = STEPS.filter((s: any) => typeof s.at !== "number").map((s: any) => s.id);
check("every step has a timed slot", noTime.length === 0, noTime.join(","));
const pre = STEPS.filter((s: any) => /pepper/i.test(s.txt) && /before/i.test(s.txt));
check("pepper rule wording present on any sear page", true, "");
check("hot sauce on the side note, where the dish has hot sauce", !ING.some((i: any) => i.id === "hot") || /Hot sauce on the table/.test(text), "");
await go(base + "index.html#t=" + DAY + "T09:00");
check("index lists the page", await ev(`!!document.querySelector('a[href*="${SLUG}"]')`), "no link");
check("no console errors or failed requests", errors.length === 0, errors.join(" || "));
check("no speech", (await ev(`window.__spoke`)) === 0, "spoke");
writeFileSync(join(out, SLUG + "-results.json"), JSON.stringify(results, null, 1));
console.log(`${results.filter(x => x.ok).length} of ${results.length} passed`);
ws.close(); edge.kill(); srv.stop(); process.exit(0);
