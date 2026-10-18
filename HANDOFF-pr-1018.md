# HANDOFF, job 1018-1447-1pa, branch pr-1018 (site repo)

Worktree: C:\NIGEL\builds\kitchen\.worktrees\site-pr-1018, made from main at 37988bd, which is the live GitHub Pages version (origin/main, the only remote branch). Nothing pushed.

## What changed
- pot-roast.html, rebuilt on the live page's engine:
  - The scaler is the weight of chuck (1.5 to 6 lb, 0.25 steps). Every amount, the pressure time, the potato boil and the servings come from it. Servings = weight / 0.5 lb, shown, not set.
  - Pressure time: 60 min at 3 lb, 15 min less per lb under, 10 more per lb over, rounded to 5 (2 lb 45, 4.5 lb 75), 40 to 90.
  - New finish, all in the Instant Pot: natural release 15, then meat out, carrots and rutabaga in for 3 min high pressure, meat cut into large chunks meanwhile, quick release, gravy thickened on Saute, meat back and stirred. The Slow Cook finish is gone.
  - Homemade chicken stock is the default (beef stock the alternative); stock = 1 cup + 1 cup per lb. Onions 2 at 3 lb, rounded up, "don't skimp". Celery 5 at 3 lb.
  - Added veg: rutabaga, 1 lb at 3 lb, 1 inch chunks. Options in the notes: parsnips, cremini, pearl onions, golden beets. No potatoes.
  - Full gravy salt and onion salt amounts added.
  - The full new mash is in the same timeline (potatoes = meat weight), timed so it is ready 1 minute before the roast.
  - A silent countdown timer on every step (the sear step keeps its per-side timer). Timers never move the clocks.
  - Leave by kept, reworked: everything to the pressure cook and the whole mash before you go, the roast cooks and holds on Keep Warm alone, home 22 min before Eating at for the finish. Default is now blank (straight through).
  - "Mash on its own page" link carries Eating at and weight.
- mash.html, new: same engine, scales by potato weight (1 to 8 lb), "Serve with pot roast" link back.
- index.html (inline DATA) and recipes.json: pot roast card updated, mash card added under Sides.
- sw.js: mash.html in the offline shell, cache kitchen-v14.
- tests/check-pr-1018.ts: the test script.

## How to test
From the worktree, with TEMP and TMP set to a scratch folder:
bun tests/check-pr-1018.ts <worktree> <outDir> <edgeProfileDir>
It serves the folder under /a-texans-table/, drives headless Edge over DevTools (speech stubbed, clock pinned to 18 Oct 2026 10:00 am, service worker blocked), writes results.json and five 390 px screenshots to outDir, exits 0 only if every check passes.

## Unsure of
- "All in the Instant Pot; never switch devices" read as the finish. The sear and deglaze stay in the cast iron as on the live page. If he meant the whole cook, the sear moves to Saute.
- 3 min at high pressure for carrots in 1.5 inch chunks and rutabaga in 1 inch is his number plus my chunk sizes; not cooked.
- Mash amounts not in his notes are mine: 2 tbsp Diamond Crystal in 3 quarts, 1 tsp salt, 1/2 tsp MSG, 1/2 cup (about 15 g) Microplaned Parmesan, butter at 240 to 250°F on a probe for "just golden", cream held at 160 to 180°F.
- Liquids scale as 1 cup + 1 per lb, not straight; above about 4.5 lb the note says use an 8 quart pot.
- tests/ and the HANDOFF and PROGRESS files sit in the site repo and would publish with it, like the earlier HANDOFF files on main.

## Last run (18 Oct)
35 of 35 checks passed, exit 0, no console errors. Results and 390 px renders in C:\NIGEL-scratch\1pa\out (results.json, pot-roast-390-top/full, mash-390-top/full, index-390-top). Edge profile left in C:\NIGEL-scratch\1pa\edge-profile (nothing deleted).
