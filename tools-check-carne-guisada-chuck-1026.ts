// Job 1026-1206-h20 checks for carne-guisada.html (pressure cooker), harness from job 1026-1145-tuz.
// bun check.ts <siteFolder> <outDir> <edgeProfileDir>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, mutes audio, blocks the
// service worker, pins the clock from the URL hash (#t=YYYY-MM-DDTHH:MM, local), 375 px phone width.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile] = process.argv.slice(2);
if (!folder || !out || !profile) throw new Error("usage: bun check.ts <site> <outDir> <profile>");
mkdirSync(out, { recursive: true });
const SUB = "/a-texans-table/";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 18991, DBG = 18992;
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
const edge = spawn(EDGE, ["--headless=new", "--remote-debugging-port=" + DBG, "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--mute-audio", "--hide-scrollbars", "--window-size=375,844", "about:blank"], { stdio: "ignore" });
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
await S("Emulation.setDeviceMetricsOverride", { width: 375, height: 844, deviceScaleFactor: 2, mobile: true });
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
  if (full) { const m = await S("Page.getLayoutMetrics"); clip = { x: 0, y: 0, width: 375, height: Math.ceil(m.cssContentSize.height), scale: 1 }; }
  const r = await S("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, clip });
  writeFileSync(join(out, name + ".png"), Buffer.from(r.data, "base64"));
}

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail = "") => { results.push({ name, ok, detail: ok ? "" : detail }); console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  " + detail)); };
const qtys = () => ev(`(function(){var o={};document.querySelectorAll('#ing .item').forEach(function(e){o[e.getAttribute('data-id')]=e.querySelector('.qty').textContent;});return o;})()`);
const rows = () => ev(`(function(){return [].map.call(document.querySelectorAll('#steps .row'),function(r){var c=r.querySelector('.clock');return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:c.firstChild.textContent,tt:[].map.call(r.querySelectorAll('.tt'),function(t){return t.textContent}),uses:[].map.call(r.querySelectorAll('.ui'),function(u){return {ing:u.getAttribute('data-ing'),t:u.textContent,q:u.querySelector('b').textContent};}),txt:r.querySelector('.txt').textContent};});})()`);
const cks = () => ev(`[].map.call(document.querySelectorAll('#checklist .ck'),function(r){return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:r.querySelector('.ct').textContent};})`);
const fmt = (min: number) => { min = ((min % 1440) + 1440) % 1440; let h = Math.floor(min / 60), m = min % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
const num = (s: string) => { s = s.trim(); let m = /^(\d+) (\d+)\/(\d+)/.exec(s); if (m) return +m[1] + +m[2] / +m[3]; m = /^(\d+)\/(\d+)/.exec(s); if (m) return +m[1] / +m[2]; m = /^(\d+(?:\.\d+)?)/.exec(s); return m ? +m[1] : NaN; };
const TSP: Record<string, number> = { tsp: 1, tbsp: 3, cup: 48, cups: 48 };
const inTsp = (s: string, fallbackUnit: string) => { const u = (/ (tsp|tbsp|cups?|lb)/.exec(s) || [, fallbackUnit])[1] as string; return num(s) * (TSP[u] || 1); };
const setServings = async (n: number) => { for (let i = 0; i < 20; i++) { const cur = +(await ev(`document.getElementById('sv').textContent`)); if (cur === n) return; const before = cur; await ev(`document.getElementById('${cur < n ? "inc" : "dec"}').click()`); if (+(await ev(`document.getElementById('sv').textContent`)) === before) return; } };
const setServe = (hm: string) => ev(`(function(){var e=document.getElementById('serve');e.value='${hm}';e.dispatchEvent(new Event('change',{bubbles:true}));return e.value;})()`);
const URL0 = base + "carne-guisada.html#t=2026-10-26T12:30";
await go(URL0); await ev(`localStorage.clear()`); errors.length = 0; await go(URL0);
await shot("375-full-default", true); await shot("375-top", false);
const ING = await ev(`ING`);
const want4: Record<string, string> = { beef: "2 1/4 lb", salt: "3/4 tsp", pepper: "1 tsp", tallow: "1 tbsp", onion: "1", bell: "1", garlic: "1 tbsp", chili: "1 tbsp", cumin: "2 tsp", oregano: "1 tsp", paste: "1 tsp", water: "1 cup", tsauce: "1 cup", bay: "2", flour: "2 tbsp", cold: "1/4 cup", salt2: "1/4 tsp", rice: "2 cups", tortillas: "8", cilantro: "1/4 cup", ronion: "1/4 cup", jalap: "1" };
const want8: Record<string, string> = { beef: "4 1/2 lb", salt: "1 1/2 tsp", pepper: "2 tsp", tallow: "2 tbsp", onion: "2", bell: "2", garlic: "2 tbsp", chili: "2 tbsp", cumin: "4 tsp", oregano: "2 tsp", paste: "2 tsp", water: "2 cups", tsauce: "2 cups", bay: "4", flour: "1/4 cup", cold: "1/2 cup", salt2: "1/2 tsp", rice: "4 cups", tortillas: "16", cilantro: "1/2 cup", ronion: "1/2 cup", jalap: "2" };
const cmp = (q: any, w: any) => Object.keys(w).filter(k => q[k] !== w[k]).map(k => `${k}: ${q[k]} want ${w[k]}`);
let q = await qtys();
check("all 22 ingredients listed", Object.keys(q).length === 22, String(Object.keys(q).length));
check("amounts at 4 servings", cmp(q, want4).length === 0, cmp(q, want4).join("; "));
let r = await rows(), c = await cks();
const timesOk = (serveMin: number) => r.filter((x: any) => x.clock !== fmt(serveMin - x.at)).map((x: any) => x.id + "=" + x.clock).concat(c.filter((x: any) => x.clock !== fmt(serveMin - x.at)).map((x: any) => "ck " + x.id));
check("21 step rows and 21 checklist rows", r.length === 21 && c.length === 21, r.length + "/" + c.length);
check("default 6:30 pm: every step and checklist row back-timed", timesOk(18 * 60 + 30).length === 0, timesOk(18 * 60 + 30).join(","));
check("first move 4:20 pm (cut), sear 4:49 pm, serve 6:30 pm", r[0].clock === "4:20 pm" && r.find((x: any) => x.id === "g5").clock === "4:49 pm" && r[20].clock === "6:30 pm", r[0].clock);
check("clock token at 6:30: pressure count from 5:18 pm", r.find((x: any) => x.id === "g11").tt[0] === "5:18 pm", JSON.stringify(r.filter((x: any) => x.tt.length).map((x: any) => x.tt)));
check("steps in time order", r.every((x: any, i: number) => i === 0 || x.at < r[i - 1].at), "order");
check("cutting, pat dry and rest each have their own slot", ["g1", "g2", "g4"].every(id => r.some((x: any) => x.id === id)) && /rest/i.test(r.find((x: any) => x.id === "g4").txt), "slots");
const pepRows = r.filter((x: any) => x.uses.some((u: any) => u.ing === "pepper")).map((x: any) => x.id);
check("pepper only on the second-side rows, never before a sear", JSON.stringify(pepRows) === '["g6","g8"]' && !/pepper (it|the|those)/i.test(r.find((x: any) => x.id === "g5").txt) && /No pepper/.test(r.find((x: any) => x.id === "g4").txt), JSON.stringify(pepRows));
const pepOrder = ["g6", "g8"].map(id => { const t = r.find((x: any) => x.id === id).txt; const turn = t.indexOf("Turn each cube so the seared face is up"); const firstPep = t.search(/pepper/i); return turn >= 0 && firstPep > turn; });
check("no pepper line before a turn: g6 and g8 turn seared face up first", pepOrder.every(Boolean) && ["g5", "g7"].every(id => !/pepper (it|the|those)/i.test(r.find((x: any) => x.id === id).txt)), JSON.stringify(pepOrder));
check("every cast iron heat row has a °F number", r.filter((x: any) => ["g3", "g5", "g9", "g19"].includes(x.id) && !/°F/.test(x.txt)).length === 0, "missing");
check("flour goes in at the end as a slurry, not before pressure", r.findIndex((x: any) => x.uses.some((u: any) => u.ing === "flour")) > r.findIndex((x: any) => x.id === "g11"), "flour early");
for (const [hm, mins] of [["19:15", 19 * 60 + 15], ["17:45", 17 * 60 + 45], ["18:30", 18 * 60 + 30]] as [string, number][]) {
  await setServe(hm); r = await rows(); c = await cks();
  const b = timesOk(mins);
  check(`serve ${hm}: all 21 steps and 21 checklist rows re-time`, b.length === 0 && r[20].clock === fmt(mins), b.join(","));
  check(`serve ${hm}: clock token in the step text moves`, r.find((x: any) => x.id === "g11").tt[0] === fmt(mins - 72), r.find((x: any) => x.id === "g11").tt[0]);
}
const baseQ = await qtys();
for (const n of [3, 5, 6, 7, 8]) {
  await setServings(n); q = await qtys(); r = await rows();
  const off = ING.filter((it: any) => Math.abs(inTsp(q[it.id], it.unit) - it.per * n * (TSP[it.unit] || 1)) > ((it.step || 0.25) / 2) * (TSP[it.unit] || 1) + 1e-6).map((it: any) => `${it.id}=${q[it.id]}`);
  check(`servings ${n}: every ingredient scales (within its rounding step)`, off.length === 0, off.join(", "));
  if (n >= 6) { const same = ING.filter((it: any) => q[it.id] === baseQ[it.id]).map((it: any) => it.id); check(`servings ${n}: every amount changed from 4`, same.length === 0, same.join(",")); }
  const mism: string[] = [];
  for (const x of r) for (const u of x.uses) { const half = /, half$/.test(u.t); const full = inTsp(q[u.ing], ''); const want = half ? full / 2 : full; if (Math.abs(inTsp(u.q, '') - want) > 1e-6) mism.push(`${x.id}:${u.ing} ${u.q} vs ${q[u.ing]}`); }
  check(`servings ${n}: step ingredient lines match the list`, mism.length === 0, mism.join("; "));
  if (n === 3) { const untidy = Object.entries(q).filter(([k, v]) => /(^|\s)(1\/8|3\/8|5\/8|7\/8) cup|(1\/4|3\/4) tbsp/.test(v as string)).map(([k, v]) => k + "=" + v); check("servings 3: no awkward eighth-cup or quarter-tbsp amounts", untidy.length === 0, untidy.join(", ")); }
  if (n === 8) { check("amounts at 8 servings", cmp(q, want8).length === 0, cmp(q, want8).join("; ")); await shot("375-8-servings", true); }
}
await setServings(4);
check("back to 4 restores amounts", cmp(await qtys(), want4).length === 0, "");
await setServings(2);
check("servings floor is 3", (await ev(`document.getElementById('sv').textContent`)) === "3", "");
await setServings(4);
await ev(`document.querySelector('#checklist .ck[data-id="g3"] input').click(); 1`);
const sync1 = await ev(`document.querySelector('#steps .row[data-id="g3"]').classList.contains('on') && document.querySelector('#steps .row[data-id="g3"] input').checked`);
await ev(`document.querySelector('#steps .row[data-id="g3"] input').click(); 1`);
const sync2 = await ev(`!document.querySelector('#checklist .ck[data-id="g3"]').classList.contains('on') && !document.querySelector('#checklist .ck[data-id="g3"] input').checked`);
check("checklist and step ticks stay in step both ways", sync1 && sync2, `${sync1} ${sync2}`);
await ev(`document.querySelector('#checklist .ck[data-id="g1"] input').click(); document.querySelector('#ing .item input').click(); 1`);
await go(URL0);
check("ticks survive a reload", await ev(`document.querySelector('#checklist .ck[data-id="g1"] input').checked && document.querySelector('#steps .row[data-id="g1"] input').checked && document.querySelector('#ing .item input').checked`), "");
await ev(`document.getElementById('clrAll').click(); 1`);
await ev(`document.getElementById('clrIng').click(); 1`);
check("reset clears ticks", await ev(`document.querySelectorAll('.ck.on,.row.on,.item.on').length===0`), "");
const ckH = await ev(`document.getElementById('checklist').getBoundingClientRect().height`);
check("checklist fits one 375 x 844 screen", ckH < 844 - 140, "height " + ckH);
await ev(`window.scrollTo(0, document.getElementById('checklist').getBoundingClientRect().top + window.scrollY - 140); 1`); await sleep(200); await shot("375-checklist", false);
await S("Emulation.setDeviceMetricsOverride", { width: 375, height: 667, deviceScaleFactor: 2, mobile: true }); await sleep(300);
await ev(`window.scrollTo(0, document.getElementById('checklist').getBoundingClientRect().top + window.scrollY - document.querySelector('.bar').offsetHeight - 4); 1`); await sleep(200);
const fit = await ev(`(function(){var b=document.querySelector('.bar').getBoundingClientRect(), c=document.getElementById('checklist').getBoundingClientRect(); return {bar:b.bottom, top:c.top, bottom:c.bottom, vh:innerHeight};})()`);
check("checklist fits a 375 x 667 phone under the sticky bar", fit.top >= fit.bar - 1 && fit.bottom <= fit.vh, JSON.stringify(fit));
await shot("375x667-checklist", false);
await S("Emulation.setDeviceMetricsOverride", { width: 375, height: 844, deviceScaleFactor: 2, mobile: true }); await sleep(200);
check("no sideways scroll at 375 px", await ev(`document.documentElement.scrollWidth <= 375`), String(await ev(`document.documentElement.scrollWidth`)));
check("no em dashes", !/—/.test(await ev(`document.documentElement.outerHTML`)), "");
await go(base + "carne-guisada.html#t=2026-10-26T16:50"); await sleep(300);
check("at 4:50 pm the first sear row is marked now in both lists", await ev(`document.querySelector('#steps .row.now').getAttribute('data-id')==='g5' && document.querySelector('#checklist .ck.now').getAttribute('data-id')==='g5'`), await ev(`(document.querySelector('#steps .row.now')||{}).getAttribute&&document.querySelector('#steps .row.now').getAttribute('data-id')||'none'`));
await shot("375-at-450", false);
await go(base + "index.html#t=2026-10-26T12:30");
check("index lists the page", await ev(`!!document.querySelector('a[href*="carne-guisada"]')`), "no link");
check("no console errors or failed requests", errors.length === 0, errors.join(" || "));
check("no speech", (await ev(`window.__spoke`)) === 0, "spoke");
writeFileSync(join(out, "results.json"), JSON.stringify(results, null, 1));
console.log(`${results.filter(x => x.ok).length} of ${results.length} passed`);
ws.close(); edge.kill(); srv.stop(); process.exit(0);
