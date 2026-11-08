// Builds the Louisiana week pages (job 1108-1118-klw) from the carne guisada page pattern
// (scampi pattern plus the single-screen checklist), and wires them into recipes.json, index.html and sw.js.
// Usage: bun tools-gen-klw-1108.ts <site worktree> [slug ...]   (no slugs = all four)
import { readFileSync, writeFileSync } from "fs";
const W = process.argv[2];
const only = process.argv.slice(3);
const tpl = readFileSync(W + "/carne-guisada.html", "utf8").replace(/\r\n/g, "\n");
const crlf = (s: string) => s.replace(/\r?\n/g, "\r\n");

const IR = `<b>Infrared readings:</b> infrared reads the surface only. Cast iron reads true; a shiny saucepan reads low, so aim at the oil or the food. Aim close, straight down, and read two or three spots, as pans vary from edge to centre. Liquids (stock, gravy, sauce, grits) go by a probe.`;
const SALT = `<b>Salt:</b> the kosher salt amounts suit a light, flaky kosher salt. A dense, fine kosher salt is about twice as salty by volume: use half.`;
const PEPPER = `<b>Pepper:</b> never on raw meat before a sear. Pepper goes on each seared face after it turns up, and on the last side as it comes off.`;
const CAJUN = `<b>No Cajun seasoning?</b> For each 1 tsp: 1/2 tsp smoked paprika, 1/4 tsp chili powder, 1/8 tsp dried oregano, 1/8 tsp ground cumin and a pinch of kosher salt.`;
const THYME = `<b>No thyme?</b> Use the same amount of dried oregano.`;
const HOT = `<b>No hot sauce?</b> A pinch of chili powder over his bowl, or a pinch of chili powder stirred into a spoon of cider vinegar.`;
const MILD = `<b>Mild for the boys:</b> the Cajun seasoning amount keeps it gentle and nothing else hot goes in the pot. Hot sauce stays on the table for the Captain.`;

type R = { slug: string; name: string; sub: string; notes: string[]; ing: any[]; steps: any[]; entry: any; serve: string; end?: number; anchorLabel?: string; unitLabel?: string; serv?: any; start?: boolean };
const R: R[] = [];

