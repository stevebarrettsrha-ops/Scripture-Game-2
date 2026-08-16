/* ============================================================
   WHAT LIES UNDER EVERY LAND — one file, and it is all data
   ------------------------------------------------------------
   "A land whose stones are iron, and out of whose hills you dig copper."
                                                        DEḆARIM 8:9

   Phase 1 dug the caves. This is what makes them worth walking into.

   THE RULE THIS FILE KEEPS. The engine must never know a country by name.
   It knows only how to read this list: a substance, the lands that hold it,
   how deep under the ground it lies, and how often. Add a land to a line
   here and that land holds that ore, with not one line changed in
   js/engine.js — the same rule world/fauna.js and world/flora.js keep.

   ---- HOW A BLOCK OF ROCK IS DECIDED ----
   1. the cell already knows which country it lies in (its `ci`), from the
      country map the terrain is cut against;
   2. the substances of that country are looked up here — most lands hold
      one or two, and very many hold none at all;
   3. for each, if this block lies within its band of depth, a number seeded
      on the very place decides whether the ore is there.
   Seeded on the PLACE, so the same shaft always holds the same vein: two
   men digging the same hill find the same gold, and a man who leaves and
   comes back finds his working where he left it.

   ---- HOW DEEP IS DEEP ----
   `lo` and `hi` are courses BELOW THE SURFACE of that column, not absolute
   heights — so a seam runs at a true depth under a mountain and under a
   plain alike, and a man on a summit does not find silver at his feet.

   AND THE ROCK OF THIS WORLD IS ONLY AS THICK AS THE LAND IS HIGH. There is
   no underworld below the sea's floor: the stone runs from the surface of a
   column down to nothing, and a plain three courses above the water has
   three courses of rock beneath it and no more. So a band that begins twenty
   courses down exists ONLY under high country — which is the truth of it
   anyway, and worth saying rather than discovering. The deep metals are
   therefore metals of the HILLS, and a man who wants gold must climb before
   he digs.

   ---- HOW TO ADD A SUBSTANCE ----
   Build the block in blocks/<name>.js, add its file to world/manifest.js,
   and write one line here. Nothing else.

   ---- AND A SUBSTANCE MAY WANT A PLACE AND NOT A DEPTH ----
   `in:'chamber'` means the thing does not lie in a band at all: it grows in
   the WALL OF A HOLLOW, in the floor and the roof of a room the caves have
   opened, and nowhere else. `room` is how many courses tall that hollow must
   be before it counts as a room rather than a crawl.

   AND `room` IS NOT WHERE RARITY GOES. It was tempting to make the rarest
   stones want the biggest rooms, and it is wrong: the gates COMPOUND. A stone
   wanting a ten-course chamber, in eleven countries, in one course of its
   floor, at four rolls in a hundred, is a stone that exists in arithmetic and
   never once in the world — emerald and ruby were both written that way and
   neither could be found anywhere on the earth. The room says what KIND of
   place holds the thing; `often` says how rare it is. One gate, one roll.

   That is the whole of what §4 means by *"rare, deep, worth the descent"*:
   not a rarer roll of the same dice, but a thing that CANNOT be had by
   digging straight down — you have to find the cave, and go in, and go
   further in.

   ---- WHAT IS DELIBERATELY NOT HERE ----
   The brief names some sixty substances — the metals, the stones of the
   breastplate, the cloths, the dyes, the spices. Sixty blocks that nothing
   can be made of and nothing needs is exactly the placeholder content §14
   forbids. A substance ships when a work needs it, and an ore ships when a
   land holds it. The rest wait, and they wait in the open: they are named
   in the brief and they are not named here, which is the honest record of
   what is done and what is not.
   ============================================================ */

/* THE LANDS ARE NAMED AS THEY ARE IN world/*.js — the country's own `n`.
   A name this build does not know is simply never matched, which is what
   should happen: a data file may run ahead of the map. */

/* --- GOLD — Havilah, "and the gold of that land is good" ---
   The oldest named gold in the book, and the deepest: a man goes a long way
   down for it, and finds little. Havilah is placed about the Arabian shore
   and the Nubian desert, which is where the ancient workings are. */
