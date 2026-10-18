/* Mashed potatoes: the one source for the mash ingredients and steps.
   Loaded by mash.html and pot-roast.html, so the two pages always match.
   Amounts: base + per x potato weight. Steps: "at" is minutes before
   Eating at at 3 lb of potatoes; sh "B" steps move with the time to the
   boil; "d" is the step timer in minutes. */
var MASH_ING = [
 {id:"potatoes",g:"Potatoes",mash:true,per:1,step:0.25,unit:"lb",name:"Yukon Gold potatoes",note:"peeled, in 1.5 inch chunks"},
 {id:"water",g:"Potatoes",mash:true,per:1,step:0.5,unit:"quart",units:"quarts",name:"cold water, for the potatoes",note:"covers them by about an inch"},
 {id:"saltwater",g:"Potatoes",mash:true,per:2/3,step:0.5,unit:"tbsp",name:"kosher salt, for the potato water",note:"Diamond Crystal; Morton, half"},
 {id:"bayp",g:"Potatoes",mash:true,per:1/3,step:1,min:1,name:"bay leaf, optional",plural:"bay leaves, optional",note:"in the potato water, if you're feeling fancy"},
 {id:"butter",g:"Butter and cream",mash:true,per:8/3,step:1,unit:"tbsp",name:"unsalted butter",note:"8 tbsp is 1 stick"},
 {id:"mgarlic",g:"Butter and cream",mash:true,per:2/3,step:1,min:1,name:"garlic clove, smashed",plural:"garlic cloves, smashed"},
 {id:"mrosemary",g:"Butter and cream",mash:true,per:2/3,step:1,min:1,name:"sprig fresh rosemary",plural:"sprigs fresh rosemary"},
 {id:"cream",g:"Butter and cream",mash:true,per:1/3,step:0.25,unit:"cup",units:"cups",name:"heavy cream"},
 {id:"resw",g:"To finish",mash:true,per:1/3,step:0.25,unit:"cup",units:"cups",name:"potato cooking water, kept back",note:"dipped out before draining; most mashes take a quarter to a half of it"},
 {id:"msalt",g:"To finish",mash:true,per:1/3,step:0.25,unit:"tsp",name:"kosher salt, for the mash",note:"Diamond Crystal; taste, then up to half as much again"},
 {id:"msg",g:"To finish",mash:true,per:1/6,step:0.125,unit:"tsp",name:"MSG"},
 {id:"parm",g:"To finish",mash:true,per:1/6,step:0.125,unit:"cup",units:"cups",name:"Parmesan, finely grated",note:"on a Microplane, loosely packed; 1/2 cup is about 15 g. Not too much"},
 {id:"truffle",g:"To finish",fixed:"3 drops",name:"truffle oil, optional",note:"only on top at the table; start with 3 drops, never in the pot"}
];
var MASH_STEPS = [
 {id:"m1",at:56,d:10,sh:"B",lane:"mash",txt:"Mash prep: peel the potatoes and cut them into 1.5 inch chunks, straight into the potato pot. Cover with the cold water and add the water salt, and the bay leaf if you are using it.",uses:["potatoes","water","saltwater","bayp"]},
 {id:"m2",at:44,d:"B",sh:"B",lane:"mash",txt:"Potato pot on high heat, lid ajar, to a boil, 212&deg;F on a probe: about {B} minutes."},
 {id:"m3",at:29,d:15,lane:"mash",txt:"Potatoes boiling: down to a lively simmer, 195 to 205&deg;F on a probe, about 15 minutes, until a fork slides in with just a little resistance at the centre. Just fork tender, not falling apart."},
 {id:"mb1",at:27,d:6,lane:"sauce",txt:"Meanwhile, the small saucepan over medium-low: the butter, smashed garlic and rosemary. Let it melt, foam and simmer about 6 minutes, until the foam and the bits on the bottom are just turning golden, about 240 to 250&deg;F on a probe in the butter. Golden, not brown.",uses:["butter","mgarlic","mrosemary"]},
 {id:"mb2",at:21,d:7,lane:"sauce",txt:"Cream into the butter, slowly, as it bubbles up. Then the burner to its lowest: hold it at 160 to 180&deg;F on a probe, never boiling, stirring now and then.",uses:["cream"]},
 {id:"m4",at:14,d:2,lane:"mash",txt:"Potatoes: before you drain, dip out the cooking water to keep back with a mug. Drain, then back into the hot pot, off the heat, for a minute to steam dry. Bay leaf out.",uses:["resw"]},
 {id:"m5",at:12,d:3,lane:"mash",txt:"Rice the potatoes back into their pot, off the heat."},
 {id:"m6",at:8,d:2,lane:"mash",txt:"Lift the garlic and rosemary out of the cream. Pour all the butter and cream into the potatoes and mix well with a spatula, no more than you need to."},
 {id:"m7",at:4,d:1,lane:"mash",txt:"Kept-back water into the mash, 2 tablespoons at a time, mixing, until it is as loose as you like it."},
 {id:"m8",at:3,d:2,lane:"mash",txt:"Season the mash: the salt, MSG and Parmesan; mix and taste, and up to half as much salt again if it wants it. Lid on, off the heat: it holds hot for half an hour.",uses:["msalt","msg","parm"]}
];
