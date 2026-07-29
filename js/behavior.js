/* ============================================================
   THE DAY'S WORK OF EVERY LIVING THING — one file, and it is the law
   ------------------------------------------------------------
   "The young lions roar after their prey, and seek their meat from God.
    The sun ariseth, they gather themselves together, and lay them down
    in their dens. Man goeth forth unto his work and to his labour
    until the evening."

   THE FAULT THIS FILE MENDS. Every beast had a TRADE (graze, hunt,
   forage) but no LIFE: it worked its one trade all day at one speed,
   stood stock-still the moment night fell wherever it happened to be
   standing, and did nothing else, ever. A zebra never rolled in the
   dust, an elephant never went down to the water, a meerkat never
   stood its watch, and at dusk the whole earth froze in place like a
   stopped clock.

   EVERY CREATURE NOW KEEPS ITS OWN HOURS, ITS OWN PACE, AND ITS OWN
   HABITS, written here in one table the engine obeys:

   day   — when it is up and about.
             'day'   up with the sun, bedded by night
             'night' the other way round (the owl, the badger, the cats
                     of the deep desert)
             'dusk'  crepuscular — it works the edges of the day and is
                     seldom caught quite still
             'all'   it keeps no hours at all (the lion, who sleeps
                     twenty hours and hunts whenever he pleases; the
                     elephant, who cannot afford to stop eating)
   walk  — its going-about pace, in world units a second
   run   — its flat-out pace: what it flees at, or charges at. These
           are in TRUE PROPORTION: a cheetah outruns a gazelle, a
           gazelle outruns a lion, a lion outruns a zebra over the
           short burst that is all he has.
   burst — a hunter's wind, in seconds: how long the charge can be
           held before he pulls up and lets the herd go. A cheetah is
           the fastest thing on the earth for twenty seconds and no
           more; a wolf can hold a chase for a long time.
   see   — how far a hunter marks his quarry.
   home  — where it lies up to sleep: 'den','burrow','tree','open',
           'water','rock','ice'. A beast with a home WALKS TO IT at
           dusk (or dawn, if it keeps the night); a beast of the open
           beds where its herd stands, which is what a herd is for.
   acts  — the small business of its day, drawn by weight whenever it
           has nothing better to do. The engine knows how to perform:
             graze  head down in the grass (the grazers do this by trade)
             browse head UP, feeding from the trees
             drink  down at the water, where a river runs by
             wallow down in the mud and rolling in it
             dust   the dust-bath: down on the back, legs up, rolling
             groom  the coat seen to, the head turned back along the flank
             alert  frozen upright, head high, reading the wind
             rear   up on the hind legs (the bear, the meerkat's watch)
             dig    the ground worked for roots and grubs
             bask   flat out in the sun, cold blood warming
             play   the tumble — otters, cubs, and everything young at heart
             gape   the jaws thrown wide — the hippo's yawn, the crocodile's
                    open-mouthed gape, the monitor's threat (needs a jaw)
             curl   rolled into a ball, the nose tucked under: the hedgehog
                    and the armadillo at a footfall
             sharpen the claws stropped, reared up against the bole of a tree
                    — the solitary cats, and no others
             earflap the great ears fanned against the heat (the elephant)
   gait  — 'hop' for the ones that bound instead of walk.
   climb — HOW BIG A STEP IT CAN TAKE, in blocks. Every beast on the earth
           used to take the same one — a block and two-thirds — so an
           elephant went up a crag stride for stride with a goat, and a
           brown bear walked to the top of a snowy alp. It is the beast's
           own now:
             0.5–0.7  the heavy and the low-slung — elephant, rhino,
                      hippo, buffalo, tortoise, crocodile. A kerb stops them.
             1.0      the common default: most beasts step up about a block
             1.4–1.7  the nimble — cats, wolves, deer, hares
             2.2–2.6  the SURE-FOOTED, and no others: the goat, the
                      chamois, the ibex-kin, the yak, the snow leopard,
                      the mule, the baboon. These are the only creatures
                      that may take a cliff, because they are the only
                      ones that take a cliff.

   ---- HOW TO CHANGE A CREATURE'S WAYS ----
   Change its line here. That is all. Anything not named keeps the old
   plain habits (walk 7, run 12, up by day, no small business).
   ============================================================ */
