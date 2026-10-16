# Hand-off: step ingredients first (job 1016-1332-4ao, 16 Oct 2026)

Branch step-ingredients-first, from live main 82517c3. Not pushed, not published.

## What changed
Every step card that has ingredients now reads, top to bottom: the step label (PREP etc.) with a small "You'll use" heading beside it, then the ingredients one per line (amount in bold, 15 px, orange rule down the left), then the instruction. Steps with no ingredients look as before (label inline with the text). No amounts or wording changed; only the order and the heading.

Done in renderSteps() and the .uses CSS of all 26 recipe pages (each page carries its own copy of the template; there is no shared file). 21 pages have step ingredients: bacon-fat-aioli, bacon-wrapped-hot-dogs, base-vinaigrette, carbonara, clarified-watermelon-rum-punch, cold-brew-cafe-du-monde, grilled-pork-chops, kentucky-hot-brown, koji-tomahawk, meatballs, mint-julep-kit, mortadella-sandwich, movie-theater-popcorn, peppercorn-mushroom-sauce, pickled-carrots-and-cabbage, pickled-eggs, pot-roast, quick-pickles, sausage-antipasto-pasta, shrimp-scampi, wilted-house-salad. The other 5 (baked-bacon-mac-and-cheese, bbq-sauce, chashu-pork-belly, smoked-chicken-thighs, smoked-ribs) got the same code but have no step ingredients, so nothing shows differently.

No other copy of the step template exists: the claude-project export (old claude.ai archive) and tools folder have none. index.html has no step cards.

## How it was tested (headless Edge, speech stubbed, one profile, TEMP in C:\NIGEL-scratch\1016-1332-4ao)
Scripts in C:\NIGEL-scratch\1016-1332-4ao\tools (probe.ts, cmp.ts, tick.ts; run with bun).
- Every recipe at 390 and 1440, before and after: per-step label, instruction text and ingredient items identical (310 step rows, 162 with ingredients). Results in before.json and after.json.
- Every ingredient block is before the instruction in the page and sits visually above it; the label is at the top.
- Servings + then -: step ingredients scale the same as before and return to the start.
- No console errors, no sideways scroll at either width.
- pot-roast, carbonara, shrimp-scampi at 390: tapping the ingredient list ticks the step, Start now still moves the timeline and the "now" row.
- Screenshots in the before and after folders there.

## Unsure
- Ticked steps rely on inherited strike-through for the ingredient lines; looked right by eye in code, not screenshotted ticked.
- The heading text is written in JS as You\x27ll use (renders as You'll use).

## Before publishing (added 16 Oct, job 1016-1409-y1n)
This branch now also carries the infrared heat temperatures (see HANDOFF-heat-temps.md). A pot roast sear timer hotfix may reach main first: rebase step-ingredients-first onto main before publishing and re-run the check.
