# Handoff: pot roast salt timer and Leave by (jobs 1016-1104-nhd and 1016-1108-ah2)

Branch `pot-roast-salt-timer` in worktree C:\NIGEL\builds\kitchen\.worktrees\site-pot-roast-salt-timer, from main 4cecccf. Nothing pushed, nothing published. Only pot-roast.html changed (plus this file and PROGRESS-pot-roast-salt-timer.md).

## What changed on pot-roast.html
1. Salt ahead is a timed step now. The old untimed "The day before (optional)" card is gone. The salt step is the first row of the timeline with its own clock, 4 hours before the first move, and it moves with Eating at, Leave by, Start now and Salt now. It has two buttons: Skip (greys it out; the salt then goes on in the first prep step, which already says "unless it was salted ahead") and Salt now (plans the whole day from the salt). Start now never pins to the salt step: Start now means start cooking.
2. One device. The meat never leaves the pressure cooker (it rests on a board, then goes back into the same pot). No Dutch oven, skillet or second vessel anywhere on the page. The potatoes use a stovetop pot and, in Leave by mode, the mash and carrots hold in the oven; neither touches the meat.
3. Leave by (job ah2). New time box next to Eating at, default 5:00 pm with Eating at 6:00 pm. When set and before Eating at, a second step list (AWAY in the code) is back-timed from Leave by: everything hands-on is done before it, the roast holds in its gravy on Keep Warm in the pressure cooker, the mash and carrots sit covered in a warm oven (oven on at 4:45), and the only step at Eating at is slice and serve. Default timeline: salt 10:13 am, first move 2:13 pm, sealed 2:49, peel 3:45, cook ends 4:12, potatoes in 4:15, roast out and carrots in 4:27, carrots out 4:39, gravy 4:40, drain 4:43, oven 4:45, mash 4:50, set to hold 4:55, out the door 5:00, home and serve 6:00. Start now with Leave by set moves Leave by and Eating at together (the gap is kept). A small "clear" link empties Leave by (iPhone time boxes are hard to blank), and "add" puts 5:00 pm back. Blank Leave by, or one that is not before Eating at, gives the old straight-through plan (the latter shows a short note). Over 2 hours away shows a note that the mash dries.

## Other recipes scanned for mixed devices
None changed. Every recipe keeps the main item in one device. Noted for the Captain: koji-tomahawk smokes on the smoker, then sears on a separate small grill (a deliberate reverse sear in his own method); left as is for his call. bacon-wrapped-hot-dogs lists alternative devices in a note, each one a complete method on its own, which is fine.

## How to test
Headless Edge over DevTools, pinned clock 16 Oct 2026 9:00 am, speechSynthesis stubbed, service worker off, one profile at C:\NIGEL-scratch\1016-1104-nhd\edge-profile, TEMP and TMP set to C:\NIGEL-scratch\1016-1104-nhd. Script: C:\NIGEL-scratch\1016-1104-nhd-tools\nhd.ts, run with bun as: nhd.ts x, the site folder, the output folder, the profile folder (head copied from C:\NIGEL\builds\kitchen\tools\sbs-check.ts). Run on 16 Oct: 42 checks, 0 failed, no console errors, no sideways scroll at 390 px. Screenshots at 390 px in C:\NIGEL-scratch\1016-1104-nhd (390-01 to 390-09, light and dark, including the full default 5:00/6:00 timeline).

## Unsure of
- The sticky bar at 390 px is 185 px tall (two rows: the two time boxes, then servings and Start now). Before it was also two rows but one box shorter; worth an eye on the phone.
- Ticks by step id carry between the two plans where the move is the same; the hold steps (w1, w2, w3, h1) exist only in Leave by mode.
- Keep Warm and a warm oven for about an hour is food safe; the texture of the mash after an hour in the oven is a judgement, the note warns past 2 hours.
- Found and fixed while testing: ticking a step did not refresh the "Salt by / First move" line until the 20 second tick. Now it refreshes at once.
