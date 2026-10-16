/* ================= THE WORKSHOPS OF THE LANDS (Phase D2) =================
   "Of fine embroidered linen from Mitsrayim was your sail to serve you as
    banner. Of blue and purple from the coasts of Alishah was your covering."
                                                          YEḤEZQĔL 27:7

   A land is known by what it makes, and until now nothing was made anywhere:
   the purple of Tsor was a line on a stall and the slime of Baḇal a price.
   Each workshop here is a yard a town of its land raises at its edge, on
   level ground, laid in the blocks of the world and furnished with the work
   half done, with a soul at it through the hours of its trade. Which towns
   raise which is the land's own word, in world/lands.js; the engine knows
   none of them by name and reads only this.

   ---- HOW ONE IS WRITTEN ----
   All of it in BLOCKS (one block is a cubit and a half), about the middle of
   the yard, with y=0 the ground the yard is laid on and +z its FRONT, which
   is turned to face the town:
     w, d    its breadth and depth, whole and even, so the yard keeps the grid
     floor   what its ground is laid with (absent: the bare earth)
     build   [x0,y0,z0, x1,y1,z1, block] — laid as blocks of the world, which a
             man may break and carry off as he may a house. Whole numbers only:
             a block is a block. y0 of −1 lays the course OF the ground itself,
             which is how a pit is filled with slime or a floor sunk flush.
     dress   [x0,y0,z0, x1,y1,z1, side, top, tint] — what is too fine for a
             block: the dye in the vat, a skein on the rack, a sheet of
             papyrus, a jar. Drawn, not laid; `tint` is the colour worked into
             it (red, green, blue — one is the block's own).
     fire    [x,y,z] — a fire that burns and glows by night
     hands   who works there: where he stands [x,z], what he faces [x,z], his
             trade (its hours are in js/behavior.js), the work of his hands
             (one of the motions the folk already have: knead, tend, chop,
             weave, work, hawk), and whether it is a woman's work
     says    what the worker says when spoken to
   ============================================================ */
