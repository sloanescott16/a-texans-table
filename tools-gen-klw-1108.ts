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

type R = { slug: string; name: string; sub: string; notes: string[]; ing: any[]; steps: any[]; entry: any; serve: string; end?: number };
const R: R[] = [];

// ---------------- Sunday 8 Nov: grillades and grits, plus the week's prep ----------------
// Steps are written in forward minutes (f) from the first move; at = END - f.
R.push({
  slug: "grillades-and-grits", name: "Grillades and grits", serve: "18:30", end: 246,
  sub: "Sunday, Louisiana week. A beef chuck tender roast sliced across the grain into medallions and pounded thin, seared hard in the cast iron, then braised 2 hours in a dark roux gravy with the trinity, tomatoes and beef stock, over cheese grits made with stock and butter, green beans on the side. While it braises, the week's prep: a double dark roux (half for tonight, half for Monday), the trinity chopped and bagged for all four nights, a second pot of grits set in a dish for Wednesday, and Monday's gumbo loaded into the Instant Pot inner pot and into the fridge. First move at 2:24 for 6:30.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet with a lid or foil &middot; big pot, 5 to 6 quart, for the grits &middot; small saucepan for the beans &middot; Instant Pot inner pot (filled tonight, cooked Monday) &middot; heatproof steel or glass bowl for the hot roux &middot; 8 by 8 or 9 by 9 inch square pan, so Wednesday's squares cut evenly &middot; three zip bags &middot; meat mallet or rolling pin &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>The week from tonight:</b> Monday's gumbo is in the inner pot in the fridge, so Monday morning is one step. Wednesday's grits are set in the dish. The trinity bags are Monday (already in the pot), Wednesday and Thursday. The second half of the sausage stays whole and sealed for Wednesday.`,
    `<b>Ground meat for Thursday:</b> raw ground meat keeps only 1 to 2 days in the fridge, so it goes in the freezer tonight, pressed flat in its bag. Wednesday's page moves it to the fridge after dinner.`,
    `<b>Roux safety:</b> a dark roux is near 350°F and sticks to skin. Long sleeves, no water near the pan, and stir with a flat wooden spatula. The dark sear bits from the beef are expected and fine. A sharp, acrid burnt smell means start again; a scorched roux cannot be saved.`,
    `<b>Roux heat:</b> hold the roux at 325 to 350°F on the infrared, read on the roux itself. Canola smokes from about 400°F, so never let it pass 375°F. About 40 minutes takes it to dark chocolate. If it darkens faster than the slots, lower the burner and keep stirring: colour is the cue, the clock is the guide.`,
    `<b>Gumbo in the fridge overnight:</b> the stock is made with cold water and the roux goes in only once it reads under 150°F, so the pot goes into the fridge cool. The raw chicken rides in its own sealed bag on top, so nothing raw touches the rest overnight; it is tipped in at 7 am Monday. Monday's page starts it on High, the USDA advice for a slow cooker start.`,
    `<b>Food safety:</b> chuck tender braised 2 hours is far past the 145°F safe point; the fork test and 195 to 205°F inside are the cues for tender. Wednesday's grits go into the fridge in a shallow dish within 30 minutes and keep 3 to 4 days. Leftovers into the fridge within 2 hours, moved out of the cast iron into a container first: the tomato gravy should not sit in the pan overnight.`,
    `<b>Grits:</b> water with powdered chicken stock, then butter and sharp cheddar at the end. Use regular or quick grits, not instant; if the bag says longer than 25 minutes, go by the bag and set Eating at later.`,
    `<b>Size:</b> set for 3 servings, one beef chuck tender roast of about 2.75 lb (this one is 2.77 lb; use or freeze by 10 Nov) in three sear batches. At 5 or 6, the double roux and the braise fill a 12 inch skillet to the rim: use a 14 inch cast iron or a deep 5 quart cast iron braiser instead, sear in four batches, and set Eating at 6 minutes later. The servings scale the week's trinity and Monday's gumbo too.`,
    MILD, PEPPER, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "beef", g: "Grillades", per: 0.923, step: 0.25, unit: "lb", name: "beef chuck tender roast", note: "1/2 inch medallions across the grain, pounded to 1/4 inch" },
    { id: "bsalt", g: "Grillades", per: 0.5, step: 0.25, unit: "tsp", name: "kosher salt", note: "on the medallions before the sear" },
    { id: "pepper", g: "Grillades", per: 0.333, step: 0.25, unit: "tsp", name: "ground black pepper", note: "on the seared faces only" },
    { id: "soil", g: "Grillades", per: 1, step: 0.5, unit: "tbsp", name: "canola oil", note: "for the sear, a third a batch" },
    { id: "roil", g: "Double dark roux", per: 0.417, step: 0.125, unit: "cup", name: "canola oil", note: "half tonight, half Monday" },
    { id: "rflour", g: "Double dark roux", per: 0.417, step: 0.125, unit: "cup", name: "all-purpose flour" },
    { id: "onS", g: "Gravy", per: 0.333, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced, Sunday's bowl" },
    { id: "bpS", g: "Gravy", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced, Sunday's bowl" },
    { id: "ceS", g: "Gravy", per: 0.667, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "sliced, Sunday's bowl" },
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
    { id: "onM", g: "Trinity for the week", per: 0.5, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "Monday's share" },
    { id: "bpM", g: "Trinity for the week", per: 0.5, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "Monday's share" },
    { id: "ceM", g: "Trinity for the week", per: 1, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "Monday's share" },
    { id: "onW", g: "Trinity for the week", per: 0.167, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "Wednesday's bag" },
    { id: "bpW", g: "Trinity for the week", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "Wednesday's bag" },
    { id: "ceW", g: "Trinity for the week", per: 0.333, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "Wednesday's bag" },
    { id: "onT", g: "Trinity for the week", per: 0.333, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "Thursday's bag" },
    { id: "bpT", g: "Trinity for the week", per: 0.333, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "Thursday's bag" },
    { id: "ceT", g: "Trinity for the week", per: 0.667, step: 1, unit: "", name: "celery rib", plural: "celery ribs", note: "Thursday's bag" },
    { id: "chicken", g: "Monday's gumbo, loaded tonight", per: 0.667, step: 0.25, unit: "lb", name: "chicken thighs", note: "boneless or bone-in, skin on or off; about 2 1/4 lb if bone-in" },
    { id: "sausM", g: "Monday's gumbo, loaded tonight", per: 0.25, step: 0.25, unit: "lb", name: "andouille or smoked sausage", note: "half the pack, 1/4 inch coins; the other half is Wednesday's" },
    { id: "cwater", g: "Monday's gumbo, loaded tonight", per: 1.667, step: 0.25, unit: "cup", name: "cold water" },
    { id: "cpowder", g: "Monday's gumbo, loaded tonight", per: 1.667, step: 0.5, unit: "tsp", name: "powdered chicken stock" },
    { id: "mgarlic", g: "Monday's gumbo, loaded tonight", per: 0.333, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "mcajun", g: "Monday's gumbo, loaded tonight", per: 0.667, step: 0.5, unit: "tsp", name: "Cajun seasoning" },
    { id: "mthyme", g: "Monday's gumbo, loaded tonight", per: 0.167, step: 0.25, unit: "tsp", name: "dried thyme" },
    { id: "mpaprika", g: "Monday's gumbo, loaded tonight", per: 0.333, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "mbay", g: "Monday's gumbo, loaded tonight", per: 0.667, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "gwater", g: "Grits, tonight and Wednesday", per: 2, step: 0.5, unit: "cup", name: "water" },
    { id: "gpowder", g: "Grits, tonight and Wednesday", per: 0.667, step: 0.5, unit: "tsp", name: "powdered chicken stock" },
    { id: "gsalt", g: "Grits, tonight and Wednesday", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "grits", g: "Grits, tonight and Wednesday", per: 0.5, step: 0.25, unit: "cup", name: "grits", note: "not instant" },
    { id: "gbutter", g: "Grits, tonight and Wednesday", per: 1, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "cheddar", g: "Grits, tonight and Wednesday", per: 0.5, step: 0.25, unit: "cup", name: "sharp cheddar", note: "shredded from the block" },
    { id: "dbutter", g: "Grits, tonight and Wednesday", fixed: "1 tsp", name: "butter", note: "to grease the dish" },
    { id: "beans", g: "Green beans", per: 0.333, step: 0.25, unit: "lb", name: "green beans", note: "half the bag; the rest is Thursday's" },
    { id: "vwater", g: "Green beans", per: 0.167, step: 0.25, min: 0.5, unit: "cup", name: "water" },
    { id: "vsalt", g: "Green beans", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "vbutter", g: "Green beans", per: 0.333, step: 0.5, unit: "tbsp", name: "butter" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "s1", f: 0, lane: "prep", short: "Slice medallions, pound, salt", txt: "Beef, 15 minutes. Cold from the fridge. Trim the silver skin off the outside of the chuck tender roast. Find the grain (the lines of the muscle run the length of the roast) and slice straight across it into medallions about 1/2 inch thick. Between two sheets of plastic wrap, pound each one to an even 1/4 inch with a meat mallet or a rolling pin. Pat really dry with paper towels and salt both sides. No pepper. Onto a tray in the fridge.", uses: ["beef", "bsalt"] },
    { id: "s2", f: 15, lane: "prep", short: "Dice onions for all four nights", txt: "Trinity, onions, 12 minutes. Dice every onion for the week, about 1/2 inch. Keep each night's share apart as you go: Sunday's into a bowl, Monday's, Wednesday's and Thursday's into three zip bags.", uses: ["onS", "onM", "onW", "onT"] },
    { id: "s3", f: 27, lane: "prep", short: "Dice peppers, slice celery", txt: "Trinity, peppers and celery, 12 minutes. Dice the bell peppers about 1/2 inch and slice the celery 1/4 inch. Same split: Sunday's into the bowl with its onion, the rest into the three bags.", uses: ["bpS", "bpM", "bpW", "bpT", "ceS", "ceM", "ceW", "ceT"] },
    { id: "c1", f: 34, lane: "iron", short: "Cast iron on to heat", txt: "Cast iron on the burner, empty, at medium-high. 10 minutes to come up evenly to 400 to 425°F on the infrared at the centre." },
    { id: "s4", f: 39, lane: "fridge", short: "Bags labelled, meat to freezer", txt: "Bags away, 4 minutes. Press the air out of the three bags and write the night on each: Mon gumbo, Wed sauce, Thu dirty rice. Into the fridge. Thursday's ground meat from the shopping: press it flat in its bag and into the freezer." },
    { id: "s5", f: 43, lane: "prep", short: "Make the beef stock", txt: "Stock, 2 minutes. Whisk the beef bouillon base into the hot water in a jug. Set it by the stove.", uses: ["bbase", "bwater"] },
    { id: "c2", f: 45, lane: "iron", short: "Sear batch 1, first side, 3 min", txt: "Sear, batch 1, first side, 3 minutes. Cast iron reading 400 to 425°F. A third of the sear oil in and swirl; it should shimmer. A third of the medallions in one layer, a finger's gap apart. Do not move it for 3 minutes, until a brown crust lets go of the pan on its own.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c3", f: 48, lane: "iron", short: "Batch 1, flip, pepper, out", txt: "Batch 1, second side, 3 minutes. Turn each piece so the seared face is up and pepper it (a sixth of the pepper). 3 minutes untouched. Lift onto a plate and pepper the second seared face as it comes off (another sixth).", uses: ["pepper@0.333"] },
    { id: "c4", f: 51, lane: "iron", short: "Sear batch 2, first side, 3 min", txt: "Sear, batch 2, first side, 3 minutes. Back to 400°F first if the pan dropped, about a minute. A third of the sear oil, a third of the medallions, a finger's gap. 3 minutes untouched.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c5", f: 54, lane: "iron", short: "Batch 2, flip, pepper, out", txt: "Batch 2, second side, 3 minutes. Turn, pepper the seared face that is up (a sixth), 3 minutes. Onto the plate and pepper the second seared face as it comes off (a sixth).", uses: ["pepper@0.333"] },
    { id: "c6", f: 57, lane: "iron", short: "Sear batch 3, first side, 3 min", txt: "Sear, batch 3, first side, 3 minutes. Back to 400°F first if the pan dropped. The last of the sear oil and the last of the medallions, a finger's gap. 3 minutes untouched.", uses: ["soil@0.333", "beef@0.333"] },
    { id: "c7", f: 60, lane: "iron", short: "Batch 3, flip, pepper, out", txt: "Batch 3, second side, 3 minutes. Turn, pepper the seared face that is up (a sixth), 3 minutes. Onto the plate and pepper the last seared face as it comes off (the last sixth).", uses: ["pepper@0.333"] },
    { id: "r1", f: 63, lane: "iron", short: "Roux: oil and flour in", txt: "Double dark roux, 40 minutes of steady stirring. Burner to medium-low and let the pan fall to about 300°F on the infrared, 1 to 2 minutes; scrape the sear bits loose. Canola in, then the flour, stirred smooth. Stir across the whole bottom with a flat wooden spatula and never leave it long. Hold the roux at 325 to 350°F on the infrared, never past 375°F. If the roux runs slow and is not dark chocolate by {t:143}, set Eating at later by the same number of minutes.", uses: ["roil", "rflour"] },
    { id: "r2", f: 76, lane: "iron", short: "Roux: peanut butter colour", txt: "Roux check, keep stirring. Peanut butter colour by now. Still 325 to 350°F on the infrared; lower the burner if it climbs." },
    { id: "r3", f: 91, lane: "iron", short: "Roux: copper penny colour", txt: "Roux check, keep stirring. Copper penny colour and a toasty smell. Stir faster now: it darkens quickly from here. Still 325 to 350°F." },
    { id: "r4", f: 103, lane: "iron", short: "Dark roux: half into a bowl", txt: "Half out, 2 minutes. At dark chocolate colour, burner off for a moment. Carefully ladle half the roux into the heatproof bowl for Monday's gumbo and set it on the back of the stove to cool. It is near 350°F: no splashes, no water near it." },
    { id: "g1", f: 105, lane: "iron", short: "Sunday's trinity into the roux", txt: "Trinity in, 5 minutes. Burner back to medium. Sunday's bowl of onion, pepper and celery into the roux left in the pan; it hisses and stops the roux darkening. Stir until soft, the pan at 300 to 325°F on the infrared.", uses: ["onS", "bpS", "ceS"] },
    { id: "g2", f: 110, lane: "iron", short: "Garlic, paste, spices, 2 min", txt: "Garlic, tomato paste, Cajun seasoning, thyme and smoked paprika in. Stir 2 minutes until the paste darkens a shade.", uses: ["garlic", "tpaste", "cajun", "thyme", "paprika"] },
    { id: "g3", f: 112, lane: "iron", short: "Stock and tomatoes in", txt: "Liquid, 4 minutes. Beef stock in a little at a time, stirring smooth after each pour, then the tomatoes with their juice and the bay leaves. Bring to a lively simmer, 195 to 205°F on a probe.", uses: ["bbase", "bwater", "tom", "bay"] },
    { id: "g4", f: 116, lane: "iron", short: "Beef back, lid on, braise 2 h", txt: "Medallions and their plate juices back in, pushed under the gravy. Lid on, or foil crimped over the rim. Burner to low. Braise 2 hours at a gentle simmer, 180 to 190°F on a probe; chuck tender is lean and sinewy and needs the time. The fork test is about {t:12}." },
    { id: "g5", f: 122, lane: "iron", short: "Check the simmer", txt: "Simmer check, 1 minute. Probe the gravy: 180 to 190°F. Bubbling hard, lower the burner; still, up a touch. Lid back." },
    { id: "m1", f: 126, lane: "prep", short: "Slice Monday's sausage", txt: "Sausage, 5 minutes. Half the andouille into 1/4 inch coins, into a bowl. The other half stays whole and sealed in the fridge for Wednesday.", uses: ["sausM"] },
    { id: "m2", f: 131, lane: "cooker", short: "Gumbo stock in the inner pot", txt: "Stock, 3 minutes. Instant Pot inner pot on the counter, not in the base. Cold water in, powdered chicken stock whisked in until it dissolves.", uses: ["cwater", "cpowder"] },
    { id: "m3", f: 134, lane: "cooker", short: "Cooled roux and spices in", txt: "Roux in, 4 minutes. Check the roux in its bowl: under 150°F on the infrared. Still hotter, give it 5 minutes. Scrape it all into the cold stock and whisk until no lumps remain. Garlic, Cajun seasoning, thyme, smoked paprika and bay leaves in.", uses: ["mgarlic", "mcajun", "mthyme", "mpaprika", "mbay"] },
    { id: "m4", f: 138, lane: "cooker", short: "Monday's trinity and sausage in", txt: "2 minutes. Tip in Monday's bag of trinity and the sausage coins. Stir.", uses: ["onM", "bpM", "ceM", "sausM"] },
    { id: "m5", f: 140, lane: "prep", short: "Chicken cut, bagged, on top", txt: "Chicken, 10 minutes. Cold from the fridge, pull off any skin. Boneless: cut into 1.5 inch pieces into a zip bag. Bone-in: leave them whole on the bone, into the zip bag. Press the air out, seal it, and set the bag on top in the inner pot; it goes in at 7 am Monday. No salt: the stock powder and Cajun seasoning carry it.", uses: ["chicken"] },
    { id: "m6", f: 150, lane: "fridge", short: "Gumbo pot covered, to the fridge", txt: "3 minutes. Cover the inner pot with its glass lid, a plate or foil and into the fridge on the bottom shelf. Wash the board, knife and your hands in hot soapy water." },
    { id: "g6", f: 156, lane: "iron", short: "Braise: stir and turn", txt: "Braise check, 2 minutes. Lift the lid, stir and turn the medallions. Thicker than heavy cream, add 1/4 cup water. Probe 180 to 190°F. Lid back." },
    { id: "g9", f: 186, lane: "iron", short: "Braise: second stir and turn", txt: "Braise check, 2 minutes. Stir, turn the medallions, keep them under the gravy. Thicker than heavy cream, add 1/4 cup water. Probe 180 to 190°F. Lid back." },
    { id: "v1", f: 191, lane: "prep", short: "Trim beans, slice greens", txt: "8 minutes. Snap the stem ends off tonight's green beans. Slice tonight's green onions and chop the parsley; the rest of both bunches stays whole in the fridge for the week.", uses: ["beans", "gonion", "parsley"] },
    { id: "v2", f: 199, lane: "prep", short: "Butter the dish for Wednesday", txt: "1 minute. Rub the butter over the inside of the 8 by 8 or 9 by 9 inch square pan.", uses: ["dbutter"] },
    { id: "q1", f: 201, lane: "bigpot", short: "Grits water on to boil", txt: "Big pot: water, powdered chicken stock and salt, lid on, high heat. To a boil, 212°F on a probe, about 10 minutes.", uses: ["gwater", "gpowder", "gsalt"] },
    { id: "q2", f: 211, lane: "bigpot", short: "Grits in, low, stir every 5 min", txt: "Grits, 25 minutes. Whisk the grits into the boil in a slow stream so no lumps form. Burner to low, lid ajar: a lazy bubble, 185 to 195°F on a probe. Stir every 5 minutes, scraping the bottom, until thick and soft.", uses: ["grits"] },
    { id: "v3", f: 226, lane: "sauce", short: "Green beans: boil, steam 7 min", txt: "Beans, 10 minutes. Small saucepan: the water and salt, lid on, high to a boil, 212°F on a probe, about 3 minutes. Beans in, lid on, steam 7 minutes, shaking the pan once, until bright and just tender.", uses: ["beans", "vwater", "vsalt"] },
    { id: "g7", f: 234, lane: "iron", short: "Fork test, bay leaves out", txt: "2 minutes. Fork test: a fork slides into the thickest medallion and pulls out with no grip, and a probe in its centre reads 195 to 205°F, where the sinew in chuck tender softens. If it fights, 15 more minutes and set Eating at 15 minutes later. Fish out the bay leaves." },
    { id: "q3", f: 236, lane: "bigpot", short: "Butter and cheddar into grits", txt: "Off the heat, 2 minutes. Butter and cheddar in, stir until melted. Taste; salt only if flat.", uses: ["gbutter", "cheddar"] },
    { id: "q4", f: 238, lane: "bigpot", short: "Half the grits into the dish", txt: "2 minutes. Spoon half the grits into the buttered dish and smooth the top. Leave it uncovered on the counter. Lid on the rest; it holds off the heat." },
    { id: "v4", f: 240, lane: "sauce", short: "Drain beans, butter", txt: "1 minute. Drain the beans, back in the pan, butter in, toss. Lid on." , uses: ["vbutter"] },
    { id: "g8", f: 241, lane: "iron", short: "Taste the gravy, greens in", txt: "2 minutes. Taste the gravy; only if it tastes flat, the finishing salt. Half the green onion and parsley stirred in, the rest kept for the top.", uses: ["fsalt"] },
    { id: "q5", f: 244, lane: "fridge", short: "Wednesday's grits to the fridge", txt: "1 minute. The dish of grits into the fridge, uncovered so it cools fast. Cover it with foil after dinner." },
    { id: "e1", f: 246, lane: "serve", short: "Eat", txt: "Grits in the bowl, grillades and gravy over, green onion and parsley on top, green beans on the side. Hot sauce on the table for the Captain; the boys' plates stay mild. After dinner, leftovers out of the cast iron into a container before the fridge, and foil over Wednesday's grits." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Cast iron sear · dark roux gravy · cheese grits · the week's prep", meal: ["dinner"], protein: ["beef"], heat: ["stovetop"], total: 246, active: 160, band: "afternoon", time: "first move at 2:24, eat at 6:30", effort: 3, ahead: false, kid: true, serves: 3, occasion: ["weekend"], timed: true, scales: true, test: false },
});

// ---------------- Monday 9 Nov: chicken and andouille gumbo, Instant Pot slow cook ----------------
R.push({
  slug: "chicken-andouille-gumbo", name: "Chicken and andouille gumbo", serve: "18:30",
  sub: "Monday, Louisiana week. Loaded on Sunday: Sunday's dark roux whisked into chicken stock with the trinity, andouille, chicken thighs, garlic and Cajun spice, in the Instant Pot inner pot in the fridge. One step at 7:00 am: inner pot in, Slow Cook on High 6 hours, then it holds on Keep Warm. Rice cooker on at 5:00 with a double batch, half kept for Thursday's dirty rice. Back to a simmer, chicken shredded, green onion and parsley on top.",
  notes: [
    `<b>Equipment:</b> Instant Pot (inner pot loaded on Sunday) with its glass lid or the sealing lid on Venting &middot; rice cooker &middot; sheet pan for cooling Thursday's rice &middot; probe thermometer.`,
    `<b>Settings:</b> Slow Cook "More" is the Instant Pot's High. Six hours from a cold, full pot cooks the chicken through and tender; Keep Warm then holds above 145°F for about 4 hours, 1:00 to 5:05, until the Saute step. If the pot came straight from the fridge it is meant to: do not let it sit out first.`,
    `<b>Food safety:</b> chicken to 165°F minimum on a probe in the thickest piece; after 6 hours it is far past. Starting on High is the USDA advice for slow cooking. Time to a safe temperature: a fridge-cold full pot on Slow Cook More (High) takes about 3 to 4 hours to pass 140°F, inside the USDA's 4 hour guide. Probe 165°F before serving. The Saute simmer at 5:00 brings the whole pot back to a lively simmer before it is served.`,
    `<b>Thursday's rice:</b> cooked rice must cool fast. Spread it thin on a sheet pan, then into a covered container in the fridge within the hour. It keeps 3 to 4 days, so Thursday is fine.`,
    `<b>If the gumbo spits on Saute:</b> drop to Saute Less and stir. A thin gumbo is the Cajun style; 20 minutes lid off thickens it a little.`,
    MILD, HOT, SALT,
  ],
  ing: [
    { id: "pot", g: "From Sunday", fixed: "1", name: "loaded Instant Pot inner pot", note: "roux, stock, trinity, sausage and spice, sized on Sunday's page" },
    { id: "chick", g: "From Sunday", fixed: "1 bag", name: "chicken thighs", note: "boneless in pieces or bone-in whole, sealed in its own bag on top of the pot" },
    { id: "riceM", g: "Rice cooker", per: 0.333, step: 0.25, unit: "cup", name: "rice", note: "tonight" },
    { id: "riceT", g: "Rice cooker", per: 0.5, step: 0.25, unit: "cup", name: "rice", note: "for Thursday's dirty rice, cooked tonight" },
    { id: "gonion", g: "To finish", per: 1.333, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To finish", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "fsalt", g: "To finish", per: 0.083, step: 0.25, unit: "tsp", name: "kosher salt, to finish", note: "only if it tastes flat" },
    { id: "hot", g: "To finish", fixed: "at the table", name: "hot sauce", note: "his bowl only" },
  ],
  steps: [
    { id: "k1", at: 690, lane: "cooker", short: "Chicken in, stir, Slow Cook High", txt: "The one morning step, 3 minutes. Inner pot from the fridge into the Instant Pot base, the plate or foil off. Lift out the chicken bag, tip the chicken into the pot and stir from the bottom so the roux and stock mix. Bin the bag and wash your hands. Glass lid on, or the sealing lid with the valve on Venting. Slow Cook, More (High), 6 hours. It drops to Keep Warm on its own about {t:330} and holds there, about 4 hours, until you are home.", uses: ["pot", "chick"] },
    { id: "k2", at: 90, lane: "rice", short: "Rice cooker on, double batch", txt: "Rice, 5 minutes. Rinse all the rice until the water runs nearly clear, water to the cooker's line for the full amount, start it. Tonight's rice and Thursday's rice cook together in one batch.", uses: ["riceM", "riceT"] },
    { id: "k3", at: 85, lane: "cooker", short: "Saute: simmer 20 min, lid off", txt: "Back to a simmer, 20 minutes. Lid off. Cancel Keep Warm, then Saute on Normal. Bring it to a lively simmer, 195 to 205°F on a probe, and hold it there, stirring the bottom now and then. Skim the oil off the top with a ladle into a cup." },
    { id: "k4", at: 80, lane: "prep", short: "Slice green onion, parsley", txt: "Greens, 5 minutes. Slice the green onions and chop the parsley into a small bowl.", uses: ["gonion", "parsley"] },
    { id: "k5", at: 65, lane: "cooker", short: "Probe chicken, shred, Keep Warm", txt: "5 minutes. Probe the gumbo and the thickest piece of chicken: 165°F minimum before serving, it will be well past. Bone-in: probe the thickest thigh near the bone, not touching it, and leave them whole for now. Boneless: press the pieces against the side with a spoon to break them into bite-size shreds. Fish out the bay leaves. Cancel, then Keep Warm, lid resting on top." },
    { id: "k6", at: 45, lane: "rice", short: "Spread Thursday's rice to cool", txt: "Rice, 3 minutes. Fluff the rice. Scoop Thursday's share, three fifths of the pot, onto a sheet pan, spread thin, and leave it to cool. Lid back on the rest." },
    { id: "k7", at: 20, lane: "fridge", short: "Thursday's rice into the fridge", txt: "2 minutes. The cooled rice into a covered container, labelled Thu, into the fridge." },
    { id: "k7b", at: 18, lane: "cooker", short: "Bone-in only: meat off the bones", txt: "Bone-in thighs only, 6 minutes. Lift the thighs onto a board with tongs, pull the meat off the bones with two forks, shred it and stir it back in. Bones in the bin. Boneless: nothing to do here." },
    { id: "k8", at: 8, lane: "cooker", short: "Taste, greens in", txt: "3 minutes. Taste; only if flat, the finishing salt. Half the greens stirred in, the rest for the top.", uses: ["fsalt"] },
    { id: "k9", at: 0, lane: "serve", short: "Eat", txt: "A scoop of rice in each bowl, gumbo ladled over, green onion and parsley on top. Hot sauce on the table for the Captain; the boys' bowls stay mild." },
  ],
  entry: { chapter: "mains", label: "POT", blurb: "Sunday's roux · Instant Pot Slow Cook High 6 hours · rice at 5:00", meal: ["dinner"], protein: ["chicken", "pork"], heat: ["stovetop"], total: 690, active: 25, band: "day", time: "7:00 am start, eat at 6:30", effort: 1, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Wednesday 11 Nov: fried grits with andouille Creole sauce ----------------
R.push({
  slug: "fried-grits-andouille-creole", name: "Fried grits with andouille Creole sauce", serve: "18:30",
  sub: "Wednesday, Louisiana week, stove only, 30 minutes from 6:00. Sunday's set cheese grits cut into squares and fried crisp in the cast iron, topped with andouille in a quick Creole tomato sauce made from Wednesday's bag of trinity.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet &middot; small saucepan &middot; thin metal spatula &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Crisp grits:</b> cold, firm grits fry best. Pat them dry and dust with flour; then leave them alone for the full first side. A crust that sticks is not ready to turn. If the dish is wider than the pan, fry in two batches and set Eating at 10 minutes later.`,
    `<b>Frying heat:</b> canola at 375 to 400°F on the infrared, read on the oil. Canola smokes from about 400°F, so lower the burner if it climbs.`,
    `<b>Food safety:</b> andouille comes cooked; browning heats it through. Bring the sauce to 165°F on a probe before serving, as with any leftover or carried dish.`,
    `<b>Tonight, after dinner:</b> move Thursday's ground meat from the freezer to the fridge on a plate. It thaws flat overnight and is ready by 6:00 tomorrow.`,
    MILD, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "grits", g: "Fried grits", fixed: "1 dish", name: "Sunday's set grits", note: "sized on Sunday's page" },
    { id: "flour", g: "Fried grits", per: 1, step: 0.5, unit: "tbsp", name: "all-purpose flour", note: "to dust" },
    { id: "foil", g: "Fried grits", per: 1, step: 0.5, unit: "tbsp", name: "canola oil" },
    { id: "ooil", g: "Creole sauce", per: 0.333, step: 0.5, unit: "tbsp", name: "olive oil" },
    { id: "saus", g: "Creole sauce", per: 0.25, step: 0.25, unit: "lb", name: "andouille or smoked sausage", note: "Wednesday's half, 1/4 inch coins" },
    { id: "bag", g: "Creole sauce", fixed: "1 bag", name: "Wednesday's trinity", note: "onion, bell pepper and celery, cut on Sunday" },
    { id: "garlic", g: "Creole sauce", per: 0.333, step: 0.25, unit: "tsp", name: "jarred minced garlic" },
    { id: "tpaste", g: "Creole sauce", per: 0.333, step: 0.5, unit: "tbsp", name: "tomato paste" },
    { id: "cajun", g: "Creole sauce", per: 0.333, step: 0.25, unit: "tsp", name: "Cajun seasoning" },
    { id: "thyme", g: "Creole sauce", per: 0.083, step: 0.125, unit: "tsp", name: "dried thyme" },
    { id: "paprika", g: "Creole sauce", per: 0.167, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "tom", g: "Creole sauce", per: 0.333, step: 1, unit: "", name: "can diced tomatoes", plural: "cans diced tomatoes", note: "14.5 oz, with the juice" },
    { id: "water", g: "Creole sauce", per: 0.167, step: 0.25, unit: "cup", name: "water" },
    { id: "powder", g: "Creole sauce", per: 0.167, step: 0.25, unit: "tsp", name: "powdered chicken stock" },
    { id: "bay", g: "Creole sauce", per: 0.333, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "fsalt", g: "Creole sauce", per: 0.083, step: 0.125, unit: "tsp", name: "kosher salt, to finish", note: "only if flat" },
    { id: "gonion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "green onions", note: "sliced" },
    { id: "parsley", g: "To serve", per: 0.667, step: 0.5, unit: "tbsp", name: "parsley", note: "chopped" },
    { id: "hot", g: "To serve", fixed: "at the table", name: "hot sauce", note: "his plate only" },
  ],
  steps: [
    { id: "w1", at: 30, lane: "iron", short: "Cast iron on, medium-high", txt: "Cast iron on the burner, empty, at medium-high, to come up over 10 minutes. Target 375 to 400°F on the infrared before the oil goes in." },
    { id: "w2", at: 29, lane: "prep", short: "Slice sausage, cut and dust grits", txt: "5 minutes. Slice the sausage into 1/4 inch coins. Turn the grits out onto the board and cut into 9 even squares, about 3 inches in a 9 by 9 pan, a little smaller in an 8 by 8; two or three a person. Pat dry and dust both sides with the flour, shaking off the extra.", uses: ["saus", "grits", "flour"] },
    { id: "w3", at: 24, lane: "sauce", short: "Brown the sausage, 4 min", txt: "Small saucepan, olive oil, medium heat: 325 to 350°F on the infrared, read on the oil. Sausage coins in, stir now and then for 4 minutes until browned at the edges.", uses: ["ooil"] },
    { id: "w4", at: 20, lane: "sauce", short: "Wednesday's trinity in", txt: "Trinity, 4 minutes. Tip in Wednesday's bag. Burner to medium-low, pan at 300 to 325°F. Stir until soft.", uses: ["bag"] },
    { id: "w5", at: 18, lane: "iron", short: "Oil in, grits in, side 1, 5 min", txt: "Grits, first side, 5 minutes. Cast iron at 375 to 400°F. Canola in and swirl. Grits squares in, a finger's gap apart. Do not move them for 5 minutes, until deep golden and they let go on their own.", uses: ["foil"] },
    { id: "w6", at: 16, lane: "sauce", short: "Garlic, paste, spices, 1 min", txt: "1 minute. Garlic, tomato paste, Cajun seasoning, thyme and smoked paprika into the saucepan, stirred until the paste darkens a shade.", uses: ["garlic", "tpaste", "cajun", "thyme", "paprika"] },
    { id: "w7", at: 15, lane: "sauce", short: "Tomatoes and stock, simmer", txt: "Sauce, 10 minutes. Tomatoes with their juice, the water, the stock powder and the bay leaf in. Bring to a lively simmer, 195 to 205°F on a probe, then lower to a gentle 180 to 190°F and let it thicken, stirring now and then.", uses: ["tom", "water", "powder", "bay"] },
    { id: "w8", at: 13, lane: "iron", short: "Flip grits, side 2, 5 min", txt: "Grits, second side, 5 minutes. Turn each square with a thin metal spatula. Back to 375°F if the pan dropped. 5 minutes untouched." },
    { id: "w9", at: 8, lane: "iron", short: "Grits out onto plates", txt: "1 minute. Both sides crisp and golden: lift onto the plates, two squares each." },
    { id: "w10", at: 6, lane: "sauce", short: "Probe 165, taste, bay out", txt: "2 minutes. Sauce at 165°F or more on a probe. Bay leaf out. Taste; only if flat, the finishing salt.", uses: ["fsalt"] },
    { id: "w11", at: 4, lane: "prep", short: "Slice green onion, parsley", txt: "3 minutes. Slice the green onions and chop the parsley.", uses: ["gonion", "parsley"] },
    { id: "w12", at: 1, lane: "serve", short: "Sauce over the grits", txt: "1 minute. Andouille Creole sauce spooned over the grits, green onion and parsley on top." },
    { id: "w13", at: 0, lane: "serve", short: "Eat; ground meat to fridge after", txt: "Eat. Hot sauce on the table for the Captain; the boys' plates stay mild. After dinner: Thursday's ground meat from the freezer into the fridge, on a plate." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Sunday's set grits fried crisp · andouille Creole sauce · 30 minutes", meal: ["dinner"], protein: ["pork"], heat: ["stovetop"], total: 30, active: 30, band: "quick", time: "30 minutes, 6:00 to 6:30", effort: 2, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------------- Thursday 12 Nov: dirty rice ----------------
R.push({
  slug: "dirty-rice", name: "Dirty rice", serve: "18:30",
  sub: "Thursday, Louisiana week, stove only, 30 minutes from 6:00. Ground pork, ground beef or breakfast sausage browned hard in the cast iron with Thursday's bag of trinity, garlic and Cajun spice, then Monday's cold rice fried through it with a splash of stock and soy. Green beans on the side. The meat moves from the freezer to the fridge after Wednesday's dinner.",
  notes: [
    `<b>Equipment:</b> 12 inch cast iron skillet &middot; small saucepan &middot; flat wooden spatula &middot; infrared thermometer &middot; probe thermometer.`,
    `<b>Cold rice is the point:</b> Monday's rice, cooled and dried in the fridge, fries in separate grains. Break up the clumps with your hands before it goes in.`,
    `<b>Which meat:</b> ground pork as written. Ground beef: the same, and spoon off all but about 1 tbsp of fat after browning if it is fatty. Breakfast sausage: it comes salted and seasoned, so use about half the kosher salt and half the Cajun seasoning, and taste before adding more.`,
    `<b>Food safety:</b> ground pork, ground beef and breakfast sausage to 160°F on a probe; it is past that after browning and the trinity. Leftover rice must come back to 165°F on a probe, so the rice step ends with a probe. The meat thaws in the fridge, never on the counter.`,
    `<b>Still frozen at 6:00?</b> Seal the bag and sit it in a bowl of cold water, changing the water every 30 minutes, and set Eating at later. Never warm water.`,
    MILD, PEPPER, CAJUN, THYME, HOT, SALT, IR,
  ],
  ing: [
    { id: "pork", g: "Dirty rice", per: 0.333, step: 0.25, unit: "lb", name: "ground pork, ground beef or breakfast sausage", note: "thawed in the fridge" },
    { id: "coil", g: "Dirty rice", per: 0.333, step: 0.5, unit: "tbsp", name: "canola oil" },
    { id: "salt", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "kosher salt", note: "on the meat as it goes in; half with breakfast sausage" },
    { id: "pepper", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "ground black pepper", note: "after the browning" },
    { id: "bag", g: "Dirty rice", fixed: "1 bag", name: "Thursday's trinity", note: "onion, bell pepper and celery, cut on Sunday" },
    { id: "garlic", g: "Dirty rice", per: 0.333, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "cajun", g: "Dirty rice", per: 0.667, step: 0.5, unit: "tsp", name: "Cajun seasoning", note: "half with breakfast sausage" },
    { id: "paprika", g: "Dirty rice", per: 0.333, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "thyme", g: "Dirty rice", per: 0.167, step: 0.25, unit: "tsp", name: "dried thyme" },
    { id: "water", g: "Dirty rice", per: 0.167, step: 0.25, unit: "cup", name: "water" },
    { id: "powder", g: "Dirty rice", per: 0.333, step: 0.5, unit: "tsp", name: "powdered chicken stock" },
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
    { id: "d0", at: 1440, lane: "fridge", short: "Wed night: meat to the fridge", txt: "Wednesday after dinner, 1 minute. The ground meat from the freezer into the fridge, on a plate. It thaws flat overnight." },
    { id: "d1", at: 30, lane: "iron", short: "Cast iron on, medium-high", txt: "Cast iron on the burner, empty, at medium-high, to come up over 5 minutes to 350 to 375°F on the infrared." },
    { id: "d2", at: 29, lane: "prep", short: "Trim beans, slice greens", txt: "4 minutes. Snap the stem ends off the green beans. Slice the green onions and chop the parsley.", uses: ["beans", "gonion", "parsley"] },
    { id: "d3", at: 25, lane: "iron", short: "Meat in, brown 6 min, no pepper", txt: "Meat, 6 minutes. Pan at 350 to 375°F. Canola in, the meat in as one flat layer, salt over the top (breakfast sausage: half the salt, it comes seasoned). No pepper. 3 minutes untouched for a brown crust, then break it up with the spatula and brown 3 minutes more.", uses: ["coil", "pork", "salt"] },
    { id: "d4", at: 22, lane: "sauce", short: "Beans water on to boil", txt: "Small saucepan: the water and salt, lid on, high to a boil, 212°F on a probe, about 3 minutes.", uses: ["vwater", "vsalt"] },
    { id: "d5", at: 19, lane: "iron", short: "Pepper, trinity in, 5 min", txt: "Trinity, 5 minutes. Ground beef with a lot of fat in the pan: spoon off all but about 1 tbsp first. Pepper over the browned meat. Tip in Thursday's bag. Burner to medium, pan at 300 to 325°F. Stir until soft.", uses: ["pepper", "bag"] },
    { id: "d6", at: 18, lane: "sauce", short: "Beans in, steam 7 min", txt: "Beans in, lid on, steam 7 minutes, shaking the pan once, until bright and just tender.", uses: ["beans"] },
    { id: "d7", at: 14, lane: "iron", short: "Garlic and spices, 1 min", txt: "1 minute. Garlic, Cajun seasoning, smoked paprika and thyme in (breakfast sausage: half the Cajun seasoning, taste first). Stir until fragrant.", uses: ["garlic", "cajun", "paprika", "thyme"] },
    { id: "d8", at: 13, lane: "iron", short: "Stock and soy, scrape", txt: "1 minute. Stir the stock powder into the water, pour it in with the soy sauce and scrape up every brown bit.", uses: ["water", "powder", "soy"] },
    { id: "d9", at: 12, lane: "iron", short: "Rice in, fry 6 min", txt: "Rice, 6 minutes. Burner to medium-high, pan back up to 350 to 375°F. Monday's rice in, folded through until every grain is coated. Spread it flat, 1 minute untouched to toast, then fold again; repeat.", uses: ["rice"] },
    { id: "d10", at: 11, lane: "sauce", short: "Drain beans, butter", txt: "1 minute. Drain the beans, back in the pan, butter in, toss. Lid on.", uses: ["vbutter"] },
    { id: "d11", at: 6, lane: "iron", short: "Probe 165, taste", txt: "2 minutes. Probe the rice in the centre of the pan: 165°F or more. Taste; only if flat, the finishing salt.", uses: ["fsalt"] },
    { id: "d12", at: 3, lane: "iron", short: "Greens in, off the heat", txt: "1 minute. Burner off. Half the green onion and parsley folded in, the rest for the top." },
    { id: "d13", at: 0, lane: "serve", short: "Eat", txt: "Dirty rice in the bowl, green onion and parsley on top, green beans on the side. Hot sauce on the table for the Captain; the boys' plates stay mild." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "Monday's rice · ground meat and trinity · 30 minutes", meal: ["dinner"], protein: ["pork", "beef"], heat: ["stovetop"], total: 30, active: 30, band: "quick", time: "30 minutes, 6:00 to 6:30", effort: 1, ahead: true, kid: true, serves: 3, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

const LANES = `var LANE = {pot:["POT","t-pot"], pan:["PAN","t-pan"], prep:["PREP","t-prep"], serve:["SERVE","t-serve"],
            fire:["FIRE","t-fire"], oven:["OVEN","t-oven"], jar:["JAR","t-jar"], fridge:["FRIDGE","t-fridge"], cooker:["INSTANT POT","t-pot"], rice:["RICE COOKER","t-jar"], away:["AWAY","t-prep"], store:["STORE","t-prep"], iron:["CAST IRON","t-pan"], bigpot:["BIG POT","t-pot"], sauce:["SAUCEPAN","t-pan"]};`;

function page(r: R) {
  if (r.end != null) for (const s of r.steps) { s.at = r.end - s.f; delete s.f; }
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
  rep(/var SERV = .*;\n/, 'var SERV = {"base":3,"min":2,"max":6};\n');
  rep('var KEY = "kitchen:carne-guisada:pressure";', `var KEY = "kitchen:${r.slug}";`);
  rep(/var LANE = \{[^;]*;/, LANES);
  rep(/<span id="sv">4<\/span>/, '<span id="sv">3</span>');
  rep("</style>", "/* Louisiana week: tighter checklist rows so the longest day fits one phone screen. */\n.ck{font-size:12px;line-height:1.15;padding:0}\n.ck.now{padding:0 12px}\n.ck input{width:14px;height:14px}\n.ck .ct{font-size:11px;min-width:52px}\n</style>");
  rep(/<script>\n\/\* Step player settings[\s\S]*?<script src="\.\/step-player\.js">\n<\/script>\n/, "");
  if (/guisada|tortilla/i.test(h)) throw new Error("template text left in " + r.slug);
  writeFileSync(W + "/" + r.slug + ".html", crlf(h));
}
const todo = only.length ? R.filter(r => only.includes(r.slug)) : R;
for (const r of todo) page(r);

// recipes.json and the embedded copy in index.html
const rj = JSON.parse(readFileSync(W + "/recipes.json", "utf8"));
const idx = readFileSync(W + "/index.html", "utf8").replace(/\r\n/g, "\n");
const m = idx.match(/var DATA = (.*);\n/);
if (!m) throw new Error("no DATA");
if (m[1] !== JSON.stringify(rj)) console.log("WARN: index DATA differs from recipes.json before the change");
const plainIng = (r: R) => [...new Set(r.ing.map((i: any) => i.name))];
const order = ["slug","name","file","sub","chapter","label","blurb","meal","protein","heat","total","active","band","time","effort","ahead","kid","serves","occasion","timed","scales","test","ingredients","steps"];
const add = todo.map(r => { const a: any = Object.assign({ slug: r.slug, name: r.name, file: r.slug + ".html", sub: r.sub }, r.entry, { ingredients: plainIng(r), steps: r.steps.length }); const o: any = {}; for (const k of order) o[k] = a[k]; return o; });
for (const a of add) {
  const i = rj.recipes.findIndex((x: any) => x.slug === a.slug);
  if (i >= 0) rj.recipes[i] = a;
  else rj.recipes.splice(rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice") + 1, 0, a);
}
// keep the four in week order after red beans
const week = ["grillades-and-grits", "chicken-andouille-gumbo", "fried-grits-andouille-creole", "dirty-rice"];
const mine = rj.recipes.filter((x: any) => week.includes(x.slug)).sort((a: any, b: any) => week.indexOf(a.slug) - week.indexOf(b.slug));
rj.recipes = rj.recipes.filter((x: any) => !week.includes(x.slug));
rj.recipes.splice(rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice") + 1, 0, ...mine);
writeFileSync(W + "/recipes.json", JSON.stringify(rj, null, 1) + "\n");
writeFileSync(W + "/index.html", crlf(idx.replace(/var DATA = .*;\n/, () => "var DATA = " + JSON.stringify(rj) + ";\n")));

// service worker: pages in the shell, cache bumped once per run that adds a page
let sw = readFileSync(W + "/sw.js", "utf8");
let added = false;
for (const r of todo) if (!sw.includes(`"./${r.slug}.html"`)) { sw = sw.replace('"./carne-guisada.html", ', `"./carne-guisada.html", "./${r.slug}.html", `); added = true; }
if (added) { const cm = sw.match(/var CACHE = "kitchen-v(\d+)";/)!; sw = sw.replace(cm[0], `var CACHE = "kitchen-v${+cm[1] + 1}";`); }
writeFileSync(W + "/sw.js", sw);
console.log("done", todo.map(r => r.slug).join(" "));
