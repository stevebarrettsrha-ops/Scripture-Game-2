/* ================= THE GOODS OF THE TRADE OF THE SEAS =================
   The eight wares every market prices by its own land: buy where a thing is
   cheap, bear it over the deep in the hold, and sell where it is dear. They
   were a literal table inside js/engine.js from the day the trade was built
   (Round 98 moved them here, changing no good and no number) — against the
   one rule this project keeps above all others: everything is data, the
   engine knows nothing by name, and adding a ware is adding a line HERE.
   `k` is the cargo key a save carries, `n` the name the stall shows, `base`
   the price in shekels a market of factor one asks. */
EARTH.good({ k:'grain', n:'Grain',      base:4  });
EARTH.good({ k:'oil',   n:'Olive oil',  base:9  });
EARTH.good({ k:'wine',  n:'Wine',       base:12 });
EARTH.good({ k:'salt',  n:'Salt',       base:6  });
EARTH.good({ k:'cedar', n:'Cedar wood', base:14 });
EARTH.good({ k:'cloth', n:'Fine cloth', base:18 });
EARTH.good({ k:'spice', n:'Spices',     base:26 });
EARTH.good({ k:'dye',   n:'Purple dye', base:34 });
