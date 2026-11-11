// Weekly menu ("This week"): writes the week in week.json into week.html and the front page.
// Usage: bun tools-gen-week.ts <site folder>     (node --experimental-strip-types tools-gen-week.ts <site folder> works too)
//
// week.json is the only thing to edit when the plan changes:
//   { "title": "Louisiana week", "days": [ { "date": "2026-11-08", "slug": "grillades-and-grits", "also": ["chicken-broth"] },
//                                          { "date": "2026-11-10", "label": "Eating out" }, ... ] }
// A cook night has a slug (its recipe page). A night with no cooking has a label ("Eating out", "Off duty").
// "also" lists side cooks made that day (broth and the like). Days run one after another with no gaps.
// week.html reads each night's clock and ingredients live from its recipe page, so nothing about a recipe is copied here.
import { readFileSync, writeFileSync, existsSync } from "fs";
const W = process.argv[2];
if (!W) throw new Error("usage: tools-gen-week.ts <site folder>");
const week = JSON.parse(readFileSync(W + "/week.json", "utf8"));
const rj = JSON.parse(readFileSync(W + "/recipes.json", "utf8"));
if (/[\u2013\u2014]/.test(JSON.stringify(week))) throw new Error("dash in week.json");
if (!Array.isArray(week.days) || !week.days.length) throw new Error("week.json has no days");
let prev: number | null = null;
for (const d of week.days) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) throw new Error("bad date " + d.date);
  const t = Date.UTC(+d.date.slice(0, 4), +d.date.slice(5, 7) - 1, +d.date.slice(8, 10));
  if (prev !== null && t !== prev + 86400000) throw new Error("days must run one after another: " + d.date);
  prev = t;
  if (!d.slug && !d.label) throw new Error(d.date + " needs a slug or a label");
  for (const s of (d.slug ? [d.slug] : []).concat(d.also || [])) {
    if (!existsSync(W + "/" + s + ".html")) throw new Error("no page for " + s);
    if (!rj.recipes.some((r: any) => r.slug === s)) throw new Error(s + " is not in recipes.json");
  }
}
// the dish name rides along as the fallback when a page cannot be read
for (const d of week.days) if (d.slug) d.name = rj.recipes.find((r: any) => r.slug === d.slug).name;
const line = "var WEEK = " + JSON.stringify(week) + ";\n";
for (const f of ["week.html", "index.html"]) {
  const src = readFileSync(W + "/" + f, "utf8");
  const crlf = /\r\n/.test(src);
  const lf = src.replace(/\r\n/g, "\n");
  if (!/var WEEK = .*;\n/.test(lf)) throw new Error("no WEEK line in " + f);
  const out = lf.replace(/var WEEK = .*;\n/, () => line);
  writeFileSync(W + "/" + f, crlf ? out.replace(/\n/g, "\r\n") : out);
}
// service worker: the week page joins the shell, cache bumped the first time only
let sw = readFileSync(W + "/sw.js", "utf8");
if (!sw.includes('"./week.html"')) {
  if (!sw.includes('"./index.html", ')) throw new Error("sw.js shell not as expected");
  sw = sw.replace('"./index.html", ', '"./index.html", "./week.html", ');
  const cm = sw.match(/var CACHE = "kitchen-v(\d+)";/);
  if (!cm) throw new Error("no CACHE line in sw.js");
  sw = sw.replace(cm[0], `var CACHE = "kitchen-v${+cm[1] + 1}";`);
  writeFileSync(W + "/sw.js", sw);
}
console.log("week written:", week.days.map((d: any) => d.date.slice(5) + " " + (d.slug || d.label)).join(" | "));
