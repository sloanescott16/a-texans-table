// Job 1018-1447-1pa checks for pot-roast.html and mash.html, in headless Edge over DevTools. Nothing installed.
// bun tests/check-pr-1018.ts <siteFolder> <outDir> <edgeProfileDir>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, pins the clock to
// 18 Oct 2026 10:00 am local, blocks the service worker, and runs every check in the real page.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile] = process.argv.slice(2);
if (!folder || !out || !profile) throw new Error("usage: bun check-pr-1018.ts <site> <outDir> <profile>");
mkdirSync(out, { recursive: true });
const SUB = "/a-texans-table/";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 18961, DBG = 18962;
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
try{Object.defineProperty(window,'speechSynthesis',{value:{speak(){},cancel(){},pause(){},resume(){},getVoices(){return []}},configurable:true});}catch(e){}
(function(){var D=Date,T=new D(2026,9,18,10,0,0).getTime(),s=D.now();function F(){var a=[].slice.call(arguments);if(!(this instanceof F))return new D(T+(D.now()-s)).toString();return a.length?new (Function.prototype.bind.apply(D,[null].concat(a)))():new D(T+(D.now()-s));}F.prototype=D.prototype;F.now=function(){return T+(D.now()-s)};F.UTC=D.UTC;F.parse=D.parse;window.Date=F;})();
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
  let done: any; const loaded = new Promise(r => done = r);
  const h = (m: any) => { if (m.sessionId === sessionId && m.method === "Page.loadEventFired") done(); };
  events.push(h);
  await S("Page.navigate", { url });
  await Promise.race([loaded, sleep(20000)]);
  events.splice(events.indexOf(h), 1);
  await ev("document.fonts.ready.then(()=>1)"); await sleep(300);
}

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail = "") => { results.push({ name, ok, detail: ok ? "" : detail }); };

// Hand-worked expected amounts (base 3 lb; amount = base + per x lb, rounded to the step, onions rounded up).
const EXPECT: Record<string, Record<string, string>> = {
  "2": { chuck: "2 lb", onion: "1 1/2", celery: "3", garlic: "1/2", carrots: "3/4 lb", rutabaga: "3/4 lb", thyme: "4", rosemary: "1", stock: "3 cups", wine: "3/4 cup", paste: "1 1/2 tbsp", worcs: "1/2 tbsp", bay: "1", cornstarch: "2 1/2 tbsp", oil: "1 1/2 tbsp", salt: "2 tsp", saltonion: "1/8 tsp", saltgravy: "3/4 tsp", pepper: "1 tsp", potatoes: "2 lb", water: "2 quarts", saltwater: "1 1/2 tbsp", bayp: "1", butter: "5 tbsp", mgarlic: "1", mrosemary: "1", cream: "3/4 cup", resw: "3/4 cup", msalt: "3/4 tsp", msg: "3/8 tsp", parm: "3/8 cup", truffle: "3 drops" },
  "3": { chuck: "3 lb", onion: "2", celery: "5", garlic: "1", carrots: "1 lb", rutabaga: "1 lb", thyme: "6", rosemary: "2", stock: "4 cups", wine: "1 cup", paste: "2 tbsp", worcs: "1 tbsp", bay: "2", cornstarch: "3 tbsp", oil: "2 tbsp", salt: "3 tsp", saltonion: "1/4 tsp", saltgravy: "1 tsp", pepper: "1 1/2 tsp", potatoes: "3 lb", water: "3 quarts", saltwater: "2 tbsp", bayp: "1", butter: "8 tbsp", mgarlic: "2", mrosemary: "2", cream: "1 cup", resw: "1 cup", msalt: "1 tsp", msg: "1/2 tsp", parm: "1/2 cup", truffle: "3 drops" },
  "4.5": { chuck: "4 1/2 lb", onion: "3", celery: "8", garlic: "1 1/2", carrots: "1 1/2 lb", rutabaga: "1 1/2 lb", thyme: "9", rosemary: "3", stock: "5 1/2 cups", wine: "1 1/2 cups", paste: "3 tbsp", worcs: "1 1/2 tbsp", bay: "3", cornstarch: "4 tbsp", oil: "3 tbsp", salt: "4 1/2 tsp", saltonion: "3/8 tsp", saltgravy: "1 1/2 tsp", pepper: "2 1/4 tsp", potatoes: "4 1/2 lb", water: "4 1/2 quarts", saltwater: "3 tbsp", bayp: "2", butter: "12 tbsp", mgarlic: "3", mrosemary: "3", cream: "1 1/2 cups", resw: "1 1/2 cups", msalt: "1 1/2 tsp", msg: "3/4 tsp", parm: "3/4 cup", truffle: "3 drops" }
};
const SERVES: Record<string, number> = { "2": 4, "3": 6, "4.5": 9 };
const PRESS: Record<string, number> = { "2": 45, "3": 60, "4.5": 75 };
const MASH_IDS = ["potatoes", "water", "saltwater", "bayp", "butter", "mgarlic", "mrosemary", "cream", "resw", "msalt", "msg", "parm", "truffle"];

