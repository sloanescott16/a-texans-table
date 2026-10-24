// Builds the four meals-1025 pages from the shrimp scampi page pattern, and adds them to recipes.json and index.html.
// Usage: bun gen.ts <site worktree>
import { readFileSync, writeFileSync } from "fs";
const W = process.argv[2];
const tpl = readFileSync(W + "/shrimp-scampi.html", "utf8").replace(/\r\n/g, "\n");
const crlf = (s: string) => s.replace(/\r?\n/g, "\r\n");

const IR = `<p class="note"><b>Infrared readings:</b> the gun reads only the surface it points at, never the inside of the food or the depth of a liquid. Cast iron and dark, seasoned pans read true; shiny stainless and aluminum read low, so aim at the oil, the fat or a dark spot. Aim close, since the spot it reads grows with distance, and read two or three spots: pans vary a lot from edge to centre. On a grill, aim at a grate bar, not the coals. Simmering water, brine and deep oil get a probe thermometer instead. Oven and smoker numbers are the dial settings.</p>`;
const SALT = `<b>Salt:</b> the kosher salt amounts are sized for Diamond Crystal. Morton is about twice as salty by volume: use half.`;

type R = { slug: string; name: string; sub: string; notes: string[]; ing: any[]; steps: any[]; entry: any };
const R: R[] = [];

