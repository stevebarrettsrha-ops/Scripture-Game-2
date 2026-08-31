/* ============================================================
   THE RARE WARES OF THE LANDS — one file, and it is all data (§5.2)
   ------------------------------------------------------------
   "Tarshish was your merchant because of your great wealth."
                                                YAHAZQ'AL 27:12

   The common goods of the market (grain, oil, wine, salt, cedar, cloth,
   spice, dye) are sold everywhere and differ only in price. A WARE is a
   different thing: it is of ONE region of the earth, bought at its own
   markets and nowhere else, and worth the most at the far end of a long
   sea road. Yahazq'al 27 is the chapter of this trade — Tyre's ledger,
   land by land — and every ware below carries its true verse.

   THE RULE THIS FILE KEEPS. The engine must never know a country or a
   ware by name. It reads this list: a key, a name, the LANDS whose
   markets sell it, what it costs there (`base`), and the shape it takes
   in the ship's hold (`lade` — the same fields Round 94's berths read:
   w/h/d in the hull's own frame, a side and top material, an optional
   tint). Selling prices are not written here because they are not a
   property of the ware alone: the engine prices a ware by HOW FAR it
   stands from home, which is the whole reason to carry it.

   Add a land to a `lands:` line and that land's market sells the ware,
   with not one line changed in js/engine.js — the rule world/minerals.js,
   world/fauna.js and world/flora.js keep.

   Verses extracted by tools/extract-besorah.js and checked to the letter
   by its --check; the linen verse is quoted in contiguous part, as the
   checker's own rule allows. */

EARTH.ware({
  k:'ophir', n:'Gold of Ophir', base:48,
  lands:['India','Sri Lanka','Oman','Yemen'],
  lade:{w:1.4,h:1.2,d:1.4,side:'benchTop',top:'benchTop',tint:[1.0,0.85,0.4]},
  verse:{ t:"It is not valued in the gold of Ophir, in precious shoham or sapphire.",
          ref:"IYOḆ 28:16" }
});

EARTH.ware({
  k:'sheba', n:'Spices of Sheḇa', base:36,
  lands:['Saudi Arabia','Yemen','Ethiopia','Eritrea','Somalia'],
  lade:{w:2.0,h:1.8,d:2.0,side:'planks',top:'benchTop',tint:[1.0,0.75,0.5]},
  verse:{ t:"“The traders of Sheḇa and Ra‛mah were your traders. They paid for your wares with the choicest spices and all kinds of precious stones and gold.",
          ref:"YAHAZQ'AL 27:22" }
});

EARTH.ware({
  k:'tarshish', n:'Silver of Tarshish', base:40,
  lands:['Spain','Portugal','Morocco'],
  lade:{w:1.6,h:1.3,d:1.6,side:'benchTop',top:'benchTop',tint:[0.85,0.88,1.0]},
  verse:{ t:"“Tarshish was your merchant because of your great wealth. They gave you silver, iron, tin and lead for your merchandise.",
          ref:"YAHAZQ'AL 27:12" }
});

EARTH.ware({
  k:'helbon', n:'Wine of Ḥelbon', base:30,
  lands:['Syria','Lebanon','Turkey'],
  lade:{w:1.9,h:2.4,d:1.9,side:'logSide',top:'logTop',tint:[0.6,0.4,0.5]},
  verse:{ t:"“Damascus was your merchant because of the multitude of your works, because of your great wealth of goods, with the wine of Ḥelbon and with white wool.",
          ref:"YAHAZQ'AL 27:18" }
});

EARTH.ware({
  k:'linen', n:'Fine linen of Mitsrayim', base:32,
  lands:['Egypt','Libya','Sudan'],
  lade:{w:2.2,h:1.8,d:2.2,side:'wool',top:'wool'},
  verse:{ t:"all dressed in garments of fine linen and purple",
          ref:"YASHAR 55:8" }
});

EARTH.ware({
  k:'minnith', n:'Wheat of Minnith', base:22,
  lands:['Yahudah','Yasharal','Jordan'],
  lade:{w:2.0,h:1.4,d:2.0,side:'haySide',top:'hayTop',tint:[1.0,0.95,0.7]},
  verse:{ t:"“Yahuḏah and the land of Yasharal were your traders. For your merchandise they exchanged wheat of Minnith and early figs and honey and oil and balm.",
          ref:"YAHAZQ'AL 27:17" }
});

EARTH.ware({
  k:'ivory', n:'Ivory of the south', base:44,
  lands:['Kenya','Tanzania','Mozambique','Madagascar'],
  lade:{w:1.4,h:1.2,d:2.8,side:'snow',top:'snow',tint:[1.0,0.98,0.9]},
  verse:{ t:"For the sovereign had ships of Tarshish at sea with the fleet of Ḥiram. Tarshish came bringing gold and silver, ivory and apes and baboons.",
          ref:"1 MALAḴIM 10:22" }
});
