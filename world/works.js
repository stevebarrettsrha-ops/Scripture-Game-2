/* ============================================================
   THE NAMED WORKS — one file, and it is all data

   "And if you make Me an mizbe'ach of stone, do not build it of cut stone."
                                                          SHEMOTH 20:25

   NOT A TECH TREE. There is no research, no unlock graph, no tier of metals
   climbing toward a better pickaxe. There is a short list of things a man in
   that world actually made, each drawn from the account, each with the words
   it is drawn from. §4 of the brief: "Ten to twenty of these beat a hundred
   generic recipes."

   THE RULE THIS FILE KEEPS. The engine must never know a work by name. It
   knows only how to read this list: what a work takes, what it gives, where
   it must be done, and what it REFUSES. Add a line here and the thing can be
   made, with not one line changed in js/engine.js — the same rule
   world/minerals.js, world/fauna.js and world/flora.js keep.

   ---- WHAT A WORK IS ----
     id      the work's own name, stable, never renumbered
     name    what a man reads on the page
     of      what it takes: block ids and how many of each
     gives   what it gives: block ids and how many
     at      OPTIONAL — the BLOCK a man must stand by to do it: 'kiln' for a
             work of the fire, 'bench' for a work of the carpenter. Absent
             means the bare hand, which is everywhere. Any block id will do;
             the engine looks for that block about his feet and knows none of
             them by name. A place this build has no block for drops the work
             at the door, as an unknown material does.
     needs   OPTIONAL — a tool that must be HELD, by what it serves as
     refuses OPTIONAL — the heart of the matter, and the reason this file
             exists at all. See below.
     verse   the words it is drawn from, quoted EXACTLY — see §5 and
             tools/extract-besorah.js, which is how every one of these was
             taken out of the Besorah and how any of them can be checked.

   ---- WHAT `refuses` MEANS, AND WHY IT IS NOT DECORATION ----
   A recipe that simply lacked a material would say "you do not have it" and a
   man would shrug. But the altar is not short of stone — a man standing at it
   with a satchel full of DRESSED stone has plenty of stone, and it is
   forbidden, and he is meant to be TOLD SO IN THE WORDS OF THE COMMAND.

   So a work may name a substance that would otherwise do perfectly well and
   refuse it. If the hand holds enough of the refused thing to make the work,
   and lacks the true material, the work is not merely withheld: it is
   refused, with its verse. That is the difference between a game that has
   read the account and a game that has a crafting grid.

   ---- WHAT IS DELIBERATELY NOT HERE ----
   The tent of goat hair, the ark of gopher wood, the furnishings in acacia
   and gold: all named in §4, none shipped, because the world has no goat
   hair, no gopher wood and no acacia in it yet, and a work that cannot be
   attempted is worse than one that is not written. They ship when something
   puts their materials in the ground — the same rule the ores keep. The
   smelting of copper and iron waits on the same: the ore is in the hills
   already, and the metal wants a fire hotter than a kiln and a work of its
   own.
   ============================================================ */

/* ---------------- THE WORKS OF THE BARE HAND ---------------- */

/* --- PLANKS — the first thing anybody does to a log --- */
EARTH.work({
  id:'planks', name:'Rive Planks',
  of:{ 'log':1 }, gives:{ 'planks':4 }
});

/* --- HEWING — and it is a work, which is the whole point ---
   The living rock of this world is UNHEWN. Dressing it is something a man
   does to it with an iron, and the House was built of stone so dressed. */
EARTH.work({
  id:'hew-stone', name:'Hew Stone',
  of:{ 'stone':1 }, gives:{ 'hewn-stone':1 },
  needs:'pick',
  verse:{ t:'And the House, when it was being built, was built with finished stone made ready beforehand, so that no hammer or chisel or any iron tool was heard in the House while it was being built.',
          ref:'MELAKIM ALEPH 6:7' }
});

/* --- COURSED STONE — the mason's work, dressed and laid --- */
EARTH.work({
  id:'course-stone', name:'Lay Stone in Courses',
  of:{ 'hewn-stone':4 }, gives:{ 'cobble':4 },
  verse:{ t:'And the sovereign commanded and they brought large stones, precious stones, to lay the foundation of the House with hewn stones.',
          ref:'MELAKIM ALEPH 5:17' }
});

/* --- THE ALTAR OF UNHEWN STONE — and it refuses the hewn ---
   The one work in this file that says NO. Twelve stones as they came out of
   the ground; a chisel taken to any of them and it is not an altar. The
   verse is quoted as far as the command runs. */
EARTH.work({
  id:'altar', name:'An Altar of Unhewn Stone',
  of:{ 'stone':12 }, gives:{ 'altar':1 },
  refuses:{ id:'hewn-stone',
            why:{ t:"And if you make Me an mizbe'ach of stone, do not build it of cut stone",
                  ref:'SHEMOTH 20:25' } },
  verse:{ t:"And if you make Me an mizbe'ach of stone, do not build it of cut stone",
          ref:'SHEMOTH 20:25' }
});

