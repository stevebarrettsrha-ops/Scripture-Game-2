/* ============================================================
   THE AGRICULTURAL YEAR — one file, and it is all data
   ------------------------------------------------------------
   "While the earth remaineth, seedtime and harvest, and cold and heat, and
    summer and winter, and day and night shall not cease."

   THE FAULT THIS FILE MENDS. Every farm on the earth grew the SAME anonymous
   green cross — twelve of them, in twelve fixed places, in every village from
   Norway to Java — and it grew it on the shortest day exactly as it grew it
   at harvest. There was no sowing, no standing green, no ripening, no reaping
   and no stubble; there was one plant, one colour, one height, all the year,
   in every country. An Egyptian barley field in April and a Finnish one in
   February were the same twelve crosses.

   ---- WHAT IS *NOT* HERE, AND WHY ----
   WHICH LANDS GROW WHICH CROP IS NOT WRITTEN HERE. `world/flora.js` has
   already said, for all one hundred and seventy-six countries, that Egypt
   grows wheat and barley and cotton, that Java grows rice, that Mali grows
   millet and sorghum, that Ireland grows oats and the potato. Writing it
   again here would be a second copy to drift from the first. This file says
   only what a NAMED crop does — and the name must be one world/flora.js
   already knows, or no field will ever bear it.

   ---- HOW A FIELD COMES BY ITS CROP ----
   js/crop.js keeps the land's own list from world/flora.js, throws away
   everything this file does not name, and draws one by a number seeded on the
   FIELD'S OWN PLACE. So the same plot bears the same crop for ever, and the
   two fields of one village bear different ones.

   ---- AND THE YEAR ITSELF IS NOT HERE EITHER ----
   When a field is sown and when it is reaped is worked out from LATITUDE, in
   the crop shader, and it is worked out there because it costs nothing there
   and NO CHUNK IS EVER RE-MESHED for it — the same way the leaves of the world
   have gilded in autumn since Round 53. A Norwegian harvest and an Egyptian
   one are four months apart; a Norwegian barley harvest and a Norwegian oat
   harvest are a fortnight apart. Latitude is the thing that matters, and
   latitude is the thing the shader has.

   ---- WHAT YOU MAY CHANGE ----
   A line below. Give a crop that world/flora.js already names its stature,
   its colour and its manner, and every field in every country that grows it
   changes. Reload the game.

   h / w   how tall it stands and how broad, in blocks
   green   its colour while it grows. It is the ONLY colour written down: what
           a ripe field turns to is one straw-gold for the whole earth, and it
           is in the shader.
   turns   OPTIONAL false — it does NOT ripen to straw. A potato haulm, a taro
           leaf and a cane are green on the day they are lifted or cut, and
           gilding them in September would be a lie about the plant. Anything
           not saying otherwise turns, because the corn of the earth turns.
   paddy   OPTIONAL true — it stands in water, and its field is flooded
   row     OPTIONAL true — set out in rows a man walks between rather than
           drilled close: the maize, the cotton, the potato, the cane
   ============================================================ */
EARTH.crops({ kinds:{

/* ---- THE BREAD CORN OF THE OLD WORLD ----
   Barley is named by ninety-three countries and wheat by seventy-eight, which
   makes them the two commonest cultivated things on this earth, as they are
   on the other one. */
wheat   :{ h:1.05, w:0.85, green:0x7a9a42 },
barley  :{ h:1.00, w:0.88, green:0x83a04a },
rye     :{ h:1.25, w:0.80, green:0x6f9448 },
oats    :{ h:0.98, w:0.92, green:0x86a656 },

/* ---- THE GRAIN OF THE DRY PLAIN ----
   Millet and sorghum are what the Sahel and the Deccan actually eat, and
   between them they are named by sixty-five countries. Sorghum stands head
   high and is set out in rows. */
sorghum :{ h:1.60, w:0.78, green:0x6d8f3e, row:true },
millet  :{ h:1.20, w:0.72, green:0x7d9a4a },

/* ---- THE GRAIN OF THE NEW WORLD AND OF THE MONSOON ----
   Maize is a row crop and stands two thirds again the height of barley; rice
   stands in water, and a flooded field is the whole look of a paddy country. */
maize   :{ h:1.75, w:0.95, green:0x4e8a34, row:true },
rice    :{ h:0.85, w:0.90, green:0x63a552, paddy:true },

/* ---- WHAT IS GROWN FOR CLOTH AND FOR OIL ---- */
flax    :{ h:0.75, w:0.70, green:0x7fa06a },
hemp    :{ h:1.55, w:0.85, green:0x4f7a34, turns:false },
cotton  :{ h:0.85, w:1.00, green:0x5c7a44, row:true },

/* ---- AND WHAT IS GROWN FOR THE ROOT AND FOR THE POT ----
   None of these TURNS. A potato haulm and a taro leaf are green on the day
   they are lifted; the field is emptied, not reaped. */
potato  :{ h:0.62, w:0.95, green:0x40702c, row:true, turns:false },
cassava :{ h:1.30, w:1.00, green:0x4c7a38, row:true, turns:false },
taro    :{ h:0.80, w:1.10, green:0x3f7a44, paddy:true, turns:false },
turmeric:{ h:0.70, w:0.85, green:0x4e8038, turns:false },
melon   :{ h:0.40, w:1.20, green:0x53853c, row:true, turns:false },

/* ---- AND THE CANE, WHICH IS NEITHER CORN NOR ROOT ----
   Named by seventy-five countries, standing over three metres, CUT and not
   reaped, and green the year round in nearly every country that grows it. */
sugarcane:{ h:2.20, w:0.80, green:0x62a03e, row:true, turns:false },

}});
