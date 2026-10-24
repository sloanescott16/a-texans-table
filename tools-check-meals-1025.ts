// Job 1024-1130-hzw checks for the four meals-1025 pages, harness from tacos-1022.
// bun check-meals-1025.ts <siteFolder> <outDir> <edgeProfileDir>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, mutes audio, blocks the
// service worker, pins the clock from the URL hash (#t=YYYY-MM-DDTHH:MM, local), 390 px phone width.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile] = process.argv.slice(2);
if (!folder || !out || !profile) throw new Error("usage: bun check-meals-1025.ts <site> <outDir> <profile>");
mkdirSync(out, { recursive: true });
const SUB = "/a-texans-table/";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 18971, DBG = 18972;
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
const check = (name: string, ok: boolean, detail = "") => { results.push({ name, ok, detail: ok ? "" : detail }); };
const qtys = () => ev(`(function(){var o={};document.querySelectorAll('#ing .item').forEach(function(e){o[e.getAttribute('data-id')]=e.querySelector('.qty').textContent;});return o;})()`);
const rows = () => ev(`(function(){return [].map.call(document.querySelectorAll('#steps .row'),function(r){var c=r.querySelector('.clock');var d=c.querySelector('.day');return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:c.firstChild.textContent,day:d?d.textContent:'',now:r.classList.contains('now'),uses:[].map.call(r.querySelectorAll('.ui'),function(u){return u.textContent;}),txt:r.querySelector('.txt').textContent};});})()`);
const toMin = (s: string) => { const m = /(\d+):(\d+) (am|pm)/.exec(s)!; let h = +m[1] % 12; if (m[3] === "pm") h += 12; return h * 60 + +m[2]; };
const fmt = (min: number) => { min = ((min % 1440) + 1440) % 1440; let h = Math.floor(min / 60), m = min % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
const setServings = async (n: number) => { for (let i = 0; i < 20; i++) { const cur = +(await ev(`document.getElementById('sv').textContent`)); if (cur === n) return; await ev(`document.getElementById('${cur < n ? "inc" : "dec"}').click()`); } };
const setServe = (hm: string) => ev(`(function(){var e=document.getElementById('serve');e.value='${hm}';e.dispatchEvent(new Event('change',{bubbles:true}));return e.value;})()`);
const BANNED = /diamond crystal|morton|low-sodium|low sodium|yukon|unsalted|boston butt|honeycrisp|valentina|cholula|80\/20|\b\d+(\.\d+)? ?oz (can|jar|bottle|bag)/i;
// expected quantities at 4 servings and at 8 servings, a few per page
const PAGES: Record<string, { n4: Record<string, string>; n8: Record<string, string>; first: string; last: string }> = {
  "peruvian-grilled-chicken": { n4: { chicken: "8", soy: "3 tbsp", cumin: "2 tsp", msalt: "2 tsp", cilantro: "2 cups", jalapeno: "1", voil: "6 tbsp", rice: "1 cup" }, n8: { chicken: "16", soy: "6 tbsp", msalt: "4 tsp", cilantro: "4 cups", rice: "2 cups" }, first: "2:00 pm", last: "6:30 pm" },
  "carne-guisada": { n4: { beef: "2 1/2 lb", salt: "2 tsp", chili: "1 tbsp", tsauce: "1 cup", stock: "1 1/2 cups", bay: "2", rice: "2 cups", tortillas: "8" }, n8: { beef: "5 lb", salt: "4 tsp", stock: "3 cups", tortillas: "16" }, first: "6:50 am", last: "6:30 pm" },
  "tom-kha": { n4: { onion: "1 cup", galangal: "3", lemongrass: "1", leaves: "10", paste: "1 tbsp", stock: "4 cups", coconut: "2", chicken: "1 lb", mushrooms: "8 oz", sugar: "2 tbsp", fish: "2 tbsp", lime: "2 tbsp", chile: "1/2" }, n8: { stock: "8 cups", coconut: "4", chicken: "2 lb", mushrooms: "16 oz", paste: "2 tbsp" }, first: "2:05 pm", last: "6:30 pm" },
  "pork-chops-onion-pear": { n4: { chops: "4", csalt: "2 tsp", onions: "2", pears: "2", cider: "1 cup", stock: "1/2 cup", fbutter: "2 tbsp", potatoes: "3 lb", mbutter: "4 tbsp", cream: "1 cup", parm: "1/2 cup" }, n8: { chops: "8", potatoes: "6 lb", cider: "2 cups", cream: "2 cups" }, first: "5:08 pm", last: "6:30 pm" },
};
const timeline: string[] = [];
for (const slug of Object.keys(PAGES)) {
  const P = PAGES[slug];
  errors.length = 0;
  await go(base + slug + ".html#t=2026-10-24T12:00");
  await ev(`localStorage.clear()`); await go(base + slug + ".html#t=2026-10-24T12:00");
  check(slug + " loads, title set", (await ev(`document.title`)).length > 3 && (await ev(`document.querySelectorAll('#steps .row').length`)) > 5, "no steps");
  await shot(slug, true);
  const q4 = await qtys();
  const bad4 = Object.entries(P.n4).filter(([k, v]) => q4[k] !== v).map(([k, v]) => `${k}: ${q4[k]} want ${v}`);
  check(slug + " base 4 quantities", bad4.length === 0, bad4.join("; "));
  let r = await rows();
  const mismatch = r.filter((x: any) => x.clock !== fmt(18 * 60 + 30 - x.at)).map((x: any) => x.id);
  check(slug + " every step has a clock, back-timed from 6:30", r.every((x: any) => /\d:\d\d [ap]m/.test(x.clock)) && mismatch.length === 0, mismatch.join(","));
  check(slug + " first and last step times", r[0].clock === P.first && r[r.length - 1].clock === P.last, r[0].clock + " .. " + r[r.length - 1].clock);
  check(slug + " steps in time order", r.every((x: any, i: number) => i === 0 || x.at <= r[i - 1].at), "order");
  const ing = await ev(`[].map.call(document.querySelectorAll('#ing .nm'),function(e){return e.textContent}).join(' | ')`);
  const steptxt = r.map((x: any) => x.txt + " " + x.uses.join(" ")).join(" ");
  check(slug + " plain names only in ingredients and steps", !BANNED.test(ing) && !BANNED.test(steptxt), (ing.match(BANNED) || steptxt.match(BANNED) || [""])[0]);
  const body = await ev(`document.body.innerText`);
  check(slug + " no em dashes", !/\u2014/.test(body) && !/\u2014/.test(await ev(`document.documentElement.outerHTML`)), "em dash");
  check(slug + " every heat cue line carries a number", r.filter((x: any) => /(medium|high|hot|preheat|shimmer|sear)/i.test(x.txt) && !/Slow Cook|Saute|°F|Keep Warm|rice cooker/i.test(x.txt)).length === 0, r.filter((x: any) => /(medium|high|hot|sear)/i.test(x.txt) && !/Slow Cook|Saute|°F|Keep Warm|rice cooker/i.test(x.txt)).map((x: any) => x.id).join(","));
  // serve time back-timing
  await setServe("19:15");
  r = await rows();
  const mm = r.filter((x: any) => x.clock !== fmt(19 * 60 + 15 - x.at)).map((x: any) => x.id);
  check(slug + " serve time 7:15 shifts every step", mm.length === 0 && r[r.length - 1].clock === "7:15 pm", mm.join(","));
  // scaler
  await setServings(8);
  const q8 = await qtys(); r = await rows();
  const bad8 = Object.entries(P.n8).filter(([k, v]) => q8[k] !== v).map(([k, v]) => `${k}: ${q8[k]} want ${v}`);
  check(slug + " scaler at 8", bad8.length === 0, bad8.join("; "));
  const firstUse = r.find((x: any) => x.uses.length);
  check(slug + " step ingredient lines follow the scaler", !!firstUse && firstUse.uses.some((u: string) => Object.values(q8).some(v => u.startsWith(v as string))), JSON.stringify(firstUse && firstUse.uses));
  await setServings(4);
  // ticks
  await ev(`document.querySelector('#ing .item input').click(); document.querySelector('#steps .row input').click(); 1`);
  const onI = await ev(`document.querySelector('#ing .item').classList.contains('on') && document.querySelector('#steps .row').classList.contains('on')`);
  await go(base + slug + ".html#t=2026-10-24T12:00");
  const kept = await ev(`document.querySelector('#ing .item input').checked && document.querySelector('#steps .row input').checked && document.getElementById('serve').value==='19:15' && document.getElementById('sv').textContent==='4'`);
  check(slug + " ticks strike through and survive a reload, with serve time", onI && kept, `on ${onI} kept ${kept}`);
  await ev(`document.getElementById('clrAll').click(); 1`);
  check(slug + " reset clears ticks", await ev(`document.querySelectorAll('#steps .row.on, #ing .item.on').length===1`) || await ev(`document.querySelectorAll('#steps .row.on').length===0`), "reset");
  check(slug + " no console errors or failed requests", errors.length === 0, errors.join(" || "));
  check(slug + " no speech", (await ev(`window.__spoke`)) === 0, "spoke");
  timeline.push(slug + ": " + (await rows()).map((x: any) => x.clock).join(", "));
}
// index
errors.length = 0;
await go(base + "#t=2026-10-24T12:00");
const links = await ev(`[].map.call(document.querySelectorAll('a[href]'),function(a){return a.getAttribute('href')}).join(' ')`);
for (const slug of Object.keys(PAGES)) check("index links to " + slug, links.includes(slug + ".html"), "missing");
check("index no console errors", errors.length === 0, errors.join(" || "));
await shot("index", false);
writeFileSync(join(out, "results.json"), JSON.stringify({ results, timeline, errors }, null, 1));
for (const x of results) console.log((x.ok ? "PASS " : "FAIL ") + x.name + (x.detail ? "  :: " + x.detail : ""));
console.log(`${results.filter(x => x.ok).length}/${results.length} passed`);
timeline.forEach(l => console.log("  " + l));
ws.close(); edge.kill(); srv.stop();
process.exit(0);