const qtys = () => ev(`(function(){var o={};document.querySelectorAll('#ing .item').forEach(function(e){o[e.getAttribute('data-id')]=e.querySelector('.qty').textContent;});return o;})()`);
// Each row: id, clock minutes of day (from the shown clock), at, d, timer present.
const rows = () => ev(`(function(){var a=[];document.querySelectorAll('#steps .row').forEach(function(r){
  var c=r.querySelector('.clock').textContent.replace('the day before,','').trim(), m=c.match(/(\\d+):(\\d+) (am|pm)/), h=+m[1]%12+(m[3]==='pm'?12:0);
  a.push({id:r.getAttribute('data-id'),min:h*60+(+m[2]),day:r.querySelector('.dayb')?-1:0,at:+r.getAttribute('data-at'),d:+r.getAttribute('data-d'),
  tmr:!!r.querySelector('.tmr button'),sear:!!r.querySelector('.sear'),txt:r.querySelector('.txt').textContent});});return a;})()`);
const hm = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
const abs = (r: any) => r.min + r.day * 1440;
async function setup(page: string, lb: number, serve: string, leave = "") {
  await go(base + page);
  await ev(`localStorage.clear(); state.serve=${JSON.stringify(serve)}; state.leave=${JSON.stringify(leave)}; showTimes(); setLb(${lb}); 1`);
}

// 1. Scaler and servings, pot roast, 2 / 3 / 4.5 lb.
for (const w of ["2", "3", "4.5"]) {
  await setup("pot-roast.html", +w, "18:00");
  const q = await qtys(), bad: string[] = [];
  for (const [k, v] of Object.entries(EXPECT[w])) if (q[k] !== v) bad.push(`${k}: got "${q[k]}" want "${v}"`);
  for (const k of Object.keys(q)) if (!(k in EXPECT[w])) bad.push("untested ingredient " + k);
  check(`scaler ${w} lb: all ${Object.keys(EXPECT[w]).length} amounts`, bad.length === 0, bad.join("; "));
  const sv = await ev(`document.getElementById('sv').textContent`);
  check(`servings follow weight at ${w} lb (${SERVES[w]})`, +sv === SERVES[w], "got " + sv);
  const r = await rows(); const s7 = r.find((x: any) => x.id === "s7");
  check(`pressure time at ${w} lb is ${PRESS[w]} min`, !!s7 && s7.txt.includes(`for ${PRESS[w]} minutes`), s7 ? s7.txt.slice(0, 120) : "no s7");
  // Combined timeline: mash ready within 5 min of the roast.
  const f5 = r.find((x: any) => x.id === "f5"), m8 = r.find((x: any) => x.id === "m8");
  const roastReady = abs(f5) + f5.d, mashReady = abs(m8) + m8.d;
  check(`mash ready within 5 min of the roast at ${w} lb`, Math.abs(roastReady - mashReady) <= 5, `roast ${roastReady} mash ${mashReady}`);
  // Order: rows in clock order, every step from its own clock, and every step on a timer.
  let ordered = true; for (let i = 1; i < r.length; i++) if (abs(r[i]) < abs(r[i - 1])) ordered = false;
  check(`timeline in clock order at ${w} lb`, ordered, r.map((x: any) => x.id + "@" + abs(x)).join(" "));
  const noTimer = r.filter((x: any) => !(x.tmr || x.sear) || !(x.d > 0)).map((x: any) => x.id);
  check(`every step has a timer at ${w} lb (${r.length} steps)`, noTimer.length === 0, "missing: " + noTimer.join(","));
}
// Servings follow weight, never the reverse: there is no servings control, only weight.
check("no servings input, weight is the only scaler", await ev(`!document.querySelector('#inc[aria-label="More"]') && !!document.getElementById('wt')`), "");

