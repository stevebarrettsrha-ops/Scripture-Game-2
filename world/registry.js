/* ================= THE REGISTRY OF THE WORLD =================
   The one table every file of the world writes itself into. Each file in
   countries/ calls EARTH.country({…}), each file in blocks/ calls
   EARTH.block({…}), and so on down: one thing per file, loaded in the fixed
   order of world/manifest.js, so the world is identical on every machine.

   ---- WHY THIS IS A FILE AND NOT A SCRIPT TAG ----
   It was written out twice, once in each page's markup — the voyage's
   index.html and scripture-unfolds/index.html — and the two DRIFTED. Blocks,
   minerals and works were added to the first over Phases 4 and 5 and never
   reached the second, so the second game loaded forty-two block files, the
   fourteen substances and the thirteen named works into a registry that had
   no `block`, no `mineral` and no `work` on it, and every one of them threw.
   Scripture Unfolds had been running on a world with an EMPTY BLOCK TABLE
   and nothing said a word: the terrain still drew, because the mesher had
   already been given its materials by the time anything asked, and the
   damage was silent and total in the places that did ask.

   The manifest itself was moved out of the two pages for exactly this reason
   and left this behind. Now there is one of these, both pages read it, and
   adding a registrar cannot reach one game and miss the other.

   THE RULE IT KEEPS: a registrar is a LIST and a PUSH, and nothing else. No
   validation, no defaulting, no knowledge of any particular country, block
   or work — if the engine must know a thing by name, it is designed wrong,
   and this file is where that rule is easiest to break and hardest to
   notice. */
window.EARTH={
  list:[], verseList:[], riverList:[], cityList:[], landmarkList:[],
  deepList:[], holeList:[], sceneList:[], scrollList:[], beastList:[],
  faunaList:[], floraList:[], cropList:[], mineralList:[], workList:[], blockList:[],
  waterfallList:[],

  country:function(c){this.list.push(c);},
  verses:function(v){this.verseList=v;},
  river:function(r){this.riverList.push(r);},
  city:function(c){this.cityList.push(c);},
  landmark:function(l){this.landmarkList.push(l);},
  /* the trenches of the sea, each at its true sounding — see world/deeps.js */
  deep:function(d){this.deepList.push(d);},
  /* the blue holes: sheer shafts sunk in the reefs — see world/deeps.js */
  hole:function(h){this.holeList.push(h);},
  /* the short films the engine plays with the camera — see world/scenes.js */
  scene:function(s){this.sceneList.push(s);},
  /* the scrolls hidden in the lands — see world/scrolls.js */
  scroll:function(s){this.scrollList.push(s);},
  /* every living thing has its own file in creatures/ — see creatures/README.md */
  beast:function(b){this.beastList.push(b);},
  /* WHICH beasts walk in WHICH land, and what ground each keeps to — the
     whole of it is data, in world/fauna.js */
  fauna:function(f){this.faunaList.push(f);},
  /* and WHAT GROWS in each — every tree, orchard, bush, berry and herb on
     the earth, in world/flora.js */
  flora:function(f){this.floraList.push(f);},
  /* and WHAT IS SOWN in the tilled ground of every village — the stature and
     the manner of each field crop, in world/crops.js. WHICH lands grow which
     is not there: world/flora.js has already said it, and one copy is enough. */
  crops:function(c){this.cropList.push(c);},
  /* and WHAT LIES UNDER each — which ore in which land, and how deep, in
     world/minerals.js. This is what makes the caves of Phase 1 worth
     walking into. */
  mineral:function(m){this.mineralList.push(m);},
  /* THE NAMED WORKS — what a man can make, what it takes, where it must be
     done, and what it REFUSES. One line to a work in world/works.js, and the
     engine knows none of them by name. */
  work:function(w){this.workList.push(w);},
  /* EVERY KIND OF BLOCK THE WORLD IS MADE OF, one to a file under blocks/ —
     what it is called, what it is drawn with, how long it takes to break,
     what tool serves, what it drops, and whether it stands on nothing. The
     mesher used to carry a table of ad-hoc material NAMES; this is a table
     of MATERIALS, and it is data like everything else. */
  block:function(b){this.blockList.push(b);},
  /* THE FALLING WATERS OF THE EARTH — every one at its true place, with its
     true height and breadth and the FORM it takes, in world/waterfalls.js.
     js/waterfall.js cuts the rock to those numbers and js/water.js runs the
     water down it; neither knows one fall from another by name. */
  waterfall:function(w){this.waterfallList.push(w);}
};