(function(){
'use strict';

const D={
/* ================= THE BEASTS OF THE FIELD ================= */
/* ---- cattle, flocks and the beasts of the household ---- */
cow:         {day:'day', walk:5,  run:13, home:'open', acts:[['graze',5],['drink',1],['groom',1]], climb:0.9},
ox:          {day:'day', walk:5,  run:12, home:'open', acts:[['graze',5],['drink',1],['wallow',1]], climb:0.9},
sheep:       {day:'day', walk:5,  run:14, home:'open', acts:[['graze',6],['drink',1]], climb:1.8},
goat:        {day:'day', walk:6,  run:15, home:'rock', acts:[['graze',4],['browse',3],['rear',1]], climb:2.6},
pig:         {day:'day', walk:5,  run:13, home:'open', acts:[['dig',3],['wallow',3],['graze',2]], climb:0.9},
chicken:     {day:'day', walk:4,  run:9,  home:'open', acts:[['dig',3],['dust',3],['graze',2]], climb:0.8},
horse:       {day:'day', walk:6,  run:22, home:'open', acts:[['graze',5],['dust',2],['drink',1],['groom',1]], climb:1.2},
donkey:      {day:'day', walk:5,  run:15, home:'open', acts:[['graze',5],['dust',2],['drink',1]], climb:1.8},
mule:        {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['dust',2],['drink',1],['alert',1]], climb:2.2},
dog:         {day:'day', walk:6,  run:17, home:'open', acts:[['dig',2],['play',3],['alert',2]], climb:1.4},
camel:       {day:'day', walk:5,  run:16, home:'open', acts:[['graze',4],['browse',2],['dust',2]], climb:0.9},
/* ---- the temperate field and wood ---- */
deer:        {day:'dusk',walk:5,  run:20, home:'open', acts:[['graze',4],['browse',2],['alert',3],['drink',1]], climb:1.5},
hare:        {day:'dusk',walk:4,  run:20, home:'open', gait:'hop', acts:[['graze',4],['alert',3],['groom',1]], climb:1.6},
boar:        {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',4],['wallow',2],['graze',2]], climb:1.2},
fox:         {day:'night',walk:5, run:17, home:'den',  acts:[['dig',2],['alert',2],['play',1],['groom',1]], climb:1.5},
badger:      {day:'night',walk:4, run:10, home:'den',  acts:[['dig',5],['graze',1]], climb:1.0},
hedgehog:    {day:'night',walk:2, run:4,  home:'den',  acts:[['dig',4],['graze',2],['curl',1]], climb:0.6},
lynx:        {day:'night',walk:5, run:18, see:70, burst:6,  home:'den',  acts:[['alert',3],['groom',2],['sharpen',1]], climb:1.7},
wolf:        {day:'dusk',walk:6,  run:18, see:95, burst:14, home:'den',  acts:[['alert',2],['play',1],['groom',1]], climb:1.5},
bison:       {day:'day', walk:5,  run:16, home:'open', acts:[['graze',6],['dust',2],['drink',1]], climb:0.9},
moose:       {day:'dusk',walk:5,  run:16, home:'open', acts:[['browse',4],['graze',2],['drink',2]], climb:1.0},
reindeer:    {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['dig',2],['alert',1]], climb:1.4},
chamois:     {day:'day', walk:5,  run:15, home:'rock', acts:[['graze',4],['alert',3]], climb:2.6},
lizard:      {day:'day', walk:3,  run:8,  home:'rock', acts:[['bask',6],['dig',1]], climb:1.2},
bear:        {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',3],['rear',2],['groom',1]], climb:1.3},
blackbear:   {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',3],['rear',2],['browse',1]], climb:1.3},
/* ---- the plain of the south ---- */
elephant:    {day:'all', walk:5,  run:14, home:'open', acts:[['browse',3],['graze',3],['wallow',2],['dust',2],['drink',2],['earflap',2]], climb:0.7},
giraffe:     {day:'day', walk:5,  run:16, home:'open', acts:[['browse',6],['alert',1],['drink',1]], climb:0.8},
zebra:       {day:'day', walk:5,  run:18, home:'open', acts:[['graze',5],['dust',2],['alert',2],['drink',1]], climb:1.2},
wildebeest:  {day:'day', walk:5,  run:18, home:'open', acts:[['graze',6],['alert',2],['drink',1]], climb:1.2},
gazelle:     {day:'day', walk:5,  run:24, home:'open', acts:[['graze',4],['alert',4],['drink',1]], climb:1.6},
oryx:        {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['alert',2]], climb:1.3},
buffalo:     {day:'day', walk:5,  run:16, home:'open', acts:[['graze',5],['wallow',3],['drink',1]], climb:0.8},
rhino:       {day:'dusk',walk:4,  run:15, home:'open', acts:[['graze',4],['wallow',3],['dust',1]], climb:0.6},
warthog:     {day:'day', walk:5,  run:14, home:'burrow', acts:[['dig',3],['graze',3],['wallow',2]], climb:0.9},
ostrich:     {day:'day', walk:6,  run:22, home:'open', acts:[['graze',3],['alert',3],['dust',2]], climb:1.0},
lion:        {day:'all', walk:5,  run:21, see:95, burst:7,  home:'open', acts:[['groom',2],['alert',2]], climb:1.5},
cheetah:     {day:'day', walk:5,  run:30, see:100,burst:5,  home:'open', acts:[['alert',3],['groom',2]], climb:1.5},
leopard:     {day:'night',walk:5, run:19, see:80, burst:6,  home:'tree', acts:[['alert',2],['groom',2],['sharpen',1]], climb:1.7},
hyena:       {day:'night',walk:5, run:17, see:90, burst:12, home:'den',  acts:[['alert',2],['dig',1]], climb:1.4},
jackal:      {day:'dusk',walk:5,  run:16, see:70, burst:9,  home:'den',  acts:[['alert',2],['dig',1]], climb:1.5},
baboon:      {day:'day', walk:5,  run:14, home:'rock', acts:[['dig',2],['groom',4],['alert',2],['play',2]], climb:2.3},
meerkat:     {day:'day', walk:4,  run:10, home:'burrow', acts:[['rear',5],['dig',3],['play',1]], climb:1.6},
hippo:       {day:'night',walk:4, run:13, home:'water', acts:[['wallow',4],['graze',3],['drink',1],['gape',2]], climb:0.5},
crocodile:   {day:'all', walk:2,  run:16, see:24, burst:3,  home:'water', acts:[['bask',6],['gape',3]], climb:0.5},
/* ---- the forests of the tropics ---- */
gorilla:     {day:'day', walk:4,  run:11, home:'den',  acts:[['graze',3],['groom',3],['rear',2],['browse',1]], climb:1.2},
chimpanzee:  {day:'day', walk:4,  run:12, home:'tree', acts:[['groom',4],['dig',1],['play',3],['browse',1]], climb:1.5},
okapi:       {day:'day', walk:4,  run:14, home:'open', acts:[['browse',5],['alert',2]], climb:1.0},
lemur:       {day:'day', walk:4,  run:11, home:'tree', acts:[['groom',3],['play',3],['bask',2]], climb:1.6},
orangutan:   {day:'day', walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]], climb:1.2},
macaque:     {day:'day', walk:4,  run:11, home:'tree', acts:[['groom',4],['play',3],['dig',1]], climb:1.6},
howler:      {day:'day', walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]], climb:1.4},
sloth:       {day:'all', walk:0.5,run:1,  home:'tree', acts:[['browse',3]], climb:0.5},
anteater:    {day:'dusk',walk:4,  run:10, home:'den',  acts:[['dig',6]], climb:0.7},
armadillo:   {day:'night',walk:3, run:9,  home:'burrow', acts:[['dig',5],['curl',1]], climb:0.7},
tapir:       {day:'night',walk:4, run:13, home:'open', acts:[['browse',3],['wallow',2],['drink',2]], climb:0.8},
jaguar:      {day:'night',walk:5, run:19, see:80, burst:6, home:'tree', acts:[['alert',2],['groom',2],['sharpen',1]], climb:1.6},
capybara:    {day:'dusk',walk:4,  run:12, home:'water', acts:[['graze',4],['wallow',3],['drink',1]], climb:0.7},
peacock:     {day:'day', walk:4,  run:9,  home:'tree', acts:[['graze',3],['alert',2],['dust',2]], climb:0.9},
komodo:      {day:'day', walk:3,  run:12, see:40, burst:4, home:'burrow', acts:[['bask',5],['alert',1],['gape',2]], climb:0.7},
/* ---- the east and the high country of Asia ---- */
tiger:       {day:'night',walk:5, run:20, see:90, burst:7, home:'den',  acts:[['alert',2],['groom',2],['drink',1],['sharpen',1]], climb:1.6},
panda:       {day:'all', walk:3,  run:9,  home:'den',  acts:[['graze',6],['rear',1],['play',1]], climb:1.1},
redpanda:    {day:'dusk',walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]], climb:1.5},
snowleopard: {day:'dusk',walk:5,  run:19, see:85, burst:6, home:'rock', acts:[['alert',3],['groom',2],['sharpen',1]], climb:2.4},
yak:         {day:'day', walk:4,  run:13, home:'open', acts:[['graze',6],['dust',1]], climb:2.2},
saiga:       {day:'day', walk:5,  run:19, home:'open', acts:[['graze',5],['alert',2]], climb:1.4},
waterbuffalo:{day:'day', walk:4,  run:14, home:'water', acts:[['graze',4],['wallow',4],['drink',1]], climb:0.8},
/* ---- the new world ---- */
cougar:      {day:'dusk',walk:5,  run:20, see:85, burst:6, home:'rock', acts:[['alert',3],['groom',2],['sharpen',1]], climb:1.7},
coyote:      {day:'dusk',walk:5,  run:17, see:80, burst:10, home:'den', acts:[['alert',2],['dig',1]], climb:1.5},
pronghorn:   {day:'day', walk:5,  run:26, home:'open', acts:[['graze',5],['alert',3]], climb:1.5},
llama:       {day:'day', walk:5,  run:14, home:'open', acts:[['graze',5],['alert',2],['dust',1]], climb:1.9},
alpaca:      {day:'day', walk:4,  run:12, home:'open', acts:[['graze',6],['dust',1]], climb:1.8},
raccoon:     {day:'night',walk:4, run:11, home:'tree', acts:[['dig',4],['groom',2],['play',1]], climb:1.5},
skunk:       {day:'night',walk:3, run:8,  home:'den',  acts:[['dig',5]], climb:0.9},
/* ---- the great south land ---- */
kangaroo:    {day:'dusk',walk:4,  run:22, home:'open', gait:'hop', acts:[['graze',4],['alert',2],['groom',1]], climb:1.5},
emu:         {day:'day', walk:5,  run:19, home:'open', acts:[['graze',4],['alert',2],['dust',2]], climb:1.0},
koala:       {day:'night',walk:1, run:3,  home:'tree', acts:[['browse',4]], climb:0.6},
wombat:      {day:'night',walk:3, run:12, home:'burrow', acts:[['dig',5],['graze',2]], climb:0.8},
dingo:       {day:'dusk',walk:5,  run:17, see:85, burst:10, home:'den', acts:[['alert',2],['dig',1]], climb:1.5},
cassowary:   {day:'day', walk:4,  run:18, home:'open', acts:[['graze',3],['alert',3]], climb:1.0},
kiwi:        {day:'night',walk:3, run:7,  home:'burrow', acts:[['dig',6]], climb:0.7},
tasdevil:    {day:'night',walk:4, run:11, home:'den',  acts:[['dig',3],['alert',2]], climb:1.0},
/* ---- the cold and the ice ---- */
polarbear:   {day:'all', walk:5,  run:16, see:90, burst:8, home:'ice',  acts:[['alert',3],['dig',1],['groom',1]], climb:1.3},
arcticfox:   {day:'all', walk:5,  run:15, home:'den',  acts:[['dig',3],['alert',3],['play',1]], climb:1.5},
muskox:      {day:'day', walk:4,  run:13, home:'open', acts:[['graze',5],['dig',2],['alert',1]], climb:1.3},
penguin:     {day:'day', walk:2,  run:5,  home:'ice',  acts:[['alert',3],['groom',3],['play',1]], climb:0.5},
mammoth:     {day:'all', walk:4,  run:12, home:'open', acts:[['graze',4],['dig',2],['dust',1]], climb:0.7},
arcticwolf:  {day:'all', walk:6,  run:18, see:95, burst:14, home:'den', acts:[['alert',2],['play',1]], climb:1.5},
wolverine:   {day:'all', walk:5,  run:13, home:'den',  acts:[['dig',4],['alert',2]], climb:1.6},
arctichare:  {day:'dusk',walk:4,  run:18, home:'open', gait:'hop', acts:[['graze',4],['alert',3]], climb:1.6},
ermine:      {day:'all', walk:4,  run:12, home:'den',  acts:[['alert',4],['dig',2]], climb:1.4},
lemming:     {day:'all', walk:3,  run:7,  home:'burrow', acts:[['graze',4],['dig',3]], climb:0.8},
ptarmigan:   {day:'day', walk:3,  run:7,  home:'open', acts:[['graze',4],['dig',2],['dust',1]], climb:0.8},
/* ---- the waste ---- */
wildass:     {day:'day', walk:5,  run:19, home:'open', acts:[['graze',5],['dust',2],['alert',1]], climb:1.6},
addax:       {day:'dusk',walk:4,  run:16, home:'open', acts:[['graze',5],['dig',1]], climb:1.3},
blackbuck:   {day:'day', walk:5,  run:22, home:'open', acts:[['graze',5],['alert',3]], climb:1.6},
caracal:     {day:'night',walk:5, run:20, see:75, burst:5, home:'den', acts:[['alert',3],['groom',2],['sharpen',1]], climb:1.7},
bustard:     {day:'day', walk:4,  run:12, home:'open', acts:[['graze',3],['alert',3],['dust',1]], climb:0.9},
jerboa:      {day:'night',walk:3, run:12, home:'burrow', gait:'hop', acts:[['dig',4],['graze',2]], climb:1.2},
viper:       {day:'night',walk:1, run:5,  home:'rock', acts:[['bask',5]], climb:0.5},
scorpion:    {day:'night',walk:2, run:5,  home:'rock', acts:[['dig',3],['alert',2]], climb:0.5},
/* ---- the running water ---- */
otter:       {day:'day', walk:4,  run:12, home:'den',  acts:[['play',5],['dig',1],['groom',2]], climb:0.9},
beaver:      {day:'night',walk:3, run:8,  home:'water', acts:[['dig',4],['drink',1]], climb:0.7},
platypus:    {day:'dusk',walk:2,  run:6,  home:'water', acts:[['dig',4]], climb:0.6},
};