// ---------- Sunday: Peruvian-style grilled chicken ----------
R.push({
  slug: "peruvian-grilled-chicken", name: "Peruvian-style grilled chicken",
  sub: "Bone-in thighs in a soy, lime, cumin and smoked paprika marinade, cooked through on the cool side of a two-zone grill, then the skin crisped over the coals. A mild green herb sauce in the aji verde style, a big salad on the house vinaigrette, rice for the boys. Set the time you want to eat and everything runs itself backward.",
  notes: [
    `Mild for the boys: no chile in the marinade or the table sauce. His heat is the jalapeno blended into a third of the green sauce, kept in its own bowl.`,
    `<b>Marinade time:</b> 2 to 4 hours in the fridge. Past about 4 hours the lime starts to turn the meat mealy.`,
    `<b>Food safety:</b> chicken to 165°F minimum on a probe in the thickest part, not touching bone; thighs are best at 175 to 185°F. Never judge by the juices. The used marinade goes down the drain, never on the food.`,
    SALT,
    IR,
  ],
  ing: [
    { id: "chicken", g: "Meat", per: 2, step: 1, unit: "", name: "bone-in, skin-on chicken thigh", plural: "bone-in, skin-on chicken thighs", note: "about 3 and a half pounds at 4 servings" },
    { id: "soy", g: "Marinade", per: 0.75, step: 0.5, unit: "tbsp", name: "soy sauce" },
    { id: "limej", g: "Marinade", per: 0.75, step: 0.5, unit: "tbsp", name: "lime juice" },
    { id: "moil", g: "Marinade", per: 0.5, step: 0.5, unit: "tbsp", name: "olive oil" },
    { id: "mgarlic", g: "Marinade", per: 0.25, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "cumin", g: "Marinade", per: 0.5, step: 0.25, unit: "tsp", name: "ground cumin" },
    { id: "paprika", g: "Marinade", per: 0.5, step: 0.25, unit: "tsp", name: "smoked paprika" },
    { id: "oregano", g: "Marinade", per: 0.25, step: 0.25, unit: "tsp", name: "dried oregano" },
    { id: "bsugar", g: "Marinade", per: 0.25, step: 0.25, unit: "tsp", name: "brown sugar" },
    { id: "msalt", g: "Marinade", per: 0.5, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "mpepper", g: "Marinade", per: 0.25, step: 0.25, unit: "tsp", name: "black pepper" },
    { id: "cilantro", g: "Green sauce", per: 0.5, step: 0.25, unit: "cup", name: "cilantro, packed", note: "leaves and tender stems, about 1 bunch at 4 servings" },
    { id: "mayo", g: "Green sauce", per: 2, step: 1, unit: "tbsp", name: "mayonnaise" },
    { id: "cotija", g: "Green sauce", per: 1, step: 1, unit: "tbsp", name: "cotija cheese, crumbled" },
    { id: "slime", g: "Green sauce", per: 0.5, step: 0.5, unit: "tbsp", name: "lime juice" },
    { id: "sgarlic", g: "Green sauce", per: 0.25, step: 0.25, unit: "tsp", name: "jarred minced garlic" },
    { id: "soil", g: "Green sauce", per: 0.5, step: 0.5, unit: "tbsp", name: "olive oil" },
    { id: "ssalt", g: "Green sauce", per: 0.0625, step: 0.125, unit: "tsp", name: "kosher salt" },
    { id: "jalapeno", g: "Green sauce", per: 0.25, step: 1, unit: "", name: "jalapeno", plural: "jalapenos", note: "his side only, stem off" },
    { id: "romaine", g: "Salad", per: 0.5, step: 1, unit: "", name: "romaine heart", plural: "romaine hearts" },
    { id: "tomato", g: "Salad", per: 0.5, step: 0.25, unit: "cup", name: "cherry tomatoes", note: "halved; a pint is about 2 cups" },
    { id: "cucumber", g: "Salad", per: 0.25, step: 0.5, unit: "", name: "cucumber", plural: "cucumbers" },
    { id: "ronion", g: "Salad", per: 0.125, step: 0.25, unit: "", name: "red onion", plural: "red onions", note: "sliced thin" },
    { id: "avocado", g: "Salad", per: 0.25, step: 0.5, unit: "", name: "avocado", plural: "avocados" },
    { id: "vinegar", g: "Vinaigrette", per: 0.5, step: 0.5, unit: "tbsp", name: "cider vinegar" },
    { id: "dijon", g: "Vinaigrette", per: 0.25, step: 0.25, unit: "tsp", name: "Dijon mustard" },
    { id: "voil", g: "Vinaigrette", per: 1.5, step: 0.5, unit: "tbsp", name: "olive oil" },
    { id: "vsalt", g: "Vinaigrette", per: 0.125, step: 0.125, unit: "tsp", name: "kosher salt" },
    { id: "vpepper", g: "Vinaigrette", per: 0.0625, step: 0.125, unit: "tsp", name: "black pepper" },
    { id: "rice", g: "Rice for the boys", per: 0.25, step: 0.25, unit: "cup", name: "jasmine rice", note: "water to the rice cooker's line" },
  ],
  steps: [
    { id: "s0", at: 270, lane: "fridge", txt: "Marinade: whisk the soy sauce, lime juice, olive oil, garlic, cumin, smoked paprika, oregano, brown sugar, salt and pepper in a big bowl or zip bag. Thighs in, turned to coat and worked under the skin. Into the fridge, 2 to 4 hours. Wash your hands and the board.", uses: ["chicken", "soy", "limej", "moil", "mgarlic", "cumin", "paprika", "oregano", "bsugar", "msalt", "mpepper"] },
    { id: "s1", at: 120, lane: "prep", txt: "Green sauce in the blender: cilantro, mayonnaise, cotija, lime juice, garlic, olive oil and salt, until smooth, about 1 minute. Pour two thirds into a bowl for the table, the mild one. Blend the jalapeno into the last third for his bowl. Both into the fridge.", uses: ["cilantro", "mayo", "cotija", "slime", "sgarlic", "soil", "ssalt", "jalapeno"] },
    { id: "s2", at: 95, lane: "fire", txt: "Light the grill for two zones: charcoal banked on one side (or gas, one side on high, the other off). Lid on, vents open, 20 minutes until the hot side's grate reads 450 to 550°F on the infrared and the lid thermometer sits around 375°F." },
    { id: "s3", at: 75, lane: "fire", txt: "Thighs out of the marinade, skin side up on the cool side, thick ends toward the fire. Marinade down the drain. Lid on, vents over the chicken. Cook 45 minutes, no turning.", uses: ["chicken"] },
    { id: "s4", at: 60, lane: "pot", txt: "Rice cooker: rinse the rice until the water runs nearly clear, water to the line, start it. It holds on warm.", uses: ["rice"] },
    { id: "s5", at: 45, lane: "prep", txt: "Salad: chop the romaine, halve the tomatoes, slice the cucumber and red onion into the big salad bowl. Avocado waits. Vinaigrette in a jar: vinegar, Dijon, salt and pepper shaken, then the oil, shaken hard. Do not dress it yet.", uses: ["romaine", "tomato", "cucumber", "ronion", "vinegar", "dijon", "voil", "vsalt", "vpepper"] },
    { id: "s6", at: 30, lane: "fire", txt: "Probe the thickest thigh, not touching bone. You want 165°F or more before the sear. If it is short, leave the lid on and check again at the next step." },
    { id: "s7", at: 20, lane: "fire", txt: "Sear, first side: skin side down over the hot side, grate 450 to 550°F on the infrared, 3 minutes. Flare-ups: slide that piece back toward the cool side for a moment.", uses: ["chicken"] },
    { id: "s8", at: 17, lane: "fire", txt: "Sear, second side: turn skin side up over the heat, grate still 450 to 550°F, 2 minutes." },
    { id: "s9", at: 15, lane: "fire", txt: "Probe again: 175 to 185°F in the thickest part, 165°F the minimum, not touching bone. Onto a clean platter, rest 10 minutes uncovered so the skin stays crisp." },
    { id: "s10", at: 4, lane: "prep", txt: "Slice the avocado onto the salad, dress it and toss.", uses: ["avocado"] },
    { id: "s11", at: 0, lane: "serve", txt: "Chicken on the table with the mild green sauce and the salad. Rice for the boys. His jalapeno sauce on his plate." },
  ],
  entry: { chapter: "smoker", label: "FIRE", blurb: "two-zone grill · mild green sauce · big salad", meal: ["dinner"], protein: ["chicken"], heat: ["grill"], total: 270, active: 60, band: "afternoon", time: "4 hr 30 with the marinade", effort: 2, ahead: false, kid: true, serves: 4, occasion: ["weekend"], timed: true, scales: true, test: false },
});

