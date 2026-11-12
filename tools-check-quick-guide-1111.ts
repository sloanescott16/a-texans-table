// Job quick-guide-1111 (11 Nov 2026): the quick guide at the top of a page in place of the Checklist, and tick boxes on
// every line of a step's "You'll use" list. Harness copied from tools-check-mnp-1108.ts.
// bun tools-check-quick-guide-1111.ts <siteFolder> <outDir> <browserProfileDir> <slug> <YYYY-MM-DD of the dinner>
// Serves the folder under /a-texans-table/ like GitHub Pages, stubs speechSynthesis, mutes audio, blocks the
// service worker, pins the clock from the URL hash (#t=YYYY-MM-DDTHH:MM, local), 390 px phone width.
// Browser: Edge on the Base Station; set KITCHEN_BROWSER to another Chromium binary anywhere else.
import { spawn } from "child_process";
import { existsSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, extname } from "path";

const [folder, out, profile, SLUG, DAY] = process.argv.slice(2);
if (!folder || !out || !profile || !SLUG || !DAY) throw new Error("usage: bun tools-check-quick-guide-1111.ts <site> <outDir> <profile> <slug> <YYYY-MM-DD>");
mkdirSync(out, { recursive: true });
const SUB = "/a-texans-table/";
const EDGE = process.env.KITCHEN_BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
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
const edge = spawn(EDGE, ["--headless=new", "--remote-debugging-port=" + DBG, "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--mute-audio", "--hide-scrollbars", "--window-size=390,844"].concat(process.platform === "win32" ? [] : ["--no-sandbox"], ["about:blank"]), { stdio: "ignore" });
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
const rows = () => ev(`(function(){return [].map.call(document.querySelectorAll('#steps .row'),function(r){var c=r.querySelector('.clock');return {id:r.getAttribute('data-id'),at:+r.getAttribute('data-at'),clock:c.firstChild.textContent,on:r.classList.contains('on'),box:r.querySelector('input').checked,uses:[].map.call(r.querySelectorAll('.ui'),function(u){return {ing:u.getAttribute('data-ing'),key:u.getAttribute('data-use'),t:u.textContent,q:u.querySelector('b').textContent,on:u.classList.contains('on'),aria:u.getAttribute('aria-checked'),box:!!u.querySelector('.ub')};}),txt:r.querySelector('.txt').textContent};});})()`);
// The quick guide as shown: one entry per block.
const guide = () => ev(`[].map.call(document.querySelectorAll('#quick .qg'),function(g){var w=g.querySelector('.qw');return {at:+g.getAttribute('data-at'),when:w?w.textContent:'',head:g.querySelector('.qh').textContent,now:g.classList.contains('now'),lines:[].map.call(g.querySelectorAll('.ql'),function(l){return l.textContent;}),amounts:[].map.call(g.querySelectorAll('.ql b:not(.tt)'),function(b){return b.textContent;})};})`);
const fmt = (min: number) => { min = ((min % 1440) + 1440) % 1440; let h = Math.floor(min / 60), m = min % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}:${String(m).padStart(2, "0")} ${ap}`; };
const setServings = async (n: number) => { for (let i = 0; i < 20; i++) { const cur = +(await ev(`document.getElementById('sv').textContent`)); if (cur === n) return; const before = cur; await ev(`document.getElementById('${cur < n ? "inc" : "dec"}').click()`); if (+(await ev(`document.getElementById('sv').textContent`)) === before) return; } };
const setServe = (hm: string) => ev(`(function(){var e=document.getElementById('serve');e.value='${hm}';e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('input',{bubbles:true}));return e.value;})()`);
// A real finger tap at a point inside the nth match of a selector (fx, fy are fractions of its box).
const tap = async (sel: string, nth = 0, fx = 0.5, fy = 0.5) => {
  const p = await ev(`(function(){var e=document.querySelectorAll(${JSON.stringify(sel)})[${nth}];if(!e)return null;e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+r.width*${fx},y:r.top+r.height*${fy}};})()`);
  if (!p) throw new Error("nothing to tap: " + sel + " #" + nth);
  await S("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: p.x, y: p.y }] });
  await S("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(150);
};
const hash = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
const PAGE = base + SLUG + ".html";
const URL0 = PAGE + "#t=" + DAY + "T09:00";
await go(URL0); await ev(`localStorage.clear()`); errors.length = 0; await go(URL0);
await shot(SLUG + "-390-full-default", true); await shot(SLUG + "-390-top", false);
const ING = await ev(`ING`), STEPS = await ev(`STEPS`), QUICK = await ev(`typeof QUICK === "undefined" ? null : QUICK`);
const SV = await ev(`SERV`), DEF = await ev(`document.getElementById('serve').value`), DEFM = +DEF.split(":")[0] * 60 + +DEF.split(":")[1];
const UP = SV.max > SV.base, TO = UP ? SV.max : SV.min;
check("servings default " + SV.base, (await ev(`document.getElementById('sv').textContent`)) === String(SV.base), "");

// ---------------- the quick guide ----------------
check("the page has quick guide data", Array.isArray(QUICK) && QUICK.length > 0, String(QUICK));
check("no Checklist block or heading left", await ev(`!document.getElementById('checklist') && !document.querySelector('.ck') && ![].some.call(document.querySelectorAll('h2'),function(h){return /checklist/i.test(h.textContent);})`), "");
check("Quick guide heading sits above Ingredients", await ev(`(function(){var h=[].map.call(document.querySelectorAll('h2'),function(x){return x.textContent;});return h.indexOf('Quick guide')===0 && h.indexOf('Ingredients')===1;})()`), "");
let g = await guide();
check("one block per stretch of work, each with a time, a length and lines", g.length === QUICK.length && g.every((x: any, i: number) => x.when && x.lines.length === QUICK[i].lines.length && (!QUICK[i].mins || x.head.length > x.when.length)), JSON.stringify(g.map((x: any) => x.head)));
check("no raw tokens left in the quick guide", g.every((x: any) => !/[{}]/.test(x.head + x.lines.join(" "))), "");
const clockOf = (x: any) => x.when.split(", ").pop();
const guideTimes = (serveMin: number) => g.filter((x: any) => clockOf(x) !== fmt(serveMin - x.at)).map((x: any) => x.at + "=" + x.when);
check("default time " + DEF + ": every block starts at its first step's time", guideTimes(DEFM).length === 0, guideTimes(DEFM).join(","));
check("every block starts on a step, in cook order, from the first step", g.every((x: any) => STEPS.some((s: any) => s.at === x.at)) && g.every((x: any, i: number) => !i || x.at < g[i - 1].at) && g[0].at === STEPS[0].at, "");
const far = g.filter((x: any) => x.at >= 720 && !/before/i.test(x.when)).map((x: any) => x.when);
check("a block more than 12 hours out says which day", far.length === 0, far.join(","));
console.log("GUIDE " + g.map((x: any) => x.head + " :: " + x.lines.join(" / ")).join("\n      "));
// amounts in the guide are the ingredient list's own amounts, in token order
const tokens = QUICK.flatMap((q: any) => q.lines.flatMap((l: string) => [...l.matchAll(/\{[QI]:(\w+)\}/g)].map(m => m[1])));
const amountsOk = async () => { const q = await qtys(); const shown = (await guide()).flatMap((x: any) => x.amounts); const bad = tokens.filter((id: string, i: number) => shown[i] !== q[id]).map((id: string) => id); return { ok: shown.length === tokens.length && bad.length === 0, detail: shown.length + "/" + tokens.length + " " + bad.join(",") }; };
let am = await amountsOk();
check("amounts in the guide match the ingredient list at " + SV.base + " servings", am.ok, am.detail);
const head0 = g.map((x: any) => x.head).join("|");
let r = await rows();
const rowTimes = (serveMin: number) => r.filter((x: any) => x.clock !== fmt(serveMin - x.at)).map((x: any) => x.id + "=" + x.clock);
check("one step row per step, every row back-timed", r.length === STEPS.length && rowTimes(DEFM).length === 0, r.length + "/" + STEPS.length + " " + rowTimes(DEFM).join(","));
for (const [hm, mins] of [45, -45, 26].map((d) => { const m = DEFM + d; return [String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"), m]; }) as [string, number][]) {
  await setServe(hm); r = await rows(); g = await guide();
  check(`Eating at ${hm}: every block and every step re-times`, guideTimes(mins).length === 0 && rowTimes(mins).length === 0, guideTimes(mins).concat(rowTimes(mins)).join(","));
}
check("clock times inside the guide move with Eating at", !/\{t:/.test(JSON.stringify(QUICK)) || g.map((x: any) => x.head).join("|") !== head0, "");
await setServe(DEF);
const lines3 = (await guide()).map((x: any) => x.lines.join(" ")).join(" ");
const q3 = await qtys();
await setServings(TO);
am = await amountsOk();
check("amounts in the guide follow the servings (" + TO + ")", am.ok && (await guide()).map((x: any) => x.lines.join(" ")).join(" ") !== lines3, am.detail);
await shot(SLUG + "-390-at-" + TO + "-servings", false);
await setServings(SV.base);
check("back at " + SV.base + ", amounts return", JSON.stringify(await qtys()) === JSON.stringify(q3) && (await guide()).map((x: any) => x.lines.join(" ")).join(" ") === lines3, "");
await ev(`window.scrollTo(0, document.getElementById('quick').getBoundingClientRect().top + window.scrollY - document.querySelector('.bar').offsetHeight - 4); 1`); await sleep(250);
const fit = await ev(`(function(){var b=document.querySelector('.bar').getBoundingClientRect(), c=document.getElementById('quick').getBoundingClientRect(); return {bar:b.bottom, top:c.top, bottom:c.bottom, vh:innerHeight};})()`);
check("quick guide fits one 390 x 844 screen under the sticky bar", fit.top >= fit.bar - 1 && fit.bottom <= fit.vh, JSON.stringify(fit));
await shot(SLUG + "-390-quick-guide", false);
const heatLines = (await guide()).flatMap((x: any) => x.lines).filter((t: string) => /\b(medium|medium-high|medium-low|high heat|low heat|simmer|boil|fry|sear)\b/i.test(t) && !/°F/.test(t) && !/Slow Cook|Keep Warm|Sealing|Venting/i.test(t));
check("every heat cue in the guide carries a °F number", heatLines.length === 0, heatLines.join(" | "));

// ---------------- tick boxes on the You'll use lines ----------------
r = await rows();
const allUses = r.flatMap((x: any) => x.uses);
check("every You'll use line has a tick box and starts unticked", allUses.length > 0 && allUses.every((u: any) => u.box && u.key && !u.on && u.aria === "false"), allUses.length + " lines");
check("every line has its own key", new Set(allUses.map((u: any) => u.key)).size === allUses.length, "");
const big = r.reduce((a: any, x: any) => (x.uses.length > a.uses.length ? x : a), r[0]);
const SEL = `#steps .row[data-id="${big.id}"] .ui`;
const stateOf = async () => { const x = (await rows()).find((y: any) => y.id === big.id); return { lines: x.uses.map((u: any) => (u.on ? 1 : 0)).join(""), aria: x.uses.map((u: any) => (u.aria === "true" ? 1 : 0)).join(""), step: x.on || x.box }; };
const want = (n: number, on: number[]) => Array.from({ length: n }, (_, i) => (on.includes(i) ? 1 : 0)).join("");
const N = big.uses.length;
await tap(SEL, 0, 0.5, 0.5);
let st = await stateOf();
check("a tap on a line ticks that line only, not the step (" + big.id + ", " + N + " lines)", st.lines === want(N, [0]) && st.aria === st.lines && !st.step, JSON.stringify(st));
if (N > 2) {
  await tap(SEL + " .ub", 1, 0.5, 0.5); await tap(SEL + " .ut b", 2, 0.5, 0.5);
  st = await stateOf();
  check("a tap on the box or on the amount ticks its line", st.lines === want(N, [0, 1, 2]) && !st.step, JSON.stringify(st));
  await tap(SEL, 1, 0.5, 0.5);
  st = await stateOf();
  check("a second tap unticks", st.lines === want(N, [0, 2]) && !st.step, JSON.stringify(st));
}
await shot(SLUG + "-390-ticked-lines", false);
const kept = (await stateOf()).lines;
await setServings(TO); await setServings(SV.base);
check("line ticks hold through a servings change", (await stateOf()).lines === kept, (await stateOf()).lines);
await go(URL0);
check("line ticks survive a reload", (await stateOf()).lines === kept, (await stateOf()).lines);
await tap(`#steps .row[data-id="${big.id}"] .txt`, 0, 0.5, 0.5);
st = await stateOf();
check("a tap on the instruction still ticks the step, and leaves the line ticks as they were", st.step && st.lines === kept, JSON.stringify(st));
await tap(`#steps .row[data-id="${big.id}"] .txt`, 0, 0.5, 0.5);
check("and unticks it again", !(await stateOf()).step, "");
await ev(`(function(){var e=document.querySelector(${JSON.stringify(SEL)});e.focus();e.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true}));return 1;})()`);
check("the space key ticks a focused line", (await stateOf()).lines.charAt(0) === (kept.charAt(0) === "1" ? "0" : "1"), (await stateOf()).lines);
await ev(`document.getElementById('clrAll').click(); 1`);
check("Reset everything clears the line ticks", await ev(`document.querySelectorAll('.ui.on,.row.on,.item.on').length===0`), "");
check("ingredient list ticks are separate from the line ticks", await ev(`(function(){document.querySelector('#ing .item input').click();var n=document.querySelectorAll('.ui.on').length;document.getElementById('clrAll').click();return n===0;})()`), "");

