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
