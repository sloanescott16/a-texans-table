// Parts and whole cooks (built 11 Nov 2026, from chat, job folder whole-cook-1111).
// The Captain: "Being able to combine side dishes with a main dish ... The site would be able to add all of those
// recipes together to break out a whole cook."
//
// This writes the dishes that can join a cook ("parts"), each as its own recipe page on the carne guisada pattern,
// and wires them and the cook page into recipes.json, index.html, cook.html and sw.js.
// Usage: bun tools-gen-cook-1111.ts <site folder> [slug ...]     (node --experimental-strip-types works too; no slugs = all)
//
// A part is an ordinary recipe page plus what cook.html needs to put it on a clock with other dishes:
//   steps:  d      minutes of hands-on work, at an easy pace (RECIPE-RULES.md, weeknights on his real clock)
//           flex   the wait after this step may run this many minutes longer (water held at the boil, a pan kept hot)
//           loose  a free-standing job (a stir, chopping the garnish) that may move this many minutes either way
//   combo:  role   main, side or sauce
//           tag    the short label on its steps in a cook
//           mid    its name in the middle of a sentence
//           hold   minutes it can sit once it is ready; 0 means it is eaten straight away
//           wait   how it waits ("lid on")
//           most   why its servings stop where they do
//           goes   the parts it is usually cooked with
//           needs  a part that has to be made ahead for this one, and how far ahead
//           ahead  its last step when it is made ahead for another part
// The last step of every part is the serve step at 0. A part's steps never name another dish, so it goes with anything.
import { readFileSync, writeFileSync, existsSync } from "fs";
const W = process.argv[2];
if (!W) throw new Error("usage: tools-gen-cook-1111.ts <site folder> [slug ...]");
const only = process.argv.slice(3);
const tpl = readFileSync(W + "/carne-guisada.html", "utf8").replace(/\r\n/g, "\n");

const IR = `<b>Infrared readings:</b> infrared reads the surface only. Cast iron reads true; a shiny saucepan reads low, so aim at the oil or the food. Aim close, straight down, and read two or three spots, as pans vary from edge to centre. Liquids (stock, gravy, sauce, grits) go by a probe.`;
const SALT = `<b>Salt:</b> the kosher salt amounts suit a light, flaky kosher salt. A dense, fine kosher salt is about twice as salty by volume: use half.`;
const CAJUN = `<b>No Cajun seasoning?</b> For each 1 tsp: 1/2 tsp smoked paprika, 1/4 tsp chili powder, 1/8 tsp dried oregano, 1/8 tsp ground cumin and a pinch of kosher salt.`;
const THYME = `<b>No thyme?</b> Use the same amount of dried oregano.`;
const HOT = `<b>No hot sauce?</b> A pinch of chili powder over his bowl, or a pinch of chili powder stirred into a spoon of cider vinegar.`;
const MILD = `<b>Mild for the boys:</b> the Cajun seasoning amount keeps it gentle and nothing else hot goes in the pot. Hot sauce stays on the table for the Captain.`;

type R = { slug: string; name: string; sub: string; notes: string[]; ing: any[]; steps: any[]; entry: any; serve: string; serv: any; combo: any; after: string };
const R: R[] = [];

