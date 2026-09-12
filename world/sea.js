/* ================= THE NATIONS OF THE SEA, AND THEIR WATERS =================
   "There go the ships: there is that leviathan, whom thou hast made to
    play therein."

   The wandering beasts of the sea — the whale and the turtle, the seal and
   the walrus, the swordfish and the octopus — each with WHERE it swims:
   how many are shown (n), how far off they may stand and respawn (R, rs),
   whether they keep near the diver's water (near), how deep each sounds in
   metres (deepM), and the band of latitude it belongs to (lat — absent
   means all seas). A walrus is not met off Ceylon and a manatee is not met
   under the ice, and the ENGINE does not know either of their names: these
   twenty lived as literals inside initSeaMobs in js/engine.js from the day
   each was built (Round 103 moved them here, changing no number).

   Their HABITS — hours, pace, breath, and the small business of their
   lives — are the SEA table's in js/behavior.js; this file is only their
   waters. To put a new wandering beast in the sea: add its creature file,
   its habits there, and its waters here.

   STILL ENGINE-SIDE, for later verses of this same wire: the sharks'
   kind-list, the dolphin pod, the squid, the jellies and crabs, the reef
   household (anemones, seahorses, morays, bed-life), the tenants of the
   deep (DEEP_KINDS), and the river fish (RIVER_KINDS). */
EARTH.sea({ name:'turtle',         n:7, R:360, rs:340, near:true,  deepM:120 });
EARTH.sea({ name:'ray',            n:4, R:460, rs:440, near:true,  deepM:200 });
EARTH.sea({ name:'whale',          n:2, R:700, rs:650, near:false, deepM:320 });
EARTH.sea({ name:'puffer',         n:8, R:240, rs:220, near:true,  deepM:60 });
EARTH.sea({ name:'parrotfish',     n:5, R:300, rs:280, near:true,  deepM:55,   lat:[-38,38] });
EARTH.sea({ name:'angelfish',      n:6, R:260, rs:240, near:true,  deepM:45,   lat:[-38,38] });
EARTH.sea({ name:'lionfish',       n:3, R:240, rs:220, near:true,  deepM:45,   lat:[-36,36] });
EARTH.sea({ name:'marlin',         n:2, R:560, rs:520, near:false, deepM:350,  lat:[-48,48] });
EARTH.sea({ name:'sunfish',        n:1, R:600, rs:560, near:false, deepM:480,  lat:[-54,54] });
EARTH.sea({ name:'whaleshark',     n:1, R:700, rs:650, near:false, deepM:300,  lat:[-36,36] });
EARTH.sea({ name:'spermwhale',     n:2, R:820, rs:760, near:false, deepM:2200, lat:[-64,64] });
EARTH.sea({ name:'seal',           n:5, R:340, rs:320, near:true,  deepM:90,   lat:[42,90] });
EARTH.sea({ name:'beluga',         n:3, R:420, rs:400, near:true,  deepM:120,  lat:[55,90] });
EARTH.sea({ name:'narwhal',        n:2, R:440, rs:410, near:true,  deepM:150,  lat:[58,90] });
EARTH.sea({ name:'greenlandshark', n:1, R:560, rs:520, near:false, deepM:600,  lat:[52,90] });
EARTH.sea({ name:'walrus',         n:2, R:320, rs:300, near:true,  deepM:70,   lat:[58,90] });
EARTH.sea({ name:'manatee',        n:2, R:300, rs:280, near:true,  deepM:40,   lat:[-30,30] });
EARTH.sea({ name:'octopus',        n:3, R:260, rs:240, near:true,  deepM:70 });
EARTH.sea({ name:'swordfish',      n:2, R:520, rs:480, near:false, deepM:400,  lat:[-46,46] });
EARTH.sea({ name:'barracuda',      n:5, R:300, rs:280, near:true,  deepM:110,  lat:[-34,34] });
