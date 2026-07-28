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
   gait  — 'hop' for the ones that bound instead of walk.

   ---- HOW TO CHANGE A CREATURE'S WAYS ----
   Change its line here. That is all. Anything not named keeps the old
   plain habits (walk 7, run 12, up by day, no small business).
   ============================================================ */
(function(){
'use strict';

const D={
/* ================= THE BEASTS OF THE FIELD ================= */
/* ---- cattle, flocks and the beasts of the household ---- */
cow:         {day:'day', walk:5,  run:13, home:'open', acts:[['graze',5],['drink',1],['groom',1]]},
ox:          {day:'day', walk:5,  run:12, home:'open', acts:[['graze',5],['drink',1],['wallow',1]]},
sheep:       {day:'day', walk:5,  run:14, home:'open', acts:[['graze',6],['drink',1]]},
goat:        {day:'day', walk:6,  run:15, home:'rock', acts:[['graze',4],['browse',3],['rear',1]]},
pig:         {day:'day', walk:5,  run:13, home:'open', acts:[['dig',3],['wallow',3],['graze',2]]},
chicken:     {day:'day', walk:4,  run:9,  home:'open', acts:[['dig',3],['dust',3],['graze',2]]},
horse:       {day:'day', walk:6,  run:22, home:'open', acts:[['graze',5],['dust',2],['drink',1],['groom',1]]},
donkey:      {day:'day', walk:5,  run:15, home:'open', acts:[['graze',5],['dust',2],['drink',1]]},
mule:        {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['dust',2],['drink',1],['alert',1]]},
dog:         {day:'day', walk:6,  run:17, home:'open', acts:[['dig',2],['play',3],['alert',2]]},
camel:       {day:'day', walk:5,  run:16, home:'open', acts:[['graze',4],['browse',2],['dust',2]]},
/* ---- the temperate field and wood ---- */
deer:        {day:'dusk',walk:5,  run:20, home:'open', acts:[['graze',4],['browse',2],['alert',3],['drink',1]]},
hare:        {day:'dusk',walk:4,  run:20, home:'open', gait:'hop', acts:[['graze',4],['alert',3],['groom',1]]},
boar:        {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',4],['wallow',2],['graze',2]]},
fox:         {day:'night',walk:5, run:17, home:'den',  acts:[['dig',2],['alert',2],['play',1],['groom',1]]},
badger:      {day:'night',walk:4, run:10, home:'den',  acts:[['dig',5],['graze',1]]},
hedgehog:    {day:'night',walk:2, run:4,  home:'den',  acts:[['dig',4],['graze',2]]},
lynx:        {day:'night',walk:5, run:18, see:70, burst:6,  home:'den',  acts:[['alert',3],['groom',2]]},
wolf:        {day:'dusk',walk:6,  run:18, see:95, burst:14, home:'den',  acts:[['alert',2],['play',1],['groom',1]]},
bison:       {day:'day', walk:5,  run:16, home:'open', acts:[['graze',6],['dust',2],['drink',1]]},
moose:       {day:'dusk',walk:5,  run:16, home:'open', acts:[['browse',4],['graze',2],['drink',2]]},
reindeer:    {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['dig',2],['alert',1]]},
chamois:     {day:'day', walk:5,  run:15, home:'rock', acts:[['graze',4],['alert',3]]},
lizard:      {day:'day', walk:3,  run:8,  home:'rock', acts:[['bask',6],['dig',1]]},
bear:        {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',3],['rear',2],['groom',1]]},
blackbear:   {day:'dusk',walk:5,  run:14, home:'den',  acts:[['dig',3],['rear',2],['browse',1]]},
/* ---- the plain of the south ---- */
elephant:    {day:'all', walk:5,  run:14, home:'open', acts:[['browse',3],['graze',3],['wallow',2],['dust',2],['drink',2]]},
giraffe:     {day:'day', walk:5,  run:16, home:'open', acts:[['browse',6],['alert',1],['drink',1]]},
zebra:       {day:'day', walk:5,  run:18, home:'open', acts:[['graze',5],['dust',2],['alert',2],['drink',1]]},
wildebeest:  {day:'day', walk:5,  run:18, home:'open', acts:[['graze',6],['alert',2],['drink',1]]},
gazelle:     {day:'day', walk:5,  run:24, home:'open', acts:[['graze',4],['alert',4],['drink',1]]},
oryx:        {day:'day', walk:5,  run:17, home:'open', acts:[['graze',5],['alert',2]]},
buffalo:     {day:'day', walk:5,  run:16, home:'open', acts:[['graze',5],['wallow',3],['drink',1]]},
rhino:       {day:'dusk',walk:4,  run:15, home:'open', acts:[['graze',4],['wallow',3],['dust',1]]},
warthog:     {day:'day', walk:5,  run:14, home:'burrow', acts:[['dig',3],['graze',3],['wallow',2]]},
ostrich:     {day:'day', walk:6,  run:22, home:'open', acts:[['graze',3],['alert',3],['dust',2]]},
lion:        {day:'all', walk:5,  run:21, see:95, burst:7,  home:'open', acts:[['groom',2],['alert',2]]},
cheetah:     {day:'day', walk:5,  run:30, see:100,burst:5,  home:'open', acts:[['alert',3],['groom',2]]},
leopard:     {day:'night',walk:5, run:19, see:80, burst:6,  home:'tree', acts:[['alert',2],['groom',2]]},
hyena:       {day:'night',walk:5, run:17, see:90, burst:12, home:'den',  acts:[['alert',2],['dig',1]]},
jackal:      {day:'dusk',walk:5,  run:16, see:70, burst:9,  home:'den',  acts:[['alert',2],['dig',1]]},
baboon:      {day:'day', walk:5,  run:14, home:'rock', acts:[['dig',2],['groom',4],['alert',2],['play',2]]},
meerkat:     {day:'day', walk:4,  run:10, home:'burrow', acts:[['rear',5],['dig',3],['play',1]]},
hippo:       {day:'night',walk:4, run:13, home:'water', acts:[['wallow',4],['graze',3],['drink',1]]},
crocodile:   {day:'all', walk:2,  run:16, see:24, burst:3,  home:'water', acts:[['bask',6]]},
/* ---- the forests of the tropics ---- */
gorilla:     {day:'day', walk:4,  run:11, home:'den',  acts:[['graze',3],['groom',3],['rear',2],['browse',1]]},
chimpanzee:  {day:'day', walk:4,  run:12, home:'tree', acts:[['groom',4],['dig',1],['play',3],['browse',1]]},
okapi:       {day:'day', walk:4,  run:14, home:'open', acts:[['browse',5],['alert',2]]},
lemur:       {day:'day', walk:4,  run:11, home:'tree', acts:[['groom',3],['play',3],['bask',2]]},
orangutan:   {day:'day', walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]]},
macaque:     {day:'day', walk:4,  run:11, home:'tree', acts:[['groom',4],['play',3],['dig',1]]},
howler:      {day:'day', walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]]},
sloth:       {day:'all', walk:0.5,run:1,  home:'tree', acts:[['browse',3]]},
anteater:    {day:'dusk',walk:4,  run:10, home:'den',  acts:[['dig',6]]},
armadillo:   {day:'night',walk:3, run:9,  home:'burrow', acts:[['dig',5]]},
tapir:       {day:'night',walk:4, run:13, home:'open', acts:[['browse',3],['wallow',2],['drink',2]]},
jaguar:      {day:'night',walk:5, run:19, see:80, burst:6, home:'tree', acts:[['alert',2],['groom',2]]},
capybara:    {day:'dusk',walk:4,  run:12, home:'water', acts:[['graze',4],['wallow',3],['drink',1]]},
peacock:     {day:'day', walk:4,  run:9,  home:'tree', acts:[['graze',3],['alert',2],['dust',2]]},
komodo:      {day:'day', walk:3,  run:12, see:40, burst:4, home:'burrow', acts:[['bask',5],['alert',1]]},
/* ---- the east and the high country of Asia ---- */
tiger:       {day:'night',walk:5, run:20, see:90, burst:7, home:'den',  acts:[['alert',2],['groom',2],['drink',1]]},
panda:       {day:'all', walk:3,  run:9,  home:'den',  acts:[['graze',6],['rear',1],['play',1]]},
redpanda:    {day:'dusk',walk:3,  run:8,  home:'tree', acts:[['browse',4],['groom',2]]},
snowleopard: {day:'dusk',walk:5,  run:19, see:85, burst:6, home:'rock', acts:[['alert',3],['groom',2]]},
yak:         {day:'day', walk:4,  run:13, home:'open', acts:[['graze',6],['dust',1]]},
saiga:       {day:'day', walk:5,  run:19, home:'open', acts:[['graze',5],['alert',2]]},
waterbuffalo:{day:'day', walk:4,  run:14, home:'water', acts:[['graze',4],['wallow',4],['drink',1]]},
/* ---- the new world ---- */
cougar:      {day:'dusk',walk:5,  run:20, see:85, burst:6, home:'rock', acts:[['alert',3],['groom',2]]},
coyote:      {day:'dusk',walk:5,  run:17, see:80, burst:10, home:'den', acts:[['alert',2],['dig',1]]},
pronghorn:   {day:'day', walk:5,  run:26, home:'open', acts:[['graze',5],['alert',3]]},
llama:       {day:'day', walk:5,  run:14, home:'open', acts:[['graze',5],['alert',2],['dust',1]]},
alpaca:      {day:'day', walk:4,  run:12, home:'open', acts:[['graze',6],['dust',1]]},
raccoon:     {day:'night',walk:4, run:11, home:'tree', acts:[['dig',4],['groom',2],['play',1]]},
skunk:       {day:'night',walk:3, run:8,  home:'den',  acts:[['dig',5]]},
/* ---- the great south land ---- */
kangaroo:    {day:'dusk',walk:4,  run:22, home:'open', gait:'hop', acts:[['graze',4],['alert',2],['groom',1]]},
emu:         {day:'day', walk:5,  run:19, home:'open', acts:[['graze',4],['alert',2],['dust',2]]},
koala:       {day:'night',walk:1, run:3,  home:'tree', acts:[['browse',4]]},
wombat:      {day:'night',walk:3, run:12, home:'burrow', acts:[['dig',5],['graze',2]]},
dingo:       {day:'dusk',walk:5,  run:17, see:85, burst:10, home:'den', acts:[['alert',2],['dig',1]]},
cassowary:   {day:'day', walk:4,  run:18, home:'open', acts:[['graze',3],['alert',3]]},
kiwi:        {day:'night',walk:3, run:7,  home:'burrow', acts:[['dig',6]]},
tasdevil:    {day:'night',walk:4, run:11, home:'den',  acts:[['dig',3],['alert',2]]},
/* ---- the cold and the ice ---- */
polarbear:   {day:'all', walk:5,  run:16, see:90, burst:8, home:'ice',  acts:[['alert',3],['dig',1],['groom',1]]},
arcticfox:   {day:'all', walk:5,  run:15, home:'den',  acts:[['dig',3],['alert',3],['play',1]]},
muskox:      {day:'day', walk:4,  run:13, home:'open', acts:[['graze',5],['dig',2],['alert',1]]},
penguin:     {day:'day', walk:2,  run:5,  home:'ice',  acts:[['alert',3],['groom',3],['play',1]]},
mammoth:     {day:'all', walk:4,  run:12, home:'open', acts:[['graze',4],['dig',2],['dust',1]]},
arcticwolf:  {day:'all', walk:6,  run:18, see:95, burst:14, home:'den', acts:[['alert',2],['play',1]]},
wolverine:   {day:'all', walk:5,  run:13, home:'den',  acts:[['dig',4],['alert',2]]},
arctichare:  {day:'dusk',walk:4,  run:18, home:'open', gait:'hop', acts:[['graze',4],['alert',3]]},
ermine:      {day:'all', walk:4,  run:12, home:'den',  acts:[['alert',4],['dig',2]]},
lemming:     {day:'all', walk:3,  run:7,  home:'burrow', acts:[['graze',4],['dig',3]]},
ptarmigan:   {day:'day', walk:3,  run:7,  home:'open', acts:[['graze',4],['dig',2],['dust',1]]},
/* ---- the waste ---- */
wildass:     {day:'day', walk:5,  run:19, home:'open', acts:[['graze',5],['dust',2],['alert',1]]},
addax:       {day:'dusk',walk:4,  run:16, home:'open', acts:[['graze',5],['dig',1]]},
blackbuck:   {day:'day', walk:5,  run:22, home:'open', acts:[['graze',5],['alert',3]]},
caracal:     {day:'night',walk:5, run:20, see:75, burst:5, home:'den', acts:[['alert',3],['groom',2]]},
bustard:     {day:'day', walk:4,  run:12, home:'open', acts:[['graze',3],['alert',3],['dust',1]]},
jerboa:      {day:'night',walk:3, run:12, home:'burrow', gait:'hop', acts:[['dig',4],['graze',2]]},
viper:       {day:'night',walk:1, run:5,  home:'rock', acts:[['bask',5]]},
scorpion:    {day:'night',walk:2, run:5,  home:'rock', acts:[['dig',3],['alert',2]]},
/* ---- the running water ---- */
otter:       {day:'day', walk:4,  run:12, home:'den',  acts:[['play',5],['dig',1],['groom',2]]},
beaver:      {day:'night',walk:3, run:8,  home:'water', acts:[['dig',4],['drink',1]]},
platypus:    {day:'dusk',walk:2,  run:6,  home:'water', acts:[['dig',4]]},
};

