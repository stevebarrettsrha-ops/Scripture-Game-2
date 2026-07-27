/* ============================================================
   THE MEASURE OF EVERY LIVING THING — one file, and it is the truth
   ------------------------------------------------------------
   "Who has measured the waters in the hollow of his hand, and meted out
    heaven with the span, and comprehended the dust of the earth in a
    measure, and weighed the mountains in scales?"

   THE FAULT THIS FILE MENDS. There were TWO scales in the world and neither
   of them was the man's.

   The beasts of the SEA were built true — six units to the metre, the same
   measure the traveller walks, swims and dives by — so a whale was sixteen
   metres and read as the mountain of meat she is.

   The beasts of the FIELD were drawn at HALF. Not by anybody's decision
   about how big a cow ought to be: the world's first cattle, sheep and
   horses were built by hand, mob-fashion, at about half life-size, and when
   eighty new beasts were added they were held down to match, or a zebra
   would have stood three times the cow in the next field. So the whole
   bestiary was in proportion with ITSELF and out of proportion with the man
   standing in the middle of it. A lion came up to his knee.

   ONE MEASURE NOW, and it is the man's. He stands 11.9 units, which at six
   units to the metre is a shade under two metres — so every creature below
   is set down at its TRUE adult size beside him. An elephant stands to three
   and a fifth metres at the shoulder, half again the man's height. A wolf
   comes to his thigh. A jerboa is the length of his hand.

   ---- AND ONE THING THIS FILE CANNOT MEND ----
   A great many of the models were drawn mob-fashion — tall in the leg and
   short in the body. Scaled by their LENGTH they stand up half again the
   height they should; scaled by their HEIGHT they come out short in the
   body. They are scaled by height, because height is what you judge a beast
   by when it is standing beside you, and because a beast that is the right
   height and a little stubby reads true while one that is the right length
   and towers over a man does not. To have both, the models themselves have
   to be redrawn longer, one at a time.

   ---- HOW TO CHANGE A SIZE ----
   Change the number here. That is all. This table is what the engine builds
   to; a creature file's own `metres` is only the fallback for anything not
   named below. The model is measured and scaled to fit, whatever it was
   drawn at — so you never have to keep any model's own numbers in
   proportion with anything.

   ---- WHICH WAY IT IS MEASURED ----
   'z' (the default) nose to tail — the length of the beast.
   'y' its HEIGHT — used where height is what a creature is known by: a
       giraffe, a gorilla, an ostrich, a kangaroo, a penguin.
   'x' wingtip to wingtip — the ray, and anything wider than it is long.
   ============================================================ */