// ---------- Monday: carne guisada ----------
R.push({
  slug: "carne-guisada", name: "Carne guisada",
  sub: "Office night. Chuck browned in the Instant Pot in the morning, cumin, chili powder and tomato in, then Slow Cook all day. Home at 5:00, rice cooker on, dinner at 6:30. The boys get it over rice with flour tortillas, he eats it as a bowl. Mild in the pot, jalapeno on the side. Set the time you want to eat and every step runs itself backward.",
  notes: [
    `The morning is about 35 minutes, 6:50 to 7:25. Cutting the beef and dicing the onion and pepper the night before saves 10 of them: keep the beef covered in the fridge.`,
    `<b>Stock:</b> the beef stock is made up from beef bouillon paste, 1 teaspoon to each cup of hot water. The paste is salty, so taste before adding any more salt at the end.`,
    `<b>Slow cook safety:</b> the beef is browned and the pot is brought to a lively simmer, 195 to 205°F on a probe, before Slow Cook starts, so it never sits lukewarm. Normal on the Instant Pot's Slow Cook runs like low on a slow cooker. Slow Cook starts about 7:25 am and the 10 hours end about 5:25 pm. The pot then drops to Keep Warm by itself, which holds it safely above 140°F for the hour or so before 6:30. Leftovers into the fridge within 2 hours.`,
    `Lid: the Instant Pot lid with the valve on Venting, or a glass lid.`,
    SALT,
    IR,
  ],
  ing: [
    { id: "beef", g: "Meat", per: 0.625, step: 0.25, unit: "lb", name: "beef chuck roast", note: "trimmed of hard fat, in 1.5 inch cubes" },
    { id: "salt", g: "Meat", per: 0.5, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "pepper", g: "Meat", per: 0.25, step: 0.25, unit: "tsp", name: "black pepper" },
    { id: "tallow", g: "Meat", per: 0.25, step: 0.5, unit: "tbsp", name: "beef tallow", note: "for the sear" },
    { id: "flour", g: "The pot", per: 0.5, step: 0.5, unit: "tbsp", name: "all-purpose flour" },
    { id: "onion", g: "The pot", per: 0.25, step: 0.5, unit: "", name: "yellow onion", plural: "yellow onions", note: "diced" },
    { id: "bell", g: "The pot", per: 0.25, step: 0.5, unit: "", name: "green bell pepper", plural: "green bell peppers", note: "diced" },
    { id: "garlic", g: "The pot", per: 0.25, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "chili", g: "The pot", per: 0.25, step: 0.25, unit: "tbsp", name: "chili powder", note: "the mild kind" },
    { id: "cumin", g: "The pot", per: 0.5, step: 0.25, unit: "tsp", name: "ground cumin" },
    { id: "oregano", g: "The pot", per: 0.25, step: 0.25, unit: "tsp", name: "dried oregano" },
    { id: "tsauce", g: "The pot", per: 0.25, step: 0.25, unit: "cup", name: "tomato sauce" },
    { id: "stock", g: "The pot", per: 0.375, step: 0.25, unit: "cup", name: "beef stock", note: "made up from beef bouillon paste: 1 tsp paste to each cup of hot water" },
    { id: "bay", g: "The pot", per: 0.5, step: 1, unit: "", name: "bay leaf", plural: "bay leaves" },
    { id: "rice", g: "To serve", per: 0.5, step: 0.25, unit: "cup", name: "jasmine rice", note: "water to the rice cooker's line" },
    { id: "tortillas", g: "To serve", per: 2, step: 1, unit: "", name: "flour tortilla", plural: "flour tortillas" },
    { id: "cilantro", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "cilantro, chopped" },
    { id: "ronion", g: "To serve", per: 1, step: 1, unit: "tbsp", name: "red onion, diced" },
    { id: "jalapeno", g: "To serve", per: 0.25, step: 1, unit: "", name: "jalapeno", plural: "jalapenos", note: "sliced, his bowl only" },
  ],
  steps: [
    { id: "s0", at: 700, lane: "prep", txt: "Cube the chuck, pat it dry, season with the salt and pepper. Dice the onion and bell pepper. Wash your hands and the board.", uses: ["beef", "salt", "pepper", "onion", "bell"] },
    { id: "s1", at: 690, lane: "pot", txt: "Instant Pot on Saute, More. Tallow in. About 4 minutes, until the fat reads 375 to 400°F on the infrared (aim at the fat; the steel reads low).", uses: ["tallow"] },
    { id: "s2", at: 686, lane: "pot", txt: "First batch, first side: half the beef in one layer, 3 minutes, do not move it.", uses: ["beef"] },
    { id: "s3", at: 683, lane: "pot", txt: "First batch, second side: turn the cubes, 3 minutes more, then onto a plate." },
    { id: "s4", at: 680, lane: "pot", txt: "Second batch, first side: the rest of the beef, 3 minutes, do not move it." },
    { id: "s5", at: 677, lane: "pot", txt: "Second batch, second side: turn, 3 minutes. Leave it in the pot." },
    { id: "s6", at: 674, lane: "pot", txt: "All the beef back in. Flour over and stir 1 minute. Onion, bell pepper, garlic, chili powder, cumin and oregano in, stir 2 minutes.", uses: ["flour", "onion", "bell", "garlic", "chili", "cumin", "oregano"] },
    { id: "s7", at: 671, lane: "pot", txt: "Tomato sauce and beef stock in. Scrape the bottom completely clean so nothing sticks. Bay leaves in. Bring it to a lively simmer, 195 to 205°F on a probe, about 5 minutes.", uses: ["tsauce", "stock", "bay"] },
    { id: "s8", at: 665, lane: "pot", txt: "Cancel Saute. Lid on, valve to Venting. Slow Cook, Normal, 10 hours. It goes to Keep Warm by itself at the end. Go to work." },
    { id: "s9", at: 90, lane: "pot", txt: "Home. Rice cooker: rinse the rice, water to the line, start it.", uses: ["rice"] },
    { id: "s10", at: 20, lane: "pot", txt: "Lid off. The beef should break with a spoon. Bay leaves out. If the gravy is thin, Saute on Normal, lid off, 5 to 10 minutes at a lively simmer, 195 to 205°F on a probe, until it coats the back of a spoon, then back to Keep Warm. Taste for salt." },
    { id: "s11", at: 14, lane: "prep", txt: "Chop the cilantro, dice the red onion, slice his jalapeno.", uses: ["cilantro", "ronion", "jalapeno"] },
    { id: "s12", at: 8, lane: "pan", txt: "Tortillas: dry cast iron on medium, 400 to 450°F on the infrared. About 30 seconds a side each, stacked in a towel to stay soft.", uses: ["tortillas"] },
    { id: "s13", at: 0, lane: "serve", txt: "Boys: guisada over rice, tortillas on the side. His bowl: guisada and rice topped with cilantro, red onion and the jalapeno." },
  ],
  entry: { chapter: "mains", label: "POT", blurb: "Instant Pot brown in the morning · slow cook all day · rice at 5", meal: ["dinner"], protein: ["beef"], heat: ["stovetop"], total: 700, active: 50, band: "day", time: "morning set-up, all-day slow cook", effort: 2, ahead: true, kid: true, serves: 4, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------- Wednesday: her tom kha ----------
R.push({
  slug: "tom-kha", name: "Slow cooker tom kha",
  sub: "Her recipe: the 40 Aprons Slow Cooker Tom Kha Soup. Onion, garlic, galangal, lemongrass, lime leaves and red curry paste steep in chicken stock on High for 3 hours, the aromatics come out, then coconut milk, chicken and mushrooms go in for about an hour more. Sugar, fish sauce and lime to finish. In the Instant Pot on Slow Cook. Mild for the boys over rice; the chile and chili oil are on the side for him.",
  notes: [
    `<b>Her recipe:</b> 40 Aprons, Slow Cooker Tom Kha Soup, quantities as published for about 4. Two changes, both ours: the chile comes out of the pot and goes on the side, so the base is mild for the boys; and the coconut broth is warmed on Saute to about 180°F before the chicken goes in, for safety.`,
    `<b>Curry paste:</b> the 1 tablespoon stays as the recipe has it. If the boys find it warm, halve it next time.`,
    `<b>The pot:</b> clean the Instant Pot insert and the lid seal on Tuesday, after Monday's guisada, so the soup does not pick up the beef.`,
    `<b>Slow cook safety, our addition:</b> straining and two cans of cold coconut milk drop the broth to about 105 to 115°F, too cool to put raw chicken into on a slow cooker setting. So the coconut broth is brought back up on Saute to about 180°F on a probe before the chicken goes in. Her ingredients and their order are as she has them. Chicken to 165°F on a probe in the biggest piece; if it is short, Saute 5 minutes and probe again. Leftovers into the fridge within 2 hours. Lid: the Instant Pot lid with the valve on Venting, or a glass lid.`,
    `Lime leaves are optional; they add a lime flavour juice cannot. If galangal is missing, ginger does the job.`,
    `<b>Stock:</b> the chicken stock is made up from chicken stock powder, 1 teaspoon to each cup of hot water. It is salty, so taste before adding more fish sauce at the end.`,
  ],
  ing: [
    { id: "onion", g: "Broth", per: 0.25, step: 0.25, unit: "cup", name: "white onion, sliced" },
    { id: "garlic", g: "Broth", per: 0.25, step: 0.25, unit: "tbsp", name: "jarred minced garlic" },
    { id: "galangal", g: "Broth", per: 0.75, step: 1, unit: "", name: "slice galangal", plural: "slices galangal", note: "or ginger" },
    { id: "lemongrass", g: "Broth", per: 0.25, step: 1, unit: "", name: "stalk lemongrass", plural: "stalks lemongrass", note: "cut in 3 inch lengths and bruised" },
    { id: "leaves", g: "Broth", per: 2.5, step: 1, unit: "", name: "lime leaf, torn", plural: "lime leaves, torn", note: "optional" },
    { id: "paste", g: "Broth", per: 0.25, step: 0.25, unit: "tbsp", name: "red Thai curry paste", note: "can be halved if the boys find it warm" },
    { id: "stock", g: "Broth", per: 1, step: 0.5, unit: "cup", name: "chicken stock", note: "made up from chicken stock powder: 1 tsp powder to each cup of hot water" },
    { id: "coconut", g: "Soup", per: 0.5, step: 0.5, unit: "", name: "can full-fat coconut milk", plural: "cans full-fat coconut milk" },
    { id: "chicken", g: "Soup", per: 0.25, step: 0.25, unit: "lb", name: "boneless, skinless chicken breast", note: "bite-sized pieces" },
    { id: "mushrooms", g: "Soup", per: 2, step: 1, unit: "oz", name: "white mushrooms, sliced" },
    { id: "sugar", g: "Finish", per: 0.5, step: 0.5, unit: "tbsp", name: "brown sugar" },
    { id: "fish", g: "Finish", per: 0.5, step: 0.5, unit: "tbsp", name: "fish sauce" },
    { id: "lime", g: "Finish", per: 0.5, step: 0.5, unit: "tbsp", name: "lime juice" },
    { id: "gonion", g: "Finish", per: 0.5, step: 1, unit: "", name: "green onion, sliced", plural: "green onions, sliced" },
    { id: "cilantro", g: "Finish", per: 0.5, step: 0.5, unit: "tbsp", name: "cilantro, chopped", note: "optional" },
    { id: "chile", g: "His side", per: 0.125, step: 0.5, unit: "", name: "red jalapeno", plural: "red jalapenos", note: "or 1 to 2 Thai chiles; sliced, out of the pot" },
    { id: "chilioil", g: "His side", per: 0, step: 0, unit: "", name: "chili oil", fixed: "to taste" },
    { id: "rice", g: "Rice for the boys", per: 0.375, step: 0.25, unit: "cup", name: "jasmine rice", note: "water to the rice cooker's line" },
  ],
  steps: [
    { id: "s0", at: 270, lane: "prep", txt: "Slice the onion. Cut 3 slices of galangal. Trim the lemongrass, cut it into 3 inch lengths and bruise them with the back of a knife. Tear the lime leaves. Slice his chile into a small bowl for the table and put it in the fridge.", uses: ["onion", "galangal", "lemongrass", "leaves", "chile"] },
    { id: "s1", at: 260, lane: "pot", txt: "Into the Instant Pot: onion, garlic, galangal, lemongrass, lime leaves, curry paste and chicken stock. Stir until the paste dissolves. Lid on, valve to Venting. Slow Cook, More (that is High), 3 hours.", uses: ["onion", "garlic", "galangal", "lemongrass", "leaves", "paste", "stock"] },
    { id: "s2", at: 90, lane: "prep", txt: "Cut the chicken into bite-sized pieces and slice the mushrooms. Keep the chicken cold. Wash your hands and the board.", uses: ["chicken", "mushrooms"] },
    { id: "s3", at: 80, lane: "pot", txt: "Pot off. Strain out the aromatics: lift them out with a slotted spoon, or pour the broth through a sieve into a big bowl and back into the pot.", uses: [] },
    { id: "s3b", at: 75, lane: "pot", txt: "Coconut milk into the broth. Saute, More, lid off, stirring, until it steams at about 180°F on a probe, about 8 minutes. Our safety step: the cold coconut milk drops the broth too low for raw chicken.", uses: ["coconut"] },
    { id: "s4", at: 66, lane: "pot", txt: "Cancel Saute. Chicken and mushrooms in, stirred. Lid on, valve to Venting. Slow Cook, More, 1 hour.", uses: ["chicken", "mushrooms"] },
    { id: "s5", at: 55, lane: "pot", txt: "Rice cooker: rinse the rice, water to the line, start it.", uses: ["rice"] },
    { id: "s6", at: 6, lane: "pot", txt: "Probe the biggest piece of chicken: 165°F. If it is short, Saute 5 minutes and probe again.", uses: [] },
    { id: "s7", at: 4, lane: "pot", txt: "Stir in the brown sugar, fish sauce and lime juice. Taste: more fish sauce for salt, lime for sour, sugar to round it. Pot to Keep Warm.", uses: ["sugar", "fish", "lime"] },
    { id: "s8", at: 2, lane: "prep", txt: "Slice the green onions and chop the cilantro. Chili oil and his chile on the table. Lime leaves and any lemongrass left are not for eating: fish them out.", uses: ["gonion", "cilantro", "chilioil"] },
    { id: "s9", at: 0, lane: "serve", txt: "Boys: rice in the bowl, soup over. Green onions and cilantro on top. His bowl: the chile and chili oil." },
  ],
  entry: { chapter: "mains", label: "POT", blurb: "her recipe, 40 Aprons · Instant Pot slow cook · mild, heat on the side", meal: ["dinner"], protein: ["chicken"], heat: ["stovetop"], total: 270, active: 35, band: "afternoon", time: "4 hr 30", effort: 1, ahead: false, kid: true, serves: 4, occasion: ["weeknight"], timed: true, scales: true, test: false },
});

// ---------- Thursday: pork chops, onion and pear pan sauce, mash ----------
R.push({
  slug: "pork-chops-onion-pear", name: "Cast iron pork chops, onion and pear pan sauce",
  sub: "Bone-in chops seared hard in cast iron after the onions have gone slowly golden in the same pan with butter. Pears in with the onions, the fond lifted with apple cider, a knob of butter to finish, over the house mash on the burner next door. Fresh off the heat at 6:30. Set the time you want to eat and everything runs itself backward.",
  notes: [
    `The mash is the site's mashed potatoes, the same amounts and steps at 3 lb, on its own two burners beside the skillet.`,
    `<b>Food safety:</b> pork chops to 145°F on a probe in the centre, not touching bone, then at least a 3 minute rest. They rest 5 to 6 minutes while the sauce finishes and go out fresh off the heat.`,
    `Apple cider here is the drink, not the vinegar. The teaspoon of cider vinegar at the end sharpens the sauce.`,
    `<b>Stock:</b> the chicken stock is made up from chicken stock powder, 1 teaspoon to each cup of hot water.`,
    SALT,
    IR,
  ],
  ing: [
    { id: "chops", g: "Chops", per: 1, step: 1, unit: "", name: "bone-in pork chop", plural: "bone-in pork chops", note: "about 1 inch thick" },
    { id: "csalt", g: "Chops", per: 0.5, step: 0.25, unit: "tsp", name: "kosher salt" },
    { id: "cpepper", g: "Chops", per: 0.25, step: 0.25, unit: "tsp", name: "black pepper" },
    { id: "canola", g: "Chops", per: 0.25, step: 0.5, unit: "tbsp", name: "canola oil" },
    { id: "onions", g: "Pan sauce", per: 0.5, step: 0.5, unit: "", name: "large yellow onion", plural: "large yellow onions", note: "halved and sliced thin" },
    { id: "obutter", g: "Pan sauce", per: 0.25, step: 0.5, unit: "tbsp", name: "butter", note: "for the onions" },
    { id: "osalt", g: "Pan sauce", per: 0.125, step: 0.125, unit: "tsp", name: "kosher salt" },
    { id: "pears", g: "Pan sauce", per: 0.5, step: 0.5, unit: "", name: "pear", plural: "pears", note: "cored, in 1/2 inch wedges" },
    { id: "thyme", g: "Pan sauce", per: 1, step: 1, unit: "", name: "sprig fresh thyme", plural: "sprigs fresh thyme", note: "leaves stripped" },
    { id: "cider", g: "Pan sauce", per: 0.25, step: 0.25, unit: "cup", name: "apple cider", note: "the drink, not the vinegar" },
    { id: "stock", g: "Pan sauce", per: 0.125, step: 0.125, unit: "cup", name: "chicken stock", note: "made up from chicken stock powder: 1 tsp powder to each cup of hot water" },
    { id: "dijon", g: "Pan sauce", per: 0.25, step: 0.25, unit: "tsp", name: "Dijon mustard" },
    { id: "vinegar", g: "Pan sauce", per: 0.25, step: 0.25, unit: "tsp", name: "cider vinegar" },
    { id: "fbutter", g: "Pan sauce", per: 0.5, step: 0.5, unit: "tbsp", name: "butter, cold", note: "the knob to finish" },
    { id: "potatoes", g: "Mash", per: 0.75, step: 0.25, unit: "lb", name: "gold potatoes", note: "peeled, in 1.5 inch chunks" },
    { id: "water", g: "Mash", per: 0.75, step: 0.5, unit: "qt", name: "cold water, for the potatoes" },
    { id: "wsalt", g: "Mash", per: 0.5, step: 0.5, unit: "tbsp", name: "kosher salt, for the potato water" },
    { id: "bayp", g: "Mash", per: 0.25, step: 1, unit: "", name: "bay leaf, optional", plural: "bay leaves, optional" },
    { id: "mbutter", g: "Mash", per: 1, step: 1, unit: "tbsp", name: "butter" },
    { id: "moil", g: "Mash", per: 0.5, step: 0.5, unit: "tbsp", name: "extra virgin olive oil" },
    { id: "mgarlic", g: "Mash", per: 0.5, step: 1, unit: "", name: "garlic clove, smashed", plural: "garlic cloves, smashed" },
    { id: "rosemary", g: "Mash", per: 0.5, step: 1, unit: "", name: "sprig fresh rosemary", plural: "sprigs fresh rosemary", note: "from the garden" },
    { id: "cream", g: "Mash", per: 0.25, step: 0.25, unit: "cup", name: "heavy cream" },
    { id: "resw", g: "Mash", per: 0.25, step: 0.25, unit: "cup", name: "potato cooking water, kept back" },
    { id: "msalt", g: "Mash", per: 0.25, step: 0.25, unit: "tsp", name: "kosher salt, for the mash", note: "taste, then up to half as much again" },
    { id: "msg", g: "Mash", per: 0.125, step: 0.125, unit: "tsp", name: "MSG" },
    { id: "parm", g: "Mash", per: 0.125, step: 0.125, unit: "cup", name: "Parmesan, finely grated", note: "not too much" },
  ],
  steps: [
    { id: "s0", at: 82, lane: "prep", txt: "Chops out of the fridge, patted dry, salt and pepper on both sides. Slice the onions thin. Strip the thyme leaves. Wash your hands and the board.", uses: ["chops", "csalt", "cpepper", "onions", "thyme"] },
    { id: "m1", at: 74, lane: "pot", txt: "Mash: peel the potatoes, dropping each one whole into the potato pot, about half full of cold water.", uses: ["potatoes", "water"] },
    { id: "c1", at: 57, lane: "pan", txt: "Cast iron on medium-low until it reads 275 to 300°F on the infrared. Butter in; it should foam, not brown.", uses: ["obutter"] },
    { id: "c2", at: 55, lane: "pan", txt: "Onions in with the salt. Stir every few minutes for 30 minutes, the pan held at 250 to 300°F, until soft and deep golden. A splash of water if they catch.", uses: ["onions", "osalt"] },
    { id: "mb1", at: 66, lane: "pot", txt: "Mash: butter and olive oil in the small saucepan, burner on low, about 225 to 250°F on the infrared. Let it melt.", uses: ["mbutter", "moil"] },
    { id: "mb2", at: 62, lane: "pot", txt: "Mash: smash the garlic into whole crushed pieces, skins off, into the melted butter. It stays on low.", uses: ["mgarlic"] },
    { id: "m1b", at: 60, lane: "pot", txt: "Mash: take the whole potatoes out, cut them into 1.5 inch chunks and put them back in the pot." },
    { id: "m1c", at: 52, lane: "pot", txt: "Mash: pour off water to about an inch over the potatoes. Salt the water, and add the bay leaf if you like.", uses: ["wsalt", "bayp"] },
    { id: "m2", at: 50, lane: "pot", txt: "Mash: high heat to a boil, 212°F on a probe, about 15 minutes." },
    { id: "c3", at: 27, lane: "prep", txt: "Core the pears and cut them into 1/2 inch wedges.", uses: ["pears"] },
    { id: "c4", at: 24, lane: "pan", txt: "Pears in with the onions, 5 minutes, until they take a little colour.", uses: ["pears"] },
    { id: "m3", at: 35, lane: "pot", txt: "Mash: once it boils, lid on ajar, down to medium, a lively simmer at 195 to 205°F on a probe, until fork tender, 15 to 20 minutes." },
    { id: "mb3", at: 34, lane: "pot", txt: "Mash: rosemary into the butter, same low heat. Fry until a little crispy.", uses: ["rosemary"] },
    { id: "c5", at: 19, lane: "pan", txt: "Onions and pears out into a bowl. Skillet stays on the burner, unwashed.", uses: [] },
    { id: "mb4", at: 32, lane: "pot", txt: "Mash: cold cream into the butter and stir. Burner to its lowest, 160 to 180°F on a probe, never boiling.", uses: ["cream"] },
    { id: "c6", at: 17, lane: "pan", txt: "Skillet to medium-high with the canola, about 3 minutes, until it reads 400 to 425°F on the infrared, oil shimmering.", uses: ["canola"] },
    { id: "c7", at: 14, lane: "pan", txt: "Chops in, first side: 4 minutes, do not move them.", uses: ["chops"] },
    { id: "c8", at: 10, lane: "pan", txt: "Flip, second side: 4 minutes." },
    { id: "c9", at: 6, lane: "pan", txt: "Probe the centre of the thickest chop, not touching bone: 145°F. If short, flip every minute until it is there. Onto a warm plate, loosely tented, to rest 5 to 6 minutes while the sauce finishes." },
    { id: "c10", at: 5, lane: "pan", txt: "Heat to medium, pan down to 300 to 350°F. Thyme in for 30 seconds, then the cider. Scrape up every bit of fond and let it bubble hard, 2 minutes, until reduced by about a third.", uses: ["thyme", "cider"] },
    { id: "m4", at: 15, lane: "pot", txt: "Mash: scoop out some of the cooking water to keep, drain in a colander, pass through the ricer back into the pot.", uses: ["resw"] },
    { id: "c11", at: 3, lane: "pan", txt: "Chicken stock and Dijon in, onions and pears back in. Simmer 2 minutes at a lively 195 to 205°F on a probe, until it coats a spoon.", uses: ["stock", "dijon"] },
    { id: "m6", at: 9, lane: "pot", txt: "Mash: strain the garlic and rosemary out of the cream and pour it into the potatoes. Add the kept water until the texture is right, then the Parmesan, salt and MSG. Mix, taste, lid on to hold.", uses: ["parm", "msalt", "msg"] },
    { id: "c12", at: 1, lane: "pan", txt: "Pan off the heat. Cider vinegar in, then swirl in the cold butter until glossy. Pour in the juice from the chop plate. Taste for salt.", uses: ["vinegar", "fbutter"] },
    { id: "c14", at: 0, lane: "serve", txt: "Mash on the plate, a rested chop on top, onions, pears and sauce over." },
  ],
  entry: { chapter: "mains", label: "PAN", blurb: "cast iron · onion and pear cider pan sauce · house mash", meal: ["dinner"], protein: ["pork"], heat: ["stovetop"], total: 82, active: 70, band: "hour", time: "1 hr 22", effort: 2, ahead: false, kid: true, serves: 4, occasion: ["weeknight", "special"], timed: true, scales: true, test: false },
});

function page(r: R) {
  r.steps.sort((a: any, b: any) => b.at - a.at);
  let h = tpl;
  const rep = (a: string | RegExp, b: string) => { const n = h.replace(a as any, () => b); if (n === h) throw new Error("no match in " + r.slug + ": " + a); h = n; };
  rep("<title>Shrimp scampi</title>", `<title>${r.name}</title>`);
  rep("<h1>Shrimp scampi</h1>", `<h1>${r.name}</h1>`);
  rep(/<p class="sub">[^<]*<\/p>/, `<p class="sub">${r.sub}</p>`);
  rep(/  <p class="note">Chicken stock stands in[\s\S]*?Oven and smoker numbers are the dial settings.<\/p>\n/, r.notes.map(n => n.startsWith("<p") ? "  " + n + "\n" : `  <p class="note">${n}</p>\n`).join(""));
  rep(/var ING = .*;\n/, "var ING = " + JSON.stringify(r.ing) + ";\n");
  rep(/var STEPS = .*;\n/, "var STEPS = " + JSON.stringify(r.steps) + ";\n");
  rep('var KEY = "kitchen:shrimp-scampi";', `var KEY = "kitchen:${r.slug}";`);
  writeFileSync(W + "/" + r.slug + ".html", crlf(h));
}
for (const r of R) page(r);

// recipes.json and the embedded copy in index.html
const rj = JSON.parse(readFileSync(W + "/recipes.json", "utf8"));
const idx = readFileSync(W + "/index.html", "utf8").replace(/\r\n/g, "\n");
const m = idx.match(/var DATA = (.*);\n/);
if (!m) throw new Error("no DATA");
if (m[1] !== JSON.stringify(rj)) console.log("WARN: index DATA differs from recipes.json before the change");
const after = rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice");
const plainIng = (r: R) => r.ing.map((i: any) => i.name + (i.note ? " (" + i.note + ")" : ""));
const add: any[] = [];
for (const r of R) {
  rj.recipes = rj.recipes.filter((x: any) => x.slug !== r.slug);
  add.push(Object.assign({ slug: r.slug, name: r.name, file: r.slug + ".html", sub: r.sub }, r.entry, { ingredients: plainIng(r), steps: r.steps.length }));
}
// key order like the others
const order = ["slug","name","file","sub","chapter","label","blurb","meal","protein","heat","total","active","band","time","effort","ahead","kid","serves","occasion","timed","scales","test","ingredients","steps"];
const ordered = add.map(a => { const o: any = {}; for (const k of order) o[k] = a[k]; return o; });
// grill chicken goes in the smoker chapter after the last smoker recipe; the rest after red beans
const grill = ordered.filter(o => o.chapter === "smoker"), mains = ordered.filter(o => o.chapter !== "smoker");
rj.recipes.splice(rj.recipes.findIndex((x: any) => x.slug === "red-beans-and-rice") + 1, 0, ...mains);
const lastSmoker = rj.recipes.map((x: any) => x.chapter).lastIndexOf("smoker");
rj.recipes.splice(lastSmoker + 1, 0, ...grill);
writeFileSync(W + "/recipes.json", JSON.stringify(rj, null, 1) + "\n");
writeFileSync(W + "/index.html", crlf(idx.replace(/var DATA = .*;\n/, () => "var DATA = " + JSON.stringify(rj) + ";\n")));

// service worker: new pages in the shell, cache name bumped
let sw = readFileSync(W + "/sw.js", "utf8");
const cm = sw.match(/var CACHE = "kitchen-v(\d+)";/)!;
sw = sw.replace(cm[0], `var CACHE = "kitchen-v${+cm[1] + 1}";`);
for (const r of R) if (!sw.includes(`"./${r.slug}.html"`)) sw = sw.replace('"./chicken-tacos.html", ', `"./chicken-tacos.html", "./${r.slug}.html", `);
writeFileSync(W + "/sw.js", sw);
console.log("done", R.map(r => r.slug).join(" "), "cache v" + (+cm[1] + 1));
