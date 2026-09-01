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
     at      OPTIONAL — 'kiln' if it needs fire. Absent means the bare hand.
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

/* --- THE KILN — the only work that makes a PLACE rather than a thing ---
   Everything below it must be done standing at one, because "bake them
   thoroughly" is not something a man does in his hands. */
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
