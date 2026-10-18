/* Mashed potatoes: the one source for the mash ingredients and steps.
   Loaded by mash.html and pot-roast.html, so the two pages always match.
   Amounts: MASH_AT3 below, scaled by potato weight. Steps: "at" is minutes before
   Eating at at 3 lb of potatoes; sh "B" steps move with the time to the
   boil; "d" is the step timer in minutes (dB: minutes at 3 lb, moving with
   the boil). Two burners run in parallel: the butter pan starts first. */
/* THE MASH AMOUNTS AT 3 LB OF POTATOES. Change a number here and both
   pages follow, scaled by the potato weight (amount at 3 lb / 3 x pounds,
   rounded to the step shown). Units are in MASH_ING below. */
var MASH_AT3 = {
  potatoes: 3,     // lb Yukon Gold
  water: 3,        // quarts cold water
  saltwater: 2,    // tbsp Diamond Crystal in the water
  bayp: 1,         // bay leaf, optional
  butter: 4,       // tbsp unsalted, half a stick (the Captain, 18 Oct)
  oliveoil: 2,     // tbsp good extra virgin olive oil (the Captain, 18 Oct)
  mgarlic: 2,      // garlic cloves, smashed
  mrosemary: 2,    // rosemary sprigs
  cream: 1,        // cup heavy cream
  resw: 1,         // cup cooking water kept back
  msalt: 1,        // tsp Diamond Crystal to season
  msg: 0.5,        // tsp MSG
  parm: 0.5        // cup Parmesan, Microplaned
};
var MASH_ING = [
 {id:"potatoes",g:"Potatoes",mash:true,step:0.25,unit:"lb",name:"Yukon Gold potatoes",note:"peeled, in 1.5 inch chunks"},
 {id:"water",g:"Potatoes",mash:true,step:0.5,unit:"quart",units:"quarts",name:"cold water, for the potatoes",note:"covers them by about an inch"},
 {id:"saltwater",g:"Potatoes",mash:true,step:0.5,unit:"tbsp",name:"kosher salt, for the potato water",note:"Diamond Crystal; Morton, half"},
 {id:"bayp",g:"Potatoes",mash:true,step:1,min:1,name:"bay leaf, optional",plural:"bay leaves, optional",note:"in the potato water, if you're feeling fancy"},
 {id:"butter",g:"Butter and cream",mash:true,step:1,unit:"tbsp",name:"unsalted butter",note:"8 tbsp is 1 stick"},
 {id:"oliveoil",g:"Butter and cream",mash:true,step:0.5,unit:"tbsp",name:"good extra virgin olive oil",note:"in the low garlic confit with the butter"},
 {id:"mgarlic",g:"Butter and cream",mash:true,step:1,min:1,name:"garlic clove, smashed",plural:"garlic cloves, smashed"},
 {id:"mrosemary",g:"Butter and cream",mash:true,step:1,min:1,name:"sprig fresh rosemary",plural:"sprigs fresh rosemary"},
 {id:"cream",g:"Butter and cream",mash:true,step:0.25,unit:"cup",units:"cups",name:"heavy cream"},
 {id:"resw",g:"To finish",mash:true,step:0.25,unit:"cup",units:"cups",name:"potato cooking water, kept back",note:"dipped out before draining; most mashes take a quarter to a half of it"},
 {id:"msalt",g:"To finish",mash:true,step:0.25,unit:"tsp",name:"kosher salt, for the mash",note:"Diamond Crystal; taste, then up to half as much again"},
 {id:"msg",g:"To finish",mash:true,step:0.125,unit:"tsp",name:"MSG"},
 {id:"parm",g:"To finish",mash:true,step:0.125,unit:"cup",units:"cups",name:"Parmesan, finely grated",note:"on a Microplane, loosely packed; 1/2 cup is about 15 g. Not too much"}
];
(function(){ for(var i=0;i<MASH_ING.length;i++){ var it = MASH_ING[i]; if(MASH_AT3[it.id] !== undefined) it.per = MASH_AT3[it.id] / 3; } })();
var MASH_STEPS = [
 {id:"m1",at:56,d:10,sh:"B",lane:"mash",txt:"Peel the potatoes, cut them into 1.5 inch chunks and put them in the potato pot with the cold water, the water salt and the bay leaf if you want it.",uses:["potatoes","water","saltwater","bayp"]},
 {id:"mb1",at:60,d:10,sh:"B",lane:"sauce",txt:"Butter on: the butter, olive oil and smashed garlic in the small saucepan on the lowest burner, 225 to 250&deg;F on the infrared. Tiny bubbles, never a hard sizzle.",uses:["butter","oliveoil","mgarlic"]},
 {id:"mb2",at:50,d:6,dB:21,sh:"B",lane:"sauce",txt:"Rosemary into the butter. Same low heat.",uses:["mrosemary"]},
 {id:"m2",at:44,d:30,dB:30,sh:"B",lane:"mash",txt:"Potatoes on high, lid ajar, to a boil, then down to a simmer, 195 to 205&deg;F on a probe, until just fork tender. About {B} minutes to the boil and 15 at the simmer."},
 {id:"mb3",at:29,d:5,lane:"sauce",txt:"Butter up to 260 to 280&deg;F on the infrared. When the butter is barely brown, the garlic golden and the rosemary crisp, pour in the cream and turn back to the lowest heat, holding 160 to 180&deg;F on a probe. Any darker and the mash tastes burnt.",uses:["cream"]},
 {id:"m4",at:14,d:5,lane:"mash",txt:"Save a cup of the potato water, drain the potatoes and rice them back into the pot.",uses:["resw"]},
 {id:"m6",at:8,d:4,lane:"mash",txt:"Garlic and rosemary out of the cream. Pour all the butter, oil and cream into the potatoes, mix, and loosen with the saved potato water until it is how you like it."},
 {id:"m8",at:3,d:3,lane:"mash",txt:"Salt, MSG and Parmesan in, mix and taste. Serve at Eating at.",uses:["msalt","msg","parm"]}
];