// 2. Back-timing for two serve times at 3 lb and once at 4.5 lb.
for (const [w, serve] of [[3, "18:00"], [3, "19:30"], [4.5, "18:00"]] as [number, string][]) {
  await setup("pot-roast.html", w, serve);
  const r = await rows(), E = hm(serve), bad: string[] = [];
  for (const x of r) if (abs(x) !== E - x.at) bad.push(`${x.id} at ${abs(x)} want ${E - x.at}`);
  const want: Record<string, number> = w === 3 ? { s1: 144, s7: 110, m1: 56, s11: 35, f1: 20, f5: 2, sv: 0, p1: 384 } : { s1: 159, s7: 125, m1: 59, s11: 35, f1: 20, sv: 0 };
  for (const [id, at] of Object.entries(want)) { const x = r.find((y: any) => y.id === id); if (!x || abs(x) !== E - at) bad.push(`${id}: ${x ? abs(x) : "missing"} want ${E - at}`); }
  check(`back-timing ${w} lb, eat ${serve}: every clock = Eating at minus its offset`, bad.length === 0, bad.join("; "));
}
// 3. Leave by plan, 3 lb, leave 15:00, eat 18:00.
{
  await setup("pot-roast.html", 3, "18:00", "15:00");
  const r = await rows(), bad: string[] = [];
  const g = (id: string) => r.find((x: any) => x.id === id);
  if (!g("w3") || abs(g("w3")) !== hm("15:00")) bad.push("leave step not at 3:00 pm");
  if (!g("h1") || abs(g("h1")) !== hm("18:00") - 22) bad.push("home step not 22 min before");
  const s8 = g("s8"); if (!s8 || abs(s8) + s8.d > abs(g("h1")) - 10) bad.push("pressure cycle not done 10 min before home");
  const lastBefore = r.filter((x: any) => !["h1", "f1", "f2", "f3", "f4", "f5", "sv", "w3"].includes(x.id)).map((x: any) => abs(x) + 0);
  if (Math.max(...lastBefore) > hm("15:00")) bad.push("a before-you-go step after Leave by");
  const noTimer = r.filter((x: any) => !(x.tmr || x.sear)).map((x: any) => x.id); if (noTimer.length) bad.push("no timer: " + noTimer.join(","));
  check("Leave by plan: out at 3:00 pm, home 5:38 pm, cycle done first, timers on every step", bad.length === 0, bad.join("; "));
}
// 4. Timer tap starts a silent countdown and does not tick the step.
{
  await setup("pot-roast.html", 3, "18:00");
  const t = await ev(`(function(){var b=document.querySelector('#steps .row[data-id="s9"] .tmr button');b.click();var r=document.querySelector('#steps .row[data-id="s9"]');return {checked:r.querySelector('input').checked,txt:r.querySelector('.tmr').textContent};})()`);
  check("step timer starts and does not tick the box", !t.checked && /left/.test(t.txt), JSON.stringify(t));
  const tick = await ev(`(function(){var r=document.querySelector('#steps .row[data-id="s3"] input');r.click();return r.checked && state.checked.s3===true;})()`);
  check("tickable step boxes", tick === true, "");
}
// 5. Mash page: amounts and clocks match the mash on the roast page; servings by potato weight.
for (const w of [2, 3, 4.5]) {
  await setup("pot-roast.html", w, "18:00");
  const rq = await qtys(), rr = await rows();
  await setup("mash.html", w, "18:00");
  const mq = await qtys(), mr = await rows(), bad: string[] = [];
  for (const k of MASH_IDS) if (mq[k] !== rq[k]) bad.push(`${k}: mash "${mq[k]}" roast "${rq[k]}"`);
  for (const x of mr) { const y = rr.find((z: any) => z.id === x.id); if (!y || abs(y) !== abs(x)) bad.push(`${x.id} clock ${abs(x)} vs ${y ? abs(y) : "none"}`); }
  const noTimer = mr.filter((x: any) => !x.tmr).map((x: any) => x.id); if (noTimer.length) bad.push("no timer: " + noTimer.join(","));
  const sv = await ev(`document.getElementById('sv').textContent`); if (+sv !== Math.round(w * 2)) bad.push("serves " + sv);
  check(`mash page at ${w} lb matches the roast page (amounts, clocks, timers, serves ${Math.round(w * 2)})`, bad.length === 0, bad.join("; "));
}
// 6. Serve-with links carry the time and weight both ways.
{
  await setup("pot-roast.html", 4.5, "19:30");
  const href = await ev(`document.getElementById('mashlink').getAttribute('href')`);
  await go(new URL(href, base + "pot-roast.html").href);
  const m = await ev(`({serve:state.serve, lb:state.lb, sv:document.getElementById('serve').value})`);
  const back = await ev(`document.getElementById('roastlink').getAttribute('href')`);
  await go(new URL(back, base + "mash.html").href);
  const p = await ev(`({serve:state.serve, lb:state.lb})`);
  check("mash link from roast carries 7:30 pm and 4.5 lb, and back", m.serve === "19:30" && m.lb === 4.5 && p.serve === "19:30" && p.lb === 4.5, JSON.stringify({ href, m, back, p }));
}
// 7. Every link resolves, from the index, the roast and the mash pages; the index links both pages.
{
  const bad: string[] = [], seen = new Set<string>();
  for (const page of ["", "pot-roast.html", "mash.html"]) {
    await go(base + page);
    const links: string[] = await ev(`Array.from(document.querySelectorAll('a[href],link[href],script[src],img[src]')).map(function(e){return e.href||e.src;})`);
    for (const l of links) { const u = new URL(l); if (u.origin !== new URL(base).origin || seen.has(u.href)) continue; seen.add(u.href);
      const r = await fetch(u.href); if (!r.ok) bad.push(r.status + " " + u.pathname + " (on " + (page || "index") + ")"); }
  }
  for (const f of ["pot-roast.html", "mash.html"]) if (![...seen].some(s => new URL(s).pathname === SUB + f)) bad.push("index or pages do not link " + f);
  await go(base);
  const onIndex = await ev(`[!!document.querySelector('a[href="./mash.html"]'), !!document.querySelector('a[href="./pot-roast.html"]')]`);
  if (!onIndex[0] || !onIndex[1]) bad.push("index cards: " + JSON.stringify(onIndex));
  const sw = readFileSync(join(folder, "sw.js"), "utf8"); for (const m of sw.matchAll(/"(\.\/[^"]*)"/g)) { const r = await fetch(new URL(m[1], base).href); if (!r.ok) bad.push("sw.js shell " + m[1] + " " + r.status); }
  check(`every link resolves (${seen.size} links plus the service worker shell)`, bad.length === 0, bad.join("; "));
}
// 8. House rules on the two pages: no em dashes, no horizontal overflow at 390.
for (const f of ["pot-roast.html", "mash.html"]) {
  const t = readFileSync(join(folder, f), "utf8");
  check(`${f}: no em dashes`, !t.includes("\u2014") && !/&mdash;/.test(t), "");
  await setup(f, 3, "18:00");
  const ov = await ev(`document.documentElement.scrollWidth`);
  check(`${f}: no sideways scroll at 390 px`, ov <= 390, "scrollWidth " + ov);
}
// 9. Renders at 390 px: top of each page and the full length of the roast and mash.
async function shot(file: string, full: boolean) {
  let params: any = { format: "png" };
  if (full) { const h = await ev(`Math.ceil(document.documentElement.scrollHeight)`); params = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: 390, height: Math.min(h, 16000), scale: 1 } }; }
  const r = await S("Page.captureScreenshot", params); writeFileSync(join(out, file), Buffer.from(r.data, "base64"));
}
await setup("pot-roast.html", 3, "18:00"); await ev(`location.reload(); 1`); await sleep(1200); await ev(`document.fonts.ready.then(()=>1)`);
await shot("pot-roast-390-top.png", false); await shot("pot-roast-390-full.png", true);
await setup("mash.html", 3, "18:00"); await ev(`location.reload(); 1`); await sleep(1200);
await shot("mash-390-top.png", false); await shot("mash-390-full.png", true);
await go(base); await shot("index-390-top.png", false);

check("no console errors, exceptions or failed requests", errors.length === 0, errors.slice(0, 8).join(" | "));
const pass = results.filter(r => r.ok).length;
writeFileSync(join(out, "results.json"), JSON.stringify({ when: new Date().toISOString(), pass, total: results.length, results }, null, 1));
for (const r of results) console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.ok ? "" : "  >> " + r.detail));
console.log(`${pass}/${results.length} passed`);
ws.close(); edge.kill(); srv.stop();
process.exit(pass === results.length ? 0 : 1);