/* ================= THE FOWL OF THE AIR =================
   Where each bird takes its rest, what it hunts, and when. The engine's
   air-life reads this to give every bird its real day: the owl works
   the night and sleeps it off in a tree; the puffin fishes the sea and
   sleeps at its burrow in the turf; the gull will not go far from
   water; the dove is on the ground as much as off it.

   perch  — where it sits at rest: 'tree', 'ground', 'flower'.
   night  — what it does in the dark: 'roost' (sleeps), 'hunt' (the owl,
            which works the dark), or 'sit' (the butterfly, folded on a stem).
   fish   — true if it takes its living from the water. The engine reads this
            now (it used to name the gull and eagle by hand), so a fishing
            bird is made a fisher by its line here and nowhere else.
   flock  — true if it gathers with its own kind: the crow's rookery, the
            dove's flight, the gull's wheeling raft. Such birds draw toward
            one another at rest instead of each sitting alone.
   soar   — true if it rides the wind on a set wing rather than flapping: the
            eagle on its thermal, the gull on the sea-breeze. */
const BIRDS={
crow:   {perch:'tree',   night:'roost', fish:false, flock:true },
dove:   {perch:'tree',   night:'roost', fish:false, flock:true },
gull:   {perch:'ground', night:'roost', fish:true,  flock:true, soar:true },
eagle:  {perch:'tree',   night:'roost', fish:false, flock:false,soar:true },
owl:    {perch:'tree',   night:'hunt',  fish:false, flock:false},   /* the one that WORKS the dark */
puffin: {perch:'ground', night:'roost', fish:true,  flock:true },
butterfly:{perch:'flower',night:'sit',  fish:false, flock:false},
};

