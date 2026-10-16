/* ============ THE SIXTEENTH SCROLL: THE IMMERSION IN THE YARDĔN ============
   MATTITHYAHU 3 — Yahuchanon the Immerser proclaiming in the wilderness of
   Yahuḏah, all the country around the Yardĕn going out to him; Yahusha coming
   from Galil to be immersed, Yahuchanon hindering Him; and as He went up from
   the water the shamayim opened, the Ruach of Aluahim descending like a dove,
   and a voice out of the shamayim.

   PLAYED AT THE CROSSING EAST OF YAHRIḤO, where the Yardĕn runs through the
   wilderness of Yahuḏah to the salt sea. The river is not in the voyage's
   earth, so it is laid here as the voyage lays water: real water, cut into
   the level ground across the picture by the set builder, with its banks of
   reeds — and taken up again when the film is done.

   YAHUSHA'S FACE IS NEVER DRAWN, and the eye never comes within the stage's
   guard of Him. The voice out of the shamayim is light standing over Him
   (`glory`, set on Him), and the Ruach is seen "like a dove" (`dove`) — a
   dove, in a light of its own, and nothing else.

   (No recordings: read by caption alone, with the music under it.) */

STORY.scene({
  id:'immersion',
  name:'THE IMMERSION IN THE YARDĔN',
  book:'mattithyahu',
  anchor:{ ll:[31.840,35.551], seek:'flat', r:800, front:0, snap:true },
  music:'desert',
  musicAt:[[86,'holy']],
  next:null,

  set:{ clear:[-64,-24,64,30], level:[[-62,-18,62,26,'grass',10],[-62,1,62,4,'sand',0],[-62,13,62,16,'sand',0]], water:[[-62,4,62,13,1]] },

  cast:[
    { id:'yahuchanon', as:'prophet', robe:0x8a6a40, sash:0x4a3020, cloth:0x6a5030, seed:3,
      keys:[ {t:0,x:-4,z:-2,pose:'arms',face:0.75}, {t:18,pose:'stand',face:0.75}, {t:34,face:0.25},
             {t:56,x:-1,z:0.6,face:'yahusha'}, {t:68,x:-1.4,z:8,pose:'wade',face:'yahusha',glide:true},
             {t:86,x:-2.4,z:1.6,pose:'stand',face:'yahusha',cut:true}, {t:112,pose:'kneel'} ] },
    /* holy: His face is never drawn, and the eye is kept from Him */
    { id:'yahusha', as:'yahusha', seed:7,
      keys:[ {t:36,x:34,z:-12}, {t:54,x:3,z:-0.6}, {t:56,face:'yahuchanon'},
             {t:68,x:1.2,z:8,pose:'wade',face:'yahuchanon',glide:true}, {t:84,x:1.2,z:8,pose:'wade'},
             {t:94,x:0.6,z:0.2,pose:'stand',face:0}, {t:130,x:0.6,z:0.2,face:0} ], on:[36,240] },
  ],
  crowds:[
    /* all the country around the Yardĕn went out to him (3:5) */
    { id:'near', n:16, as:'mixed', x0:-30, z0:-12, x1:-9, z1:-3, face:0.25, seed:131, poses:[[112,'kneel']] },
    { id:'far', n:10, as:'mixed', x0:-18, z0:17, x1:20, z1:23, face:0, seed:171, poses:[[112,'kneel']] },
  ],
  props:[
    { k:'reeds', x:16, z:3.4, len:30 }, { k:'reeds', x:-36, z:3.4, len:20 },
    { k:'reeds', x:8, z:13.6, len:36 }, { k:'reeds', x:-44, z:13.6, len:16 },
    { k:'dove', x:0.6, z:0.2, h0:64, h1:2.9, dz:-8, on:[86,240] },
  ],
  signs:{ glory:{on:'yahusha',h:70,r:46,foot:3,top:1} },

  stage:[
    { t:  0, hour:9.6, dark:0, light:0.96, sky:0xb4c8d8, sun:0.9, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, glory:0, dove:0,
      fogN:500, fogF:1700, cd:260, cy:60, ca:0.02, cl:8, cfov:56, ox:-10, oz:2, cut:true },
    { t: 18, cd:300, cy:70, cl:8, ox:-12, oz:2, ca:0.04 },
    /* ---- then Yahusha came from Galil ---- */
    { t: 34, cd:340, cy:64, cl:10, ox:10, oz:-4, ca:0.06 },
    { t: 54, cd:150, cy:36, cl:9, ox:0, oz:0, ca:0.04 },
    { t: 68, cd:180, cy:40, cl:6, ox:0, oz:6, ca:0.06 },
    { t: 84, cd:200, cy:40, cl:6, ox:0, oz:5, ca:0.07 },
    /* ---- and see, the shamayim were opened ---- */
    { t: 86, glory:0.2, dove:0, cd:220, cy:30, cl:30, ox:0, oz:2, ca:0.03, cut:true },
    { t: 96, glory:1, dove:0.2 },
    { t:108, dove:1, cd:200, cy:34, cl:22, ca:0.04 },
    { t:110, light:1.0 },
    { t:130, cd:300, cy:50, cl:20, ca:0.06 },
    { t:144, cd:380, cy:66, cl:18, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE IMMERSION IN THE YARDĔN' },
  ],
  fades:[],
  caps:[
    { t:  5.0, to: 18.0, q:['mattithyahu',3,1] },
    { t: 18.0, to: 34.0, q:['mattithyahu',3,5] },
    { t: 34.0, to: 54.0, q:['mattithyahu',3,13] },
    { t: 54.0, to: 68.0, q:['mattithyahu',3,14] },
    { t: 68.0, to: 86.0, q:['mattithyahu',3,15] },
    { t: 86.0, to:110.0, q:['mattithyahu',3,16] },
    { t:110.0, to:132.0, q:['mattithyahu',3,17] },
  ],
});