// ---------------- Sunday 8 Nov: grillades and grits, dinner only (job 1108-1448-mnp) ----------------
// Steps are written in forward minutes (f) from the first move; at = END - f.
R.push({
  slug: "grillades-and-grits", name: "Grillades and grits", serve: "18:30", end: 229,
  sub: "Sunday, Louisiana week, tonight's dinner only. Active time: about 1 hour 40 minutes up front (the medallions, tonight's trinity, the stock jug, three sear batches and 40 minutes stirring the roux), then a 2 hour hands-off braise with a stir at the hour and the hour and a half, then about 30 minutes at the end for the grits and the beans. A beef chuck tender roast sliced across the grain into medallions and pounded thin, seared hard in the cast iron, then braised in the Dutch oven in a dark roux gravy with the trinity, tomatoes and beef stock, over cheese grits, green beans on the side. Half the roux goes into a bowl for Monday's gumbo at no extra work. First move at 2:41 for 6:30.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet for the sear &middot; Dutch oven with its lid, for the roux and the braise &middot; big pot, 5 to 6 quart, for the grits &middot; small saucepan for the beans &middot; heatproof steel or glass bowl for the hot roux &middot; meat mallet or rolling pin &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Monday's roux:</b> the roux is made double and half of it goes into the heatproof bowl, covered into the fridge once cool, for Monday's gumbo. That is the only thing tonight does for another night. The chicken broth is its own page.`,
    `<b>Roux safety:</b> a dark roux is near 350°F and sticks to skin. Long sleeves, no water near the pan, and stir with a flat wooden spatula. Black specks or a sharp, acrid burnt smell mean start again; a scorched roux cannot be saved.`,
    `<b>Roux heat:</b> hold the roux at 325 to 350°F on the infrared, read on the roux itself. Beef tallow is the default fat, with canola as the alternative; tallow melts to a clear oil at once and a tallow roux is fine at this heat. Both smoke from about 400°F, so never let the roux pass 375°F. Chilled, a tallow roux sets hard: that is normal, and it melts straight back in when warmed. About 40 minutes takes it to dark chocolate. If it darkens faster than the slots, lower the burner and keep stirring: colour is the cue, the clock is the guide. The roux is always made in the Dutch oven, never the cast iron skillet; the cast iron sears, then is deglazed into the stock.`,
    `<b>Food safety:</b> chuck tender braised 2 hours is far past the 145°F safe point; the fork test and 195 to 205°F inside are the cues for tender. Leftovers into the fridge within 2 hours, moved out of the Dutch oven into a container first.`,
    `<b>Grits:</b> water with powdered chicken stock, then butter and sharp cheddar at the end. Use regular or quick grits, not instant; if the bag says longer than 25 minutes, go by the bag and set Eating at later.`,
    `<b>Size:</b> set for 3 servings, one beef chuck tender roast of about 2.75 lb (this one is 2.77 lb; use or freeze by 10 Nov) in three sear batches. At 5 or 6, sear in four batches and set Eating at 6 minutes later; the Dutch oven needs to be 5 quart or larger for the braise.`,
    MILD, PEPPER, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "beef", g: "Grillades", per: 0.923, step: 0.25, unit: "lb", name: "beef chuck tender roast", note: "1/2 inch medallions across the grain, pounded to 1/4 inch" },
    { id: "bsalt", g: "Grillades", per: 0.5, step: 0.25, unit: "tsp", name: "kosher salt", note: "on the medallions before the sear" },
    { id: "pepper", g: "Grillades", per: 0.333, step: 0.25, unit: "tsp", name: "ground black pepper", note: "on the seared faces only" },
    { id: "soil", g: "Grillades", per: 1, step: 0.5, unit: "tbsp", name: "beef tallow (or canola oil)", note: "for the sear, a third a batch" },
    { id: "roil", g: "Dark roux", per: 0.417, step: 0.125, unit: "cup", name: "beef tallow (or canola oil)", note: "makes double: half tonight, half into a bowl for Monday" },
    { id: "rflour", g: "Dark roux", per: 0.417, step: 0.125, unit: "cup", name: "all-purpose flour" },
    { id: "onS", g: "Gravy", per: 0.333, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bpS", g: "Gravy", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "ceS", g: "Gravy", per: 0.667, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced" },
    { id: "garlic", g: "Gravy", per: 0.5, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "tpaste", g: "Gravy", per: 0.5, step: 0.5, unit: "tbsp", name: "tomato paste" },
    { id: "cajun", g: "Gravy", per: 0.917, step: 0.5, unit: "tsp", name: "Cajun seasoning" },
    { id: "thyme", g: "Gravy", per: 0.25, step: 0.25, unit: "tsp", name: "dried thyme" },
    { id: "paprika", g: "Gravy", per: 0.5, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "bbase", g: "Gravy", per: 0.917, step: 0.5, unit: "tsp", name: "beef bouillon base" },
    { id: "bwater", g: "Gravy", per: 1.167, step: 0.25, min: 2.5, unit: "cup", name: "hot water", note: "the bouillon base whisked in makes the stock" },
    { id: "tom", g: "Gravy", per: 0.333, step: 1, unit: "", name: "can diced tomatoes", plural: "cans diced tomatoes", note: "14.5 oz, with the juice" },
    { id: "bay", g: "Gravy", per: 0.667, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "fsalt", g: "Gravy", per: 0.083, step: 0.25, unit: "tsp", name: "kosher salt, to finish", note: "only if the gravy tastes flat" },
    { id: "gwater", g: "Grits", per: 1, step: 0.5, unit: "cup", name: "water" },
    { id: "gpowder", g: "Grits", per: 0.333, step: 0.5, unit: "tsp", name: "powdered chicken stock" },
    { id: "gsalt", g: "Grits", per: 0.083, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "grits", g: "Grits", per: 0.25, step: 0.25, unit: "cup", name: "grits", note: "not instant" },
    { id: "gbutter", g: "Grits", per: 0.5, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "cheddar", g: "Grits", per: 0.25, step: 0.25, unit: "cup", name: "sharp cheddar", note: "shredded from the block" },
    { id: "beans", g: "Green beans", per: 0.333, step: 0.25, unit: "lb", name: "green beans", note: "half the bag" },
    { id: "vwater", g: "Green beans", per: 0.167, step: 0.25, min: 0.5, unit: "cup", name: "water" },
    { id: "vsalt", g: "Green beans", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "vbutter", g: "Green beans", per: 0.333, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "s1", f: 0, lane: "prep", short: "Slice medallions, pound, salt", txt: "Beef, 15 minutes. Cold from the fridge. Trim the silver skin off the outside of the chuck tender roast. Find the grain (the lines of the muscle run the length of the roast) and slice straight across it into medallions about 1/2 inch thick. Between two sheets of plastic wrap, pound each one to an even 1/4 inch with a meat mallet or a rolling pin. Pat really dry with paper towels and salt both sides. No pepper. Onto a tray in the fridge.", uses: ["beef", "bsalt"] },
    { id: "c1", f: 15, lane: "iron", short: "Cast iron on to heat", txt: "Cast iron on the burner, empty, at medium-high. 10 minutes to come up evenly to 400 to 425°F on the infrared at the centre; dice while it heats." },
    { id: "s2", f: 16, lane: "prep", short: "Dice tonight's trinity", txt: "Trinity, 8 minutes. Dice the onion and the bell pepper about 1/2 inch and slice the celery 1/4 inch, all into one bowl. Tonight's only.", uses: ["onS", "bpS", "ceS"] },
    { id: "s5", f: 24, lane: "prep", short: "Make the beef stock", txt: "Stock, 2 minutes. Whisk the beef bouillon base into the hot water in a jug. Set it by the stove.", uses: ["bbase", "bwater"] },
    { id: "c2", f: 26, lane: "iron", short: "Sear batch 1, first side, 3 min", txt: "Sear, batch 1, first side, 3 minutes. Cast iron reading 400°F (tallow smokes from about 420; with canola up to 425°F is fine). A third of the sear fat in and swirl: tallow melts at once, canola should shimmer. A third of the medallions in one layer, a finger's gap apart. Do not move it for 3 minutes, until a brown crust lets go of the pan on its own.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c3", f: 29, lane: "iron", short: "Batch 1, flip, pepper, out", txt: "Batch 1, second side, 3 minutes. Turn each piece so the seared face is up and pepper it (a sixth of the pepper). 3 minutes untouched. Lift onto a plate and pepper the second seared face as it comes off (another sixth).", uses: ["pepper@0.333"] },
    { id: "c4", f: 32, lane: "iron", short: "Sear batch 2, first side, 3 min", txt: "Sear, batch 2, first side, 3 minutes. Back to 400°F first if the pan dropped, about a minute. A third of the sear fat, a third of the medallions, a finger's gap. 3 minutes untouched.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c5", f: 35, lane: "iron", short: "Batch 2, flip, pepper, out", txt: "Batch 2, second side, 3 minutes. Turn, pepper the seared face that is up (a sixth), 3 minutes. Onto the plate and pepper the second seared face as it comes off (a sixth).", uses: ["pepper@0.333"] },
    { id: "d1", f: 38, lane: "dutch", short: "Dutch oven on to warm", txt: "Dutch oven, empty and dry, on a second burner at medium-low, about 6 minutes, to 300°F on the infrared at the centre of the bottom. Never past 325°F while empty." },
    { id: "c6", f: 38, lane: "iron", short: "Sear batch 3, first side, 3 min", txt: "Sear, batch 3, first side, 3 minutes. Back to 400°F first if the pan dropped. The last of the sear fat and the last of the medallions, a finger's gap. 3 minutes untouched.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c7", f: 41, lane: "iron", short: "Batch 3, flip, pepper, out", txt: "Batch 3, second side, 1 minute: the thin medallions need only a short second sear before the braise. Turn, pepper the seared face that is up (a sixth), 1 minute. Onto the plate and pepper the last seared face as it comes off (the last sixth).", uses: ["pepper@0.333"] },
    { id: "c8", f: 42, lane: "iron", short: "Deglaze the cast iron", txt: "Deglaze, 2 minutes. Burner off under the cast iron. Pour in 1/2 cup of the beef stock from the jug; it hisses. Scrape every sear bit loose with a flat wooden spatula, then pour it all back into the stock jug. The jug holds the same amount, now with the fond. Cast iron is done for the night." },
    { id: "r1", f: 44, lane: "dutch", short: "Roux: tallow and flour in", txt: "Dark roux in the Dutch oven, 40 minutes of steady stirring. Dutch oven at 300°F on the infrared. Beef tallow (or canola) in, then the flour, stirred smooth. Stir across the whole bottom with a flat wooden spatula and never leave it long. Hold the roux at 325 to 350°F on the infrared, never past 375°F. A Dutch oven holds heat longer than a skillet: if it creeps past 350°F, lift it off the burner for 30 seconds and lower the heat. If the roux runs slow and is not dark chocolate by {t:145}, set Eating at later by the same number of minutes.", uses: ["roil", "rflour"] },
    { id: "r2", f: 57, lane: "dutch", short: "Roux: peanut butter colour", txt: "Roux check, keep stirring. Peanut butter colour by now. Still 325 to 350°F on the infrared; lower the burner if it climbs." },
    { id: "r3", f: 72, lane: "dutch", short: "Roux: copper penny colour", txt: "Roux check, keep stirring. Copper penny colour and a toasty smell. Stir faster now: it darkens quickly from here. Still 325 to 350°F." },
    { id: "r4", f: 84, lane: "dutch", short: "Dark roux: half into a bowl", txt: "Half out, 2 minutes. At dark chocolate colour, burner off for a moment. Carefully ladle half the roux into the heatproof bowl for Monday's gumbo and set it on the back of the stove to cool. It is near 350°F: no splashes, no water near it." },
    { id: "g1", f: 86, lane: "dutch", short: "Trinity into the roux", txt: "Trinity in, 5 minutes. Burner back to medium. The bowl of onion, pepper and celery into the roux left in the Dutch oven; it hisses and stops the roux darkening. Stir until soft, the pan at 300 to 325°F on the infrared." },
    { id: "g2", f: 91, lane: "dutch", short: "Garlic, paste, spices, 2 min", txt: "Garlic, tomato paste, Cajun seasoning, thyme and smoked paprika in. Stir 2 minutes until the paste darkens a shade.", uses: ["garlic", "tpaste", "cajun", "thyme", "paprika"] },
    { id: "g3", f: 93, lane: "dutch", short: "Stock and tomatoes in", txt: "Liquid, 4 minutes. The stock jug, fond and all, in a little at a time, stirring smooth after each pour, then the tomatoes with their juice and the bay leaves. Bring to a lively simmer, 195 to 205°F on a probe.", uses: ["tom", "bay"] },
    { id: "g4", f: 97, lane: "dutch", short: "Beef back, lid on, braise 2 h", txt: "Medallions and their plate juices back in, pushed under the gravy. The Dutch oven's own lid on. Burner to low. Braise 2 hours at a gentle simmer, 180 to 190°F on a probe; chuck tender is lean and sinewy and needs the time. Hands off from here: two stirs, then the fork test about {t:12}." },
    { id: "g5", f: 103, lane: "dutch", short: "Check the simmer", txt: "Simmer check, 1 minute. Probe the gravy: 180 to 190°F. Bubbling hard, lower the burner; still, up a touch. Lid back." },
    { id: "x1", f: 124, lane: "fridge", short: "Monday's roux: cover, fridge", txt: "2 minutes. The roux bowl has cooled about 40 minutes: under 150°F on the infrared. Cover it and into the fridge for Monday's gumbo." },
    { id: "g6", f: 157, lane: "dutch", short: "Braise: stir and turn, 1 hour", txt: "Braise check at the hour, 2 minutes. Lift the lid, stir and turn the medallions. Thicker than heavy cream, add 1/4 cup water. Probe 180 to 190°F. Lid back." },
    { id: "g9", f: 187, lane: "dutch", short: "Braise: stir and turn, 1 1/2 h", txt: "Braise check at the hour and a half, 2 minutes. Stir, turn the medallions, keep them under the gravy. Thicker than heavy cream, add 1/4 cup water. Probe 180 to 190°F. Lid back." },
    { id: "q1", f: 191, lane: "bigpot", short: "Grits water on to boil", txt: "Big pot: water, powdered chicken stock and salt, lid on, high heat. To a boil, 212°F on a probe, about 8 minutes.", uses: ["gwater", "gpowder", "gsalt"] },
    { id: "v1", f: 192, lane: "prep", short: "Trim beans, slice greens", txt: "6 minutes. Snap the stem ends off the green beans. Slice the green onions and chop the parsley.", uses: ["beans", "gonion", "parsley"] },
    { id: "q2", f: 199, lane: "bigpot", short: "Grits in, low, stir every 5 min", txt: "Grits, 25 minutes. Whisk the grits into the boil in a slow stream so no lumps form. Burner to low, lid ajar: a lazy bubble, 185 to 195°F on a probe. Stir every 5 minutes, scraping the bottom, until thick and soft.", uses: ["grits"] },
    { id: "v3", f: 212, lane: "sauce", short: "Green beans: boil, steam 7 min", txt: "Beans, 10 minutes. Small saucepan: the water and salt, lid on, high to a boil, 212°F on a probe, about 3 minutes. Beans in, lid on, steam 7 minutes, shaking the pan once, until bright and just tender.", uses: ["vwater", "vsalt"] },
    { id: "g7", f: 217, lane: "dutch", short: "Fork test, bay leaves out", txt: "2 minutes. Fork test: a fork slides into the thickest medallion and pulls out with no grip, and a probe in its centre reads 195 to 205°F, where the sinew in chuck tender softens. If it fights, 15 more minutes and set Eating at 15 minutes later. Fish out the bay leaves." },
    { id: "q3", f: 224, lane: "bigpot", short: "Butter and cheddar into grits", txt: "Off the heat, 2 minutes. Butter and cheddar in, stir until melted. Taste; salt only if flat. Lid on; it holds off the heat.", uses: ["gbutter", "cheddar"] },
    { id: "v4", f: 225, lane: "sauce", short: "Drain beans, butter", txt: "1 minute. Drain the beans, back in the pan, butter in, toss. Lid on." , uses: ["vbutter"] },
    { id: "g8", f: 226, lane: "dutch", short: "Taste the gravy, greens in", txt: "2 minutes. Taste the gravy; only if it tastes flat, the finishing salt. Half the green onion and parsley stirred in, the rest kept for the top.", uses: ["fsalt"] },
    { id: "e1", f: 229, lane: "serve", short: "Eat", txt: "Grits in the bowl, grillades and gravy over, green onion and parsley on top, green beans on the side. Hot sauce on the table for the Captain; the boys' plates stay mild. After dinner, leftovers out of the Dutch oven into a container before the fridge." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Cast iron sear · dark roux gravy · cheese grits · active about 2 hours 15, mostly up front", meal: ["dinner"], protein: ["beef"], heat: ["stovetop"], total: 229, active: 135, band: "afternoon", time: "first move at 2:41, eat at 6:30", effort: 3, ahead: false, kid: true, serves: 3, occasion: ["weekend"], timed: true, scales: true, test: false },
});