/* ================= THE FISH OF THE SEA, AND THEIR WORK =================
   "So is this great and wide sea, wherein are things creeping innumerable,
    both small and great beasts. There go the ships: there is that leviathan,
    whom thou hast made to play therein."

   THE FAULT THIS TABLE MENDS. Every nation of the sea swam the one way — a
   flat wander at one speed, at one depth, by day and by night alike. A whale
   never came up to blow, a seal never lay logging at the top, an octopus
   never went to ground in its hole, and the deep-water shoals never rose in
   the dark to feed and sank again at dawn. Now each keeps its own hours, its
   own water, its own pace, and its own habits — written here, and the sea-life
   engine obeys.

   day    — when it is abroad and quick: 'day', 'night', 'dusk', or 'all'.
            Off its hours it does not stop (nothing stops in the sea) but goes
            slow and quiet.
   swim   — its cruising pace, world units a second.
   fast   — its burst: the flight, or the strike.
   deep   — the water it keeps to (a label, for the reader; the engine already
            sinks each nation to its own depth): reef, shelf, open, pelagic,
            abyss, ice, bed, river.
   school — true if it holds with its own kind.
   air    — true if it MUST come up to breathe: every whale, dolphin, seal and
            turtle. These rise to the surface on their own clock and go down
            again, which is the plainest sign of life the open sea can show.
   home   — where it rests or shelters: reef, bed, kelp/weed, ice, cave, open,
            river.
   acts   — the small business of its life, drawn by weight. The engine renders
            what it can as real motion — the dive (sound), the rise to breathe
            (surface), the hang at the top (logging/bask), the going-to-ground
            (bottom/den) — and keeps the rest as a stable key for sound and
            animation, exactly as the land's acts are.

   To put a new fish in the sea: add its creature file, add a line here. */
