// Quick guide and tick boxes on the "You'll use" lists (the Captain, 11 Nov 2026; rule in RECIPE-RULES.md).
// "Check list isn't helpful. A quick guide would be but that isn't."
// "For things like this with a bunch of little things in there, a little checkbox as I go down would be helpful."
//
// Two changes to a recipe page's own copy of the page code, written as functions so any generator can call them:
//   useTicks(html, slug)           every line of a step's "You'll use" list gets its own tick box
//   quickGuide(html, quick, slug)  the Checklist block at the top becomes a quick guide: a few blocks, one per stretch of work
// Both take the page as text with \n line ends and throw if the page code is not what they expect, so nothing is half applied.
//
// As a tool, for tick boxes on pages no generator writes:
//   bun tools-quick-guide-1111.ts <site folder> <slug> [slug ...]
import { readFileSync, writeFileSync } from "fs";

export type Quick = { at: number; mins?: string; lines: string[] };

const once = (h: string, slug: string, a: string, b: string) => {
  const i = h.indexOf(a);
  if (i < 0) throw new Error("no match in " + slug + ": " + a.slice(0, 90));
  if (h.indexOf(a, i + a.length) >= 0) throw new Error("more than one match in " + slug + ": " + a.slice(0, 90));
  return h.slice(0, i) + b + h.slice(i + a.length);
};

// ---------------- tick boxes on the "You'll use" lines ----------------
const UI_CSS = `.ui{display:block;font-size:15px;line-height:1.35;padding:1px 0}`;
const UI_CSS_NEW = `.ui{display:flex;gap:9px;align-items:flex-start;font-size:15px;line-height:1.35;padding:5px 0;cursor:pointer}
.ui .ub{flex:0 0 auto;width:18px;height:18px;margin-top:1px;border:1px solid var(--muted);border-radius:4px;background:#fff}
.ui.on .ub{background:var(--citrus);border-color:var(--citrus)}
.ui.on .ub::after{content:"";display:block;width:5px;height:10px;margin:1px 0 0 5px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.ui.on .ut{color:var(--muted);text-decoration:line-through}`;
// The two copies of the line in use: pages on the carne guisada pattern, and the older scampi pattern.
const UI_A = `u += '<span class="ui" data-ing="' + g0.it.id + '"><b>' + l.qty + '</b> ' + l.name + (got[j].length === 1 && g0.part === 0.5 ? ', half' : '') + '</span>';`;
const UI_A_NEW = `var uk = "use:" + s.id + ":" + g0.it.id, uon = state.checked[uk];
      u += '<span class="ui' + (uon ? ' on' : '') + '" data-ing="' + g0.it.id + '" data-use="' + uk + '" role="checkbox" tabindex="0" aria-checked="' + (uon ? 'true' : 'false') + '"><span class="ub"></span><span class="ut"><b>' + l.qty + '</b> ' + l.name + (got[j].length === 1 && g0.part === 0.5 ? ', half' : '') + '</span></span>';`;
const UI_B = `u += '<span class="ui"><b>' + l.qty + '</b> ' + l.name + '</span>';`;
const UI_B_NEW = `var uk = "use:" + s.id + ":" + it.id, uon = state.checked[uk];
      u += '<span class="ui' + (uon ? ' on' : '') + '" data-ing="' + it.id + '" data-use="' + uk + '" role="checkbox" tabindex="0" aria-checked="' + (uon ? 'true' : 'false') + '"><span class="ub"></span><span class="ut"><b>' + l.qty + '</b> ' + l.name + '</span></span>';`;
const SERVE_EL = `var serveEl = document.getElementById("serve");`;
const TICK_JS = `/* You'll use lists: each line ticks on its own as it goes in. The step card is a
   label, so the tap is stopped here or it would tick the whole step as well. */
function useTick(el){
  var k = el.getAttribute("data-use"), v = !state.checked[k];
  state.checked[k] = v;
  el.classList.toggle("on", v);
  el.setAttribute("aria-checked", v ? "true" : "false");
  save();
}
document.addEventListener("click", function(e){
  var el = e.target.closest ? e.target.closest("[data-use]") : null;
  if(!el) return;
  e.preventDefault();
  useTick(el);
});
document.addEventListener("keydown", function(e){
  if(e.key !== " " && e.key !== "Enter") return;
  var el = e.target.closest ? e.target.closest("[data-use]") : null;
  if(!el) return;
  e.preventDefault();
  useTick(el);
});
`;

export function useTicks(h: string, slug: string): string {
  if (h.includes("data-use=")) return h;
  h = once(h, slug, UI_CSS, UI_CSS_NEW);
  h = h.includes(UI_A) ? once(h, slug, UI_A, UI_A_NEW) : once(h, slug, UI_B, UI_B_NEW);
  return once(h, slug, SERVE_EL, TICK_JS + SERVE_EL);
}

// ---------------- the quick guide ----------------
const CHECK_HTML = `  <h2>Checklist</h2>
  <div class="card check" id="checklist"></div>`;
const QUICK_HTML = `  <h2>Quick guide</h2>
  <div class="card quick" id="quick"></div>`;
