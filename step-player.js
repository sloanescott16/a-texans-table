/* Step player: play, pause, back and forward through a recipe's steps like a playlist.
   Shared by recipe pages. It reads the page's own globals (STEPS with their back-timed
   "at" minutes, byId, label, fillT, serveDate, clockOf, hhmm, state, KEY), so a page only
   needs this file after its main script. Optional per-page settings before it:
     var STEP_PLAYER = { passive: { stepId: "what is happening while you wait" } };
   Every time is wall-clock (Date.now), so a locked phone or a reload never drifts. */
(function(){
  if(typeof STEPS === "undefined" || !STEPS.length) return;
  var OPTS = window.STEP_PLAYER || {};
  var PASSIVE = OPTS.passive || {};
  var PKEY = (typeof KEY !== "undefined" ? KEY : location.pathname) + ":player";
  var N = STEPS.length, LAST = N - 1;
  function idxOf(id){ for(var i=0;i<N;i++){ if(STEPS[i].id === id) return i; } return -1; }
  /* Phases, like chapters of a playlist: [{name, from: firstStepId, wait: [stepIds]}] in step order.
     A phase runs from its first step to the step before the next phase. "wait" lists the
     recipe's own steps to do during a hands-off window in that phase. */
  var PHASES = [];
  (OPTS.phases || []).forEach(function(ph){
    var a = idxOf(ph.from); if(a < 0) return;
    PHASES.push({name: ph.name, a: a, wait: (ph.wait || []).map(idxOf).filter(function(i){ return i >= 0; })});
  });
  PHASES.sort(function(x, y){ return x.a - y.a; });
  PHASES.forEach(function(ph, k){ ph.b = k + 1 < PHASES.length ? PHASES[k+1].a - 1 : LAST; });
  function phaseOf(i){ for(var k=PHASES.length-1;k>=0;k--){ if(i >= PHASES[k].a) return k; } return -1; }

  /* Step i runs until step i+1 is due: the gap between their back-timed offsets. */
  function durMs(i){
    if(i >= LAST) return 0;
    return Math.max(0, (STEPS[i].at - STEPS[i+1].at)) * 60000;
  }
  function untilEatAfter(i){ return i >= LAST ? 0 : STEPS[i+1].at * 60000; }

  var P = {open:false, idx:0, start:0, pausedAt:null, playing:false, chime:false};
  function now(){ return Date.now(); }
  function save(){ try{ localStorage.setItem(PKEY, JSON.stringify(P)); }catch(e){} }
  function load(){
    try{
      var v = JSON.parse(localStorage.getItem(PKEY) || "null");
      if(v && typeof v.idx === "number"){
        P.open = !!v.open; P.idx = Math.min(LAST, Math.max(0, v.idx));
        P.start = +v.start || now(); P.pausedAt = v.pausedAt == null ? null : +v.pausedAt;
        P.playing = !!v.playing; P.chime = !!v.chime;
        if(!P.playing && P.pausedAt == null) P.pausedAt = P.start;
      } else { P.start = P.pausedAt = now(); }
    }catch(e){ P.start = P.pausedAt = now(); }
  }
  function elapsed(){ return (P.playing ? now() : (P.pausedAt == null ? now() : P.pausedAt)) - P.start; }
  function remaining(){ return durMs(P.idx) - elapsed(); }

  /* ---------- styles ---------- */
  var css = '' +
  '#spFab{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom));z-index:40;border:0;border-radius:28px;background:var(--citrus,#A85C34);color:#fff;font-family:var(--mono,monospace);font-size:15px;padding:14px 20px;box-shadow:0 3px 12px rgba(0,0,0,.25);cursor:pointer}' +
  '#sp{position:fixed;inset:0;z-index:60;background:var(--ground,#F3EBDA);color:var(--ink,#33291F);display:none;flex-direction:column}' +
  '#sp.open{display:flex}' +
  '#sp .sp-top{display:flex;gap:8px;align-items:center;padding:10px max(14px,env(safe-area-inset-left)) 8px;border-bottom:1px solid var(--rule,#D9C9AF);flex-wrap:wrap}' +
  '#sp .sp-ready{flex:1 1 100%;font-family:var(--mono,monospace);font-size:15px;line-height:1.35}' +
  '#sp .sp-ready b{font-size:20px}' +
  '#sp .sp-ahead{color:var(--brine,#7E7047)} #sp .sp-behind{color:var(--citrus,#A85C34)}' +
  '#sp select,#sp .sp-small{font-family:var(--mono,monospace);font-size:13px;color:var(--ink,#33291F);background:var(--field,#fff);border:1px solid var(--rule,#D9C9AF);border-radius:3px;padding:8px;min-height:40px}' +
  '#sp select{flex:1 1 0;min-width:0}' +
  '#sp .sp-small{cursor:pointer;white-space:nowrap}' +
  '#sp .sp-small[aria-pressed=true]{background:var(--brine-bg,#E8E3D0);color:var(--brine,#7E7047)}' +
  '#sp .sp-phases{flex:1 1 100%;display:flex;gap:6px;overflow-x:auto;padding:2px 0;scrollbar-width:none}' +
  '#sp .sp-phases button{flex:0 0 auto;font-family:var(--mono,monospace);font-size:12px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--rule,#D9C9AF);background:transparent;color:var(--muted,#7A6A56);border-radius:16px;padding:8px 12px;min-height:38px;cursor:pointer}' +
  '#sp .sp-phases button.on{background:var(--ink,#33291F);color:var(--ground,#F3EBDA);border-color:transparent}' +
  '#sp .sp-phase{font-family:var(--stamp,monospace);font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:var(--citrus,#A85C34);margin-bottom:2px}' +
  '#sp .sp-wait{display:none;font-size:15px;border:1px dashed var(--brine,#7E7047);border-radius:3px;padding:8px 11px;margin:0 0 12px}' +
  '#sp .sp-wait.on{display:block}' +
  '#sp .sp-wait b{font-family:var(--mono,monospace);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--brine,#7E7047);display:block;margin-bottom:3px}' +
  '#sp .sp-wait span{display:block;padding:2px 0} #sp .sp-wait span.done{color:var(--muted,#7A6A56);text-decoration:line-through}' +
  '#sp .sp-body{flex:1;overflow-y:auto;padding:14px max(16px,env(safe-area-inset-left)) 20px}' +
  '#sp .sp-num{font-family:var(--mono,monospace);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#7A6A56)}' +
  '#sp .sp-short{font-family:var(--stamp,monospace);font-size:24px;line-height:1.15;margin:4px 0 10px;text-transform:uppercase;letter-spacing:.02em}' +
  '#sp .sp-cd{font-family:var(--mono,monospace);font-size:56px;line-height:1;margin:2px 0 4px}' +
  '#sp .sp-cdl{font-family:var(--mono,monospace);font-size:13px;color:var(--muted,#7A6A56);margin-bottom:12px}' +
  '#sp .sp-pass{display:none;font-family:var(--mono,monospace);font-size:14px;background:var(--brine-bg,#E8E3D0);color:var(--brine,#7E7047);border-radius:3px;padding:9px 11px;margin:0 0 12px}' +
  '#sp .sp-pass.on{display:block}' +
  '#sp .sp-uses{border-left:4px solid var(--citrus,#A85C34);padding:6px 0 6px 12px;margin:0 0 12px}' +
  '#sp .sp-uses .ui{font-size:19px;line-height:1.4}' +
  '#sp .sp-txt{font-size:19px;line-height:1.45}' +
  '#sp .sp-next{margin-top:18px;padding-top:12px;border-top:1px dashed var(--rule,#D9C9AF);color:var(--muted,#7A6A56);font-size:15px}' +
  '#sp .sp-next b{color:var(--ink,#33291F)}' +
  '#sp .sp-bar{display:flex;gap:8px;padding:10px max(12px,env(safe-area-inset-left)) calc(10px + env(safe-area-inset-bottom));border-top:1px solid var(--rule,#D9C9AF);background:var(--card,#FAF4E7)}' +
  '#sp .sp-bar button{flex:1;min-height:72px;font-size:26px;border:1px solid var(--rule,#D9C9AF);border-radius:6px;background:var(--field,#fff);color:var(--ink,#33291F);cursor:pointer;font-family:var(--mono,monospace)}' +
  '#sp .sp-bar #spPlay{flex:1.6;background:var(--citrus,#A85C34);color:#fff;border-color:transparent}' +
  '#sp .sp-bar button:active{filter:brightness(.85)}' +
  '#sp .sp-msg{display:none;font-family:var(--mono,monospace);font-size:15px;background:var(--citrus,#A85C34);color:#fff;padding:10px 14px}' +
  '#sp .sp-msg.on{display:block}' +
  '#sp.sp-flash{animation:spFlash 1.4s ease-out}' +
  '@keyframes spFlash{0%,30%,60%{background:var(--citrus,#A85C34)}15%,45%,100%{background:var(--ground,#F3EBDA)}}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- markup ---------- */
  var fab = document.createElement("button");
  fab.id = "spFab"; fab.type = "button"; fab.textContent = "▶ Step player";
  document.body.appendChild(fab);
  var box = document.createElement("div");
  box.id = "sp"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Step player");
  box.innerHTML =
    '<div class="sp-top">' +
      '<div class="sp-ready" id="spReady"></div>' +
      '<div class="sp-phases" id="spPhases"></div>' +
      '<select id="spPick" aria-label="Start from step"></select>' +
      '<button type="button" class="sp-small" id="spChime" aria-pressed="false">Chime off</button>' +
      '<button type="button" class="sp-small" id="spClose" aria-label="Close the player">Close</button>' +
    '</div>' +
    '<div class="sp-msg" id="spMsg"></div>' +
    '<div class="sp-body" id="spBody">' +
      '<div class="sp-phase" id="spPhase"></div>' +
      '<div class="sp-num" id="spNum"></div>' +
      '<div class="sp-short" id="spShort"></div>' +
      '<div class="sp-pass" id="spPass"></div>' +
      '<div class="sp-wait" id="spWait"></div>' +
      '<div class="sp-cd" id="spCd"></div>' +
      '<div class="sp-cdl" id="spCdl"></div>' +
      '<div class="sp-uses" id="spUses"></div>' +
      '<div class="sp-txt" id="spTxt"></div>' +
      '<div class="sp-next" id="spNext"></div>' +
    '</div>' +
    '<div class="sp-bar">' +
      '<button type="button" id="spBack" aria-label="Back a step">⏮</button>' +
      '<button type="button" id="spPlay" aria-label="Play">▶</button>' +
      '<button type="button" id="spFwd" aria-label="Forward a step">⏭</button>' +
    '</div>';
  document.body.appendChild(box);
  function $(id){ return document.getElementById(id); }

  /* ---------- helpers from the page, with plain fallbacks ---------- */
  function fmtClock(d){ if(typeof hhmm === "function") return hhmm(d); return d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"}); }
  function target(){
    if(typeof serveDate === "function") return serveDate();
    var d = new Date(); d.setHours(18, 30, 0, 0); return d;
  }
  function planned(i){ return typeof clockOf === "function" ? fmtClock(clockOf(STEPS[i].at)) : ""; }
  function usesHtml(s){
    var out = "", uses = s.uses || [];
    if(typeof byId !== "function" || typeof label !== "function") return "";
    for(var j=0;j<uses.length;j++){
      var pp = String(uses[j]).split("@"), part = pp[1] ? parseFloat(pp[1]) : 0;
      var it = byId(pp[0]); if(!it) continue;
      var l = label(it, part);
      out += '<span class="ui" data-ing="' + it.id + '"><b>' + l.qty + '</b> ' + l.name + (part === 0.5 ? ', half' : '') + '</span>';
    }
    return out;
  }
  function txt(s){ return typeof fillT === "function" ? fillT(s.txt) : s.txt; }
  function mmss(ms){
    var neg = ms < 0; ms = Math.abs(ms);
    var t = Math.ceil(ms / 1000), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
    var s = (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
    return (neg ? "-" : "") + s;
  }

  /* ---------- the picker ---------- */
  function fillPicker(){
    var html = "";
    for(var i=0;i<N;i++){
      var k = phaseOf(i);
      if(k >= 0 && PHASES[k].a === i) html += (i > PHASES[0].a ? '</optgroup>' : '') + '<optgroup label="' + PHASES[k].name + '">';
      var p = planned(i);
      html += '<option value="' + i + '">Step ' + (i+1) + (p ? ' · ' + p : '') + ' · ' + STEPS[i].short + '</option>';
    }
    if(PHASES.length) html += '</optgroup>';
    $("spPick").innerHTML = html;
    var ch = "";
    for(var j=0;j<PHASES.length;j++) ch += '<button type="button" data-phase="' + j + '">' + PHASES[j].name + '</button>';
    $("spPhases").innerHTML = ch;
    $("spPhases").style.display = PHASES.length ? "" : "none";
  }

  /* ---------- alerts on auto-advance ---------- */
  var actx = null;
  function chime(){
    if(!P.chime) return;
    try{
      var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
      if(!actx) actx = new AC();
      if(actx.state === "suspended" && actx.resume) actx.resume();
      [0, 0.32].forEach(function(off){
        var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + off;
        o.type = "sine"; o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.3);
      });
    }catch(e){}
  }
  var msgTimer = null;
  function announce(){
    box.classList.remove("sp-flash"); void box.offsetWidth; box.classList.add("sp-flash");
    setTimeout(function(){ box.classList.remove("sp-flash"); }, 1600);
    window.__spFlashes = (window.__spFlashes || 0) + 1;
    try{ if(navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 300]); }catch(e){}
    chime();
    var m = $("spMsg");
    m.textContent = "Time's up. Now step " + (P.idx + 1) + ": " + STEPS[P.idx].short;
    m.classList.add("on");
    clearTimeout(msgTimer); msgTimer = setTimeout(function(){ m.classList.remove("on"); }, 15000);
    fabText();
  }

  /* ---------- wake lock ---------- */
  var lock = null;
  function wantLock(){
    if(!P.playing || lock || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
    try{
      navigator.wakeLock.request("screen").then(function(l){
        lock = l; window.__spLockCount = (window.__spLockCount || 0) + 1;
        l.addEventListener && l.addEventListener("release", function(){ lock = null; });
      }).catch(function(){ lock = null; });
    }catch(e){}
  }
  function dropLock(){ try{ if(lock) lock.release(); }catch(e){} lock = null; }
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "visible"){ lock = null; wantLock(); tick(); }
  });

  /* ---------- moving about ---------- */
  function go(i, fromUser){
    P.idx = Math.min(LAST, Math.max(0, i));
    P.start = now(); P.pausedAt = P.playing ? null : P.start;
    if(fromUser){ $("spMsg").classList.remove("on"); }
    if(P.idx === LAST){ P.playing = false; P.pausedAt = P.start; dropLock(); }
    save(); render(true);
  }
  function play(){
    if(P.playing) return;
    if(P.idx === LAST) return;
    var t = now();
    P.start += t - (P.pausedAt == null ? t : P.pausedAt);
    P.pausedAt = null; P.playing = true;
    if(P.chime && !actx){ try{ var AC = window.AudioContext || window.webkitAudioContext; if(AC) actx = new AC(); }catch(e){} }
    save(); wantLock(); render(false);
  }
  function pause(){
    if(!P.playing) return;
    P.pausedAt = now(); P.playing = false;
    dropLock(); save(); render(false);
  }
  function open(){ P.open = true; box.classList.add("open"); save(); render(true); }
  function close(){ P.open = false; box.classList.remove("open"); save(); fabText(); }

  /* While playing, a step whose time has run out hands over to the next one, from the
     moment it was due, so a phone locked through two steps lands on the right one. */
  function advanceDue(){
    if(!P.playing) return false;
    var moved = false, t = now();
    while(P.idx < LAST && durMs(P.idx) > 0 && t - P.start >= durMs(P.idx)){
      P.start += durMs(P.idx); P.idx++; moved = true;
    }
    if(P.idx === LAST && moved){ P.playing = false; P.pausedAt = t; dropLock(); }
    if(moved) save();
    return moved;
  }

  /* ---------- drawing ---------- */
  var sig = "";
  function render(force){
    var s = STEPS[P.idx];
    var srv = (window.state && state.servings) || "";
    var nsig = P.idx + "|" + srv + "|" + (window.state ? state.serve : "");
    if(force || nsig !== sig){
      sig = nsig;
      fillPicker();
      $("spNum").textContent = "Step " + (P.idx + 1) + " of " + N + (planned(P.idx) ? " · planned " + planned(P.idx) : "");
      $("spShort").textContent = s.short;
      var u = usesHtml(s);
      $("spUses").innerHTML = u; $("spUses").style.display = u ? "" : "none";
      $("spTxt").innerHTML = txt(s);
      var nx = STEPS[P.idx + 1];
      $("spNext").innerHTML = nx ? 'Next: <b>' + nx.short + '</b>' + (PASSIVE[nx.id] ? ' (hands off)' : '') : 'Last step. Enjoy it.';
      $("spPick").value = String(P.idx);
      var pass = PASSIVE[s.id];
      $("spPass").textContent = pass ? "Hands off: " + pass : "";
      $("spPass").className = "sp-pass" + (pass ? " on" : "");
      var pk = phaseOf(P.idx), ph = PHASES[pk];
      $("spPhase").textContent = ph ? ph.name + " · step " + (P.idx - ph.a + 1) + " of " + (ph.b - ph.a + 1) : "";
      $("spPhase").setAttribute("data-phase", String(pk));
      var chips = $("spPhases").querySelectorAll("button");
      for(var c=0;c<chips.length;c++) chips[c].classList.toggle("on", c === pk);
      var w = "";
      if(pass && ph){
        var list = ph.wait.length ? ph.wait : [];
        for(var q=0;q<list.length;q++){
          var ws = STEPS[list[q]]; if(list[q] === P.idx) continue;
          var done = !!(window.state && state.checked && state.checked[ws.id]);
          w += '<span data-id="' + ws.id + '"' + (done ? ' class="done"' : '') + '>' + ws.short + '</span>';
        }
      }
      $("spWait").innerHTML = w ? '<b>While you wait</b>' + w : "";
      $("spWait").className = "sp-wait" + (w ? " on" : "");
      $("spBack").disabled = P.idx === 0;
      $("spFwd").disabled = P.idx === LAST;
    }
    var rem = remaining(), d = durMs(P.idx), t = now();
    if(P.idx === LAST){
      $("spCd").textContent = "Eat";
      $("spCdl").textContent = "";
    } else {
      $("spCd").textContent = mmss(Math.max(0, rem));
      var ends = fmtClock(new Date(t + Math.max(0, rem)));
      $("spCdl").textContent = (PASSIVE[s.id] ? "You have " + Math.max(0, Math.ceil(rem / 60000)) + " min, until " + ends : "Next step at " + ends) +
        " · " + Math.round(d / 60000) + " min step" + (P.playing ? "" : " · paused");
    }
    var ready = new Date(t + Math.max(0, rem) + untilEatAfter(P.idx));
    var tg = target(), diff = Math.round((tg.getTime() - ready.getTime()) / 60000);
    var rel = diff === 0 ? '<span class="sp-ahead">on time</span>' :
      diff > 0 ? '<span class="sp-ahead">' + diff + ' min ahead</span>' : '<span class="sp-behind">' + (-diff) + ' min behind</span>';
    $("spReady").innerHTML = 'Dinner ready <b>' + fmtClock(ready) + '</b> · ' + rel + ' of ' + fmtClock(tg);
    $("spReady").setAttribute("data-diff", String(diff));
    $("spPlay").textContent = P.playing ? "⏸" : "▶";
    $("spPlay").setAttribute("aria-label", P.playing ? "Pause" : "Play");
    $("spChime").textContent = P.chime ? "Chime on" : "Chime off";
    $("spChime").setAttribute("aria-pressed", P.chime ? "true" : "false");
    fabText();
  }
  function fabText(){
    if(P.playing) fab.textContent = "▶ Step " + (P.idx + 1) + " · " + mmss(Math.max(0, remaining()));
    else fab.textContent = "▶ Step player";
  }
  function tick(){
    var moved = advanceDue();
    if(moved) announce();
    if(P.open) render(moved); else fabText();
  }

  /* ---------- wiring ---------- */
  fab.addEventListener("click", open);
  $("spClose").addEventListener("click", close);
  $("spPlay").addEventListener("click", function(){ P.playing ? pause() : play(); });
  $("spBack").addEventListener("click", function(){ go(P.idx - 1, true); });
  $("spFwd").addEventListener("click", function(){ go(P.idx + 1, true); });
  $("spPhases").addEventListener("click", function(e){
    var b = e.target.closest ? e.target.closest("[data-phase]") : null; if(!b) return;
    var ph = PHASES[parseInt(b.getAttribute("data-phase"), 10)]; if(ph) go(ph.a, true);
  });
  $("spPick").addEventListener("change", function(e){ go(parseInt(e.target.value, 10) || 0, true); });
  $("spChime").addEventListener("click", function(){
    P.chime = !P.chime; save();
    if(P.chime){ try{ var AC = window.AudioContext || window.webkitAudioContext; if(AC && !actx) actx = new AC(); if(actx && actx.resume) actx.resume(); }catch(e){} chime(); }
    render(false);
  });
  /* Servings or eating-at changed on the page: redraw amounts and the target. */
  document.addEventListener("click", function(e){ if(e.target && (e.target.id === "inc" || e.target.id === "dec") && P.open) setTimeout(function(){ render(true); }, 0); });
  document.addEventListener("change", function(e){ if(e.target && e.target.id === "serve" && P.open) render(true); });

  load();
  fillPicker();
  advanceDue();
  if(P.open){ box.classList.add("open"); render(true); } else fabText();
  wantLock();
  setInterval(tick, 500);
  window.StepPlayer = {state: P, play: play, pause: pause, go: go, phases: PHASES, open: open, close: close, tick: tick, durMs: durMs};
})();