const SEA={
/* ---- the great breathing beasts: whale, dolphin, and their kin ---- */
whale:        {day:'all',  swim:5, fast:11, deep:'open',    school:true,  air:true,  home:'open', acts:[['sound',4],['surface',3],['breach',1],['spyhop',1]]},
orca:         {day:'all',  swim:7, fast:16, deep:'open',    school:true,  air:true,  home:'open', acts:[['hunt',3],['surface',3],['spyhop',2],['breach',1]]},
dolphin:      {day:'day',  swim:8, fast:18, deep:'shelf',   school:true,  air:true,  home:'open', acts:[['surface',3],['play',2],['breach',2],['hunt',1]]},
riverdolphin: {day:'day',  swim:5, fast:11, deep:'river',   school:false, air:true,  home:'river',acts:[['surface',3],['probe',2],['roll',1]]},
narwhal:      {day:'all',  swim:5, fast:12, deep:'ice',     school:true,  air:true,  home:'ice',  acts:[['sound',3],['surface',3],['tusk',1]]},
beluga:       {day:'all',  swim:5, fast:12, deep:'ice',     school:true,  air:true,  home:'ice',  acts:[['surface',3],['sound',2],['song',2]]},
seal:         {day:'day',  swim:7, fast:16, deep:'shelf',   school:false, air:true,  home:'ice',  acts:[['surface',3],['logging',3],['hunt',2],['bask',1]]},
walrus:       {day:'day',  swim:4, fast:9,  deep:'shelf',   school:true,  air:true,  home:'ice',  acts:[['surface',3],['bottom',3],['logging',2]]},
manatee:      {day:'day',  swim:3, fast:7,  deep:'shelf',   school:false, air:true,  home:'weed', acts:[['graze',5],['surface',3],['logging',2]]},
turtle:       {day:'day',  swim:4, fast:10, deep:'reef',    school:false, air:true,  home:'reef', acts:[['graze',3],['surface',3],['clean',1],['logging',1]]},
/* ---- the hunters and the great fish of the open water ---- */
greenlandshark:{day:'all', swim:2, fast:4,  deep:'abyss',   school:false, air:false, home:'bed',  acts:[['sound',4],['logging',3],['scavenge',1]]},
shark:        {day:'all',  swim:6, fast:20, deep:'open',    school:false, air:false, home:'open', acts:[['hunt',4],['patrol',3],['clean',1]]},
hammerhead:   {day:'dusk', swim:6, fast:18, deep:'open',    school:true,  air:false, home:'open', acts:[['hunt',3],['school',3],['patrol',2]]},
whaleshark:   {day:'day',  swim:3, fast:7,  deep:'open',    school:false, air:false, home:'open', acts:[['filter',5],['bask',2],['sound',1]]},
tuna:         {day:'day',  swim:12,fast:30, deep:'pelagic', school:true,  air:false, home:'open', acts:[['school',4],['hunt',2],['patrol',2]]},
swordfish:    {day:'dusk', swim:8, fast:22, deep:'pelagic', school:false, air:false, home:'open', acts:[['sound',3],['hunt',3],['patrol',2]]},
barracuda:    {day:'day',  swim:6, fast:20, deep:'reef',    school:true,  air:false, home:'reef', acts:[['logging',4],['hunt',3],['school',1]]},
/* ---- the schooling nations ---- */
sardine:      {day:'night',swim:9, fast:17, deep:'shelf',   school:true,  air:false, home:'open', acts:[['school',5],['bait',3],['flash',1]]},
mackerel:     {day:'night',swim:11,fast:21, deep:'shelf',   school:true,  air:false, home:'open', acts:[['school',5],['patrol',2]]},
cod:          {day:'day',  swim:5, fast:9,  deep:'bed',     school:true,  air:false, home:'bed',  acts:[['bottom',4],['forage',3]]},
/* ---- the bed and the reef ---- */
ray:          {day:'day',  swim:3, fast:8,  deep:'bed',     school:false, air:false, home:'bed',  acts:[['bottom',4],['glide',3],['bury',2]]},
octopus:      {day:'night',swim:2, fast:9,  deep:'reef',    school:false, air:false, home:'cave', acts:[['den',4],['crawl',3],['jet',1],['ink',1]]},
squid:        {day:'night',swim:5, fast:14, deep:'deep',    school:true,  air:false, home:'open', acts:[['hover',3],['jet',3],['school',2]]},
jelly:        {day:'all',  swim:1, fast:2,  deep:'deep',    school:false, air:false, home:'open', acts:[['pulse',5],['drift',4]]},
crab:         {day:'night',swim:1, fast:3,  deep:'bed',     school:false, air:false, home:'bed',  acts:[['bottom',4],['bury',2],['forage',2]]},
puffer:       {day:'day',  swim:2, fast:6,  deep:'reef',    school:false, air:false, home:'reef', acts:[['forage',4],['puff',1],['logging',1]]},
anglerfish:   {day:'all',  swim:1, fast:5,  deep:'abyss',   school:false, air:false, home:'open', acts:[['lure',6],['hover',3]]},
fish:         {day:'day',  swim:4, fast:9,  deep:'reef',    school:true,  air:false, home:'reef', acts:[['graze',3],['school',3],['clean',1]]},
/* ---- the fish of the rivers, that never see the sea ---- */
salmon:       {day:'day',  swim:6, fast:19, deep:'river',   school:true,  air:false, home:'river',acts:[['run',4],['leap',2],['hold',2]]},
trout:        {day:'dusk', swim:5, fast:12, deep:'river',   school:false, air:false, home:'river',acts:[['hold',4],['rise',2],['dart',1]]},
arcticchar:   {day:'day',  swim:5, fast:12, deep:'river',   school:true,  air:false, home:'river',acts:[['hold',3],['school',2]]},
sturgeon:     {day:'night',swim:3, fast:8,  deep:'river',   school:false, air:false, home:'bed',  acts:[['bottom',5],['probe',2]]},
catfish:      {day:'night',swim:2, fast:6,  deep:'river',   school:false, air:false, home:'bed',  acts:[['bottom',5],['probe',3]]},
piranha:      {day:'day',  swim:5, fast:16, deep:'river',   school:true,  air:false, home:'river',acts:[['school',4],['hunt',3]]},
};