// ---------------- Andouille Creole sauce: Thursday 12 Nov's sauce (fried-grits-andouille-creole.html) as its own recipe ----------------
R.push({
  slug: "andouille-creole-sauce", name: "Andouille Creole sauce", serve: "18:30", serv: { base: 3, min: 2, max: 6 }, after: "peppercorn-mushroom-sauce",
  sub: "Andouille, the trinity, tomatoes and Cajun seasoning, slow cooked all day in the Instant Pot. The insert is loaded the night before, the pot goes on in the morning, and at dinner the sauce is waiting on Keep Warm for whatever it goes over: fried grit cakes, rice, cheese grits, potatoes. Active time: about 20 minutes at the counter the night before, 2 minutes in the morning, and about 8 minutes of easy work at dinner. Nothing happens at the stove.",
  notes: [
    `<b>Equipment:</b> Instant Pot &middot; probe thermometer.`,
    `<b>The sauce:</b> nothing boils off under the lid, so it comes out a little looser than a stovetop sauce. That is right for spooning over something.`,
    `<b>What it goes over:</b> fried grit cakes, rice, cheese grits, potatoes, vegetables, peppers. Build a cook to put the sauce and what it goes over on one clock.`,
    `<b>Food safety:</b> andouille comes cooked, and the pot spends the day well above 165°F. Keep Warm then holds the sauce above 145°F until dinner.`,
    MILD, CAJUN, THYME, HOT, SALT,
  ],
  ing: [
    { id: "saus", g: "In the Instant Pot", per: 0.25, step: 0.25, unit: "lb", name: "andouille or smoked sausage", note: "1/4 inch coins" },
    { id: "onion", g: "In the Instant Pot", per: 0.167, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bpep", g: "In the Instant Pot", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "celery", g: "In the Instant Pot", per: 0.333, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced" },
    { id: "tom", g: "In the Instant Pot", per: 0.333, step: 1, unit: "", name: "can diced tomatoes", plural: "cans diced tomatoes", note: "14.5 oz, with the juice" },
    { id: "tpaste", g: "In the Instant Pot", per: 0.5, step: 0.5, unit: "tbsp", name: "tomato paste" },
    { id: "garlic", g: "In the Instant Pot", per: 0.333, step: 0.25, unit: "tsp", name: "jarred minced garlic" },
    { id: "cajun", g: "In the Instant Pot", per: 0.333, step: 0.25, unit: "tsp", name: "Cajun seasoning" },
    { id: "thyme", g: "In the Instant Pot", per: 0.083, step: 0.125, unit: "tsp", name: "dried thyme" },
    { id: "paprika", g: "In the Instant Pot", per: 0.167, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "water", g: "In the Instant Pot", per: 0.083, step: 0.25, unit: "cup", name: "water" },
    { id: "powder", g: "In the Instant Pot", per: 0.167, step: 0.25, unit: "tsp", name: "powdered chicken stock", note: "stirred into the water" },
    { id: "bay", g: "In the Instant Pot", per: 0.333, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "fsalt", g: "In the Instant Pot", per: 0.083, step: 0.125, unit: "tsp", name: "kosher salt, to finish", note: "only if flat" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "a1", at: 1320, d: 15, lane: "prep", short: "Dice trinity, slice sausage", txt: "The night before, 15 minutes at an easy pace, once the boys are down. Dice the onion and the bell pepper about 1/2 inch and slice the celery 1/4 inch. Slice the sausage into 1/4 inch coins. Everything straight into the Instant Pot insert.", uses: ["onion", "bpep", "celery", "saus"] },
    { id: "a2", at: 1305, d: 6, lane: "cooker", short: "Load the insert, into the fridge", txt: "6 minutes. Into the insert on top of the sausage and vegetables: the tomatoes with their juice, the tomato paste, garlic, Cajun seasoning, thyme, smoked paprika, the water with the stock powder stirred in, and the bay leaf. Stir until the paste is worked through. A lid or a plate on the insert, and into the fridge overnight.", uses: ["tom", "tpaste", "garlic", "cajun", "thyme", "paprika", "water", "powder", "bay"] },
    { id: "a3", at: 700, d: 2, lane: "cooker", short: "Insert in, Slow Cook Normal, 10 hours", txt: "2 minutes, on the way out of the door. Insert from the fridge into the Instant Pot. Lid on, steam valve to Venting. Slow Cook on Normal, 10 hours, Keep Warm left on. Normal is the Instant Pot's match for a slow cooker's Low. It drops to Keep Warm on its own at {t:100} and holds the sauce hot until dinner." },
    { id: "a4", at: 30, d: 1, loose: 20, lane: "cooker", short: "Pot: lid off, stir", txt: "1 minute. Instant Pot lid off, a good stir, then the lid resting back on top. Keep Warm stays on." },
    { id: "a5", at: 15, d: 5, loose: 30, lane: "prep", short: "Slice green onion, parsley", txt: "5 minutes. Slice the green onions and chop the parsley.", uses: ["gonion", "parsley"] },
    { id: "a6", at: 8, d: 2, loose: 6, lane: "cooker", short: "Taste the sauce, bay out", txt: "2 minutes. Bay leaf out. Taste; only if flat, the finishing salt. On Keep Warm the sauce is above 145°F on a probe, hot enough to serve.", uses: ["fsalt"] },
    { id: "a7", at: 0, lane: "serve", short: "Eat", txt: "Sauce spooned over, green onion and parsley on top. Cancel the Instant Pot. Hot sauce on the table for the Captain; the boys' plates stay mild." },
  ],
  combo: { role: "sauce", tag: "SAUCE", mid: "andouille Creole sauce", hold: 120, wait: "on Keep Warm", goes: ["fried-grit-cakes", "rice-cooker-rice", "cheese-grits", "steamed-green-beans"] },
  entry: { chapter: "sauces", label: "POT", blurb: "Slow cooked all day in the Instant Pot · over grit cakes, rice or cheese grits", meal: ["sauce"], protein: ["pork"], heat: ["stovetop"], total: 700, active: 31, band: "day", time: "pot on at 6:50 am, ready at dinner", effort: 1, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Fried grit cakes: Thursday 12 Nov's cakes as their own recipe ----------------
R.push({
  slug: "fried-grit-cakes", name: "Fried grit cakes", serve: "18:30", serv: { base: 3, min: 2, max: 3 }, after: "fried-grits-andouille-creole",
  sub: "Leftover cheese grits, cut cold, dusted with flour and fried crisp in the cast iron in beef tallow at 375°F, 5 minutes a side. One pan, six pieces. Active time: about 18 minutes at an easy pace, 30 minutes from pan on to plate. The cheese grits have to be made ahead and set cold in the fridge.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet &middot; thin metal spatula &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Crisp grits:</b> cold, firm grits fry best. Pat them dry and dust with flour, then leave them alone for the full first side. A crust that sticks is not ready to turn. One pan only: six pieces with a finger's gap between them. Crowded pieces steam and will not crisp.`,
    `<b>Frying heat:</b> tallow at 375°F on the infrared, read on the fat. Tallow smokes from about 400°F, so lower the burner if it climbs.`,
    `<b>Leftover grits:</b> cooked grits keep three to four days in the fridge, so fry them by the fourth day. Five minutes a side heats the pieces right through: 165°F or more on a probe in the middle of one.`,
    `<b>Size:</b> 3 servings, six pieces, is the most one 12 inch pan holds. More means frying in batches, which is not weeknight work.`,
    IR,
  ],
  ing: [
    { id: "setgrits", g: "Grit cakes", per: 2, step: 1, unit: "", name: "piece of leftover cheese grits", plural: "pieces of leftover cheese grits", note: "set cold in the fridge, about 2 1/2 inches across", from: "cheese-grits" },
    { id: "flour", g: "Grit cakes", per: 0.667, step: 0.5, unit: "tbsp", name: "all-purpose flour", note: "to dust" },
    { id: "ftallow", g: "Grit cakes", per: 0.5, step: 0.5, unit: "tbsp", name: "beef tallow (or canola oil)", note: "for frying" },
  ],
  steps: [
    { id: "c1", at: 30, d: 1, lane: "iron", short: "Cast iron on, tallow in", txt: "1 minute. Cast iron on medium with the beef tallow (or canola oil). It takes about 8 minutes to reach 375°F on the infrared, read on the fat, which is the time the grits need.", uses: ["ftallow"] },
    { id: "c2", at: 28, d: 12, flex: 6, lane: "prep", short: "Cut and flour the grits", txt: "12 minutes at an easy pace. Turn the cold grits out onto the board and cut the pieces, about 2 1/2 inches across and 3/4 inch thick, two a person. Pat every face dry with a paper towel, dust with the flour and shake off the extra.", uses: ["setgrits", "flour"] },
    { id: "c3", at: 16, d: 1, lane: "iron", short: "Grit cakes in, side 1, 5 min", txt: "Side 1, 5 minutes. Pan at 375°F; lower the burner if it passes 400°F. All the pieces in, a finger's gap apart. Do not move them until they are deep golden and let go of the pan on their own." },
    { id: "c4", at: 10, d: 1, lane: "iron", short: "Flip, side 2, 5 min", txt: "Side 2, 5 minutes. Turn each piece with the thin metal spatula. Untouched again." },
    { id: "c5", at: 5, d: 3, lane: "iron", short: "Grit cakes out, plate", txt: "3 minutes. Burner off. Two grit cakes on each plate." },
    { id: "c6", at: 0, lane: "serve", short: "Eat", txt: "Grit cakes hot from the pan, while the crust is crisp." },
  ],
  combo: { role: "main", tag: "CAKES", mid: "fried grit cakes", hold: 0, most: "the most one pan holds", goes: ["andouille-creole-sauce", "steamed-green-beans"],
    needs: [{ slug: "cheese-grits", ahead: 1440, word: "the day before", hint: "Uses leftover cheese grits, set cold in the fridge. None left over?" }] },
  entry: { chapter: "mains", label: "PAN", blurb: "Leftover cheese grits · cast iron · 5 minutes a side at 375°F", meal: ["dinner", "side"], protein: ["none"], heat: ["stovetop"], total: 30, active: 18, band: "quick", time: "30 minutes, pan on to plate", effort: 1, ahead: false, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Cheese grits: Sunday 8 Nov's grits (grillades-and-grits.html), with his real numbers ----------------
R.push({
  slug: "cheese-grits", name: "Cheese grits", serve: "18:30", serv: { base: 3, min: 2, max: 6 }, after: "mash",
  sub: "Grits cooked in water with powdered chicken stock, finished with butter and sharp cheddar. About 40 minutes at an easy pace: about 10 for the water to boil, then 25 on low with a stir every 5 minutes. Active time: about 15 minutes. From a 6:00 start they are ready at 6:40. What is left sets firm in the fridge for fried grit cakes.",
  notes: [
    `<b>Equipment:</b> big pot, 5 to 6 quart, with a lid &middot; whisk &middot; probe thermometer.`,
    `<b>Grits:</b> about 10 minutes for 6 cups of water to come to the boil, then 25 to cook. His batch is 240 g grits to 6 cups water at 3 servings. Regular or quick grits, not instant.`,
    `<b>For fried grit cakes:</b> spread what is not eaten about 3/4 inch deep in a dish. Once it stops steaming, cover it and into the fridge. It sets firm overnight and keeps three to four days. About half a batch for 3 makes one pan of six cakes.`,
    SALT,
  ],
  ing: [
    { id: "gwater", g: "Grits", per: 2, step: 0.5, unit: "cup", name: "water" },
    { id: "gpowder", g: "Grits", per: 0.667, step: 0.5, unit: "tsp", name: "powdered chicken stock" },
    { id: "gsalt", g: "Grits", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "grits", g: "Grits", per: 0.5, step: 0.25, unit: "cup", name: "grits", note: "not instant; about 80 g a serving, 240 g to 6 cups water" },
    { id: "gbutter", g: "Grits", per: 1, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "cheddar", g: "Grits", per: 0.5, step: 0.25, unit: "cup", name: "sharp cheddar", note: "shredded from the block" },
  ],
  steps: [
    { id: "g1", at: 40, d: 2, flex: 3, lane: "bigpot", short: "Grits water on to boil", txt: "2 minutes. Big pot: the water, powdered chicken stock and salt, lid on, high heat. It comes to a boil, 212°F on a probe, in about 10 minutes.", uses: ["gwater", "gpowder", "gsalt"] },
    { id: "g2", at: 36, d: 4, loose: 8, lane: "prep", short: "Shred the cheddar", txt: "4 minutes at an easy pace, while the water heats. Shred the cheddar from the block.", uses: ["cheddar"] },
    { id: "g3", at: 28, d: 2, lane: "bigpot", short: "Grits in, low, 25 min", txt: "Grits, 25 minutes in the big pot. The first 2 are hands-on: whisk the grits into the boil in a slow stream so no lumps form. Then burner to low, lid ajar: a lazy bubble, 185 to 195°F on a probe.", uses: ["grits"] },
    { id: "g4", at: 23, d: 1, loose: 1, lane: "bigpot", short: "Stir the grits", txt: "1 minute. Stir, scraping the bottom of the big pot. Lid back ajar." },
    { id: "g5", at: 18, d: 1, loose: 1, lane: "bigpot", short: "Stir the grits", txt: "1 minute. Stir, scraping the bottom of the big pot. Lid back ajar." },
    { id: "g6", at: 13, d: 1, loose: 1, lane: "bigpot", short: "Stir the grits", txt: "1 minute. Stir, scraping the bottom of the big pot. Lid back ajar." },
    { id: "g7", at: 8, d: 1, loose: 1, lane: "bigpot", short: "Stir the grits", txt: "1 minute. Stir, scraping the bottom of the big pot. They are nearly there: thick and soft." },
    { id: "g8", at: 3, d: 3, lane: "bigpot", short: "Butter and cheddar in", txt: "3 minutes. Burner off under the big pot. Butter and cheddar in, stirred until melted. Taste; salt only if flat.", uses: ["gbutter", "cheddar"] },
    { id: "g9", at: 0, lane: "serve", short: "Eat", txt: "Cheese grits into the bowls while they are loose and hot." },
  ],
  combo: { role: "side", tag: "GRITS", mid: "cheese grits", hold: 10, wait: "lid on, off the heat", goes: ["andouille-creole-sauce", "fried-grit-cakes", "steamed-green-beans"],
    ahead: { short: "Into a dish to set", lane: "fridge", d: 3, txt: "3 minutes. Spread what is not being eaten tonight about 3/4 inch deep in a dish. Once it stops steaming, cover it and into the fridge. It sets firm overnight and keeps three to four days." } },
  entry: { chapter: "sides", label: "POT", blurb: "Water and powdered chicken stock · butter and sharp cheddar · sets firm for grit cakes", meal: ["side"], protein: ["none"], heat: ["stovetop"], total: 40, active: 15, band: "hour", time: "40 minutes", effort: 1, ahead: true, kid: true, serves: 3, occasion: ["weeknight", "weekend"], timed: true, scales: true, test: false },
});

// ---------------- Rice cooker rice: the rice from the gumbo page, at an easy pace ----------------
R.push({
  slug: "rice-cooker-rice", name: "Rice cooker rice", serve: "18:30", serv: { base: 3, min: 2, max: 6 }, after: "chicken-broth",
  sub: "Plain rice in the rice cooker, for under a sauce or a gumbo. Washed, water to the line, start. The cooker takes 45 minutes and then holds the rice on Keep Warm. Active time: about 6 minutes at an easy pace. From a 6:00 start the rice is ready at 6:51.",
  notes: [
    `<b>Equipment:</b> rice cooker.`,
    `<b>The 45 minutes:</b> this cooker takes 45 minutes, so the rice always goes in 45 minutes before it is needed. It holds well on Keep Warm for up to an hour.`,
  ],
  ing: [
    { id: "rice", g: "Rice cooker", per: 0.333, step: 0.25, unit: "cup", name: "rice", note: "washed" },
    { id: "rwater", g: "Rice cooker", fixed: "to the line", name: "water for the rice cooker", note: "the cooker's own mark for that much rice" },
  ],
  steps: [
    { id: "r1", at: 51, d: 6, lane: "rice", short: "Wash the rice, cooker on", txt: "6 minutes at an easy pace. Wash the rice until the water runs nearly clear, into the rice cooker, water to the line, start. The cooker takes 45 minutes and switches to Keep Warm on its own.", uses: ["rice", "rwater"] },
    { id: "r2", at: 0, lane: "serve", short: "Eat", txt: "Rice in the bowl first." },
  ],
  combo: { role: "side", tag: "RICE", mid: "rice", hold: 60, wait: "on Keep Warm", goes: ["andouille-creole-sauce", "steamed-green-beans"] },
  entry: { chapter: "stocks", label: "POT", blurb: "Rice cooker · washed, water to the line · 45 minutes", meal: ["side"], protein: ["none"], heat: [], total: 51, active: 6, band: "hour", time: "51 minutes, 45 of them the cooker", effort: 1, ahead: false, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Steamed green beans: the frozen green beans from the dirty rice page, at an easy pace ----------------
R.push({
  slug: "steamed-green-beans", name: "Steamed green beans", serve: "18:30", serv: { base: 3, min: 2, max: 6 }, after: "wilted-house-salad",
  sub: "Frozen green beans steamed from frozen in a small saucepan for 7 minutes, then tossed in butter. No trimming. Active time: about 5 minutes at an easy pace, 15 minutes from water on to the table.",
  notes: [
    `<b>Equipment:</b> small saucepan with a lid &middot; probe thermometer.`,
    `<b>Frozen, not fresh:</b> this page is for frozen green beans, steamed straight from the freezer. Fresh green beans want trimming and a different time.`,
    SALT,
  ],
  ing: [
    { id: "beans", g: "Green beans", per: 0.333, step: 0.25, unit: "lb", name: "frozen green beans", note: "straight from the freezer, no trimming" },
    { id: "vwater", g: "Green beans", per: 0.167, step: 0.25, min: 0.5, unit: "cup", name: "water" },
    { id: "vsalt", g: "Green beans", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "vbutter", g: "Green beans", per: 0.333, step: 0.5, unit: "tbsp", name: "butter" },
  ],
  steps: [
    { id: "b1", at: 15, d: 2, flex: 4, lane: "sauce", short: "Beans water on to boil", txt: "2 minutes. Small saucepan: the water and salt, lid on, high heat to a boil, 212°F on a probe, about 3 minutes.", uses: ["vwater", "vsalt"] },
    { id: "b2", at: 10, d: 1, lane: "sauce", short: "Frozen beans in, steam 7 min", txt: "Steam, 7 minutes. The frozen green beans into the saucepan straight from the freezer, no trimming, lid on. Shake the pan once halfway. Done when hot through and just tender.", uses: ["beans"] },
    { id: "b3", at: 3, d: 2, lane: "sauce", short: "Drain beans, butter", txt: "2 minutes. Drain the beans, back in the saucepan, butter in, toss. Lid on.", uses: ["vbutter"] },
    { id: "b4", at: 0, lane: "serve", short: "Eat", txt: "Green beans on the side." },
  ],
  combo: { role: "side", tag: "BEANS", mid: "green beans", hold: 10, wait: "lid on", goes: ["fried-grit-cakes", "andouille-creole-sauce", "rice-cooker-rice", "cheese-grits"] },
  entry: { chapter: "sides", label: "PAN", blurb: "Frozen green beans · steamed from frozen, 7 minutes · butter", meal: ["side"], protein: ["none"], heat: ["stovetop"], total: 15, active: 5, band: "quick", time: "15 minutes", effort: 1, ahead: false, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// Cooks that are ready to open from the front page: the parts in each, and one line about it.
const READY: { r: string[]; line: string }[] = [
  { r: ["fried-grit-cakes", "andouille-creole-sauce"], line: "The sauce on all day, one pan of cakes from 6:00" },
  { r: ["andouille-creole-sauce", "rice-cooker-rice", "steamed-green-beans"], line: "The same sauce over rice, green beans on the side" },
  { r: ["andouille-creole-sauce", "cheese-grits"], line: "The same sauce over cheese grits made that night" },
];

// ---------------- checks on the data ----------------
const bySlug: Record<string, R> = {};
for (const r of R) bySlug[r.slug] = r;
const ROLEORDER: Record<string, number> = { main: 0, sauce: 1, side: 2 };
const list = (a: string[]) => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
const cookName = (slugs: string[]) => { const ps = slugs.map(s => bySlug[s]).sort((a, b) => ROLEORDER[a.combo.role] - ROLEORDER[b.combo.role]); return ps[0].name + (ps.length > 1 ? " with " + list(ps.slice(1).map(p => p.combo.mid)) : ""); };
for (const r of R) {
  const bad = JSON.stringify(r).match(/[–—]/);
  if (bad) throw new Error("dash in " + r.slug);
  r.steps.sort((a: any, b: any) => b.at - a.at);
  const last = r.steps[r.steps.length - 1];
  if (last.lane !== "serve" || last.at !== 0) throw new Error(r.slug + ": the last step must be the serve step at 0");
  const busy: number[][] = [];
  for (const s of r.steps.slice(0, -1)) {
    if (!Number.isInteger(s.at) || !Number.isInteger(s.d) || s.d < 0) throw new Error(r.slug + " step " + s.id + " needs whole minutes for at and d");
    if (s.flex && s.loose) throw new Error(r.slug + " step " + s.id + " cannot be both flex and loose");
    if (!s.short || !s.txt) throw new Error(r.slug + " step " + s.id + " needs short and txt");
    if (s.d > 0) busy.push([s.at, s.at - s.d]);
    if (s.at - s.d < 0) throw new Error(r.slug + " step " + s.id + " runs past the finish");
  }
  // on its own page a part never asks for two hands-on steps at once
  for (let i = 0; i < busy.length; i++) for (let k = i + 1; k < busy.length; k++) if (busy[i][0] > busy[k][1] && busy[k][0] > busy[i][1]) throw new Error(r.slug + ": two hands-on steps overlap");
  for (const s of r.steps) for (const u of s.uses || []) if (!r.ing.find((i: any) => i.id === String(u).split("@")[0])) throw new Error(r.slug + " step " + s.id + " uses unknown " + u);
  const c = r.combo;
  if (!ROLEORDER.hasOwnProperty(c.role) || !c.tag || !c.mid || !Number.isInteger(c.hold)) throw new Error(r.slug + ": combo needs role, tag, mid and hold");
  for (const g of c.goes || []) if (!bySlug[g] || g === r.slug) throw new Error(r.slug + " goes with unknown " + g);
  for (const n of c.needs || []) if (!bySlug[n.slug] || !Number.isInteger(n.ahead)) throw new Error(r.slug + " needs unknown " + n.slug);
  for (const i of r.ing) if (i.from && !bySlug[i.from]) throw new Error(r.slug + " ingredient from unknown " + i.from);
  const hands = r.steps.reduce((n: number, s: any) => n + (s.d || 0), 0);
  if (hands !== r.entry.active) throw new Error(r.slug + ": entry.active is " + r.entry.active + " but the steps add up to " + hands);
}
for (const k of READY) for (const s of k.r) if (!bySlug[s]) throw new Error("ready cook names unknown " + s);

// ---------------- the pages ----------------
const LANES = `var LANE = {pot:["POT","t-pot"], pan:["PAN","t-pan"], prep:["PREP","t-prep"], serve:["SERVE","t-serve"],
            fire:["FIRE","t-fire"], oven:["OVEN","t-oven"], jar:["JAR","t-jar"], fridge:["FRIDGE","t-fridge"], cooker:["INSTANT POT","t-pot"], rice:["RICE COOKER","t-jar"], away:["AWAY","t-prep"], store:["STORE","t-prep"], iron:["CAST IRON","t-pan"], dutch:["DUTCH OVEN","t-pot"], bigpot:["BIG POT","t-pot"], sauce:["SAUCEPAN","t-pan"]};`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(r: R) {
  let h = tpl;
  const rep = (a: string | RegExp, b: string) => { const n = h.replace(a as any, () => b); if (n === h) throw new Error("no match in " + r.slug + ": " + a); h = n; };
  // "Make it a whole cook": one tap from this dish to a cook with something it goes with
  const order = (slugs: string[]) => slugs.slice().sort((a, b) => ROLEORDER[bySlug[a].combo.role] - ROLEORDER[bySlug[b].combo.role]);
  const pairs = (r.combo.goes || []).map((g: string) => `<a class="ghost" href="./cook.html#r=${order([r.slug, g]).join(",")}">${esc(bySlug[g].name)}</a>`).join("") +
    `<a class="ghost" href="./cook.html#r=${r.slug}">Pick the dishes</a>`;
  rep("<title>Carne guisada</title>", `<title>${r.name}</title>`);
  rep("<h1>Carne guisada</h1>", `<h1>${r.name}</h1>`);
  rep(/<p class="sub">[^<]*<\/p>/, `<p class="sub">${r.sub}</p>\n  <div class="pairs"><span class="pl">Make it a whole cook with</span>${pairs}</div>`);
  rep(/  <p class="note"><b>Why the cast iron, not Saute:[\s\S]*?<\/p>\n<\/div>\n/, r.notes.map(n => `  <p class="note">${n}</p>\n`).join("") + "</div>\n");
  rep(/var ING = .*;\n/, "var ING = " + JSON.stringify(r.ing) + ";\n");
  rep(/var STEPS = .*;\n/, "var STEPS = " + JSON.stringify(r.steps) + ";\n");
  rep(/var SERV = .*;\n/, "var SERV = " + JSON.stringify(r.serv) + ";\n");
  if (r.serve !== "18:30") { rep('value="18:30"', 'value="' + r.serve + '"'); rep('serve: "18:30"', 'serve: "' + r.serve + '"'); }
  rep('var KEY = "kitchen:carne-guisada:pressure";\n', `var KEY = "kitchen:${r.slug}";\nvar COMBO = ${JSON.stringify(r.combo)};\n`);
  rep(/var LANE = \{[^;]*;/, LANES);
  rep(/<span id="sv">4<\/span>/, '<span id="sv">' + r.serv.base + '</span>');
  rep("</style>", "/* Louisiana week: tighter checklist rows so the longest day fits one phone screen. */\n.ck{font-size:12px;line-height:1.15;padding:0}\n.ck.now{padding:0 12px}\n.ck input{width:14px;height:14px}\n.ck .ct{font-size:11px;min-width:52px}\n" +
    "/* A dish that can join a cook: the way into cook.html. */\n.pairs{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:-6px 0 16px}\n.pairs .pl{flex-basis:100%;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted)}\na.ghost{display:inline-block;text-decoration:none;line-height:1.2}\n</style>");
  rep(/<script>\n\/\* Step player settings[\s\S]*?<script src="\.\/step-player\.js">\n<\/script>\n/, "");
  if (/guisada|tortilla/i.test(h)) throw new Error("template text left in " + r.slug);
  writeFileSync(W + "/" + r.slug + ".html", h);
}
const todo = only.length ? R.filter(r => only.includes(r.slug)) : R;
for (const r of todo) page(r);

// ---------------- recipes.json and the embedded copy in index.html ----------------
const rj = JSON.parse(readFileSync(W + "/recipes.json", "utf8"));
let idx = readFileSync(W + "/index.html", "utf8").replace(/\r\n/g, "\n");
const m = idx.match(/var DATA = (.*);\n/);
if (!m) throw new Error("no DATA");
if (m[1] !== JSON.stringify(rj)) console.log("WARN: index DATA differs from recipes.json before the change");
const plainIng = (r: R) => [...new Set(r.ing.map((i: any) => i.name))];
const keys = ["slug","name","file","sub","chapter","label","blurb","meal","protein","heat","total","active","band","time","effort","ahead","kid","serves","occasion","timed","scales","test","ingredients","steps","combo"];
for (const r of todo) {
  const a: any = Object.assign({ slug: r.slug, name: r.name, file: r.slug + ".html", sub: r.sub }, r.entry, { ingredients: plainIng(r), steps: r.steps.length, combo: r.combo });
  const o: any = {}; for (const k of keys) o[k] = a[k];
  const i = rj.recipes.findIndex((x: any) => x.slug === r.slug);
  if (i >= 0) rj.recipes[i] = o;
  else {
    const at = rj.recipes.findIndex((x: any) => x.slug === r.after);
    if (at < 0) throw new Error("no " + r.after + " to put " + r.slug + " after");
    rj.recipes.splice(at + 1, 0, o);
  }
}
writeFileSync(W + "/recipes.json", JSON.stringify(rj, null, 1) + "\n");
idx = idx.replace(/var DATA = .*;\n/, () => "var DATA = " + JSON.stringify(rj) + ";\n");

// ---------------- the list of parts and ready-made cooks, for cook.html and the front page ----------------
// Every recipe in recipes.json that carries a combo is offered, so a part written by a later generator joins in too.
const parts = rj.recipes.filter((x: any) => x.combo).map((x: any) => ({ slug: x.slug, name: x.name, mid: x.combo.mid, role: x.combo.role, tag: x.combo.tag, goes: x.combo.goes || [], line: x.blurb }));
const cook = { parts, ready: READY.map(k => ({ r: k.r, name: cookName(k.r), line: k.line })) };
const cookLine = "var COOK = " + JSON.stringify(cook) + ";\n";
if (/[–—]/.test(cookLine)) throw new Error("dash in COOK");
if (!/var COOK = .*;\n/.test(idx)) throw new Error("no COOK line in index.html: run the job's patch-index-cook.py once first");
idx = idx.replace(/var COOK = .*;\n/, () => cookLine);
writeFileSync(W + "/index.html", idx);
if (!existsSync(W + "/cook.html")) throw new Error("no cook.html in the site folder");
const ck = readFileSync(W + "/cook.html", "utf8").replace(/\r\n/g, "\n");
if (!/var COOK = .*;\n/.test(ck)) throw new Error("no COOK line in cook.html");
writeFileSync(W + "/cook.html", ck.replace(/var COOK = .*;\n/, () => cookLine));

// ---------------- service worker: the pages and cook.html in the shell, cache bumped once per run that adds one ----------------
let sw = readFileSync(W + "/sw.js", "utf8");
let added = false;
if (!sw.includes('"./week.html", ')) throw new Error("sw.js shell not as expected");
if (!sw.includes('"./cook.html"')) { sw = sw.replace('"./week.html", ', '"./week.html", "./cook.html", '); added = true; }
for (const r of todo) if (!sw.includes(`"./${r.slug}.html"`)) { sw = sw.replace('"./carne-guisada.html", ', `"./carne-guisada.html", "./${r.slug}.html", `); added = true; }
if (added) { const cm = sw.match(/var CACHE = "kitchen-v(\d+)";/)!; sw = sw.replace(cm[0], `var CACHE = "kitchen-v${+cm[1] + 1}";`); }
writeFileSync(W + "/sw.js", sw);
console.log("done", todo.map(r => r.slug).join(" "), "| parts", parts.length, "| ready", cook.ready.map(k => k.name).join(" / "));
