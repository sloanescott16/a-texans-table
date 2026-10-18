/* Mashed potatoes: the one source for the mash ingredients and steps.
   Loaded by mash.html and pot-roast.html, so the two pages always match.
   Amounts: MASH_AT3 below, scaled by potato weight. Steps: "at" is minutes before
   Eating at at 3 lb of potatoes; sh "B" steps move with the time to the
   boil; "d" is the step timer in minutes. Two burners in parallel: the
   butter pan and the potato pot both start 72 minutes before Eating at
   (the Captain's own process, 18 Oct). {Q:id} in a step reads the scaled amount. */
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
 {id:"water",g:"Potatoes",mash:true,step:0.5,unit:"quart",units:"quarts",name:"cold water, for the potatoes",note:"the pot about half full to start; poured down to an inch over the chunks before salting"},
 {id:"saltwater",g:"Potatoes",mash:true,step:0.5,unit:"tbsp",name:"kosher salt, for the potato water",note:"Diamond Crystal; Morton, half"},
 {id:"bayp",g:"Potatoes",mash:true,step:1,min:1,name:"bay leaf, optional",plural:"bay leaves, optional",note:"in the potato water, if you're feeling fancy"},
 {id:"butter",g:"Butter and cream",mash:true,step:1,unit:"tbsp",name:"unsalted butter",note:"8 tbsp is 1 stick"},
 {id:"oliveoil",g:"Butter and cream",mash:true,step:0.5,unit:"tbsp",name:"good extra virgin olive oil",note:"in the low garlic confit with the butter"},
 {id:"mgarlic",g:"Butter and cream",mash:true,step:1,min:1,name:"garlic clove, smashed",plural:"garlic cloves, smashed"},
 {id:"mrosemary",g:"Butter and cream",mash:true,step:1,min:1,name:"sprig fresh rosemary",plural:"sprigs fresh rosemary"},
 {id:"cream",g:"Butter and cream",mash:true,step:0.25,unit:"cup",units:"cups",name:"heavy cream"},
 {id:"resw",g:"To finish",mash:true,step:0.25,unit:"cup",units:"cups",name:"potato cooking water, kept back",note:"scooped out before draining; add it until the texture is right"},
 {id:"msalt",g:"To finish",mash:true,step:0.25,unit:"tsp",name:"kosher salt, for the mash",note:"Diamond Crystal; taste, then up to half as much again"},
 {id:"msg",g:"To finish",mash:true,step:0.125,unit:"tsp",name:"MSG"},
 {id:"parm",g:"To finish",mash:true,step:0.125,unit:"cup",units:"cups",name:"Parmesan, finely grated",note:"on a Microplane, loosely packed; 1/2 cup is about 15 g. Not too much"}
];
(function(){ for(var i=0;i<MASH_ING.length;i++){ var it = MASH_ING[i]; if(MASH_AT3[it.id] !== undefined) it.per = MASH_AT3[it.id] / 3; } })();
var MASH_STEPS = [
 {id:"m1",at:72,d:10,sh:"B",lane:"mash",txt:"Peel the potatoes, dropping each one whole into the potato pot, about half full of cold water.",uses:["potatoes","water"]},
 {id:"mb1",at:72,d:10,sh:"B",lane:"sauce",txt:"Butter and olive oil in the small saucepan, burner on low, about 225 to 250&deg;F on the infrared. Let it melt.",uses:["butter","oliveoil"]},
 {id:"mb2",at:62,d:2,sh:"B",lane:"sauce",txt:"Smash the garlic with the flat of a knife into whole crushed pieces, no little bits. Skins off, into the melted butter. It stays on low.",uses:["mgarlic"]},
 {id:"m1b",at:60,d:10,sh:"B",lane:"mash",txt:"Take the whole potatoes out, cut them into 1.5 inch chunks and put them back in the pot."},
 {id:"m1c",at:50,d:2,sh:"B",lane:"mash",txt:"Pour off water to about an inch over the potatoes. Salt the water, and add the bay leaf if you like.",uses:["saltwater","bayp"]},
 {id:"m2",at:48,d:"B",sh:"B",lane:"mash",txt:"High heat to a boil, 212&deg;F on a probe: about {B} minutes."},
 {id:"m3",at:33,d:20,lane:"mash",txt:"Once it boils: lid on ajar, down to medium, until fork tender, 15 to 20 minutes."},
 {id:"mb3",at:33,d:2,lane:"sauce",txt:"Rosemary into the butter, same low heat. Fry until a little crispy.",uses:["mrosemary"]},
 {id:"mb4",at:31,d:1,lane:"sauce",txt:"Cold cream in and stir. Burner to its lowest to keep it warm, 160 to 180&deg;F on a probe, never boiling.",uses:["cream"]},
 {id:"m4",at:13,d:5,lane:"mash",txt:"Drain. Scoop out some of the reserve water, drain in a colander, pass through ricer.",uses:["resw"]},
 {id:"m6",at:8,d:5,lane:"mash",txt:"Strain the garlic and rosemary out of the cream and pour it all into the potatoes. Add the kept water until the texture is right, then the Parmesan, salt and MSG. Mix and taste.",uses:["parm","msalt","msg"]}
];