/* ================= THE GRASS, THE HERB, AND THE BEARING TREE =================
   "And God said, Let the earth bring forth grass, the herb yielding seed, and
    the fruit tree yielding fruit after his kind: and it was so."

   The beasts have their day's work; the green things have a slower one, and it
   is written here by FORM (the shapes in js/flora.js), because a poplar and a
   reed behave alike whatever their names, and a baobab and a cactus alike.

   The land's flora is built once into the ground and does not walk, so most of
   this is the CATALOGUE — the law of what each form does, kept as the land
   beasts' acts are kept, against the day the ground is re-meshed by season.
   What CAN move already (the sea's kelp and seagrass) is driven live by the
   engine from the 'things' below.

   sway  — how freely it moves on the wind, 0 (the baobab, immovable) to 1
           (the reed, never still).
   fold  — true if its leaf or flower closes in the dark (nyctinasty): the
           acacia, the flowering herb.
   bear  — what it puts forth in its season: fruit, blossom, cone, berry,
           spore, flower, or none.
   grow  — its habit of growth: phototropic (turns to the sun), succulent
           (stores water against the drought), stilt (walks into the sea on
           its roots), fire (needs the burn), and so on. */
const FLORA={
broad:   {sway:0.5, fold:false, bear:'fruit',   grow:'phototropic', acts:[['sway',4],['fruit',2],['leaf-fall',1]]},
round:   {sway:0.5, fold:false, bear:'fruit',   grow:'phototropic', acts:[['sway',4],['fruit',2]]},
conifer: {sway:0.3, fold:false, bear:'cone',    grow:'evergreen',   acts:[['sway',3],['cone',2]]},
column:  {sway:0.7, fold:false, bear:'none',    grow:'phototropic', acts:[['sway',5]]},
palm:    {sway:0.8, fold:false, bear:'fruit',   grow:'phototropic', acts:[['sway',5],['fruit',2]]},
thorn:   {sway:0.4, fold:true,  bear:'blossom', grow:'drought',     acts:[['sway',3],['fold',2],['blossom',1]]},
blossom: {sway:0.5, fold:false, bear:'blossom', grow:'deciduous',   acts:[['blossom',4],['sway',3],['petal-fall',2]]},
bamboo:  {sway:0.9, fold:false, bear:'none',    grow:'fast',        acts:[['sway',6]]},
cactus:  {sway:0.1, fold:false, bear:'fruit',   grow:'succulent',   acts:[['store',4],['flower',1],['fruit',1]]},
baobab:  {sway:0.1, fold:false, bear:'fruit',   grow:'succulent',   acts:[['store',4],['fruit',1]]},
banana:  {sway:0.9, fold:false, bear:'fruit',   grow:'fast',        acts:[['sway',5],['fruit',3]]},
mangrove:{sway:0.3, fold:false, bear:'none',    grow:'stilt',       acts:[['sway',2],['breathe-root',3],['trap-silt',2]]},
fern:    {sway:0.6, fold:false, bear:'spore',   grow:'shade',       acts:[['sway',4],['sporulate',2]]},
gum:     {sway:0.6, fold:false, bear:'none',    grow:'fire',        acts:[['sway',4],['shed-bark',2],['scent',1]]},
spread:  {sway:0.3, fold:false, bear:'fruit',   grow:'buttress',    acts:[['sway',3],['drop-root',2],['fruit',1]]},
darkoak: {sway:0.4, fold:false, bear:'fruit',   grow:'phototropic', acts:[['sway',3],['fruit',2]]},
jungle:  {sway:0.5, fold:false, bear:'fruit',   grow:'reach-light', acts:[['sway',4],['reach',2],['fruit',1]]},
shrub:   {sway:0.7, fold:false, bear:'berry',   grow:'thicket',     acts:[['sway',5],['berry',2]]},
herb:    {sway:0.9, fold:true,  bear:'flower',  grow:'annual',      acts:[['sway',6],['flower',3],['fold',2],['seed',1]]},
cane:    {sway:1.0, fold:false, bear:'none',    grow:'reed',        acts:[['sway',7]]},
pad:     {sway:0.2, fold:false, bear:'fruit',   grow:'succulent',   acts:[['store',3],['flower',1],['fruit',1]]},
rosette: {sway:0.2, fold:false, bear:'flower',  grow:'succulent',   acts:[['store',3],['bolt',1]]},
};