EARTH.mineral({
  id:'gold', block:'gold-ore',
  lands:['Saudi Arabia','Yemen','Sudan','Egypt','Ethiopia','Eritrea'],
  lo:18, hi:64,            /* courses below the surface — the high country only */
  often:0.010,             /* one block in a hundred, within the band */
  verse:{ t:'And the gold of that land is good.', ref:'BERĔSHITH 2:12' }
});

/* --- COPPER — the Aravah, and the mines of Timna ---
   The oldest workings in the land, and the metal the first tools are of.
   It lies shallow, which is why it was found first. */
EARTH.mineral({
  id:'copper', block:'copper-ore',
  lands:['Israel','Jordan','Cyprus','Oman','Yasharal'],
  lo:8, hi:40,
  often:0.030,
  verse:{ t:'a land whose stones are iron and out of whose hills you dig copper.',
          ref:'DEḆARIM 8:9' }
});

/* --- IRON — the commonest of the metals worth the digging --- */
EARTH.mineral({
  id:'iron', block:'iron-ore',
  lands:['Israel','Yasharal','Lebanon','Syria','Turkey','Iran','Spain',
         'Sweden','Ukraine','India','China','Australia','Brazil','Canada',
         'South Africa','United States of America','Russia','Kazakhstan'],
  lo:6, hi:56,
  often:0.026,
  verse:{ t:'a land whose stones are iron and out of whose hills you dig copper.',
          ref:'DEḆARIM 8:9' }
});

/* --- SILVER — the metal a thing is weighed against --- */
EARTH.mineral({
  id:'silver', block:'silver-ore',
  lands:['Turkey','Greece','Spain','Iran','Mexico','Peru','Bolivia','Chile'],
  lo:14, hi:56,
  often:0.016,
  verse:{ t:'there is a mine for silver and a place where gold is refined.',
          ref:'IYOḆ 28:1' }
});

/* --- ALABASTER — the vessel-stone of Egypt ---
   Shallow, and in the limestone country, which is where it truly is. */
EARTH.mineral({
  id:'alabaster', block:'alabaster',
  lands:['Egypt','Libya','Algeria','Italy','Iraq'],
  lo:4, hi:26,
  often:0.028
});

/* --- FLINT — in the chalk and the limestone, in nodules ---
   The commonest thing here, and the one a man finds first: he goes down for
   gold and comes up with the stone that gives him fire. */
EARTH.mineral({
  id:'flint', block:'flint',
  lands:['Israel','Yasharal','Jordan','Egypt','Lebanon','Syria','Turkey',
         'United Kingdom','France','Denmark','Germany','Poland','Belgium'],
  lo:3, hi:30,
  often:0.034,
  verse:{ t:'who brought water for you out of the flinty rock', ref:'DEḆARIM 8:15' }
});

/* --- SALT — the Valley of Siddim, that is the Salt Sea ---
   The block already existed; this is what puts it in the ground where it
   belongs, rather than only in the hand of whoever placed it. */
EARTH.mineral({
  id:'salt', block:'salt',
  lands:['Israel','Yasharal','Jordan','Iran','Pakistan','Austria','Poland'],
  lo:5, hi:34,
  often:0.030,
  verse:{ t:'All these joined together in the Valley of Siddim, that is the Salt Sea.',
          ref:'BERĔSHITH 14:3' }
});

/* --- BITUMEN — the slime pits of Siddim, and the mortar of Babel ---
   "The Valley of Siddim was full of slime pits." It is the one substance
   here that is named twice over in the account: the pits the kings fell
   into, and the mortar the tower was built with. */
EARTH.mineral({
  id:'bitumen', block:'bitumen',
  lands:['Israel','Yasharal','Jordan','Iraq','Iran','Azerbaijan'],
  lo:6, hi:38,
  often:0.024,
  verse:{ t:'And the Valley of Siddim had many tar pits.', ref:'BERĔSHITH 14:10' }
});

