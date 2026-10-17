# Hand-off: food safety temps (branch food-safety-1017, 17 Oct 2026)

What changed
- smoked-chicken-thighs.html: new FIRE step s3 after "Smoked at 250F": "Done at 165°F minimum on a probe in the thickest part of the thickest thigh, not touching bone if bone-in. That is the USDA safe minimum. Thighs are often taken on to 175 to 185°F for texture: the connective tissue softens and they stay juicy." The "Still to pin down" note now reads "the exact pull temp above 165 and time".
- meatballs.html step s5: "or juices run clear" removed. Now: "Done at 160°F on a probe in the centre of the biggest meatball for beef or pork, 165°F if any of the meat is poultry. Go by the probe: juice colour is not a safe test."
- RECIPE-RULES.md: one rule line for poultry and ground meat temps.
- No infrared note added: neither page has an infrared cue, and the rules attach that note only to pages that do.

How to test
- Serve the folder under /a-texans-table/ and open both pages at 390 and 1440 px. Look for the wording above, no "juices run clear", no em dash, no sideways scroll, no console errors.
- Done 17 Oct in headless Edge (own profile, speech stubbed): all passed at both widths.

Unsure of
- s3 has no "at" offset; the chicken page is untimed (TIMED false), so none is needed.
- Meatballs previously said 165F for all; 160°F for beef and pork is the USDA ground meat figure, so the beef and pork number went down by 5.
