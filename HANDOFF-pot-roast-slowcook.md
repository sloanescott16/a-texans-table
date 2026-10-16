# Handoff: pot roast slow cook finish (job 1016-1229-yl4)

Branch `pot-roast-slowcook` in worktree C:\NIGEL\builds\kitchen\.worktrees\site-pot-roast-slowcook, from main 91665af. Nothing pushed, nothing published. Changed: pot-roast.html, index.html and recipes.json (home card sub, blurb and carrot ingredient wording), plus this file.

## What changed
- The 3 minute carrot pressure cycle is gone, and so is every step that lifts the carrots out or puts them in the oven. New finish, all in the Instant Pot: after the 60 minute cook and natural release, roast out to a plate, herbs out, skim (s13); gravy on Saute with the cornstarch slurry, taken a shade thicker than wanted, then Cancel to turn Saute off (s17); carrots in (now cut 2 inch), roast back on top, lid on, valve Venting, Slow Cook on More (new step sc). It drops to Keep Warm on its own. The mash is unchanged: done and covered in the warm oven by Leave by.
- The slow cook step text is live: it shows the length and what to set ("1 hour 25 minutes: set 1:25. It ends at 6:00 pm, right at Eating at ...") and moves with Eating at, Leave by and Start now.
- Leave by mode: steps before Leave by are back-timed from it, the slow cook starts 21 minutes before Leave by and runs to Eating at. Minimum 60 minutes (SC_MIN): if Leave by is too close to Eating at, the before-Leave steps start earlier and a note says "done by X"; "out the door" stays at Leave by. Maximum 3 hours (SC_MAX): past that the step says it ends early and Keep Warm holds until home.
- Straight through (Leave by cleared): the same finish with a fixed 90 minute slow cook ending at Eating at; the mash finishes on the stove at Eating at. The potatoes wait peeled in cold water from the prep step.
- pinStep now shifts every clock by one amount (same results as before, and it keeps the minimum-slow-cook case right).
- 6 servings was already the default (3 lb), kept.

## Today, Leave by 5:00, Eating at 6:00
Salt 10:23 am, first move 2:23, sear 2:31, veg 2:46, garlic 2:52, deglaze 2:54, into the Instant Pot 2:56, sealed 2:59, pressure check 3:12, cast iron care 3:18, peel 3:45, cook ends 4:12, potatoes on 4:15, open and roast out 4:27, potatoes simmer 4:28, gravy 4:29, carrots and roast in, Slow Cook More 1:25 at 4:35, drain 4:43, oven 4:45, mash into oven 4:50, check 4:55, out the door 5:00, home and serve 6:00.
Straight through to 6:00: salt 10:18 am, first move 2:18 pm, cook ends 4:07, gravy 4:24, Slow Cook 1:30 at 4:30, serve 6:00.

## How to test
Headless Edge, one profile C:\NIGEL-scratch\1016-1229-yl4\edge-profile, TEMP and TMP C:\NIGEL-scratch\1016-1229-yl4, speech stubbed, service worker off. Script C:\NIGEL-scratch\1016-1229-yl4\tools\yl4.ts (head from t5z.ts), run with bun: yl4.ts x, site folder, out folder, profile. PIN_H=9 pins 9:00 am (71 checks), PIN_H=21 pins 9:00 pm (9 checks, Start now and pairs across midnight). Both 0 failed, no console errors, no sideways scroll at 390/1024/1440. Results in C:\NIGEL-scratch\1016-1229-yl4\out (run-9am.txt, run-9pm.txt, shots).

## Unsure of
- Some Instant Pot models set Slow Cook only in half hours. The note says round down (it then drops to Keep Warm a few minutes early). Today's 1:25 would be set as 1:00 on such a pot.
- Instant Pot Slow Cook More runs cooler than a countertop slow cooker. The carrots go into boiling gravy, so 60 minutes should do for 2 inch pieces; worth a fork check on the night.
- The recipes.json and index.html "total" (160) and "time" (2 hr 40) for the card were already behind the real plan and were left as is (brief asked for sub, blurb and ingredients only). Straight-through is now about 3 hr 40 from first move.
- sw.js cache name not bumped (earlier pot roast jobs did not either).