const QUICK_CSS = `/* Quick guide: the whole cook in a few lines, one block per stretch of work. */
.card.quick{padding:2px 14px}
.qg{padding:11px 0 12px;border-bottom:1px solid var(--rule)}
.qg:last-child{border-bottom:0}
.qg.now{background:var(--brine-bg);margin:0 -14px;padding:11px 14px 12px;border-radius:3px;border-bottom-color:transparent}
.qh{font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--citrus);margin:0 0 5px}
.qh .qm{color:var(--muted)}
.qh b{font-weight:400}
.ql{display:block;position:relative;font-size:14.5px;line-height:1.4;padding:2px 0 2px 13px}
.ql::before{content:"";position:absolute;left:1px;top:10px;width:4px;height:4px;border-radius:50%;background:var(--muted)}
.ql b{font-weight:700}
</style>`;
const QUICK_JS = `/* Quick guide: QUICK is a few blocks, one per stretch of work, each with its lines. In a line {Q:id} is an
   ingredient's scaled amount, {I:id} the amount with its name, and {t:N} the clock time N minutes before the finish. */
function fillQ(t){
  return fillT(t).replace(/\\{([QI]):(\\w+)\\}/g, function(m, k, id){
    var it = byId(id); if(!it) return m;
    var l = label(it);
    return '<b>' + l.qty + '</b>' + (k === "I" ? ' ' + l.name : '');
  });
}
function renderQuick(){
  var host = document.getElementById("quick"), html = "";
  if(!host) return;
  for(var i=0;i<QUICK.length;i++){
    var q = QUICK[i];
    html += '<div class="qg"' + (TIMED ? ' data-at="' + q.at + '"' : '') + '><div class="qh">' + (TIMED ? '<span class="qw">' + whenOf(q.at) + '</span>' : '') +
      (q.mins ? '<span class="qm">' + (TIMED ? ' · ' : '') + fillQ(q.mins) + '</span>' : '') + '</div>';
    for(var j=0;j<q.lines.length;j++){ html += '<span class="ql">' + fillQ(q.lines[j]) + '</span>'; }
    html += '</div>';
  }
  host.innerHTML = html;
}
/* The block for right now: the last one that starts at or before the step in play. */
function markQuick(at){
  var qs = document.querySelectorAll("#quick .qg"), cur = -1;
  for(var i=0;i<qs.length;i++){ qs[i].classList.remove("now"); if(at !== null && QUICK[i].at >= at) cur = i; }
  if(cur >= 0) qs[cur].classList.add("now");
}
function renderChecklist(){`;

export function quickGuide(h: string, quick: Quick[], slug: string): string {
  if (!quick.length) throw new Error("empty quick guide for " + slug);
  const steps = JSON.parse((/var STEPS = (\[[\s\S]*?\]);\n/.exec(h) || [])[1] || "[]");
  const ings = JSON.parse((/var ING = (\[[\s\S]*?\]);\n/.exec(h) || [])[1] || "[]");
  let last = Infinity;
  for (const q of quick) {
    if (!steps.some((s: any) => s.at === q.at)) throw new Error(slug + " quick guide block at " + q.at + " does not start on a step");
    if (q.at >= last) throw new Error(slug + " quick guide blocks must run in cook order");
    last = q.at;
    for (const t of q.lines.concat(q.mins || "")) {
      for (const m of t.matchAll(/\{([^}]*)\}/g)) {
        const k = /^([QI]):(\w+)$/.exec(m[1]);
        if (k ? !ings.some((i: any) => i.id === k[2]) : !/^t:\d+$/.test(m[1])) throw new Error(slug + " quick guide: bad token " + m[0]);
      }
    }
  }
  if (quick[0].at !== steps[0].at) throw new Error(slug + " quick guide must start on the first step");
  h = once(h, slug, CHECK_HTML, QUICK_HTML);
  h = once(h, slug, "</style>", QUICK_CSS);
  h = h.replace(/(var STEPS = .*;\n)/, (m) => m + "var QUICK = " + JSON.stringify(quick) + ";\n");
  if (!h.includes("var QUICK = ")) throw new Error("no STEPS line in " + slug);
  h = once(h, slug, "function renderChecklist(){", QUICK_JS);
  h = once(h, slug, "  renderChecklist();\n", "  renderChecklist();\n  renderQuick();\n");
  h = once(h, slug, `  for(i=0;i<cks.length;i++){ cks[i].classList.remove("now"); }\n`, `  for(i=0;i<cks.length;i++){ cks[i].classList.remove("now"); }\n  markQuick(null);\n`);
  h = once(h, slug, `    if(rows[0]) rows[0].classList.add("now");\n`, `    if(rows[0]) rows[0].classList.add("now");\n    markQuick(STEPS[0].at);\n`);
  h = once(h, slug, `  if(cks[cur]) cks[cur].classList.add("now");\n`, `  if(cks[cur]) cks[cur].classList.add("now");\n  markQuick(STEPS[cur].at);\n`);
  return h;
}

if (import.meta.main) {
  const [W, ...slugs] = process.argv.slice(2);
  if (!W || !slugs.length) throw new Error("usage: bun tools-quick-guide-1111.ts <site folder> <slug> [slug ...]");
  for (const slug of slugs) {
    const f = W + "/" + slug + ".html", src = readFileSync(f, "utf8"), crlf = /\r\n/.test(src);
    const out = useTicks(src.replace(/\r\n/g, "\n"), slug);
    writeFileSync(f, crlf ? out.replace(/\n/g, "\r\n") : out);
    console.log("tick boxes: " + slug);
  }
}