/* ================= THE FOWL OF THE AIR =================
   Where each bird takes its rest, what it hunts, and when. The engine's
   air-life reads this to give every bird its real day: the owl works
   the night and sleeps it off in a tree; the puffin fishes the sea and
   sleeps at its burrow in the turf; the gull will not go far from
   water; the dove is on the ground as much as off it. */
const BIRDS={
crow:   {perch:'tree',   night:'roost', fish:false},
dove:   {perch:'tree',   night:'roost', fish:false},
gull:   {perch:'ground', night:'roost', fish:true },
eagle:  {perch:'tree',   night:'roost', fish:false},
owl:    {perch:'tree',   night:'hunt',  fish:false},   /* the one that WORKS the dark */
puffin: {perch:'ground', night:'roost', fish:true },
butterfly:{perch:'flower',night:'sit',  fish:false},
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
  seeOf:(name,fb)=>{ const b=D[name]; return (b&&b.see)||fb; },
  burstOf:(name,fb)=>{ const b=D[name]; return (b&&b.burst)||fb; },
  /* draw one piece of the day's small business, by weight */
  drawAct:(name,r)=>{ const b=D[name]; if(!b||!b.acts||!b.acts.length) return null;
    let w=0; for(const a of b.acts) w+=a[1];
    let x=r*w; for(const a of b.acts){ x-=a[1]; if(x<=0) return a[0]; }
    return b.acts[b.acts.length-1][0]; },
};
})();
