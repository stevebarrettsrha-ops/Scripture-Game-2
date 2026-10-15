/* ================= THE GOODS OF THE TRADE OF THE SEAS =================
   The wares every market prices by its own land: buy where a thing is
   cheap, bear it over the deep in the hold, and sell where it is dear. They
   were a literal table inside js/engine.js from the day the trade was built
   (Round 98 moved them here, changing no good and no number) — against the
   one rule this project keeps above all others: everything is data, the
   engine knows nothing by name, and adding a ware is adding a line HERE.
   `k` is the cargo key a save carries, `n` the name the stall shows, `base`
   the price in shekels a market of factor one asks.

   ---- AND WHAT IT LOOKS LIKE ON A COUNTER (Phase D) ----
   `look` is how the ware is laid out on the stall of a land that makes it:
   the block it is drawn with (`m`) and the colour worked into it (`t`, red,
   green and blue, one being the block's own) — the purple of Tsor in bales,
   the linen of Mitsrayim white in bolts, the slime of Baḇal black in cakes.

   ---- AND THE FIVE THAT CAME WITH THE LANDS (Phase D) ----
   The eight were what any coast might sell. A land is known by what only it
   makes, and five such were wanting: the fine linen of Mitsrayim, the glass
   of Tsiḏon, the copper of Eḏom and Kittim, the frankincense of Sheḇa, and
   the slime of the pits of Baḇal. They are appended, never put between: a
   save carries its cargo by key, and the order here is the order of the
   stall. WHERE each is cheap and where it is dear is not written here at
   all — that is each land's own word, in world/lands.js. */
EARTH.good({ k:'grain',   n:'Grain',        base:4,  look:{m:'hayTop'} });
EARTH.good({ k:'oil',     n:'Olive oil',    base:9,  look:{m:'badSide', t:[1.0,0.92,0.62]} });
EARTH.good({ k:'wine',    n:'Wine',         base:12, look:{m:'badSide', t:[0.62,0.32,0.34]} });
EARTH.good({ k:'salt',    n:'Salt',         base:6,  look:{m:'salt'} });
EARTH.good({ k:'cedar',   n:'Cedar wood',   base:14, look:{m:'logSide', t:[1.0,0.78,0.62]} });
EARTH.good({ k:'cloth',   n:'Fine cloth',   base:18, look:{m:'wool',    t:[0.72,0.30,0.26]} });
EARTH.good({ k:'spice',   n:'Spices',       base:26, look:{m:'sand',    t:[0.86,0.50,0.22]} });
EARTH.good({ k:'dye',     n:'Purple dye',   base:34, look:{m:'wool',    t:[0.44,0.13,0.42]} });
EARTH.good({ k:'linen',   n:'Fine linen',   base:16, look:{m:'wool',    t:[1.0,0.98,0.90]} });
EARTH.good({ k:'glass',   n:'Glass',        base:22, look:{m:'glass'} });
EARTH.good({ k:'copper',  n:'Copper',       base:20, look:{m:'bronze',  t:[1.0,0.66,0.50]} });
EARTH.good({ k:'incense', n:'Frankincense', base:30, look:{m:'salt',    t:[1.0,0.86,0.56]} });
EARTH.good({ k:'bitumen', n:'Bitumen',      base:7,  look:{m:'bitumen'} });