(function(){
/* a low wall about a basin — the four sides of a box, open in the middle */
const ring=(x0,z0,x1,z1,y0,y1,m)=>[[x0,y0,z0,x1,y1,z0+1,m],[x0,y0,z1-1,x1,y1,z1,m],
  [x0,y0,z0+1,x0+1,y1,z1-1,m],[x1-1,y0,z0+1,x1,y1,z1-1,m]];
const PURPLE=[0.40,0.12,0.40], CRIMSON=[0.52,0.12,0.24], FIRSTDIP=[0.62,0.64,0.30],
      LINEN=[1.0,0.98,0.90], FLAX=[0.86,0.88,0.56], CEDAR=[1.0,0.80,0.66], MUST=[0.42,0.08,0.18],
      GRAPE=[0.30,0.12,0.32], REED=[0.55,0.74,0.34], PAPER=[0.95,0.88,0.62], GLOW=[1.0,0.55,0.15];

/* ---- THE DYE-WORKS OF TSOR ----
   Three vats of the shellfish dye, each a stage of it: the first liquor yellow-
   green, deepening to purple in the sun, and the crimson of the second dipping;
   a rack of dyed skeins drying, a heap of fleece waiting, and the MIDDEN — the
   crushed shells of a hundred years heaped at the corner of the yard, which is
   how the dye-works of Tsor are found to this day. */
EARTH.workshop({ k:'dye-works', name:'the dye-works', w:12, d:10, floor:'cobble',
  build:[].concat(ring(-6,-5,-3,-1,0,1,'hewnStone'), ring(-2,-5,1,-1,0,1,'hewnStone'), ring(2,-5,5,-1,0,1,'hewnStone'),
    [[3,0,1,6,1,5,'sand'],[4,1,2,6,2,5,'sand'],[5,2,3,6,3,5,'sand']]),
  dress:[
    [-5,0,-4,-4,0.8,-2,'waterB','waterB',FIRSTDIP],
    [-1,0,-4,0,0.8,-2,'waterB','waterB',PURPLE],
    [3,0,-4,4,0.8,-2,'waterB','waterB',CRIMSON],
    /* the rack: two posts, a pole, and the skeins on it */
    [-5.15,0,1.85,-4.85,3,2.15,'logSide','logTop'],[-0.15,0,1.85,0.15,3,2.15,'logSide','logTop'],
    [-5.2,2.8,1.9,0.2,3.0,2.1,'logSide','logTop'],
    [-4.6,1.3,1.93,-4.1,2.8,2.07,'wool','wool',PURPLE],[-3.8,1.4,1.93,-3.3,2.8,2.07,'wool','wool',CRIMSON],
    [-3.0,1.2,1.93,-2.5,2.8,2.07,'wool','wool',PURPLE],[-2.2,1.5,1.93,-1.7,2.8,2.07,'wool','wool',[0.30,0.10,0.34]],
    [-1.4,1.3,1.93,-0.9,2.8,2.07,'wool','wool',CRIMSON],
    /* the fleece waiting its turn, and a basket of shells by the vats */
    [-6,0,3.6,-4.4,0.7,5,'wool','wool'],
    [1.2,0,-0.8,2.0,0.6,0,'haySide','hayTop'],[1.3,0.6,-0.7,1.9,0.75,-0.1,'sand','sand',[0.80,0.62,0.66]],
    /* the shells on the midden, broken and stained */
    [3.3,1,1.4,3.7,1.2,1.8,'sand','sand',[0.70,0.52,0.60]],[4.4,2,2.4,4.8,2.2,2.8,'sand','sand',[0.62,0.42,0.52]],
    [5.3,3,3.3,5.7,3.2,3.7,'sand','sand',[0.74,0.60,0.62]],[3.4,1,3.9,3.8,1.2,4.3,'sand','sand',[0.56,0.40,0.50]]],
  hands:[{at:[-0.5,-0.2], face:[-0.5,-3], trade:'dyer', anim:'knead'},
         {at:[-2.5,3.3], face:[-2.5,2], trade:'dyer', anim:'tend', female:true}],
  says:['“Ten thousand shells to dye one robe. Smell that? That is the smell of silver.”',
        '“The liquor is yellow-green when it goes in. Hang it in the sun and watch it turn to purple before your eyes.”',
        '“Twice dipped, it is the purple of kings — no rain and no sun will ever take it out.”'] });

/* ---- THE GLASS-FURNACE OF TSIḎON ----
   The beehive furnace of brick with its mouth glowing, a heap of the fine
   sand of the river-mouth, and the work of the day on the bench: cups, flasks
   and beads in green and blue and amber. */
EARTH.workshop({ k:'glass-furnace', name:'the glass-house', w:10, d:8, floor:'cobble',
  build:[[-2,0,-4,2,1,0,'brick'],
    [-2,1,-4,-1,2,0,'brick'],[1,1,-4,2,2,0,'brick'],[-1,1,-4,1,2,-3,'brick'],
    [-2,2,-4,2,3,0,'brick'],[-1,3,-3,1,4,-1,'brick'],
    [3,0,-4,5,1,-1,'sand'],[4,1,-4,5,2,-2,'sand'],
    [-5,0,1,-2,1,2,'planks']],
  dress:[
    [-0.7,1.0,-0.7,0.7,1.15,-0.1,'wool','wool',GLOW],
    [-4.7,1,1.3,-4.25,1.7,1.7,'glass','glass',[0.55,0.85,0.80]],[-3.95,1,1.3,-3.5,1.55,1.7,'glass','glass',[0.40,0.60,0.95]],
    [-3.2,1,1.3,-2.75,1.8,1.7,'glass','glass',[0.95,0.72,0.35]],[-2.6,1,1.25,-2.2,1.45,1.65,'glass','glass',[0.50,0.92,0.50]],
    [2.6,0,1.0,2.75,2.6,1.15,'ironBar','ironBar'],[2.9,0,1.0,3.05,2.4,1.15,'ironBar','ironBar'],
    [-1.2,0,1.6,-0.4,0.25,2.4,'glass','glass',[0.55,0.80,0.75]]],
  fire:[[0,1.05,-1.7]],
  hands:[{at:[0,1.6], face:[0,-1], trade:'glass-blower', anim:'tend'}],
  says:['“Sand of the river-mouth, ash of the sea-plants, and a fire that never sleeps — that is all glass is.”',
        '“A breath down the pipe and the gather swells like a bubble. My father learned it, and his father.”',
        '“Clear glass from Tsiḏon goes to every land under heaven. The far east pays for it in silk.”'] });

/* ---- THE CEDAR-CAMP OF LEḆANON ----
   The logs stacked as they came down the mountain, beams squared with the adze,
   a great trunk on the trestles, chips over everything, and the stumps. */
EARTH.workshop({ k:'cedar-camp', name:'the cedar-camp', w:12, d:8,
  build:[[-6,0,-4,-1,1,-2,'logSide'],[-5,1,-4,-2,2,-2,'logSide'],
    [1,0,-4,6,1,-3,'planks'],[2,1,-4,6,2,-3,'planks']],
  dress:[
    [-2.6,0,0.6,-2.3,1.3,0.9,'logSide','logTop'],[-2.6,0,2.1,-2.3,1.3,2.4,'logSide','logTop'],
    [2.3,0,0.6,2.6,1.3,0.9,'logSide','logTop'],[2.3,0,2.1,2.6,1.3,2.4,'logSide','logTop'],
    [-4,1.3,1.0,4,2.2,2.0,'logSide','logTop',CEDAR],
    [-3,0,2.6,3,0.08,3.6,'planks','planks',[1.0,0.86,0.70]],
    [4,0,2,5,0.9,3,'logSide','logTop'],[-5.5,0,2.5,-4.5,0.7,3.5,'logSide','logTop'],
    [-0.8,0,-1.2,-0.65,1.8,-1.05,'logSide','logTop'],[-0.95,1.6,-1.3,-0.5,1.9,-0.95,'ironBar','ironBar']],
  hands:[{at:[0,3.3], face:[0,1.5], trade:'cedar-hewer', anim:'chop'}],
  says:['“Sound to the heart, and it will not rot in a thousand years. That is why every king wants it.”',
        '“We float them down to the sea in rafts, and along the coast to whoever is paying.”',
        '“Smell the chips — sweet as incense. Take a handful for your chest; the moth will never touch your cloak.”'] });

/* ---- THE LINEN-WORKS OF MITSRAYIM ----
   The retting pool where the pulled flax is soaked, the bundles drying in
   stooks, a loom pegged out flat on the ground as the women of the river weave
   it, and the finished bolts on the bench. */
EARTH.workshop({ k:'linen-works', name:'the linen-works', w:12, d:10, floor:'path',
  build:[].concat(ring(-6,-5,-1,-1,0,1,'mudbrick'), [[2,0,-5,6,1,-4,'mudbrick']]),
  dress:[
    [-5,0,-4,-2,0.75,-2,'waterB','waterB',[0.70,0.82,0.60]],
    [-4.6,0.7,-3.7,-3.4,0.86,-3.3,'hayTop','haySide',FLAX],[-3.2,0.7,-2.8,-2.2,0.86,-2.4,'hayTop','haySide',FLAX],
    [-5.5,0,1.2,-4.9,1.4,1.8,'haySide','hayTop',FLAX],[-4.3,0,1.2,-3.7,1.4,1.8,'haySide','hayTop',FLAX],
    [-3.1,0,1.2,-2.5,1.4,1.8,'haySide','hayTop',FLAX],[-5.5,0,2.8,-4.9,1.4,3.4,'haySide','hayTop',FLAX],
    [-4.3,0,2.8,-3.7,1.4,3.4,'haySide','hayTop',FLAX],[-3.1,0,2.8,-2.5,1.4,3.4,'haySide','hayTop',FLAX],
    /* the ground loom: two beams pegged out, and the linen between */
    [0.5,0,0.5,5.5,0.3,0.8,'logSide','logTop'],[0.5,0,3.7,5.5,0.3,4.0,'logSide','logTop'],
    [0.2,0,0.4,0.45,0.5,0.65,'logSide','logTop'],[5.55,0,0.4,5.8,0.5,0.65,'logSide','logTop'],
    [0.2,0,3.85,0.45,0.5,4.1,'logSide','logTop'],[5.55,0,3.85,5.8,0.5,4.1,'logSide','logTop'],
    [0.7,0.05,0.8,5.3,0.12,3.7,'wool','wool',LINEN],
    /* the bolts finished, and the basket of the spindles */
    [2.3,1,-4.9,3.3,1.5,-4.1,'wool','wool',LINEN],[3.5,1,-4.9,4.5,1.5,-4.1,'wool','wool',LINEN],
    [4.7,1,-4.9,5.7,1.45,-4.1,'wool','wool',[0.96,0.94,0.84]],
    [-1,0,3.5,-0.3,0.6,4.2,'haySide','hayTop']],
  hands:[{at:[3,4.6], face:[3,2.5], trade:'linen-weaver', anim:'weave', female:true},
         {at:[-3.5,-0.2], face:[-3.5,-3], trade:'flax-dresser', anim:'knead'}],
  says:['“Pulled, soaked, beaten and combed, and spun finer than a hair. No land weaves linen like ours.”',
        '“The priests wear nothing else. The dead are wound in it. The ships of Tsor hoist it for sails.”',
        '“A cubit a day on the ground loom, if the light holds and the children leave me be.”'] });

/* ---- THE PAPYRUS-MAKERS OF MITSRAYIM ----
   The reeds cut from the marsh and stood in bundles, the pith laid crosswise on
   the stone and beaten into a sheet, and the sheets drying in the sun. */
EARTH.workshop({ k:'papyrus', name:'the papyrus-makers', w:8, d:8, floor:'path',
  build:[[-1,0,-2,2,1,0,'hewnStone']],
  dress:[
    [-3.6,0,-3.8,-3.3,2.8,-3.5,'haySide','hayTop',REED],[-3.85,2.8,-3.95,-3.05,3.2,-3.35,'leaves','leaves',REED],
    [-2.4,0,-3.8,-2.1,2.6,-3.5,'haySide','hayTop',REED],[-2.65,2.6,-3.95,-1.85,3.0,-3.35,'leaves','leaves',REED],
    [-1.2,0,-3.8,-0.9,2.9,-3.5,'haySide','hayTop',REED],[-1.45,2.9,-3.95,-0.65,3.3,-3.35,'leaves','leaves',REED],
    [2.4,0,-3.8,2.7,2.7,-3.5,'haySide','hayTop',REED],[2.15,2.7,-3.95,2.95,3.1,-3.35,'leaves','leaves',REED],
    [-0.8,1,-1.8,1.8,1.05,-0.2,'wool','wool',PAPER],[1.2,1.05,-0.6,1.7,1.25,-0.4,'logSide','logTop'],
    [-3.6,0,1,-2.0,0.04,2.1,'wool','wool',PAPER],[-1.2,0,1,0.4,0.04,2.1,'wool','wool',PAPER],
    [1.2,0,1,2.8,0.04,2.1,'wool','wool',[0.92,0.84,0.56]],[-3.6,0,2.6,-2.0,0.04,3.7,'wool','wool',PAPER],
    [-1.2,0,2.6,0.4,0.04,3.7,'wool','wool',[0.92,0.84,0.56]],
    [2.6,0,-1.8,3.8,0.5,-0.2,'logSide','logTop'],[2.7,0.5,-1.7,3.7,0.56,-0.3,'waterB','waterB',[0.7,0.8,0.6]]],
  hands:[{at:[0.5,1.0], face:[0.5,-1], trade:'papyrus-maker', anim:'knead'}],
  says:['“The pith is cut in strips, laid one way and then across, and beaten with the mallet till it holds by its own sap.”',
        '“Every letter the king sends, every count of the granaries, is written on a sheet from a yard like this.”'] });

/* ---- THE OLIVE-PRESS OF YASHARAL ----
   The crushing basin with its stone wheel turned about a post, and the beam
   press: the beam's foot in a pier of stone, the baskets of mash under it, the
   weight-stone hanging at its end, and the jars filling. */
EARTH.workshop({ k:'olive-press', name:'the olive-press', w:10, d:8, floor:'cobble',
  build:[[-5,0,-4,-1,1,0,'hewnStone'],[3,0,-4,5,3,-3,'cobble'],[3,0,-1,5,1,1,'hewnStone']],
  dress:[
    [-4.6,1,-3.6,-1.4,1.12,-0.4,'dirt','dirt',[0.55,0.50,0.25]],
    [-3.15,1,-2.15,-2.85,3.6,-1.85,'logSide','logTop'],
    [-2.8,1,-3.1,-2.1,3.2,-0.9,'stone','stone'],
    [-2.85,2.0,-2.1,0.8,2.3,-1.9,'logSide','logTop'],
    [3.75,2.2,-3.5,4.25,2.7,3.5,'logSide','logTop'],
    [3.3,1,-0.7,4.7,1.25,0.7,'haySide','hayTop',[0.70,0.55,0.35]],[3.35,1.25,-0.65,4.65,1.5,0.65,'haySide','hayTop',[0.66,0.52,0.32]],
    [3.3,1.5,-0.7,4.7,1.75,0.7,'haySide','hayTop',[0.70,0.55,0.35]],
    [3.95,1.6,3.15,4.05,2.2,3.25,'wool','wool',[0.60,0.50,0.35]],[3.5,0.6,2.8,4.5,1.6,3.6,'stone','stone'],
    [3.2,0,1.2,4.8,0.5,1.9,'stone','stone'],[3.35,0.5,1.3,4.65,0.52,1.8,'waterB','waterB',[0.62,0.56,0.16]],
    [-4.5,0,3,-3.8,1.1,3.7,'badSide','badTop'],[-3.6,0,3,-2.9,1.1,3.7,'badSide','badTop'],[-2.7,0,3,-2.0,0.9,3.7,'badSide','badTop']],
  hands:[{at:[0.9,-1.3], face:[-3,-2], trade:'olive-presser', anim:'work'}],
  says:['“The first oil runs by itself from the crushing, before the beam is ever laid on — that is the oil for the lamp of the House.”',
        '“Round and round the stone goes, and the whole town smells of olives from the feast of booths to the rains.”',
        '“A good tree gives a jar a year for a hundred years. My grandfather planted these.”'] });

/* ---- THE WINEPRESS OF YASHARAL ----
   The treading floor cut flush in the ground, the channel from it, the vat
   below where the must gathers red, and the baskets of the vintage. */
EARTH.workshop({ k:'wine-press', name:'the winepress', w:8, d:8,
  build:[].concat([[-4,-1,-4,0,0,1,'hewnStone'],[-4,0,-4,0,1,-3,'hewnStone'],[-4,0,-3,-3,1,1,'hewnStone']],
    ring(1,-2,4,2,0,1,'hewnStone')),
  dress:[
    [-3,0,-3,0,0.15,1,'wool','wool',GRAPE],
    [2,0,-1,3,0.75,1,'waterB','waterB',MUST],
    [0,0.5,-0.2,1.2,0.62,0.2,'hewnStone','hewnStone'],[0.9,0.12,-0.1,1.1,0.55,0.1,'wool','wool',MUST],
    [-3.5,0,2.6,-2.6,0.7,3.5,'haySide','hayTop'],[-3.4,0.7,2.7,-2.7,0.95,3.4,'wool','wool',GRAPE],
    [-2.3,0,2.6,-1.4,0.7,3.5,'haySide','hayTop'],[-2.2,0.7,2.7,-1.5,0.95,3.4,'wool','wool',[0.36,0.16,0.30]],
    [-1.1,0,2.6,-0.2,0.7,3.5,'haySide','hayTop'],[-1.0,0.7,2.7,-0.3,0.95,3.4,'wool','wool',GRAPE],
    [2.2,0,2.6,2.9,1.1,3.3,'badSide','badTop',[0.85,0.62,0.58]],[3.1,0,2.6,3.8,1.0,3.3,'badSide','badTop',[0.85,0.62,0.58]]],
  hands:[{at:[-1.8,-1.4], face:[-1.8,0], trade:'vintner', anim:'work'}],
  says:['“Tread, and sing while you tread — that is the vintage. The must runs down into the vat red as blood.”',
        '“In the season the whole household is up in the vineyard, and the watchman sleeps in the tower.”'] });

/* ---- THE COPPER-SMELTERS OF EḎOM AND KITTIM ----
   A shaft furnace blown with skin bellows, its tap-hole glowing, the green ore
   heaped beside it, the black slag thrown out behind, charcoal, and the red
   metal cooling in its cakes. */
EARTH.workshop({ k:'copper-smelter', name:'the copper-smelter', w:10, d:8, floor:'path',
  build:[[-1,0,-3,1,3,-1,'furnSide'],
    [2,0,-4,5,1,-2,'copperOre'],[3,1,-4,5,2,-3,'copperOre'],
    [-5,0,1,-2,1,4,'basalt'],[-4,1,2,-3,2,3,'basalt'],
    [2,0,1,4,1,2,'hewnStone']],
  dress:[
    [-2.7,0,-2.6,-1.6,0.6,-2.0,'wool','wool',[0.55,0.42,0.30]],[-2.7,0,-1.9,-1.6,0.6,-1.3,'wool','wool',[0.52,0.40,0.28]],
    [-1.6,0.25,-2.0,-1.0,0.4,-1.85,'badSide','badTop'],
    [-0.4,0.15,-1.0,0.4,0.75,-0.92,'wool','wool',GLOW],
    [2.2,1,1.2,2.9,1.18,1.7,'bronze','bronze',[1,0.62,0.45]],[3.0,1,1.2,3.7,1.18,1.7,'bronze','bronze',[1,0.62,0.45]],
    [2.6,1.18,1.3,3.3,1.36,1.6,'bronze','bronze',[1,0.66,0.48]],
    [-5,0,-4,-3,0.6,-2,'bitumen','bitumen',[0.55,0.55,0.55]]],
  fire:[[0,3.0,-2]],
  hands:[{at:[-2.2,-0.3], face:[-2.2,-2], trade:'smelter', anim:'tend'}],
  says:['“Green stone out of the hill, charcoal, and the skins worked till your arms burn — then the red metal runs out at the foot.”',
        '“The slag heap is older than any man here. The fires have been lit in these hills since before the flood, they say.”'] });

/* ---- THE INCENSE-STORE OF SHEḆA ----
   The caravan's store: a shed of mudbrick and palm-thatch stacked with sacks
   of frankincense and myrrh against the long road north, the white tears spread
   on a cloth for the buyers, and the jars and the camel-packs. */
EARTH.workshop({ k:'incense-store', name:'the incense-store', w:10, d:8, floor:'path',
  build:[[-5,0,-4,1,3,-3,'mudbrick'],[-5,0,-1,-4,3,0,'logSide'],[0,0,-1,1,3,0,'logSide'],[-5,3,-4,1,4,0,'thatch']],
  dress:[
    [-4,0,-2.9,-3.15,1.0,-2.1,'wool','wool',[0.82,0.72,0.52]],[-3,0,-2.9,-2.15,1.0,-2.1,'wool','wool',[0.78,0.68,0.50]],
    [-2,0,-2.9,-1.15,1.0,-2.1,'wool','wool',[0.82,0.72,0.52]],[-1,0,-2.9,-0.15,1.0,-2.1,'wool','wool',[0.72,0.60,0.44]],
    [-3.6,1.0,-2.85,-2.75,1.9,-2.15,'wool','wool',[0.78,0.68,0.50]],[-2.4,1.0,-2.85,-1.55,1.9,-2.15,'wool','wool',[0.82,0.72,0.52]],
    [-4,0,-1.9,-3.15,0.9,-1.1,'wool','wool',[0.70,0.58,0.42]],
    [2,0,-3,4.6,0.05,-0.6,'wool','wool',[0.55,0.30,0.22]],
    [2.3,0.05,-2.7,3.0,0.3,-2.0,'salt','salt',[1,0.86,0.56]],[3.3,0.05,-2.5,4.2,0.25,-1.6,'salt','salt',[1,0.90,0.66]],
    [2.5,0.05,-1.6,3.3,0.28,-0.9,'salt','salt',[0.96,0.80,0.50]],
    [1.6,0,1.5,2.3,1.1,2.2,'badSide','badTop'],[2.5,0,1.5,3.2,1.0,2.2,'badSide','badTop'],
    [-3.5,0,2,-1.5,0.8,3,'wool','wool',[0.60,0.35,0.20]]],
  hands:[{at:[0.8,1.4], face:[-1,-2], trade:'incense-merchant', anim:'hawk'}],
  says:['“The tears are bled from the trees in the hot months and gathered when they harden. The whitest is for the temples.”',
        '“Seventy days by camel to Azzah, and every well on the road takes its toll. It is worth it — it is worth its weight in gold.”'] });

/* ---- THE SLIME-PITS OF BAḆAL ----
   "And the Valley of Siddim had many tar pits." The black pool welling
   up through the ground, the cakes of it stacked, the baskets, the pot on the
   fire where it is boiled with sand and chopped reed for mortar. */
EARTH.workshop({ k:'bitumen-pit', name:'the slime-pits', w:10, d:8,
  build:[[-4,-1,-3,1,0,1,'bitumen'],[-4,0,-4,1,1,-3,'mudbrick'],
    [2,0,-3,4,1,-1,'bitumen'],[2,1,-3,3,2,-2,'bitumen']],
  dress:[
    [-4,0,-3,1,0.04,1,'waterB','waterB',[0.16,0.14,0.13]],
    [-2.8,0,-1.8,-2.4,0.18,-1.4,'bitumen','bitumen'],[-0.9,0,-0.6,-0.5,0.15,-0.2,'bitumen','bitumen'],
    [2.3,0,1.5,3.1,0.7,2.3,'haySide','hayTop'],[2.4,0.7,1.6,3.0,0.8,2.2,'bitumen','bitumen'],
    [3.4,0,2.0,3.7,0.35,2.3,'stone','stone'],[4.3,0,2.0,4.6,0.35,2.3,'stone','stone'],[3.4,0,3.0,3.7,0.35,3.3,'stone','stone'],
    [3.6,0.4,2.3,4.4,1.1,3.1,'bronze','bronze',[0.40,0.35,0.30]],[3.7,1.1,2.4,4.3,1.13,3.0,'bitumen','bitumen'],
    [-4.5,0,2.5,-2.5,0.5,3.8,'hayTop','haySide']],
  fire:[[4,0.15,2.7]],
  hands:[{at:[-1.5,2.2], face:[-1.5,0], trade:'pitch-gatherer', anim:'work'}],
  says:['“It wells up black out of the ground by itself. Boil it with sand and chopped reed and it holds a wall or a boat against any water.”',
        '“Brick for stone and slime for mortar — so they built the tower, and so we build still.”'] });

/* ---- THE BRICK-KILN OF BAḆAL ----
   "Come, let us make bricks and bake them thoroughly." The kiln of fired brick
   with the fire in its belly, the green bricks drying in rows on the ground, the
   clay and the straw and the mould, and the burnt bricks stacked to go. */
EARTH.workshop({ k:'brick-kiln', name:'the brick-kiln', w:12, d:10, floor:'path',
  build:(function(){ const b=[[-6,0,-5,-2,1,-1,'kilnSide'],
      [-6,1,-5,-5,2,-1,'kilnSide'],[-3,1,-5,-2,2,-1,'kilnSide'],[-5,1,-5,-3,2,-4,'kilnSide'],
      [-6,2,-5,-2,3,-1,'kilnSide'],[-5,3,-4,-3,4,-2,'kilnSide'],
      [2,0,-5,5,2,-3,'brick']];
    return b; })(),
  dress:(function(){ const d=[[-4.8,1.0,-3.8,-3.2,1.2,-1.4,'wool','wool',GLOW]];
    for(let r=0;r<4;r++) for(let c=0;c<7;c++){ const x=-5.6+c*0.95, z=0.4+r*1.05;
      d.push([x,0,z,x+0.7,0.28,z+0.45,'mudbrick','mudbrick']); }
    d.push([2.5,0,1.5,5,0.8,4,'dirt','dirt',[0.75,0.60,0.45]],[1.2,0,0.6,2.2,0.3,1.2,'planks','planks'],
      [4,0,-2,5.5,0.6,-0.5,'hayTop','haySide'],[0.5,0,-2,1.2,1.1,-1.3,'badSide','badTop']);
    return d; })(),
  fire:[[-4,1.05,-2.6]],
  hands:[{at:[1.6,2.4], face:[1.8,0.9], trade:'brickmaker', anim:'knead'},
         {at:[-4,0.0], face:[-4,-2], trade:'brickmaker', anim:'tend'}],
  says:['“Clay, straw and water, trodden together and pressed in the mould. A good man makes a thousand a day.”',
        '“Sun-dried for a house, kiln-burnt for a wall or a quay — the burnt brick will outlast us all.”'] });
})();