/* ============================================================
   THE STONES OF THE BREASTPLATE

   "And you shall put settings of stones in it, four rows of stones."
                                                        SHEMOTH 28:17

   The account names TWELVE, in four rows: ruby, topaz and emerald; turquoise,
   sapphire and diamond; jacinth, agate and amethyst; beryl, shoham and
   jasper. Six of them ship, and they ship under the SOURCE'S OWN NAMES —
   shoham and not onyx, ruby and not sardius, both of which are how the brief
   remembered them and neither of which is how SHEMOTH 28 says them. The other
   six wait for pigments; the paint box has no turquoise, no diamond, no
   jacinth, no agate, no amethyst and no beryl, and inventing one to fill a
   row would be exactly the placeholder §14 forbids.

   THEY ARE NOT IN THE GROUND. They are in the walls of the deep chambers —
   `in:'chamber'` — so no amount of digging straight down will turn one up. A
   man finds them by finding a cave, and going in.

   AND THAT PUTS A CONDITION ON THE LANDS. An ore only wants a country with
   rock in it; a chamber stone wants a country the world actually HOLLOWS, and
   only some thirty-four have cave country at all. Ruby, topaz and emerald
   were first written with the lands the stones truly come from and NONE of
   those lands had a cave in it — three lines that could never once have
   fired, which is exactly the silently useless line test 21 was written to
   catch, and it caught them the first time it was asked. Each keeps its true
   lands and has cave country added to it: Nepal and China for the ruby, the
   Swiss Alps and Tanzania for the emerald, Japan and the Americas for the
   topaz — every one of them a place that stone is genuinely found.
   ============================================================ */

EARTH.mineral({
  id:'sapphire', block:'sapphire', in:'chamber', room:8,
  lands:['Israel','Yasharal','Turkey','Iran','India','Afghanistan','Sri Lanka',
         'Myanmar','Ethiopia','Kenya','Madagascar','Australia'],
  lo:6, hi:120, often:0.055,
  verse:{ t:'the second row is a turquoise, a sapphire and a diamond;', ref:'SHEMOTH 28:18' }
});
EARTH.mineral({
  id:'jasper', block:'jasper', in:'chamber', room:8,
  lands:['Egypt','Libya','Algeria','Israel','Yasharal','Jordan','Iraq','Iran',
         'Turkey','Greece','Italy','Spain','India','Brazil','United States of America'],
  lo:4, hi:120, often:0.070,
  verse:{ t:'the fourth row is a beryl and a shoham and a jasper. They are set in gold settings.',
          ref:'SHEMOTH 28:20' }
});
EARTH.mineral({
  id:'topaz', block:'topaz', in:'chamber', room:8,
  lands:['Egypt','Ethiopia','Brazil','Russia','Pakistan','Nigeria','Mexico','Australia',
         'United States of America','Japan','Argentina'],
  lo:8, hi:120, often:0.048,
  verse:{ t:'The first row is a ruby, a topaz and an emerald;', ref:'SHEMOTH 28:17' }
});
EARTH.mineral({
  id:'shoham', block:'shoham', in:'chamber', room:8,
  lands:['Yemen','Oman','Saudi Arabia','Egypt','Sudan','Ethiopia','India','Brazil'],
  lo:6, hi:120, often:0.052,
  verse:{ t:'the fourth row is a beryl and a shoham and a jasper. They are set in gold settings.',
          ref:'SHEMOTH 28:20' }
});
EARTH.mineral({
  id:'emerald', block:'emerald', in:'chamber', room:8,
  lands:['Egypt','Ethiopia','Colombia','Brazil','Zambia','Afghanistan','Pakistan','Russia',
         'Switzerland','Tanzania','South Africa'],
  lo:10, hi:120, often:0.052,
  verse:{ t:'The first row is a ruby, a topaz and an emerald;', ref:'SHEMOTH 28:17' }
});
EARTH.mineral({
  id:'ruby', block:'ruby', in:'chamber', room:8,
  lands:['Myanmar','Sri Lanka','Thailand','India','Afghanistan','Kenya','Tanzania','Madagascar',
         'Nepal','China'],
  lo:10, hi:120, often:0.050,
  verse:{ t:'The first row is a ruby, a topaz and an emerald;', ref:'SHEMOTH 28:17' }
});
