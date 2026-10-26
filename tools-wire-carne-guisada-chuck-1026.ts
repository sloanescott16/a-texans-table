// Job 1026-1206-h20: updates the carne-guisada entry in recipes.json and the index DATA copy, bumps the sw.js cache.
// bun wire.ts <siteFolder>
import { readFileSync, writeFileSync } from "fs";
const W = process.argv[2];
const crlf = (s: string) => s.replace(/\r?\n/g, "\r\n");
const rjRaw = readFileSync(W + "/recipes.json", "utf8");
const rj = JSON.parse(rjRaw);
const e = rj.recipes.find((r: any) => r.slug === "carne-guisada");
if (!e) throw new Error("no carne-guisada");
Object.assign(e, {
  sub: "Monday night, Instant Pot. One chuck pot roast in 1.5 inch cubes, seared hard in the cast iron, onion and bell pepper in the drippings with garlic, chili powder, cumin and oregano, then 25 minutes under pressure in tomato and beef stock, gravy thickened with a flour slurry at the end. Rice and tortillas. Mild in the pot, jalapeno on the side. Set the time you want to eat and every step runs itself backward.",
  blurb: "Cast iron sear · Instant Pot 25 minutes · slurry gravy · rice at 5:10",
  heat: ["stovetop"], total: 130, active: 75, band: "hour", time: "cut at 4:20, eat at 6:30",
  ahead: false, steps: 21,
  ingredients: ["beef chuck roast (1.5 inch cubes)", "kosher salt", "ground black pepper", "beef tallow", "yellow onion", "green bell pepper", "jarred minced garlic", "chili powder", "ground cumin", "dried oregano", "beef bouillon paste", "tomato sauce", "bay leaf", "all-purpose flour", "jasmine rice", "flour tortillas", "cilantro", "red onion", "jalapeno"],
});
const indent = /\n( +)"/.exec(rjRaw)![1].length;
writeFileSync(W + "/recipes.json", crlf(JSON.stringify(rj, null, indent) + (rjRaw.endsWith("\n") ? "\n" : "")));
let idx = readFileSync(W + "/index.html", "utf8");
if (!/var DATA = .*;\r?\n/.test(idx)) throw new Error("no DATA");
idx = idx.replace(/var DATA = .*;(\r?\n)/, (_m, nl) => "var DATA = " + JSON.stringify(rj) + ";" + nl);
writeFileSync(W + "/index.html", idx);
let sw = readFileSync(W + "/sw.js", "utf8");
const v = /var CACHE = "kitchen-v(\d+)";/.exec(sw)!;
sw = sw.replace(v[0], `var CACHE = "kitchen-v${+v[1] + 1}";`);
writeFileSync(W + "/sw.js", sw);
console.log("wired; cache v" + (+v[1] + 1));
