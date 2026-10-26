// Job 1026-1618-ixh checks for the shared step player (step-player.js) on carne-guisada.html; harness from job 1026-1206-h20.
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
const PORT = 18993, DBG = 18994;
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
// Step player stubs: a movable clock (localStorage __clk offset, survives reload), vibrate, wake lock and Web Audio recorders. No sound.
await S("Page.addScriptToEvaluateOnNewDocument", { source: `
(function(){var D0=window.Date;function off(){try{return +localStorage.getItem('__clk')||0}catch(e){return 0}}function F2(){var a=[].slice.call(arguments);if(!(this instanceof F2))return new D0(D0.now()+off()).toString();return a.length?new (Function.prototype.bind.apply(D0,[null].concat(a)))():new D0(D0.now()+off());}F2.prototype=D0.prototype;F2.now=function(){return D0.now()+off()};F2.UTC=D0.UTC;F2.parse=D0.parse;window.Date=F2;})();
window.__vib=0;window.__wl=0;window.__osc=0;
try{Object.defineProperty(navigator,'vibrate',{value:function(){window.__vib++;return true},configurable:true});}catch(e){}
try{Object.defineProperty(navigator,'wakeLock',{value:{request:function(){window.__wl++;return Promise.resolve({release:function(){return Promise.resolve()},addEventListener:function(){}})}},configurable:true});}catch(e){}
(function(){function AC(){this.currentTime=0;this.state='running';this.destination={};}AC.prototype.resume=function(){return Promise.resolve()};AC.prototype.createOscillator=function(){return {type:'',frequency:{value:0},connect:function(){},start:function(){window.__osc++},stop:function(){}}};AC.prototype.createGain=function(){return {gain:{setValueAtTime:function(){},exponentialRampToValueAtTime:function(){}},connect:function(){}}};window.AudioContext=AC;window.webkitAudioContext=AC;})();
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
const URL1 = base + "carne-guisada.html#t=2026-10-26T16:40";
const adv = (ms: number) => ev(`localStorage.setItem('__clk', String((+localStorage.getItem('__clk')||0) + ${ms})); StepPlayer.tick(); 1`);
const P = () => ev(`({idx:StepPlayer.state.idx, playing:StepPlayer.state.playing, open:StepPlayer.state.open, diff:+document.getElementById('spReady').getAttribute('data-diff'), cd:document.getElementById('spCd').textContent, cdl:document.getElementById('spCdl').textContent, phase:document.getElementById('spPhase').textContent, ready:document.getElementById('spReady').textContent})`);
const wantDiff = (remMs = -1) => ev(`(function(){var n=Date.now(), s=StepPlayer.state, rem=${remMs}>=0?${remMs}:Math.max(0,StepPlayer.durMs(s.idx)-((s.playing?n:s.pausedAt)-s.start));var nx=STEPS[s.idx+1];var ready=n+rem+(nx?nx.at*60000:0);return Math.round((new Date(2026,9,26,18,30).getTime()-ready)/60000)||0;})()`);
await go(URL1); await ev(`localStorage.clear()`); errors.length = 0; await go(URL1);
check("player button on the page, player closed at load", await ev(`!!document.getElementById('spFab') && !document.getElementById('sp').classList.contains('open')`), "");
await ev(`document.getElementById('spFab').click(); 1`); await sleep(200);
check("player opens", await ev(`document.getElementById('sp').classList.contains('open')`), "");
const bar = await ev(`(function(){var b=document.querySelector('#sp .sp-bar').getBoundingClientRect();var h=[].map.call(document.querySelectorAll('#sp .sp-bar button'),function(x){return x.getBoundingClientRect().height});return {bottom:b.bottom, vh:innerHeight, h:h};})()`);
check("play, back, forward fixed at the bottom, thumb sized", Math.abs(bar.bottom - bar.vh) < 2 && bar.h.length === 3 && bar.h.every((x: number) => x >= 60), JSON.stringify(bar));
const uses0 = await ev(`[document.getElementById('spUses').textContent, document.querySelector('#steps .row[data-id="g1"] .uses').textContent]`);
check("step 1 shows its scaled ingredient on top (beef 2 1/4 lb)", uses0[0] === uses0[1] && /2 1\/4 lb/.test(uses0[0]), JSON.stringify(uses0));
check("instruction and next step shown", await ev(`/Cut the beef/.test(document.getElementById('spTxt').textContent) && /Dice onion and pepper/.test(document.getElementById('spNext').textContent)`), "");
await ev(`document.getElementById('inc').click(); 1`); await sleep(300);
const uses5 = await ev(`[document.getElementById('spUses').textContent, document.querySelector('#steps .row[data-id="g1"] .uses').textContent]`);
check("servings change rescales the player's amounts", uses5[0] === uses5[1] && uses5[0] !== uses0[0], JSON.stringify(uses5));
await ev(`document.getElementById('dec').click(); 1`); await sleep(200);
let p = await P();
check("phase shown with progress: Mise en place, step 1 of 4", p.phase === "Mise en place · step 1 of 4", p.phase);
await ev(`(function(){var s=document.getElementById('spPick');s.value='2';s.dispatchEvent(new Event('change',{bubbles:true}));})(); 1`); await sleep(200);
p = await P();
check("start from step 3 via the picker", p.idx === 2 && !p.playing && /Cast iron on/.test(await ev(`document.getElementById('spShort').textContent`)), JSON.stringify(p));
check("dinner ready at step 3 from 4:40 pm: 6:31 pm, 1 min behind 6:30", p.diff === -1 && /6:31 pm/.test(p.ready) && /1 min behind/.test(p.ready), p.ready);
await ev(`document.getElementById('spPlay').click(); 1`); await sleep(300);
p = await P();
check("play starts and asks for a wake lock", p.playing && (await ev(`window.__wl`)) >= 1, JSON.stringify(p) + " wl " + await ev(`window.__wl`));
await adv(60000); p = await P();
check("countdown runs on the wall clock (about 1:00 left of 2)", /^(1:00|0:59|0:58)$/.test(p.cd) && p.diff === -1, JSON.stringify(p));
await ev(`document.getElementById('spPlay').click(); 1`); const cdPaused = (await P()).cd;
await adv(5 * 60000); p = await P();
check("pause holds the countdown", !p.playing && p.cd === cdPaused, cdPaused + " / " + p.cd);
check("dinner time slides 5 min after a 5 min pause (6 min behind)", p.diff === -6 && /6 min behind/.test(p.ready), p.ready);
await ev(`document.getElementById('spPlay').click(); 1`);
const vib0 = await ev(`window.__vib`);
await adv(65000); await sleep(100); p = await P();
check("time out moves on by itself to step 4", p.idx === 3 && p.playing, JSON.stringify(p));
check("auto-advance flashes, vibrates and says so", (await ev(`window.__vib`)) > vib0 && await ev(`window.__spFlashes >= 1 && document.getElementById('spMsg').classList.contains('on') && /Time's up/.test(document.getElementById('spMsg').textContent)`), "vib " + await ev(`window.__vib`));
check("chime off by default, no oscillator yet", (await ev(`window.__osc`)) === 0 && /Chime off/.test(await ev(`document.getElementById('spChime').textContent`)), "");
await ev(`document.getElementById('spChime').click(); 1`);
const osc0 = await ev(`window.__osc`);
check("chime switches on with one tap (test beep through the stub)", osc0 > 0 && /Chime on/.test(await ev(`document.getElementById('spChime').textContent`)), String(osc0));
await adv(8 * 60000 + 2000); p = await P();
check("next time out chimes too (step 5, sear)", p.idx === 4 && (await ev(`window.__osc`)) > osc0, JSON.stringify(p));
await ev(`document.getElementById('spBack').click(); 1`); p = await P();
check("back a step", p.idx === 3 && p.playing, JSON.stringify(p));
await ev(`document.getElementById('spFwd').click(); document.getElementById('spFwd').click(); document.getElementById('spFwd').click(); 1`); p = await P();
const wd = await wantDiff();
check("forward three steps to step 7, dinner time recalculated", p.idx === 6 && p.diff === wd, JSON.stringify(p) + " want " + wd);
check("Fire phase progress: step 3 of 6", p.phase === "Fire · step 3 of 6", p.phase);
const chips = await ev(`[].map.call(document.querySelectorAll('#spPhases button'),function(b){return b.textContent})`);
check("five phase chips", chips.join("|") === "Mise en place|Fire|Hands-off|Finish|Plate", chips.join("|"));
await ev(`document.querySelector('#spPhases [data-phase="3"]').click(); 1`); p = await P();
check("jump to Finish lands on its first step (vent, spoon test)", p.idx === 15 && p.phase === "Finish · step 1 of 3" && await ev(`document.querySelector('#spPhases [data-phase="3"]').classList.contains('on')`), JSON.stringify(p));
check("dinner time right after a phase jump", p.diff === await wantDiff(), JSON.stringify(p));
await ev(`document.querySelector('#spPhases [data-phase="2"]').click(); 1`); p = await P();
check("jump back to Hands-off, step 1 of 5", p.idx === 10 && p.phase === "Hands-off · step 1 of 5", JSON.stringify(p));
check("no wait nudge on an active step", !(await ev(`document.getElementById('spWait').classList.contains('on')`)), "");
await ev(`document.getElementById('spFwd').click(); document.getElementById('spFwd').click(); document.getElementById('spFwd').click(); 1`); p = await P();
const w14 = await ev(`[].map.call(document.querySelectorAll('#spWait span'),function(s){return s.getAttribute('data-id')})`);
check("pressure step is hands off with its own countdown (28 min)", p.idx === 13 && await ev(`document.getElementById('spPass').classList.contains('on')`) && /You have 28 min/.test(p.cdl) && /^(28:00|27:5\d)$/.test(p.cd), JSON.stringify(p));
check("while you wait nudge lists rice and wipe the pan", await ev(`document.getElementById('spWait').classList.contains('on') && /While you wait/.test(document.getElementById('spWait').textContent)`) && w14.join() === "g12,g13", w14.join());
await ev(`document.querySelector('#steps .row[data-id="g12"] input').click(); 1`); await ev(`StepPlayer.go(14); 1`);
p = await P();
const w15 = await ev(`[].map.call(document.querySelectorAll('#spWait span'),function(s){return s.getAttribute('data-id')+(s.classList.contains('done')?'*':'')})`);
check("natural release: 15 min countdown, nudge marks the ticked rice done", /You have 15 min/.test(p.cdl) && w15.join() === "g12*,g13,g14", w15.join() + " " + p.cdl);
await ev(`document.querySelector('#steps .row[data-id="g12"] input').click(); 1`);
check("no sideways scroll with the player open", await ev(`document.documentElement.scrollWidth <= 375`), "");
await shot("player-375-release", false);
await adv(4 * 60000);
const before = await P();
await go(URL1); await sleep(800); p = await P();
check("reload resumes: open, same step, still playing, wake lock asked again", p.open && p.idx === 14 && p.playing && (await ev(`window.__wl`)) >= 1, JSON.stringify(p) + " before " + JSON.stringify(before));
check("reload keeps the elapsed time (about 11 min left)", /^1[01]:\d\d$/.test(p.cd), p.cd);
await adv(11 * 60000 + 2 * 60000 + 30000); await sleep(100); p = await P();
check("phone locked through two steps lands on the right one (thicken)", p.idx === 16 && /^5:[23]\d$/.test(p.cd), JSON.stringify(p));
await ev(`document.dispatchEvent(new Event('visibilitychange')); 1`); await sleep(200);
check("wake lock asked again on visibilitychange", (await ev(`window.__wl`)) >= 2, String(await ev(`window.__wl`)));
await shot("player-375-thicken", false);
await ev(`document.getElementById('spClose').click(); 1`);
check("closing keeps it running, the button shows the step and time", await ev(`!document.getElementById('sp').classList.contains('open') && /Step 17 /.test(document.getElementById('spFab').textContent)`), await ev(`document.getElementById('spFab').textContent`));
check("old page parts intact: 21 rows, 21 checklist rows, 22 ingredients", await ev(`document.querySelectorAll('#steps .row').length===21 && document.querySelectorAll('#checklist .ck').length===21 && document.querySelectorAll('#ing .item').length===22`), "");
check("no em dashes", !/—/.test(await ev(`document.documentElement.outerHTML`)), "");
const swTxt = await Bun.file(join(folder, "sw.js")).text();
check("service worker cache bumped and lists step-player.js", /kitchen-v20/.test(swTxt) && /"\.\/step-player\.js"/.test(swTxt), "");
check("no console errors or failed requests", errors.length === 0, errors.join(" || "));
check("no speech", (await ev(`window.__spoke`)) === 0, "spoke");
writeFileSync(join(out, "results.json"), JSON.stringify(results, null, 1));
console.log(`${results.filter(x => x.ok).length} of ${results.length} passed`);
ws.close(); edge.kill(); srv.stop(); process.exit(0);
