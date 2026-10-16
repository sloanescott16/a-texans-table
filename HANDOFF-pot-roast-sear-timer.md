# Handoff: pot roast sear timer (job 1016-1413-lhn)

Branch `pot-roast-sear-timer` in C:\NIGEL\builds\kitchen\.worktrees\site-pot-roast-sear-timer, from live main 82517c3. Only pot-roast.html changed (one CSS block, one JS block before load()), plus this file. Nothing pushed, nothing published.

## What it does
Inside the sear step (s2, "Sear hard in the cast iron"), a timer box: "Sear timer · Side 1 of 6: First broad side", a big 5:00 and a Start 5:00 button. It counts down on screen; at zero it shows Done, "Turn it. Next: ...", and Next side (plus Again). Six slots from the step's own wording: two broad sides at 5:00, four edges at 1:00 ("a minute or two on the edges"), 14 minutes in the 15 minute slot. After the last: "All seared. Deep brown all over. Out to a plate." and Start over. "Start over from side 1" and Reset everything also reset it.
- Time left is worked out from a stored start time (localStorage kitchen:pot-roast:sear, apart from the page's own state), so it is right after sleep, background or reload.
- Taps in the box never tick the step's checkbox. No step clock, timeline, Leave by or Eating at moves.
- No sound and no vibration (the page had no sound pattern): a clear visual Done only.
- Hooks in by wrapping renderSteps, so it rebases over other edits to the step code.

## How to test
bun C:\NIGEL-scratch\1016-1413-lhn\tools\lhn.ts <site folder> <out folder> <edge profile>  (35 checks)
add `compare C:\NIGEL\builds\kitchen\site` to diff 20 snapshots of the rest of the page against live main.
Headless Edge 390 px, one profile C:\NIGEL-scratch\1016-1413-lhn\edge-profile, TEMP/TMP C:\NIGEL-scratch\1016-1413-lhn, speech, audio and vibrate stubbed and counted (0 calls), fixed fake clock moved by the test. Results: 35/35 and 2/2 pass, no console errors, no sideways scroll. Shots in C:\NIGEL-scratch\1016-1413-lhn\out.

## Unsure of
- Edges at 1:00 each assumes a block-shaped roast with four edges. If he wants 1:30 or fewer edges, change SEAR_SIDES.
- One timer covers both pieces together (they sear side by side), not one per piece.
- The background test fakes a jump in the clock plus a visibilitychange; not tried on a real sleeping phone.
- sw.js cache name not bumped (as with earlier pot roast jobs); a phone with the old page cached may need a reload.