// ---------------- the block for right now ----------------
const serve = new Date(DAY + "T" + DEF + ":00");
for (let i = 0; i < QUICK.length; i++) {
  await go(PAGE + "#t=" + hash(new Date(serve.getTime() - QUICK[i].at * 60000 + 60000)));
  const now = (await guide()).map((x: any) => (x.now ? 1 : 0)).join("");
  check("a minute into block " + (i + 1) + ", that block is the one marked", now === want(QUICK.length, [i]), now);
  if (i === 0) { await ev(`window.scrollTo(0, 0); 1`); await sleep(200); await shot(SLUG + "-390-night-before", false); }
}
await go(PAGE + "#t=" + hash(new Date(serve.getTime() - STEPS[0].at * 60000 - 60 * 60000)));
check("an hour before the first move, no block is marked", (await guide()).every((x: any) => !x.now), "");

// ---------------- the rest of the page ----------------
await go(URL0);
const sw = await ev(`({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, bw: document.body.scrollWidth})`);
check("no sideways scroll at 390", sw.sw <= 390 && sw.bw <= 390, JSON.stringify(sw));
const html = await ev(`document.documentElement.outerHTML`);
check("no em or en dashes", !/[–—]/.test(html), "");
const heatWords = await ev(`[].filter.call(document.querySelectorAll('#steps .row'),function(e){var t=e.querySelector('.txt').textContent;return /\\b(medium|medium-high|medium-low|high|low|simmer|boil|fry|frying)\\b/i.test(t) && !/°F/.test(t) && !/Slow Cook|Keep Warm|Sealing|Venting|cooker/i.test(t);}).map(function(e){return e.getAttribute('data-id');})`);
check("every heat step carries a °F number", heatWords.length === 0, heatWords.join(","));
await go(base + "week.html#t=" + DAY + "T09:00"); await sleep(1500);
const wk = await ev(`document.body.innerText`);
check("the weekly menu still reads the page (first step shown)", !new RegExp(SLUG).test(JSON.stringify(await ev(`typeof WEEK === "undefined" ? [] : WEEK.days`))) || wk.includes(STEPS[0].short), "");
await go(base + "index.html#t=" + DAY + "T09:00");
check("index lists the page", await ev(`!!document.querySelector('a[href*="${SLUG}"]')`), "no link");
check("no console errors or failed requests", errors.length === 0, errors.join(" || "));
check("no speech", (await ev(`window.__spoke`)) === 0, "spoke");
writeFileSync(join(out, SLUG + "-results.json"), JSON.stringify(results, null, 1));
console.log(`${results.filter(x => x.ok).length} of ${results.length} passed`);
ws.close(); edge.kill(); srv.stop(); process.exit(results.every(x => x.ok) ? 0 : 1);