/* ================= THE THINGS THAT ARE NOT ALIVE, AND YET MOVE =================
   The sea's weed, the tide, the current, the light in the deep. Not beasts and
   not plants, but the game's living furniture — and each has a way of moving.
   The engine drives the two that stand in the water (kelp, seagrass) live from
   here; the rest is the catalogue, in the same spirit as the behaviour kit.

   move — how it goes: current (leans and streams with the flow), rise-fall
          (the tide), drift, sink, flash, slant, rise, spread, gust.
   day  — when it is at its strongest: day, night, all, or 'moon' (the tide,
          which keeps the moon's clock, not the sun's). */
const THINGS={
kelp:       {move:'current',  day:'all',  acts:[['sway',6],['stream',3]]},
seagrass:   {move:'current',  day:'all',  acts:[['sway',6],['stream',2]]},
coral:      {move:'none',     day:'all',  acts:[['polyp-feed',4],['biolum',2],['bleach',1]]},
tide:       {move:'rise-fall',day:'moon', acts:[['flood',4],['ebb',4]]},
current:    {move:'drift',    day:'all',  acts:[['drift',6],['upwell',2]]},
marine_snow:{move:'sink',     day:'all',  acts:[['fall',6]]},
biolum:     {move:'flash',    day:'night',acts:[['glow',5],['burst',2]]},
godray:     {move:'slant',    day:'day',  acts:[['shaft',5]]},
bubble:     {move:'rise',     day:'all',  acts:[['rise',6]]},
wildfire:   {move:'spread',   day:'all',  acts:[['spread',5],['smoulder',2]]},
storm:      {move:'gust',     day:'all',  acts:[['gust',5],['surge',2]]},
};