/* --- KNIVES OF FLINT — commanded by name, and the sharpest edge there is --- */
EARTH.work({
  id:'flint-knife', name:'Knives of Flint',
  of:{ 'flint':2, 'planks':1 }, gives:{ 'flint-knife':1 },
  verse:{ t:'Make knives of flint for yourself and circumcise the sons of Yasharal again the second time.',
          ref:'YEHOSHUA 5:2' }
});

/* --- AND THE REST OF THE TOOLS, of the same stone and the same wood ---
   No verse on these: they are not named in the account, and §14 would rather
   have four honest tools than four invented citations. */
EARTH.work({ id:'flint-pick',  name:'A Pick of Flint',
  of:{ 'flint':3, 'planks':2 }, gives:{ 'flint-pick':1 } });
EARTH.work({ id:'flint-axe',   name:'An Axe of Flint',
  of:{ 'flint':3, 'planks':2 }, gives:{ 'flint-axe':1 } });
EARTH.work({ id:'flint-spade', name:'A Spade of Flint',
  of:{ 'flint':2, 'planks':2 }, gives:{ 'flint-spade':1 } });
EARTH.work({ id:'flint-hoe',   name:'A Hoe of Flint',
  of:{ 'flint':2, 'planks':2 }, gives:{ 'flint-hoe':1 } });

/* --- THRESHING — seed corn beaten out of the sheaf ---
   The sheaves stand in every byre and pen on the earth, and the seed is IN
   them: beaten out at the bare hand, as Ruth beat out her gleaning and
   Giḏ‛on threshed his wheat in the winepress. It is the one door into the
   sowing a voyage that owns nothing can walk through — a sheaf gives to
   bare fingers, and from it the seed, and from the seed the field. */
EARTH.work({
  id:'thresh', name:'Thresh Seed Corn',
  of:{ 'hay':1 }, gives:{ 'seed':4 },
  verse:{ t:'And she gleaned in the field until evening and beat out that which she had gleaned and it was about an ĕphah of barley.',
          ref:'RUTH 2:17' }
});

/* --- THE KILN — the first work that makes a PLACE rather than a thing ---
   The works of the fire below it must be done standing at one, because "bake
   them thoroughly" is not something a man does in his hands. (It was the
   ONLY such work until §17.5 gave the carpenter his bench; the works of the
   bench are at the foot of this file.) */
EARTH.work({
  id:'kiln', name:'A Kiln',
  of:{ 'stone':8, 'clay-band':4 }, gives:{ 'kiln':1 }
});

/* ---------------- AND THE WORKS OF THE FIRE ---------------- */

/* --- BRICK — the recipe for Baḇel, and it is given in the account itself ---
   "Let us make bricks and bake them thoroughly" is a method, not a flourish:
   it is why this work needs a kiln and riving planks does not. */
EARTH.work({
  id:'brick', name:'Bake Brick', at:'kiln',
  of:{ 'clay-band':4 }, gives:{ 'brick':4 },
  verse:{ t:'And they said to each other, “Come, let us make bricks and bake them thoroughly.” And they had brick for stone and they had asphalt for mortar.',
          ref:'BERĔSHITH 11:3' }
});

/* --- A BUCKET — fired clay, and the one vessel this world needs by name ---
   A man carries water in something. Every other way of moving it — a channel
   cut, a spring at a lip, a storm over a wall — the world does for itself; this
   is the only one that is HIS, and it is a jar of baked clay because that is
   what a man of that country carried water in. The account is full of them at
   wells. */
EARTH.work({
  id:'bucket', name:'A Bucket', at:'kiln',
  of:{ 'clay-band':3 }, gives:{ 'bucket':1 },
  verse:{ t:'And she hurried and emptied her jar into the trough, ran back to the fountain to draw water and drew for all his camels.',
          ref:'BERĔSHITH 24:20' }
});

/* --- ROOF TILE — the same clay, and the same fire --- */
EARTH.work({
  id:'roof-tile', name:'Bake Roof Tile', at:'kiln',
  of:{ 'clay-band':3 }, gives:{ 'roof-tile':3 }
});

/* --- GLASS — sand, and heat enough to make it run --- */
EARTH.work({
  id:'glass', name:'Melt Glass', at:'kiln',
  of:{ 'sand':4 }, gives:{ 'glass':4 }
});

