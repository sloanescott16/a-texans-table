# Progress: step ingredients first + heat cues (jobs 1016-1332-4ao and 1016-1409-y1n)

## 17 Oct 2026, 10:48 - rebased, self-tested, awaiting checker
- The pot roast sear timer hotfix (1016-1413-lhn, branch pot-roast-sear-timer, c547cc9) is NOT in main yet; it still waits for the Captain's publish yes.
- So step-ingredients-first is rebased onto pot-roast-sear-timer (not main). One later publish can cover all three jobs: merging this branch brings the sear timer with it.
- Old head kept as branch step-ingredients-first-pre-rebase-1017 (8ff02da).
- Rebase had no conflicts; git merged pot-roast.html cleanly (sear timer block plus the step card and heat cue edits).
- Self-tests, headless Edge, speech stubbed, TEMP/TMP and profile in C:\NIGEL-scratch\4ao (profile removed after):
  - Sear timer checks (lhn.ts) on the rebased branch: 35 of 35 pass.
  - Step cards and heat cues (chk.ts + cmp.ts) on all 26 recipes at 390 and 1440 against a base of the rebased step cards commit: 310 step rows, 162 with ingredients, every cue rendered, ingredients above instruction, no console errors, no sideways scroll. Only flags: mint-julep-kit and quick-pickles scaler not back to start, the same known flag as before the rebase.
- Nothing fixed: the rebase broke nothing.
- Next: checker, then one publish ask covering lhn, 4ao and y1n.