// ---------------- Monday 9 Nov: chicken and andouille gumbo, his own recipe, Dutch oven on the stove ----------------
R.push({
  slug: "chicken-andouille-gumbo", name: "Chicken and andouille gumbo", serve: "18:30",
  sub: "Monday, Louisiana week. The Captain's own gumbo, written lean: run it his way. Active time: about 1 hour, from 4:37 at a normal afternoon pace, the rest a hands-off simmer. Tonight's trinity diced fresh, Sunday's dark roux from the fridge, the homemade broth, chicken thighs and half the andouille, simmered about an hour. Rice cooker at 5:15 with Thursday's share.",
  notes: [
    `<b>His recipe:</b> this is the Captain's gumbo. The steps and temperatures are a guide for the evening; where he does it differently, his way wins.`,
    `<b>Equipment:</b> Dutch oven with its lid &middot; rice cooker &middot; sheet pan for cooling Thursday's rice &middot; whisk &middot; tongs &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Bone-in or boneless:</b> either works, skin off. Boneless go in as 1.5 inch pieces. Bone-in go in whole, about 2 1/4 lb for 2 lb boneless, are probed near the bone, and come off the bone at 6:10.`,
    `<b>Food safety:</b> chicken to 165°F minimum on a probe in the thickest piece, near the bone but not touching it if bone-in. Andouille comes cooked. Leftovers out of the Dutch oven into a container and into the fridge within 2 hours.`,
    `<b>Broth:</b> 5 cups of Sunday's homemade broth; Wednesday and Thursday take 1/2 cup each, inside the 8 to 10 cups it makes. No broth: the same amount of water plus the powdered chicken stock.`,
    `<b>Thursday's rice:</b> cooked rice must cool fast. Spread it thin on a sheet pan, then into a covered container in the fridge within the hour. It keeps 3 to 4 days.`,
    MILD, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "roux", g: "From Sunday", fixed: "1 bowl", name: "Sunday's dark roux", note: "the half kept in the fridge" },
    { id: "onion", g: "Pot", per: 0.5, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bpep", g: "Pot", per: 0.5, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "celery", g: "Pot", per: 1, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced" },
    { id: "broth", g: "Pot", per: 1.667, step: 0.25, unit: "cup", name: "homemade chicken broth", note: "Sunday's; or the same amount of water plus the powdered chicken stock below" },
    { id: "powder", g: "Pot", per: 1.667, step: 0.5, unit: "tsp", name: "powdered chicken stock", note: "only if using water instead of broth" },
    { id: "chicken", g: "Pot", per: 0.667, step: 0.25, unit: "lb", name: "chicken thighs", note: "bone-in or boneless, skin off; about 2 1/4 lb if bone-in" },
    { id: "saus", g: "Pot", per: 0.25, step: 0.25, unit: "lb", name: "andouille or smoked sausage", note: "half the pack, 1/4 inch coins; the other half is Wednesday's" },
    { id: "garlic", g: "Pot", per: 0.333, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "cajun", g: "Pot", per: 0.667, step: 0.5, unit: "tsp", name: "Cajun seasoning" },
    { id: "thyme", g: "Pot", per: 0.167, step: 0.25, unit: "tsp", name: "dried thyme" },
    { id: "paprika", g: "Pot", per: 0.333, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "bay", g: "Pot", per: 0.667, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "riceM", g: "Rice cooker", per: 0.333, step: 0.25, unit: "cup", name: "rice", note: "tonight" },
    { id: "riceT", g: "Rice cooker", per: 0.5, step: 0.25, unit: "cup", name: "rice", note: "for Thursday's dirty rice, cooked tonight" },
    { id: "gonion", g: "To finish", per: 1.333, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To finish", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "fsalt", g: "To finish", per: 0.083, step: 0.25, unit: "tsp", name: "kosher salt, to finish", note: "only if it tastes flat" },
    { id: "hot", g: "To finish", fixed: "at the table", name: "hot sauce", note: "his bowl only" },
  ],
  steps: [
    { id: "k0", at: 113, lane: "prep", short: "Dice tonight's trinity", txt: "Trinity, 8 minutes. Dice the onion and the bell pepper about 1/2 inch and slice the celery 1/4 inch, all into one bowl.", uses: ["onion", "bpep", "celery"] },
    { id: "k1", at: 105, lane: "prep", short: "Cut chicken, slice sausage", txt: "Prep, 10 minutes. Roux and broth out of the fridge. Chicken skin off. Boneless: 1.5 inch pieces. Bone-in: leave them whole. Half the andouille into 1/4 inch coins.", uses: ["chicken", "saus"] },
    { id: "k2", at: 95, lane: "dutch", short: "Roux into the Dutch oven", txt: "Roux, 3 minutes. Sunday's roux into the Dutch oven over medium-low. It may be set hard from the fridge if made with tallow: that is normal, it melts back in. Stir as it loosens, to 250 to 275°F on the infrared, read on the roux.", uses: ["roux"] },
    { id: "k3", at: 92, lane: "dutch", short: "Trinity in, 5 min", txt: "Trinity, 5 minutes. The bowl of onion, pepper and celery in. Burner to medium, 300 to 325°F. Stir until soft.", },
    { id: "k4", at: 87, lane: "dutch", short: "Garlic and spices, 1 min", txt: "1 minute. Garlic, Cajun seasoning, thyme and smoked paprika in, stirred until fragrant.", uses: ["garlic", "cajun", "thyme", "paprika"] },
    { id: "k5", at: 86, lane: "dutch", short: "Broth in, whisk, to a simmer", txt: "Broth, 6 minutes. The broth in a cup at a time, whisking smooth after each (or water with the stock powder stirred in). Bay leaves in. Up to a lively simmer, 195 to 205°F on a probe.", uses: ["broth", "powder", "bay"] },
    { id: "k6", at: 80, lane: "dutch", short: "Chicken and sausage in, simmer", txt: "Simmer, about an hour. Chicken and sausage in, back to the simmer, then lower to hold 190 to 200°F on a probe, lid ajar. Stir the bottom now and then.", uses: ["chicken", "saus"] },
    { id: "k7", at: 75, lane: "rice", short: "Rice cooker on, both batches", txt: "Rice, 5 minutes. Rinse all the rice until the water runs nearly clear, water to the cooker's line for the full amount, start. Tonight's and Thursday's cook together.", uses: ["riceM", "riceT"] },
    { id: "k8", at: 50, lane: "dutch", short: "Stir, skim, check 190 to 200", txt: "2 minutes. Stir, skim the oil off the top with a ladle, probe 190 to 200°F." },
    { id: "k9", at: 30, lane: "dutch", short: "Probe the chicken: 165°F", txt: "2 minutes. Probe the thickest piece of chicken: 165°F minimum. Bone-in: near the bone, not touching it. Boneless: press the pieces against the side to break them into shreds." },
    { id: "k10", at: 25, lane: "rice", short: "Spread Thursday's rice to cool", txt: "3 minutes. Fluff the rice. Scoop Thursday's share, three fifths of the pot, onto a sheet pan, spread thin. Lid back on the rest." },
    { id: "k11", at: 20, lane: "dutch", short: "Bone-in only: meat off the bones", txt: "Bone-in thighs only, 6 minutes. Thighs onto a board with tongs, the meat pulled off the bones with two forks, shredded and stirred back in. Bones in the bin. Boneless: nothing to do here." },
    { id: "k12", at: 14, lane: "prep", short: "Slice green onion, parsley", txt: "4 minutes. Slice the green onions and chop the parsley.", uses: ["gonion", "parsley"] },
    { id: "k13", at: 8, lane: "dutch", short: "Bay out, taste, greens in", txt: "3 minutes. Bay leaves out. Taste; only if flat, the finishing salt. Half the greens stirred in, the rest for the top. Burner to low, held at 180 to 190°F on a probe until serving.", uses: ["fsalt"] },
    { id: "k14", at: 3, lane: "fridge", short: "Thursday's rice into the fridge", txt: "2 minutes. The cooled rice into a covered container, labelled Thu, into the fridge." },
    { id: "k15", at: 0, lane: "serve", short: "Eat", txt: "A scoop of rice in each bowl, gumbo ladled over, green onion and parsley on top. Hot sauce on the table for the Captain; the boys' bowls stay mild." },
  ],
  entry: { chapter: "mains", label: "POT", blurb: "His own gumbo · Sunday's roux · trinity diced tonight · from 4:37", meal: ["dinner"], protein: ["chicken", "pork"], heat: ["stovetop"], total: 113, active: 58, band: "hour", time: "4:37 to 6:30", effort: 2, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Wednesday 11 Nov: andouille Creole over creamy grits, made tonight (job 1108-1448-mnp) ----------------
// Was fried grits cakes from Sunday's set grits; fried cakes need grits set for hours, so the grits are made tonight.
R.push({
  slug: "fried-grits-andouille-creole", name: "Andouille Creole over creamy grits", serve: "18:30",
  sub: "Wednesday, Louisiana week, stove only. Active time: about 30 minutes, 6:00 to 6:30, all of it at the stove. Andouille browned in the cast iron and simmered in a quick Creole tomato sauce with tonight's trinity, spooned over creamy cheese grits made tonight. This used to be fried grits cakes, but those need grits set in the fridge for hours, so tonight the grits are simply made fresh.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet &middot; saucepan with a lid, for the grits &middot; whisk &middot; flat wooden spatula &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Grits:</b> regular grits take about 20 minutes and the page is timed for them. Quick grits take about 5: whisk them in 7 minutes before eating instead. Not instant.`,
    `<b>Food safety:</b> andouille comes cooked; browning heats it through. Bring the sauce to 165°F on a probe before serving.`,
    MILD, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "gwater", g: "Grits", per: 1, step: 0.5, unit: "cup", name: "water" },
    { id: "gpowder", g: "Grits", per: 0.333, step: 0.5, unit: "tsp", name: "powdered chicken stock", note: "for the grits" },
    { id: "gsalt", g: "Grits", per: 0.083, step: 0.125, unit: "tsp", name: "kosher salt", note: "in the grits water" },
    { id: "grits", g: "Grits", per: 0.25, step: 0.25, unit: "cup", name: "grits", note: "regular or quick, not instant" },
    { id: "gbutter", g: "Grits", per: 0.5, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "cheddar", g: "Grits", per: 0.25, step: 0.25, unit: "cup", name: "sharp cheddar", note: "shredded from the block" },
    { id: "ooil", g: "Creole sauce", per: 0.333, step: 0.5, unit: "tbsp", name: "beef tallow (or canola oil)" },
    { id: "saus", g: "Creole sauce", per: 0.25, step: 0.25, unit: "lb", name: "andouille or smoked sausage", note: "the other half of the pack, 1/4 inch coins" },
    { id: "onion", g: "Creole sauce", per: 0.167, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bpep", g: "Creole sauce", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "celery", g: "Creole sauce", per: 0.333, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced" },
    { id: "garlic", g: "Creole sauce", per: 0.333, step: 0.25, unit: "tsp", name: "jarred minced garlic" },
    { id: "tpaste", g: "Creole sauce", per: 0.333, step: 0.5, unit: "tbsp", name: "tomato paste" },
    { id: "cajun", g: "Creole sauce", per: 0.333, step: 0.25, unit: "tsp", name: "Cajun seasoning" },
    { id: "thyme", g: "Creole sauce", per: 0.083, step: 0.125, unit: "tsp", name: "dried thyme" },
    { id: "paprika", g: "Creole sauce", per: 0.167, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "tom", g: "Creole sauce", per: 0.333, step: 1, unit: "", name: "can diced tomatoes", plural: "cans diced tomatoes", note: "14.5 oz, with the juice" },
    { id: "broth", g: "Creole sauce", per: 0.167, step: 0.25, unit: "cup", name: "homemade chicken broth", note: "or the same amount of water plus the powdered chicken stock below" },
    { id: "powder", g: "Creole sauce", per: 0.167, step: 0.25, unit: "tsp", name: "powdered chicken stock", note: "for the sauce, only if using water instead of broth" },
    { id: "bay", g: "Creole sauce", per: 0.333, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "fsalt", g: "Creole sauce", per: 0.083, step: 0.125, unit: "tsp", name: "kosher salt, to finish", note: "only if flat" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "w1", at: 30, lane: "sauce", short: "Grits water on to boil", txt: "1 minute. Saucepan: the water, powdered chicken stock and salt, lid on, high heat, to a boil, 212°F on a probe, about 7 minutes.", uses: ["gwater", "gpowder", "gsalt"] },
    { id: "w2", at: 29, lane: "prep", short: "Dice trinity, slice sausage", txt: "Prep, 7 minutes. Dice the onion and the bell pepper about 1/2 inch and slice the celery 1/4 inch, into one bowl. Slice the sausage into 1/4 inch coins.", uses: ["onion", "bpep", "celery", "saus"] },
    { id: "w3", at: 22, lane: "sauce", short: "Grits in, low, stir every 5 min", txt: "Grits, 20 minutes. Whisk the grits into the boil in a slow stream so no lumps form. Burner to low, lid ajar: a lazy bubble, 185 to 195°F on a probe. Stir every 5 minutes, scraping the bottom.", uses: ["grits"] },
    { id: "w4", at: 21, lane: "iron", short: "Brown the sausage, 4 min", txt: "Cast iron at medium, beef tallow (or canola oil) in: 325 to 350°F on the infrared, read on the fat. Sausage coins in, stir now and then for 4 minutes until browned at the edges.", uses: ["ooil"] },
    { id: "w5", at: 17, lane: "iron", short: "Trinity in, 4 min", txt: "Trinity, 4 minutes. The bowl of onion, pepper and celery in. Burner to medium-low, pan at 300 to 325°F. Stir until soft." },
    { id: "w6", at: 13, lane: "iron", short: "Garlic, paste, spices, 1 min", txt: "1 minute. Garlic, tomato paste, Cajun seasoning, thyme and smoked paprika in, stirred until the paste darkens a shade.", uses: ["garlic", "tpaste", "cajun", "thyme", "paprika"] },
    { id: "w7", at: 12, lane: "iron", short: "Tomatoes and stock, simmer", txt: "Sauce, 9 minutes. Tomatoes with their juice, the broth (or the same amount of water with the stock powder stirred in) and the bay leaf in. Bring to a lively simmer, 195 to 205°F on a probe, then lower to a gentle 180 to 190°F and let it thicken, stirring now and then.", uses: ["tom", "broth", "powder", "bay"] },
    { id: "w8", at: 10, lane: "prep", short: "Slice green onion, parsley", txt: "3 minutes. Slice the green onions and chop the parsley.", uses: ["gonion", "parsley"] },
    { id: "w9", at: 3, lane: "iron", short: "Probe 165, taste, bay out", txt: "1 minute. Sauce at 165°F or more on a probe. Bay leaf out. Taste; only if flat, the finishing salt.", uses: ["fsalt"] },
    { id: "w10", at: 2, lane: "sauce", short: "Butter and cheddar into grits", txt: "Off the heat, 2 minutes. Butter and cheddar in, stir until melted. Taste; salt only if flat.", uses: ["gbutter", "cheddar"] },
    { id: "w11", at: 0, lane: "serve", short: "Eat", txt: "Grits in the bowl, andouille Creole sauce spooned over, green onion and parsley on top. Hot sauce on the table for the Captain; the boys' plates stay mild." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Andouille Creole sauce · creamy cheese grits made tonight · 30 minutes", meal: ["dinner"], protein: ["pork"], heat: ["stovetop"], total: 30, active: 30, band: "quick", time: "30 minutes, 6:00 to 6:30", effort: 2, ahead: false, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Thursday 12 Nov: dirty rice ----------------
R.push({
  slug: "dirty-rice", name: "Dirty rice", serve: "18:30",
  sub: "Thursday, Louisiana week, stove only. Active time: about 35 minutes, 5:55 to 6:30. Ground pork, ground beef or breakfast sausage browned hard in the cast iron with tonight's trinity, diced fresh, garlic and Cajun spice, then Monday's cold rice fried through it with a splash of stock and soy. Green beans on the side. The ground meat thaws in the fridge the night before.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet &middot; small saucepan &middot; flat wooden spatula &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Cold rice is the point:</b> Monday's rice, cooled and dried in the fridge, fries in separate grains. Break up the clumps with your hands before it goes in.`,
    `<b>Which meat:</b> ground pork as written. Ground beef: the same, and spoon off all but about 1 tbsp of fat after browning if it is fatty. Breakfast sausage: it comes salted and seasoned, so use about half the kosher salt and half the Cajun seasoning, and taste before adding more.`,
    `<b>Food safety:</b> ground pork, ground beef and breakfast sausage to 160°F on a probe; it is past that after browning and the trinity. Leftover rice must come back to 165°F on a probe, so the rice step ends with a probe. The meat thaws in the fridge, never on the counter.`,
    `<b>Ground meat:</b> it went into the freezer the day it was bought, because raw ground meat keeps only 1 to 2 days in the fridge. The night before, it moves to the fridge to thaw.`,
    `<b>Still frozen at 6:00?</b> Seal the bag and sit it in a bowl of cold water, changing the water every 30 minutes, and set Eating at later. Never warm water.`,
    MILD, PEPPER, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "pork", g: "Dirty rice", per: 0.333, step: 0.25, unit: "lb", name: "ground pork, ground beef or breakfast sausage", note: "thawed in the fridge" },
    { id: "coil", g: "Dirty rice", per: 0.333, step: 0.5, unit: "tbsp", name: "beef tallow (or canola oil)" },
    { id: "salt", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt", note: "on the meat as it goes in; half with breakfast sausage" },
    { id: "pepper", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "ground black pepper", note: "after the browning" },
    { id: "onion", g: "Dirty rice", per: 0.333, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bpep", g: "Dirty rice", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "celery", g: "Dirty rice", per: 0.667, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced" },
    { id: "garlic", g: "Dirty rice", per: 0.333, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "cajun", g: "Dirty rice", per: 0.667, step: 0.5, unit: "tsp", name: "Cajun seasoning", note: "half with breakfast sausage" },
    { id: "paprika", g: "Dirty rice", per: 0.333, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "thyme", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "dried thyme" },
    { id: "broth", g: "Dirty rice", per: 0.167, step: 0.25, unit: "cup", name: "homemade chicken broth", note: "made Sunday; or the same amount of water plus the powdered chicken stock below" },
    { id: "powder", g: "Dirty rice", per: 0.333, step: 0.5, unit: "tsp", name: "powdered chicken stock", note: "only if using water instead of broth" },
    { id: "soy", g: "Dirty rice", per: 0.333, step: 0.5, unit: "tsp", name: "soy sauce" },
    { id: "rice", g: "Dirty rice", fixed: "all of it", name: "Monday's cooked rice", note: "cold, clumps broken up" },
    { id: "fsalt", g: "Dirty rice", per: 0.083, step: 0.125, unit: "tsp", name: "kosher salt, to finish", note: "only if flat" },
    { id: "beans", g: "Green beans", per: 0.333, step: 0.25, unit: "lb", name: "green beans", note: "the rest of the bag" },
    { id: "vwater", g: "Green beans", per: 0.167, step: 0.25, min: 0.5, unit: "cup", name: "water" },
    { id: "vsalt", g: "Green beans", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "vbutter", g: "Green beans", per: 0.333, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "d0", at: 1440, lane: "fridge", short: "Thaw the meat in the fridge", txt: "The night before, 1 minute. The ground meat from the freezer into the fridge, on a plate, to thaw flat overnight." },
    { id: "d1a", at: 35, lane: "prep", short: "Dice tonight's trinity", txt: "Trinity, 5 minutes. Dice the onion and the bell pepper about 1/2 inch and slice the celery 1/4 inch, all into one bowl.", uses: ["onion", "bpep", "celery"] },
    { id: "d1", at: 30, lane: "iron", short: "Cast iron on, medium-high", txt: "Cast iron on the burner, empty, at medium-high, to come up over 5 minutes to 350 to 375°F on the infrared." },
    { id: "d2", at: 29, lane: "prep", short: "Trim beans, slice greens", txt: "4 minutes. Snap the stem ends off the green beans. Slice the green onions and chop the parsley.", uses: ["beans", "gonion", "parsley"] },
    { id: "d3", at: 25, lane: "iron", short: "Meat in, brown 6 min, no pepper", txt: "Meat, 6 minutes. Pan at 350 to 375°F. Beef tallow (or canola) in, the meat in as one flat layer, salt over the top (breakfast sausage: half the salt, it comes seasoned). No pepper. 3 minutes untouched for a brown crust, then break it up with the spatula and brown 3 minutes more.", uses: ["coil", "pork", "salt"] },
    { id: "d4", at: 22, lane: "sauce", short: "Beans water on to boil", txt: "Small saucepan: the water and salt, lid on, high to a boil, 212°F on a probe, about 3 minutes.", uses: ["vwater", "vsalt"] },
    { id: "d5", at: 19, lane: "iron", short: "Pepper, trinity in, 5 min", txt: "Trinity, 5 minutes. Ground beef with a lot of fat in the pan: spoon off all but about 1 tbsp first. Pepper over the browned meat. The bowl of trinity in. Burner to medium, pan at 300 to 325°F. Stir until soft.", uses: ["pepper"] },
    { id: "d6", at: 18, lane: "sauce", short: "Beans in, steam 7 min", txt: "Beans in, lid on, steam 7 minutes, shaking the pan once, until bright and just tender.", uses: ["beans"] },
    { id: "d7", at: 14, lane: "iron", short: "Garlic and spices, 1 min", txt: "1 minute. Garlic, Cajun seasoning, smoked paprika and thyme in (breakfast sausage: half the Cajun seasoning, taste first). Stir until fragrant.", uses: ["garlic", "cajun", "paprika", "thyme"] },
    { id: "d8", at: 13, lane: "iron", short: "Broth and soy, scrape", txt: "1 minute. Pour in the broth (or the same amount of water with the stock powder stirred in) with the soy sauce and scrape up every brown bit.", uses: ["broth", "powder", "soy"] },
    { id: "d9", at: 12, lane: "iron", short: "Rice in, fry 6 min", txt: "Rice, 6 minutes. Burner to medium-high, pan back up to 350 to 375°F. Monday's rice in, folded through until every grain is coated. Spread it flat, 1 minute untouched to toast, then fold again; repeat.", uses: ["rice"] },
    { id: "d10", at: 11, lane: "sauce", short: "Drain beans, butter", txt: "1 minute. Drain the beans, back in the pan, butter in, toss. Lid on.", uses: ["vbutter"] },
    { id: "d11", at: 6, lane: "iron", short: "Probe 165, taste", txt: "2 minutes. Probe the rice in the centre of the pan: 165°F or more. Taste; only if flat, the finishing salt.", uses: ["fsalt"] },
    { id: "d12", at: 3, lane: "iron", short: "Greens in, off the heat", txt: "1 minute. Burner off. Half the green onion and parsley folded in, the rest for the top." },
    { id: "d13", at: 0, lane: "serve", short: "Eat", txt: "Dirty rice in the bowl, green onion and parsley on top, green beans on the side. Hot sauce on the table for the Captain; the boys' plates stay mild." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Monday's rice · ground meat and trinity · 35 minutes", meal: ["dinner"], protein: ["pork", "beef"], heat: ["stovetop"], total: 35, active: 35, band: "quick", time: "35 minutes, 5:55 to 6:30", effort: 1, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Rotisserie chicken broth, Instant Pot, timed forward from a start time (job 1108-1448-mnp) ----------------
// A side cook gets its own page (RECIPE-RULES.md). Steps are forward minutes (f) from Start at; at = -f.
R.push({
  slug: "chicken-broth", name: "Rotisserie chicken broth", serve: "14:47", start: true,
  unitLabel: "Carcasses", serv: { base: 2, min: 1, max: 3 },
  sub: "Instant Pot, pressure cooked. Frozen rotisserie chicken carcasses go straight in with the spare onion, celery, a bay leaf and cold water to the PC MAX line, then Pressure Cook High 90 minutes and a natural release. Strained into an ice bath, into jars and the fridge. Set the time you start and every step counts forward from it: a 2:47 start strains about 5:10 and is in the fridge by 6:20. The come-up and release times are estimates.",
  notes: [
    `<b>Equipment:</b> 6 quart Instant Pot with its sealing lid &middot; tongs &middot; oven gloves &middot; fine mesh sieve &middot; large metal bowl that fits in the sink &middot; ice from the freezer &middot; ladle &middot; jars with lids &middot; probe thermometer.`,
    `<b>The clock is an estimate:</b> from frozen the pot takes about 25 minutes to come up to pressure (it can be 25 to 35), and the natural release about 20 minutes (it can be 20 to 30). The page uses 25 and 20 so a 2:47 start strains about 5:10. If the pin is slow either time, the steps after it run late by the same; press Start now on the next step to re-time the rest.`,
    `<b>PC MAX line:</b> fill only to the PC MAX line on the inner pot, two thirds full, never the top line. Three carcasses only if they fit under it broken up; the water then stays at the line, so three gives about the same volume as two, just richer.`,
    `<b>Yield:</b> about 8 to 10 cups from two carcasses, about 5 to 6 from one, about 9 to 10 from three. An estimate. No salt in it: the recipes that use it season it.`,
    `<b>Cooling, the food safety rule:</b> under 70°F within 2 hours of straining, then under 40°F within the next 4 hours. The ice bath does the first part in about an hour; the fridge does the rest, so leave space around the jars.`,
    `<b>Keeps:</b> about 4 days in the fridge, or about 3 months in the freezer with 1 inch of space at the top of the jar. The fat cap on top is optional: leave it as a seal, or lift it off cold.`,
    `<b>No broth?</b> The pages that use it carry water plus powdered chicken stock as the fallback, cup for cup.`,
  ],
  ing: [
    { id: "carcass", g: "Instant Pot", per: 1, step: 1, unit: "", name: "rotisserie chicken carcass", plural: "rotisserie chicken carcasses", note: "frozen, straight in" },
    { id: "onion", g: "Instant Pot", per: 0.5, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "the spare one, quartered, skin on" },
    { id: "celery", g: "Instant Pot", per: 1, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "in thirds" },
    { id: "bay", g: "Instant Pot", by: { 1: "1|bay leaf", 2: "1|bay leaf", 3: "2|bay leaves" }, name: "bay leaf" },
    { id: "water", g: "Instant Pot", by: { 1: "about 7 cups", 2: "about 10 cups", 3: "about 9 cups" }, name: "cold water", note: "up to the PC MAX line, two thirds full, never past it" },
    { id: "ice", g: "Cooling", fixed: "about 2 trays", name: "ice", note: "from the freezer, with cold water in the sink" },
    { id: "jars", g: "Cooling", fixed: "enough for 10 cups", name: "jars with lids" },
  ],
  steps: [
    { id: "b1", f: 0, lane: "cooker", short: "Carcasses, veg, cold water in", txt: "Load, 4 minutes. The frozen carcasses into the inner pot, frozen. Quarter the onion with its skin on, cut the celery into thirds, in with the bay leaf. Cold water up to the PC MAX line and no higher.", uses: ["carcass", "onion", "celery", "bay", "water"] },
    { id: "b2", f: 4, lane: "cooker", short: "Sealing, Pressure Cook High 90", txt: "Lid on, 1 minute. Turn the valve to Sealing. Pressure Cook, High, 90 minutes, Start. From frozen it takes about 25 minutes to come up to pressure (an estimate, it can be 25 to 35)." },
    { id: "b3", f: 29, lane: "cooker", short: "Glance: pin up, counting down", txt: "Glance, no work. The float pin is up and the screen counts down from 90. If it still shows On, it is still coming up: every minute it runs over moves the strain later by the same." },
    { id: "b4", f: 119, lane: "cooker", short: "Beep: natural release, hands off", txt: "No work. The 90 minutes are done and the pot beeps. Leave the valve on Sealing: natural release, about 20 minutes (an estimate, it can be 20 to 30). The pressure falls on its own." },
    { id: "b5", f: 129, lane: "prep", short: "Set up the ice bath", txt: "Ice bath, 8 minutes. Plug the sink. The large metal bowl in it, the sieve on top. Ice and cold water around the bowl, up to about two thirds of its height, none inside.", uses: ["ice"] },
    { id: "b6", f: 139, lane: "cooker", short: "Pin down, lid off, carcasses out", txt: "4 minutes. The float pin is down. Turn the valve to Venting to be sure nothing hisses, then lid off, tilted away from you. Carcasses out with tongs into a bin bag." },
    { id: "b7", f: 143, lane: "prep", short: "Strain into the ice bath", txt: "Strain, 5 minutes. Lift the inner pot out with oven gloves and pour the broth through the sieve into the bowl in the ice bath. Onion, celery and bay leaf in the bin. Probe and note the reading: the 2 hour count to under 70°F starts now." },
    { id: "b8", f: 158, lane: "prep", short: "Stir, add ice outside", txt: "Cool, 2 minutes. Stir the broth so the warm middle meets the cold sides. Add more ice to the sink around the bowl as it melts." },
    { id: "b9", f: 178, lane: "prep", short: "Stir, probe under 100", txt: "Cool, 2 minutes. Stir and probe: it should be under 100°F by now. If not, drain some warm sink water and add ice." },
    { id: "b10", f: 203, lane: "jar", short: "Under 70°F: into jars", txt: "Jars, 10 minutes. Probe: under 70°F, inside 2 hours of straining. Ladle into the jars, 1 inch from the top for any that go to the freezer. Lids on, write the date: use within 4 days.", uses: ["jars"] },
    { id: "b11", f: 213, lane: "fridge", short: "Jars into the fridge", txt: "Into the fridge, spaced apart so the cold air gets round them, to reach under 40°F within the next 4 hours. Any jar you will not use in 4 days goes in the freezer, good for about 3 months." },
  ],
  entry: { chapter: "stocks", label: "POT", blurb: "Instant Pot · frozen carcasses · High 90 · natural release · strained about 5:10", meal: ["side"], protein: ["chicken"], heat: ["stovetop"], total: 213, active: 35, band: "afternoon", time: "start 2:47 pm, strained about 5:10, in the fridge by 6:20", effort: 1, ahead: true, kid: true, serves: 2, occasion: ["weekend"], timed: true, scales: true, test: false },
});

const LANES = `var LANE = {pot:["POT","t-pot"], pan:["PAN","t-pan"], prep:["PREP","t-prep"], serve:["SERVE","t-serve"],
            fire:["FIRE","t-fire"], oven:["OVEN","t-oven"], jar:["JAR","t-jar"], fridge:["FRIDGE","t-fridge"], cooker:["INSTANT POT","t-pot"], rice:["RICE COOKER","t-jar"], away:["AWAY","t-prep"], store:["STORE","t-prep"], iron:["CAST IRON","t-pan"], dutch:["DUTCH OVEN","t-pot"], bigpot:["BIG POT","t-pot"], sauce:["SAUCEPAN","t-pan"]};`;

function page(r: R) {
  if (r.end != null) for (const s of r.steps) { s.at = r.end - s.f; delete s.f; }
  if (r.start) for (const s of r.steps) { s.at = s.f ? -s.f : 0; delete s.f; }
  r.steps.sort((a: any, b: any) => b.at - a.at);
  const bad = JSON.stringify(r).match(/[–—]/);
  if (bad) throw new Error("dash in " + r.slug);
  for (const s of r.steps) for (const u of s.uses || []) if (!r.ing.find((i: any) => i.id === String(u).split("@")[0])) throw new Error(r.slug + " step " + s.id + " uses unknown " + u);
  let h = tpl;
  const rep = (a: string | RegExp, b: string) => { const n = h.replace(a as any, () => b); if (n === h) throw new Error("no match in " + r.slug + ": " + a); h = n; };
  rep("<title>Carne guisada</title>", `<title>${r.name}</title>`);
  rep("<h1>Carne guisada</h1>", `<h1>${r.name}</h1>`);
  rep(/<p class="sub">[^<]*<\/p>/, `<p class="sub">${r.sub}</p>`);
  rep(/  <p class="note"><b>Why the cast iron, not Saute:[\s\S]*?<\/p>\n<\/div>\n/, r.notes.map(n => `  <p class="note">${n}</p>\n`).join("") + "</div>\n");
  rep(/var ING = .*;\n/, "var ING = " + JSON.stringify(r.ing) + ";\n");
  rep(/var STEPS = .*;\n/, "var STEPS = " + JSON.stringify(r.steps) + ";\n");
  const sv = r.serv || { base: 3, min: 2, max: 6 };
  rep(/var SERV = .*;\n/, "var SERV = " + JSON.stringify(sv) + ";\n");
  if (r.serve !== "18:30") { rep('value="18:30"', 'value="' + r.serve + '"'); rep('serve: "18:30"', 'serve: "' + r.serve + '"'); }
  if (r.anchorLabel) { rep('Eating at</label>', r.anchorLabel + '</label>'); rep("'Dinner was at <b>'", "'Due in the fridge at <b>'"); rep("'<b>Eat.</b>'", "'<b>Into the fridge.</b>'"); rep("'Dinner is now <b>'", "'Fridge time is now <b>'"); }
  if (r.start) { rep('Eating at</label>', 'Start at</label>'); rep("'Dinner was at <b>'", "'Finished at <b>'"); rep("'<b>Eat.</b>'", "'<b>Into the fridge.</b>'"); rep("'Dinner is now <b>'", "'Start is now <b>'"); }
  if (r.unitLabel) rep('for="dec">Servings', 'for="dec">' + r.unitLabel);
  rep('var KEY = "kitchen:carne-guisada:pressure";', `var KEY = "kitchen:${r.slug}";`);
  rep(/var LANE = \{[^;]*;/, LANES);
  rep(/<span id="sv">4<\/span>/, '<span id="sv">' + sv.base + '</span>');
  rep("</style>", "/* Louisiana week: tighter checklist rows so the longest day fits one phone screen. */\n.ck{font-size:12px;line-height:1.15;padding:0}\n.ck.now{padding:0 12px}\n.ck input{width:14px;height:14px}\n.ck .ct{font-size:11px;min-width:52px}\n</style>");
  rep(/<script>\n\/\* Step player settings[\s\S]*?<script src="\.\/step-player\.js">\n<\/script>\n/, "");
  if (/guisada|tortilla/i.test(h)) throw new Error("template text left in " + r.slug);
  writeFileSync(W + "/" + r.slug + ".html", crlf(h));
}
const RETIRED: string[] = [];
const todo = (only.length ? R.filter(r => only.includes(r.slug)) : R).filter(r => !RETIRED.includes(r.slug));
for (const r of todo) page(r);

// recipes.json and the embedded copy in index.html
const rj = JSON.parse(readFileSync(W + "/recipes.json", "utf8"));
const idx = readFileSync(W + "/index.html", "utf8").replace(/\r\n/g, "\n");
const m = idx.match(/var DATA = (.*);\n/);
if (!m) throw new Error("no DATA");
if (m[1] !== JSON.stringify(rj)) console.log("WARN: index DATA differs from recipes.json before the change");
if (todo.some(r => r.entry.chapter === "stocks") && !rj.chapters.some((c: any) => c.id === "stocks")) rj.chapters.splice(rj.chapters.findIndex((c: any) => c.id === "pantry") + 1, 0, { id: "stocks", name: "Stocks & Bases", line: "Broth and the bases the dinners lean on, each on its own page" });
const plainIng = (r: R) => [...new Set(r.ing.map((i: any) => i.name))];
const order = ["slug","name","file","sub","chapter","label","blurb","meal","protein","heat","total","active","band","time","effort","ahead","kid","serves","occasion","timed","scales","test","ingredients","steps"];
const add = todo.map(r => { const a: any = Object.assign({ slug: r.slug, name: r.name, file: r.slug + ".html", sub: r.sub }, r.entry, { ingredients: plainIng(r), steps: r.steps.length }); const o: any = {}; for (const k of order) o[k] = a[k]; return o; });
for (const a of add) {
  const i = rj.recipes.findIndex((x: any) => x.slug === a.slug);
  if (i >= 0) rj.recipes[i] = a;
  else rj.recipes.splice(rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice") + 1, 0, a);
}
// keep the four in week order after red beans
const week = ["grillades-and-grits", "chicken-andouille-gumbo", "chicken-broth", "fried-grits-andouille-creole", "dirty-rice"];
const mine = rj.recipes.filter((x: any) => week.includes(x.slug)).sort((a: any, b: any) => week.indexOf(a.slug) - week.indexOf(b.slug));
rj.recipes = rj.recipes.filter((x: any) => !week.includes(x.slug));
rj.recipes.splice(rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice") + 1, 0, ...mine);
rj.recipes = rj.recipes.filter((x: any) => !RETIRED.includes(x.slug));
writeFileSync(W + "/recipes.json", JSON.stringify(rj, null, 1) + "\n");
writeFileSync(W + "/index.html", crlf(idx.replace(/var DATA = .*;\n/, () => "var DATA = " + JSON.stringify(rj) + ";\n")));

// service worker: pages in the shell, cache bumped once per run that adds a page
let sw = readFileSync(W + "/sw.js", "utf8");
let added = false;
for (const r of todo) if (!sw.includes(`"./${r.slug}.html"`)) { sw = sw.replace('"./carne-guisada.html", ', `"./carne-guisada.html", "./${r.slug}.html", `); added = true; }
for (const slug of RETIRED) if (sw.includes(`"./${slug}.html", `)) { sw = sw.replace(`"./${slug}.html", `, ""); added = true; }
if (added) { const cm = sw.match(/var CACHE = "kitchen-v(\d+)";/)!; sw = sw.replace(cm[0], `var CACHE = "kitchen-v${+cm[1] + 1}";`); }
writeFileSync(W + "/sw.js", sw);
console.log("done", todo.map(r => r.slug).join(" "));