/* ================= AND THE WORKS OF THE BENCH (§17.5) =================
   THE SECOND PLACE THIS WORLD HAS. Until now every work was done at the bare
   hand or at a fire, so there was nowhere a man WENT to make, and the list
   above could not grow past what one can do standing in a field. A bench is
   that place: it is a block like the kiln, and `at:'bench'` is read by the
   same engine line the kiln is read by — nothing in js/ knows what a bench
   is, and nothing needed to be taught.

   THESE GO LAST, AND THE ORDER IS LOAD-BEARING. Acceptance test 20 takes its
   place-probe as the FIRST work in this file carrying an `at`. Declared
   above the works of the fire, these would quietly take that probe over, and
   test 20 would stop exercising the kiln while still passing green — a guard
   that has silently changed what it guards. So: new places are declared
   after the old ones. (Test 20 was also taught to walk EVERY place rather
   than the first, so this rule is belt and braces rather than the only
   thing standing between us and that.)

   THE THREE VERSES ARE ONE PASSAGE — the building of the House: the timber
   prepared, the boards panelled, the boards carved. Every one extracted with
   tools/extract-besorah.js, none typed from memory. */

/* --- THE BENCH ITSELF — a work of the bare hand, or nobody could ever start ---
   A bench stands in every village on the earth and may be broken out of one
   and carried; this is for the man who is nowhere near a village, and it
   keeps the bootstrap honest — timber to planks to a bench, all of it at the
   fingers, exactly as test 44 walks a man from nothing to a pick. */
EARTH.work({
  id:'bench', name:'A Carpenter\'s Bench',
  of:{ 'planks':4, 'log':2 }, gives:{ 'bench':1 },
  verse:{ t:'And Shelomoh’s builders and Ḥiram’s builders and the men of Geḇal did hew and prepared timber and stones to build the House.',
          ref:'MELAKIM ALEPH 5:18' }
});

/* --- PANELLING — the plank dressed and fitted, which wants a bench ---
   NOT Yashayahu 44:13, which is the vivid carpentry verse in the whole
   account — the rule, the chalk, the plane, the compass — and is the
   idol-maker's passage. This project does not set a verse to work against
   its own subject, and that is a decision, not an oversight. */
EARTH.work({
  id:'panelling', name:'Dress Boards', at:'bench',
  of:{ 'planks':4 }, gives:{ 'panel':4 },
  verse:{ t:'And he built the walls of the House inside with cedar boards, from the floor of the House to the ceiling he panelled them on the inside with wood and covered the floor of the House with planks of cypress.',
          ref:'MELAKIM ALEPH 6:15' }
});

/* --- CARVED WORK — the second remove, and the first work in this world
   that wants a KNIFE. Of fifteen works before this round exactly one named
   a tool, and it wanted a pick; the knives of flint were commanded by name
   in YEHOSHUA 5:2, made, carried, and asked for by nothing. Now they cut. */
EARTH.work({
  id:'carved-panel', name:'Carve Boards', at:'bench',
  of:{ 'panel':1 }, gives:{ 'carved-panel':1 },
  needs:'knife',
  verse:{ t:'And he carved all the walls of the House all around, both inside and outside, with carved figures of keruḇim and palm trees and open flowers.',
          ref:'MELAKIM ALEPH 6:29' }
});
/* --- THE FURNACE — built of the kiln's own brick, at the kiln's own fire ---
   The first time one work's product is another work's material, which is
   what "building from gathered materials" means: clay to brick at the kiln,
   brick to furnace, and the furnace opens the smelting. The account knows
   it by name — the iron furnace of Mitsrayim. */
EARTH.work({
  id:'furnace', name:'A Furnace', at:'kiln',
  of:{ 'brick':8 }, gives:{ 'furnace':1 },
  verse:{ t:'“But (YAHUAH) HWHY has taken you and brought you out of the iron furnace, out of Mitsrayim, to be His people, an inheritance, as it is today.',
          ref:'DEḆARIM 4:20' }
});

/* ---------------- AND THE WORKS OF THE FURNACE ---------------- */

/* --- SMELTING — the ore of DEḆARIM 8:9's hills becomes the metal ---
   The head of this file has said since Phase 4 that "the metal wants a
   fire hotter than a kiln and a work of its own." This is that work.
   IRON ONLY, and the restraint is the point: copper's metal waits until a
   work needs it, and bronze waits on a tin no land's list holds — a
   substance ships when a work needs it, and the iron pick needs this. */
EARTH.work({
  id:'smelt-iron', name:'Smelt Iron', at:'furnace',
  of:{ 'iron-ore':1 }, gives:{ 'iron':1 },
  verse:{ t:'Iron is taken from the earth and copper is smelted from ore.',
          ref:'IYOḆ 28:2' }
});

/* --- A PICK OF IRON — the reason the smelting exists ---
   The same shape as the flint pick's work, in the better metal. No verse:
   it is not named in the account, and an honest tool beats an invented
   citation. */
EARTH.work({ id:'iron-pick', name:'A Pick of Iron',
  of:{ 'iron':3, 'planks':2 }, gives:{ 'iron-pick':1 } });
