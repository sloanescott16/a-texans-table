# Hand-off: infrared surface temperatures on every heat cue (job 1016-1409-y1n, folded into 1016-1332-4ao, 16 Oct 2026)

Branch step-ingredients-first, on top of 1912d29 (step ingredients first, checked and passed). Not pushed, not published.

IMPORTANT: a pot roast hotfix (per-side sear timer, branch pot-roast-sear-timer from 82517c3) may go live first. Before publishing, step-ingredients-first must rebase onto main. pot-roast.html will conflict on the one long STEPS line and the AWAY line; the simplest fix is to take main's pot-roast.html and re-run the four pot-roast swaps from the edit table (C:\NIGEL-scratch\1016-1409-y1n\tools\edits.ts, with the Infrared readings note), then re-run the check.

## What changed
36 heat cues on 16 recipes now carry a target temperature in °F, the old cue kept alongside. Surface readings say "on the infrared"; liquids say "on a probe". Oven and smoker settings unchanged. No amounts, times or step clocks changed. Each of the 16 pages gets one new note at the end of its notes, "Infrared readings": IR reads the surface only, shiny stainless and aluminum read low so aim at the oil or a dark spot, cast iron reads true, aim at a grate bar not the coals, liquids and deep oil get a probe, oven and smoker numbers are the dial.

RECIPE-RULES.md (new) holds the standing rules: one device per method, every step timed, ingredients on top, full seasoning, no em dashes, the heat cue rule with the working numbers, and the per-side timer rule (any sear or flip step gives each side its own timer; timers cover every step he is told to do; not built here).

## Every cue changed
- pot-roast (each in both the straight-through and Leave by plans): s1 cast iron medium-high, oil shimmers -> 400 to 425°F, oil shimmering; s3 heat down to medium -> pan settling to 325 to 350°F; c1 drying the pan over medium -> bone dry and about 250°F; s12 lively simmer -> 200 to 205°F on a probe.
- carbonara: s1 render, medium-low -> pan 275 to 300°F; s6 below a sizzle -> pan and pasta under about 180°F; s7 lowest flame -> stop at 160 to 170°F sauce; note "warm fat, never hot" -> 100 to 120°F.
- bacon-fat-aioli: s1 warm-to-the-touch fat -> 100 to 120°F.
- sausage-antipasto-pasta: s1 brown the sausage -> pan 375 to 400°F; s1 warm-to-the-touch fat -> 100 to 120°F; s2 dry hot pan -> 450 to 500°F; note gentle simmer -> about 180°F on a probe.
- bacon-wrapped-hot-dogs: s3 medium heat -> pan 325 to 350°F; note grill medium -> grates 350 to 400°F; note skillet -> 325 to 350°F.
- baked-bacon-mac-and-cheese: p1 cold pan over medium -> climbing to 325 to 350°F; p3 over LOW, do not rush -> sauce no more than 160 to 170°F.
- kentucky-hot-brown: s2 butter over medium -> pan 250 to 300°F, foaming not browning; s3 gentle simmer -> 180 to 190°F on a probe.
- grilled-pork-chops: s5 two-zone fire -> hot side grate 500 to 600°F, cool side 250 to 350°F; s7 sear direct -> grate 500 to 600°F.
- koji-tomahawk: s6 coals genuinely violent, grate on -> grate 650°F or more, aimed at a bar.
- mortadella-sandwich: s1 hot pan -> 375 to 400°F; note hot dry skillet for porchetta -> 400 to 450°F.
- movie-theater-popcorn: p1 coconut oil medium-high -> oil 400 to 450°F; s1 tallow medium-high -> fat 400 to 420°F (test kernels kept).
- peppercorn-mushroom-sauce: s2 medium-high -> 350 to 375°F; s3 heat to medium -> 300 to 325°F; s5 simmer -> simmer briskly, 200 to 210°F on a probe; s6 gentle simmer -> 180 to 190°F on a probe.
- quick-pickles: s2 brine over medium, do not boil -> dissolved at 160 to 180°F on a probe.
- pickled-carrots-and-cabbage: s1 dissolved warm -> 160 to 180°F on a probe.
- pickled-eggs: s1 warmed until dissolved -> 160 to 180°F on a probe.
- shrimp-scampi: s4 properly hot -> 375 to 400°F read on the fat, butter foam settling; s8 medium-low -> pan cooling to 250 to 275°F.

No heat cue to change (numbers already, oven or smoker dial, or no heat): base-vinaigrette, bbq-sauce, chashu-pork-belly, clarified-watermelon-rum-punch (milk already 150F), cold-brew-cafe-du-monde, meatballs, mint-julep-kit, smoked-chicken-thighs, smoked-ribs, wilted-house-salad. Boiling water ("to a boil") left as is: 212°F needs no gun.

## How to run and test
Static site: serve the folder. Check scripts (bun, headless Edge, speech stubbed, one reused profile C:\NIGEL-scratch\1016-1332-4ao\profile, TEMP and TMP C:\NIGEL-scratch\1016-1409-y1n) in C:\NIGEL-scratch\1016-1409-y1n\tools: bun chk.ts then bun cmp.ts. chk.ts loads every recipe at 390 and 1440 from both 1912d29 (exported to C:\NIGEL-scratch\1016-1409-y1n\base) and this branch. cmp.ts applies the edit table to the base text and requires an exact match.

Result: 26 pages, 310 step rows, 162 with ingredients. Whole page text identical to 1912d29 except the 36 swaps and the note (note on exactly the 16 pages). All 36 cues seen rendered. Step ingredients still above the instruction, label on top. Scaler up, down and back, tick by tap, and on pot-roast, carbonara and scampi at 390: Eating at, Leave by set and cleared, salt Skip and Undo, Salt now, Start now all identical to 1912d29. No console errors, no sideways scroll. Only flag: mint-julep-kit and quick-pickles do not return to start after the scaler test, the same on 1912d29 (they start at 1 serving, minus clamps at 1, so the test ends at 2). Not a regression.

## Sources for the numbers (from working knowledge, not re-fetched today)
- ThermoWorks blog and IR guides: emissivity, shiny stainless reading low, aim at oil or a dark surface; griddle and pan bands (saute about 350 to 400°F, sear 400 to 500°F+).
- Serious Eats (J. Kenji Lopez-Alt, The Food Lab; cooking oil smoke point guide): browning fast above about 300 to 350°F; smoke points about 350 to 410°F extra virgin olive oil, about 400 to 420°F tallow, about 450°F refined coconut oil, butter solids burning near 350°F; warm, not hot, fat for bacon fat mayo.
- Popcorn: kernels pop near 355 to 380°F; popping oil commonly given as 400 to 460°F.
- Simmer bands: gentle 180 to 190°F, lively 200 to 205°F, boil 212°F at sea level (standard kitchen references).
- Eggs: yolks start to set about 150 to 160°F, curdle past 180°F (the carbonara page already used 160 and 180).

## Unsure
- The numbers are sound, standard ranges but were not freshly cited from live web pages in this job; the researcher could confirm them if wanted.
- Grill grate bands vary with grate metal and IR spot size; the range is a target, not a hard rule.
- The carbonara "under about 180°F" pan read is a judgement call to protect the eggs; the 20 second wait was kept as written.
