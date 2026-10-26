// Job 1026-1206-h20: rebuilds carne-guisada.html as a pressure cooker cook for one 2.27 lb chuck roast,
// on the template of carne-asada-chuck.html (job 1026-1145-tuz, branch carne-asada-1026, commit f460b43).
// bun gen.ts <templatePage> <siteFolder>
import { readFileSync, writeFileSync } from "fs";
const [TPL, W] = process.argv.slice(2);
if (!TPL || !W) throw new Error("usage: bun gen.ts <template page> <site>");
let h = readFileSync(TPL, "utf8").replace(/\r\n/g, "\n");
function rep(a: string | RegExp, b: string) { const before = h; h = h.replace(a as any, () => b); if (h === before) throw new Error("no match: " + String(a).slice(0, 80)); }

rep("<title>Carne asada from chuck, Instant Pot</title>", "<title>Carne guisada</title>");
rep(/<h1>Carne asada from chuck, Instant Pot<\/h1>\n  <p class="sub">.*<\/p>\n  <p class="sub">.*<\/p>/,
`<h1>Carne guisada</h1>
  <p class="sub">Monday night, Instant Pot. One chuck pot roast in 1.5 inch cubes, seared hard in the cast iron, onion and bell pepper softened in the drippings with garlic, chili powder, cumin and oregano, then 25 minutes under pressure in tomato and beef stock. The gravy is thickened with a flour slurry at the end, so the cubes hold their shape and keep some bite. Rice cooker at 5:05, tortillas off the cast iron at the end. Mild in the pot, jalapeno on the side. Set the time you want to eat and every step runs itself backward.</p>`);

rep(/  <p class="note"><b>Why chunks[\s\S]*?(?=\n<\/div>\n\n<script>)/, `  <p class="note"><b>Why the cast iron, not Saute:</b> the cast iron holds 400 to 425°F through a batch of cold beef and reads true on the infrared; the Instant Pot's thin steel drops when the meat goes in, reads low, and steams more than it sears. The drippings and the deglaze carry every brown bit into the pot.</p>
  <p class="note"><b>Bite, not mush:</b> 1.5 inch cubes, 25 minutes on High and a 15 minute natural release leaves them tender but whole. The flour goes in at the end as a slurry, not before, so nothing scorches on the bottom under pressure and the gravy thickens in 5 minutes without stewing the beef further. Stir the slurry in gently.</p>
  <p class="note"><b>Salt, counted:</b> the last pressure cook was a touch salty, so this one carries 3/4 tsp of kosher salt on the beef at 4 servings, 1 tsp of beef bouillon paste in 1 cup of water (the usual 1 to 1, just less of it), and the salt already in the tomato sauce. That is about 2,900 mg of sodium for a 2.27 lb roast, on the gentle side. The last 1/4 tsp is only for a gravy that tastes flat after thickening.</p>
  <p class="note"><b>Pepper:</b> never before a sear. Each cube is peppered only on a face that has already seared and is facing up, after each turn, and again as it comes off.</p>
  <p class="note"><b>Mild for the boys:</b> ordinary mild chili powder, no cayenne. The jalapeno is for his bowl.</p>
  <p class="note"><b>Burn warning:</b> stock first, beef on it, tomato sauce poured over the top and not stirred in: thick tomato on the bottom is what throws a Burn warning. If it shows, Cancel, valve to Venting, scrape the bottom, add 1/4 cup water and start the 25 minutes again.</p>
  <p class="note"><b>Size:</b> the clock is set for 4 servings, about 2 1/4 lb, seared in two batches. At 6 to 8 sear in three batches and set Eating at 10 minutes later; the 25 minutes stay the same, as cube size sets the time. The servings stop at 3 to keep enough liquid in the Instant Pot.</p>
  <p class="note"><b>Done temperature:</b> pressure cooking takes the beef far past the 145°F safe point; the spoon test is the cue for tenderness. Leftovers into the fridge within 2 hours.</p>
  <p class="note"><b>Infrared readings:</b> infrared reads the surface only. Cast iron reads true. Aim close, straight down, and read two or three spots, as pans vary from edge to centre. Liquids, like the gravy, go by a probe.</p>`);
h = h.replace(" (the usual 1 to 1, just less of it)", " (the usual 1 to 1, just less of it)");