(function(){
'use strict';

/* ---- THE ONE SCALE OF THE WORLD ----
   Six units to the metre. A block is a metre in the measure a man walks by,
   the depth gauge reports by, and every beast is now built to. */
const U_PER_M=6;
/* and the man himself, for reference: this is what everything is beside */
const MAN=1.98;

/* ---- EVERY CREATURE, AT ITS TRUE ADULT SIZE IN METRES ---- */
const metres={

/* ================= THE BEASTS OF THE FIELD ================= */
/* ---- cattle, flocks and the beasts of the household ---- */
cow:1.4, ox:1.5, sheep:0.9, goat:0.9, pig:0.75, chicken:0.42,
horse:1.6, donkey:1.25, dog:0.6, camel:2.15,
/* ---- the temperate field and wood ---- */
deer:1.1, hare:0.4, boar:0.9, fox:1.1, badger:0.8, hedgehog:0.25,
lynx:1.0, wolf:0.8, bison:1.9, moose:2.0, reindeer:1.2, chamois:0.8,
lizard:0.25, bear:1.0, blackbear:0.9,
/* ---- the plain of the south ---- */
elephant:3.2, giraffe:5.5, zebra:1.4, wildebeest:1.4, gazelle:0.9,
oryx:1.2, buffalo:1.6, rhino:1.8, warthog:0.75, ostrich:2.4,
lion:1.15, cheetah:0.85, leopard:0.7, hyena:0.85, jackal:1.0,
baboon:0.75, meerkat:0.5, hippo:1.5, crocodile:4.5,
/* ---- the forests of the tropics ---- */
gorilla:1.65, chimpanzee:1.3, okapi:1.6, lemur:0.9, orangutan:1.35,
macaque:0.6, howler:0.62, sloth:0.7, anteater:2.0, armadillo:0.75,
tapir:1.1, jaguar:0.75, capybara:1.2, peacock:1.1, komodo:2.6,
/* ---- the east and the high country of Asia ---- */
tiger:1.0, panda:0.8, redpanda:0.62, snowleopard:1.3, yak:1.7,
saiga:0.8, waterbuffalo:1.7,
/* ---- the new world ---- */
cougar:0.75, coyote:1.2, pronghorn:0.9, llama:1.8, alpaca:1.4,
raccoon:0.75, skunk:0.6,
/* ---- the great south land ---- */
kangaroo:1.6, emu:1.8, koala:0.75, wombat:1.0, dingo:1.2,
cassowary:1.7, kiwi:0.5, tasdevil:0.7,
/* ---- the cold and the ice ---- */
polarbear:1.3, arcticfox:0.72, muskox:1.4, penguin:1.15,
mammoth:3.4, arcticwolf:1.5, wolverine:1.0, arctichare:0.6,
ermine:0.28, lemming:0.13, ptarmigan:0.36,
/* ---- the waste ---- */
wildass:1.4, addax:1.1, blackbuck:0.8, caracal:0.9, bustard:0.9,
jerboa:0.15, viper:0.7, scorpion:0.12,
/* ---- the running water ---- */
otter:1.2, beaver:1.1, platypus:0.5,

/* ================= THE BEASTS OF THE SEA ================= */
fish:0.35, puffer:0.45, jelly:0.9, crab:0.45, squid:6.0,
anglerfish:1.2, sardine:0.2, mackerel:0.38, salmon:0.85, cod:1.0,
tuna:2.2, turtle:1.8, ray:5.5, dolphin:3.2, shark:5.2,
hammerhead:4.6, whaleshark:11.0, orca:8.0, narwhal:7.0, whale:16.0,
seal:1.8, walrus:3.2, octopus:1.2, swordfish:3.0, barracuda:1.4,
manatee:3.0, beluga:4.2, greenlandshark:5.0,
/* ---- and of the rivers ---- */
trout:0.45, catfish:1.2, piranha:0.3, sturgeon:2.2, riverdolphin:2.4,
arcticchar:0.6,

/* ================= THE FOWL OF THE AIR =================
   Measured wingtip to wingtip, which is the only measure anybody uses for a
   bird in the air, and the only one that reads at a distance. */
crow:0.95, dove:0.6, gull:1.3, eagle:2.1, owl:1.5, puffin:0.55,
butterfly:0.09,
};

/* ---- WHICH WAY EACH IS MEASURED ----
   Anything not named here is measured nose to tail. */
const axis={
  /* ---- THE ONES MEASURED BY THEIR HEIGHT ----
     Not a whim: these models were drawn mob-fashion, tall in the leg and
     short in the body, and scaling one of them by its LENGTH stands it up
     twice the height it should be — a six-and-a-half-metre elephant came out
     five and a quarter metres TALL, which is two and a half times the man
     looking at it. Height is also the thing you actually judge a beast by
     when it is standing next to you, which is the whole point of the
     exercise. So these are set down at their true height at the shoulder (or
     at the crown of the head, for the ones that carry it high). */
  elephant:'y', mammoth:'y', camel:'y', horse:'y', donkey:'y', ox:'y', cow:'y',
  deer:'y', goat:'y', sheep:'y', pig:'y', bear:'y', blackbear:'y', lion:'y',
  wolf:'y', dog:'y', hare:'y', rhino:'y', hippo:'y', buffalo:'y', bison:'y',
  moose:'y', muskox:'y', yak:'y', waterbuffalo:'y', zebra:'y', wildebeest:'y',
  okapi:'y', wildass:'y', oryx:'y', addax:'y', tapir:'y', saiga:'y',
  reindeer:'y', chamois:'y', gazelle:'y', blackbuck:'y', pronghorn:'y',
  boar:'y', warthog:'y', tiger:'y', jaguar:'y', cougar:'y', leopard:'y',
  cheetah:'y', hyena:'y', polarbear:'y', panda:'y', baboon:'y',
  giraffe:'y', gorilla:'y', chimpanzee:'y', orangutan:'y', meerkat:'y',
  llama:'y', alpaca:'y', kangaroo:'y', koala:'y', emu:'y', cassowary:'y',
  ostrich:'y', penguin:'y', bustard:'y', chicken:'y', squid:'y', jelly:'y',
  /* and the ones wider than they are long */
  crab:'x', ray:'x',
  /* every bird in the air, wingtip to wingtip */
  crow:'x', dove:'x', gull:'x', eagle:'x', owl:'x', puffin:'x', butterfly:'x',
};

window.SIZE={
  U_PER_M, MAN, metres, axis,
  /* the true size of a creature in metres, or 0 if it is not named here */
  of:name=>metres[name]||0,
  /* and which way that number is measured */
  axisOf:name=>axis[name]||'z',
  /* how many world units that creature truly measures */
  unitsOf:name=>(metres[name]||0)*U_PER_M,
};
})();