window.BEHAVIOR={
  D, BIRDS,
  of:name=>D[name]||null,
  birdOf:name=>BIRDS[name]||null,
  /* the engine asks these with a fallback already in hand */
  walkOf:(name,fb)=>{ const b=D[name]; return (b&&b.walk)||fb; },
  runOf:(name,fb)=>{ const b=D[name]; return (b&&b.run)||fb; },
  dayOf:name=>{ const b=D[name]; return (b&&b.day)||'day'; },
  homeOf:name=>{ const b=D[name]; return (b&&b.home)||'open'; },
  gaitOf:name=>{ const b=D[name]; return (b&&b.gait)||'walk'; },
  /* how big a step this beast can take, in blocks — a goat's cliff or an
     elephant's kerb. Anything unnamed steps a plain block. */
  climbOf:name=>{ const b=D[name]; return (b&&b.climb)||1.0; },
  seeOf:(name,fb)=>{ const b=D[name]; return (b&&b.see)||fb; },
  burstOf:(name,fb)=>{ const b=D[name]; return (b&&b.burst)||fb; },
  /* draw one piece of the day's small business, by weight */
  drawAct:(name,r)=>{ const b=D[name]; if(!b||!b.acts||!b.acts.length) return null;
    let w=0; for(const a of b.acts) w+=a[1];
    let x=r*w; for(const a of b.acts){ x-=a[1]; if(x<=0) return a[0]; }
    return b.acts[b.acts.length-1][0]; },
  /* ---- and the same, for the fish of the sea ---- */
  SEA,
  seaOf:name=>SEA[name]||null,
  swimOf:(name,fb)=>{ const b=SEA[name]; return (b&&b.swim)||fb; },
  seaFastOf:(name,fb)=>{ const b=SEA[name]; return (b&&b.fast)||fb; },
  seaDayOf:name=>{ const b=SEA[name]; return (b&&b.day)||'day'; },
  seaAirOf:name=>{ const b=SEA[name]; return !!(b&&b.air); },
  seaSchoolOf:name=>{ const b=SEA[name]; return !!(b&&b.school); },
  seaHomeOf:name=>{ const b=SEA[name]; return (b&&b.home)||'open'; },
  drawSeaAct:(name,r)=>{ const b=SEA[name]; if(!b||!b.acts||!b.acts.length) return null;
    let w=0; for(const a of b.acts) w+=a[1];
    let x=r*w; for(const a of b.acts){ x-=a[1]; if(x<=0) return a[0]; }
    return b.acts[b.acts.length-1][0]; },
  /* ---- the green things, by form, and the living furniture of the world ---- */
  FLORA, THINGS,
  floraOf:form=>FLORA[form]||null,
  swayOf:(form,fb)=>{ const f=FLORA[form]; return f?f.sway:(fb===undefined?0.5:fb); },
  foldsOf:form=>{ const f=FLORA[form]; return !!(f&&f.fold); },
  thingOf:name=>THINGS[name]||null,
};
})();