const ING = [
  { id: "beef", g: "Meat", per: 0.5675, step: 0.25, unit: "lb", name: "beef chuck roast", note: "one 2.27 lb chuck pot roast at 4 servings, in 1.5 inch cubes" },
  { id: "salt", g: "Meat", per: 0.1875, step: 0.25, unit: "tsp", name: "kosher salt", note: "on the cubes before the sear" },
  { id: "pepper", g: "Meat", per: 0.25, step: 0.25, unit: "tsp", name: "ground black pepper", note: "after the sear, never before" },
  { id: "tallow", g: "Meat", per: 0.25, step: 0.5, unit: "tbsp", name: "beef tallow", note: "half for each batch" },
  { id: "onion", g: "The pot", per: 0.25, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
  { id: "bell", g: "The pot", per: 0.25, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
  { id: "garlic", g: "The pot", per: 0.25, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
  { id: "chili", g: "The pot", per: 0.25, step: 0.25, unit: "tbsp", name: "chili powder", note: "the ordinary mild blend" },
  { id: "cumin", g: "The pot", per: 0.5, step: 0.25, unit: "tsp", name: "ground cumin" },
  { id: "oregano", g: "The pot", per: 0.25, step: 0.25, unit: "tsp", name: "dried oregano" },
  { id: "paste", g: "The pot", per: 0.25, step: 0.25, unit: "tsp", name: "beef bouillon paste" },
  { id: "water", g: "The pot", per: 0.25, step: 0.125, unit: "cup", name: "hot water", note: "the paste whisked into it makes the stock" },
  { id: "tsauce", g: "The pot", per: 0.25, step: 0.125, unit: "cup", name: "tomato sauce", note: "one small can at 4 servings" },
  { id: "bay", g: "The pot", per: 0.5, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
  { id: "flour", g: "Gravy", per: 0.5, step: 0.5, unit: "tbsp", name: "all-purpose flour" },
  { id: "cold", g: "Gravy", per: 0.0625, step: 0.125, unit: "cup", name: "cold water", note: "for the slurry" },
  { id: "salt2", g: "Gravy", per: 0.0625, step: 0.125, unit: "tsp", name: "kosher salt, to finish", note: "only if the gravy tastes flat" },
  { id: "rice", g: "To serve", per: 0.5, step: 0.25, unit: "cup", name: "jasmine rice", note: "water to the rice cooker's line" },
  { id: "tortillas", g: "To serve", per: 2, step: 1, unit: "", name: "flour tortilla", plural: "flour tortillas" },
  { id: "cilantro", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "cilantro", note: "chopped; the rest of the bunch is Wednesday's" },
  { id: "ronion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "red onion", note: "diced, the half left from Sunday" },
  { id: "jalap", g: "To serve", per: 0.25, step: 1, unit: "", name: "jalapeno", plural: "jalapenos", note: "sliced, his bowl only" },
];

const STEPS = [
  { id: "g1", at: 130, lane: "prep", short: "Cube the chuck, 1.5 inch", txt: "Cut the beef, 12 minutes. Cold from the fridge, on the board. Cut into 1.5 inch cubes along the seams; trim off only hard, thick fat and silver skin, keep the marbling. Even cubes cook evenly. Spread them on a tray.", uses: ["beef"] },
  { id: "g2", at: 118, lane: "prep", short: "Dice onion and pepper, make stock", txt: "Veg and stock, 7 minutes. Dice the onion and the bell pepper, together in one bowl. Whisk the bouillon paste into the hot water in a jug. Wash the board and your hands.", uses: ["onion", "bell", "paste", "water"] },
  { id: "g3", at: 111, lane: "pan", short: "Cast iron on to heat", txt: "Cast iron on the burner, empty, at medium-high. 10 minutes to come up evenly. Target 400 to 425°F on the infrared at the centre." },
  { id: "g4", at: 109, lane: "prep", short: "Pat dry, salt, rest", txt: "Pat dry and salt, then rest, 10 minutes in all. Pat every cube dry with paper towels, really dry, or it steams instead of searing. Sprinkle the salt over all sides. No pepper. Let them sit on the tray while the pan finishes heating.", uses: ["salt"] },
  { id: "g5", at: 101, lane: "pan", short: "Sear batch 1, first side, 3 min", txt: "Sear, batch 1, first side, 3 minutes. Cast iron reading 400 to 425°F. Half the tallow in and swirl. Half the cubes in, a finger's gap between them. Do not move them for 3 minutes, until a dark crust lets go of the pan on its own.", uses: ["tallow@0.5", "beef@0.5"] },
  { id: "g6", at: 98, lane: "pan", short: "Batch 1, second side, pepper, out", txt: "Batch 1, second side, 3 minutes. Turn each cube so the seared face is up, pepper it (a quarter of the pepper), 3 minutes untouched. Lift out and pepper the second seared face as it comes off (another quarter), into the Instant Pot inner pot. The Instant Pot stays off for now.", uses: ["pepper@0.5"] },
  { id: "g7", at: 95, lane: "pan", short: "Sear batch 2, first side, 3 min", txt: "Sear, batch 2, first side, 3 minutes. Back to 400°F first if the pan dropped, about a minute. The rest of the tallow, the rest of the cubes, a finger's gap. 3 minutes untouched.", uses: ["tallow@0.5", "beef@0.5"] },
  { id: "g8", at: 92, lane: "pan", short: "Batch 2, second side, pepper, out", txt: "Batch 2, second side, 3 minutes. Turn each cube so the seared face is up, pepper it (a quarter of the pepper), 3 minutes untouched. Lift out and pepper the second seared face as it comes off (the last quarter), into the Instant Pot with the rest.", uses: ["pepper@0.5"] },
  { id: "g9", at: 89, lane: "pan", short: "Onion and pepper, then spices", txt: "Veg in the drippings, 5 minutes. Heat to medium; let the pan fall to 325 to 350°F on the infrared. Onion and bell pepper in, stir 4 minutes until soft at the edges. Garlic, chili powder, cumin and oregano in, stir 1 minute until fragrant, not dark.", uses: ["onion", "bell", "garlic", "chili", "cumin", "oregano"] },
  { id: "g10", at: 84, lane: "pan", short: "Deglaze into the Instant Pot", txt: "Deglaze, 2 minutes. Cast iron off the heat. Pour in the stock; it will hiss. Scrape every brown bit off with a flat wooden spatula, then tip the lot, veg and all, over the beef in the Instant Pot." },
  { id: "g11", at: 82, lane: "cooker", short: "Tomato on top, seal, High 25 min", txt: "Load and seal, 2 minutes. Bay leaves in. Pour the tomato sauce over the top and do not stir it in. Lid on, valve to Sealing, Pressure Cook on High, 25 minutes. About 10 minutes to come to pressure; the count starts on its own, about {t:72}.", uses: ["bay", "tsauce"] },
  { id: "g12", at: 80, lane: "rice", short: "Rice cooker on", txt: "Rice cooker, 3 minutes. Rinse the rice, water to the line, start it. It holds on warm.", uses: ["rice"] },
  { id: "g13", at: 77, lane: "pan", short: "Wipe the cast iron, leave it out", txt: "Wipe the cast iron with a paper towel, 2 minutes. No wash: it does the tortillas later. Back burner." },
  { id: "g14", at: 75, lane: "prep", short: "Toppings into the fridge", txt: "Toppings, 8 minutes. Chop the cilantro, dice the red onion, slice the jalapeno into its own small bowl. Cover and into the fridge. Wash the board.", uses: ["cilantro", "ronion", "jalap"] },
  { id: "g15", at: 47, lane: "cooker", short: "Beep: natural release 15 min", txt: "Beep: the 25 minutes are done. Leave the valve on Sealing for a 15 minute natural release. The screen counts up from L0:00." },
  { id: "g16", at: 32, lane: "cooker", short: "Vent, bay out, spoon test", txt: "At L0:15, push the valve to Venting with a long spoon, hand and face clear of the steam. When the pin drops, lid off, tilted away from you. Bay leaves out. Spoon test: a cube should break under a spoon with a little push and hold its shape. If it fights, lid on, Sealing, 5 more minutes on High, quick release, and set Eating at 10 minutes later." },
  { id: "g17", at: 30, lane: "cooker", short: "Slurry in, thicken 5 min", txt: "Thicken, 6 minutes. Whisk the flour into the cold water in a cup until smooth. Saute on Normal, lid off. When the gravy reaches a lively simmer, 195 to 205°F on a probe, stir the slurry in gently with a spoon, folding so the cubes stay whole. 5 minutes at that simmer, until it coats the back of a spoon. Cancel, then Keep Warm.", uses: ["flour", "cold"] },
  { id: "g18", at: 24, lane: "cooker", short: "Taste the gravy", txt: "Taste, 1 minute. Only if the gravy tastes flat, stir in the finishing salt. Lid resting on top, Keep Warm on.", uses: ["salt2"] },
  { id: "g19", at: 16, lane: "pan", short: "Warm the tortillas", txt: "Tortillas, 10 minutes. Dry cast iron at medium, 400 to 450°F on the infrared. About 30 seconds a side each, stacked in a towel to stay soft.", uses: ["tortillas"] },
  { id: "g20", at: 5, lane: "prep", short: "Fluff rice, toppings out", txt: "Set out, 5 minutes. Fluff the rice. Toppings out of the fridge. His jalapeno on the side; nothing hot goes in the pot." },
  { id: "g21", at: 0, lane: "serve", short: "Eat", txt: "Boys: guisada over rice, tortillas on the side. His bowl: guisada and rice topped with cilantro, red onion and the jalapeno." },
];

rep(/var ING = .*;\n/, "var ING = " + JSON.stringify(ING) + ";\n");
rep(/var STEPS = .*;\n/, "var STEPS = " + JSON.stringify(STEPS) + ";\n");
rep('var KEY = "kitchen:carne-asada-chuck:pressure";', 'var KEY = "kitchen:carne-guisada:pressure";');
if (/—/.test(h)) throw new Error("em dash found");
if (/asada/i.test(h)) throw new Error("asada left in page");
writeFileSync(W + "/carne-guisada.html", h.replace(/\n/g, "\r\n"));
console.log("wrote carne-guisada.html", h.length);
