/* ================= THE WORK OF THE PEOPLE (Phase B) =================
   "The labourer is worthy of his hire."

   THE FAULT THIS FILE MENDS. A soul of the town gave a trade line, then a
   rumour of the nearest land, then "Go in peace" — and that was the whole of
   what a traveller could have of a people who worked from first light to
   dark. Nobody wanted anything done. Now every trade has work to give that
   fits it, and the work is REAL: the grain is beaten out on a threshing floor
   that stands in the countryside, the strayed sheep is a beast standing out
   past the fields, the wolf is a wolf at the fold, the water is drawn at the
   well the town was built round, the timber is cut from standing trees with
   the axe in the belt. Nothing is finished by a word; the engine reads what
   the hands have done.

   THE ENGINE KNOWS NO JOB BY NAME, the rule this project keeps above all
   others. It knows the seven MANNERS of work (`kind`) and how to read a line;
   the words, the measures and the pay are here, and a new job is a new line.

     k       the job's own key — the save carries it
     kind    the manner of the work, which is all the engine knows:
               gather  take n measures at a place of the town (`at`), one
                       to a stroke of the hand, and bring them to the giver
               carry   bear a parcel to the market of another town; the one
                       there it is for (`to`, a trade) takes it and pays
               stray   a beast of the flock has strayed into the country —
                       find it and lead it home to the fold
               wolf    a bold wolf at the fold — drive it off, or spear it
               draw    draw n jars at the well and pour each into the jars
                       at the giver's door
               bring   n of a substance (`ids`) in the satchel, handed over
               catch   n fish of the traveller's own catching, handed over
     trades  the trades that give it (js/behavior.js FOLK, by role)
     n       [least, most] — the measure of the work, drawn per job
     what    [one, many] — what the measure counts
     at      for `gather`: 'floor' (the threshing floors of the farmsteads)
             — a town that laid none sends him to its fields
     parcel  for `carry`: what he carries
     to      for `carry`: the trades at the far town who take it
     ids     for `bring`: the substances that serve (any of them)
     ask     what the giver says when he offers it — {n} {what} {pay} {town}
             {dir} {km} {beast} {place} {who} are filled in
     task    the line in THE LOG
     pay     shekels: base + per × n (+ perKm × km for a carry, to max)
     gw      the goodwill of the giver's town the work earns */

EARTH.job({ k:'thresh', kind:'gather', at:'floor', trades:['farmer','gleaner','baker','folk'],
  n:[5,8], what:['measure of grain','measures of grain'],
  ask:'“The sheaves are trodden out on {place} at the farmstead, and the wind is right for the winnowing. Beat out {n} {what} there and bring them to me — {pay} shekels for your arms.”',
  task:'beat out {n} {what} on {place} and bring them',
  pay:{base:6,per:3}, gw:4 });

EARTH.job({ k:'cloth', kind:'carry', trades:['vendor','weaver','spinner','shopper'],
  parcel:'a bale of fine cloth', to:['vendor'],
  ask:'“This bale of cloth is sold to the market of {town}, some {km} away to the {dir}. Carry it to the merchant there; he pays the carriage — {pay} shekels — on the day it comes.”',
  task:'carry a bale of fine cloth to the merchant at the market of {town} ({dir}, {km})',
  pay:{base:12,perKm:0.4,max:90}, gw:4 });

EARTH.job({ k:'jars-oil', kind:'carry', trades:['potter'],
  parcel:'a crate of oil jars, packed in straw', to:['vendor'],
  ask:'“The merchant of {town}, some {km} away to the {dir}, has bought a crate of my oil jars. Bear it gently — he pays {pay} shekels for every jar that comes whole.”',
  task:'bear a crate of oil jars to the merchant at the market of {town} ({dir}, {km})',
  pay:{base:12,perKm:0.4,max:90}, gw:4 });

EARTH.job({ k:'letter', kind:'carry', trades:['teacher'],
  parcel:'a sealed letter', to:['teacher'],
  ask:'“I have written to the teacher of {town}, some {km} away to the {dir}, about the reading of the scroll. Put it in his hand and no other — he will give you {pay} shekels for the road.”',
  task:'carry a sealed letter to the teacher of {town} ({dir}, {km})',
  pay:{base:10,perKm:0.35,max:80}, gw:5 });

EARTH.job({ k:'stray', kind:'stray', trades:['herder','feeder'],
  ask:'“One of my {beast}s went astray at dawn — out past the fields, away to the {dir}. Will you not leave the ninety and nine and go after it? Lead it home to the fold, and {pay} shekels are yours.”',
  task:'find the strayed {beast} out to the {dir} and lead it home to the fold',
  pay:{base:16}, gw:5 });

EARTH.job({ k:'wolf', kind:'wolf', trades:['hunter'],
  ask:'“A wolf has been at the fold three nights running, and it is bold — the herdsman’s staff does not turn it. Drive it off into the hills, or take it with the spear (Q), and you shall have {pay} shekels.”',
  task:'drive the wolf off from the fold, or take it with the spear',
  pay:{base:18}, gw:6 });

EARTH.job({ k:'jars', kind:'draw', trades:['water'],
  n:[3,4], what:['jar','jars'],
  ask:'“My back is bent with carrying. Draw {n} {what} of water at the well and pour each into the great jars at my door, and I will give you {pay} shekels.”',
  task:'draw {n} {what} at the well and pour them into the jars at the door',
  pay:{base:5,per:4}, gw:4 });

EARTH.job({ k:'timber', kind:'bring', trades:['woodcutter','carpenter'],
  ids:['log'], n:[5,8], what:['length of timber','lengths of timber'],
  ask:'“The town wants beams for a roof. Fell what you need out past the fields — the axe in your belt will serve — and bring me {n} {what}, for {pay} shekels.”',
  task:'cut {n} {what} from standing trees and bring them',
  pay:{base:8,per:3}, gw:4 });

EARTH.job({ k:'stone', kind:'bring', trades:['mason'],
  ids:['stone','cobble','hewn-stone','grey-stone','sandstone','basalt','mudbrick'], n:[5,8], what:['stone','stones'],
  ask:'“A course of the wall has come down in the rain. Break me {n} {what} out of the rock with your pick and bring them, that I may set them back — {pay} shekels for the work.”',
  task:'break {n} {what} out of the rock for the fallen wall, and bring them',
  pay:{base:8,per:3}, gw:4 });

EARTH.job({ k:'fish', kind:'catch', trades:['fisher'],
  n:[2,4], what:['fish','fish'],
  ask:'“The nets came up empty, and there are mouths at home. Bring me {n} {what} of your own catching — cast where the water darkens — and I will give you {pay} shekels.”',
  task:'catch {n} {what} with the line and bring them',
  pay:{base:6,per:5}, gw:4 });
