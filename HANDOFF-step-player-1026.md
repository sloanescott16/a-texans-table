# Hand-off: step player on carne guisada (job 1026-1618-ixh, 26 Oct 2026)

Branch step-player-1026 in worktree C:\NIGEL-scratch\1026-1618-ixh\wt, cut from origin/main b7044e5. Not pushed, not merged, not published.

## What was built
- step-player.js: a shared player any recipe page can load after its main script. It reads the page's own STEPS (back-timed "at" minutes), byId, label, fillT, serveDate, clockOf, hhmm, state and KEY. Its CSS is injected by the script, so rollout is one script tag plus an optional STEP_PLAYER settings block.
- Wired into carne-guisada.html only. A "Step player" button floats bottom right; it opens a full-screen player with play/pause, back and forward as 72 px buttons fixed at the bottom.
- Shows: phase name and "step N of M", step number and planned time, the step's scaled ingredients on top, the instruction below, a big countdown, the next step underneath. Each step lasts until the next step's back-timed start.
- Auto-advance on time out: screen flash, navigator.vibrate, a banner, and an optional Web Audio chime (off by default, one tap to switch on).
- Live "Dinner ready at" line with minutes ahead or behind the Eating at time; it moves with pauses, skips and phase jumps.
- Passive steps (settings: g14 pressure cook, g15 natural release) show "Hands off" and "You have N min, until H:MM". In a hands-off step, a "While you wait" box lists the phase's own steps (rice, wipe the pan, toppings), struck through when ticked on the page.
- Phases (data-driven, STEP_PLAYER.phases = [{name, from: stepId, wait: [stepIds]}]): Mise en place g1 to g4, Fire g5 to g10, Hands-off g11 to g15, Finish g16 to g18, Plate g19 to g21. Phase chips jump to the start of a phase; the "start from step" picker is grouped by phase.
- Wall-clock timing (Date.now). Position, elapsed time, play state, open state and chime choice are saved in localStorage (key kitchen:carne-guisada:pressure:player), so a reload or a locked phone resumes; a phone locked through several steps lands on the right one.
- Screen Wake Lock while playing, asked again on visibilitychange.
- sw.js: cache kitchen-v19 to kitchen-v20, step-player.js added to the cache list.

## How to test
TEMP and TMP in C:\NIGEL-scratch\1026-1618-ixh. Both scripts: bun <script> <site folder> <out folder> <edge profile folder>. Headless Edge, 375 px, speech, vibrate, wake lock and Web Audio stubbed, service worker blocked, clock movable.
- New: tools-check-step-player-1026.ts, 40 of 40 passed (profile C:\NIGEL-scratch\1026-1618-ixh\profile2, out C:\NIGEL-scratch\1026-1618-ixh\out-new).
- Old: tools-check-carne-guisada-chuck-1026.ts, 49 of 49 passed (profile C:\NIGEL-scratch\1026-1618-ixh\profile, out C:\NIGEL-scratch\1026-1618-ixh\out-old).

## Unsure of
- The player does not tick the page's checklist as steps pass; the two are separate on purpose so the old checklist is untouched.
- The flash animation is not visible in headless screenshots (no frames in the background tab); the test checks it fired by a counter.
- Wake lock and vibrate were tested against stubs only. iPhone Safari has no navigator.vibrate, so on his phone the flash and banner (and the chime if on) carry the alert.
- carne-asada-1026 also bumps sw.js; whichever merges second needs v21.
