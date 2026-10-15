/* ============ THE THIRTEENTH SCROLL: KARMEL ============
   1 MALAḴIM 18 — "How long would you keep hopping between two opinions?" —
   the altar of (YAHUAH) HWHY repaired with twelve stones, the wood laid, the
   bull, four jars of water poured three times and the trench filled, and at
   the time of the evening offering the fire of (YAHUAH) HWHY falling.

   PLAYED ON THE HEIGHT OF KARMEL above the plain, at the place called the
   Burning: Aliyahu at his altar in the middle, all the people beyond it, and
   the naḇiʼim of Baʽal to one side by their own altar, which never burned.

   YAHUAH IS SHOWN ONLY AS FIRE. The fire comes down out of the shamayim as a
   column and burns on what it fell on (`fire`: the column for the first half
   of its dial, the burning for the second), and the trench of water is
   licked up with it. And all the people fall on their faces (18:39). */

STORY.scene({
  id:'karmel',
  name:'THE FIRE ON KARMEL',
  book:'1malakim',
  anchor:{ ll:[32.669,35.084], seek:'high', r:600, front:0, snap:true },
  music:'tense',
  musicAt:[[102,'holy']],
  next:null,

  set:{ clear:[-30,-24,34,30], level:[[-22,-8,26,24,'grass',8]] },

  cast:[
    { id:'aliyahu', as:'prophet', robe:0x6b5a40, cloth:0x5a4a34, seed:8,
      keys:[ {t:0,x:-2,z:-4,face:0.5,pose:'arms'}, {t:22,pose:'stand',face:0.5}, {t:28,x:-1.8,z:-2.2,face:0.5,pose:'reach'},
             {t:44,x:2.4,z:-0.6,face:0.75,pose:'reach'}, {t:62,x:0,z:-3,face:0.5,pose:'stand'},
             {t:66,pose:'arms'}, {t:102,pose:'arms'}, {t:124,x:0,z:-4.4,pose:'prone',face:0.5} ] },
    /* those who poured the four jars, three times over (18:33-35) */
    { id:'pourer1', as:'youth', seed:61, keys:[ {t:44,x:-2.6,z:1.4,face:0.25,pose:'reach'}, {t:62,x:-6,z:8} ], on:[44,64] },
    { id:'pourer2', as:'youth', seed:67, keys:[ {t:44,x:2.6,z:2.4,face:0.75,pose:'reach'}, {t:62,x:6,z:9} ], on:[44,64] },
  ],
  crowds:[
    /* all the people, beyond the altar; they come closer at his word (18:30) */
    { id:'people', n:30, as:'mixed', x0:-16, z0:12, x1:16, z1:22, face:0, seed:21, poses:[[124,'prone']] },
    /* the naḇiʼim of Baʽal, at their own altar, which was not answered (18:26-29) */
    { id:'baal', n:9, as:'man', robe:0x8a3a2a, cloth:0xb88a3a, x0:16, z0:-2, x1:23, z1:8, face:0.75, seed:91, poses:[[64,'sit'],[124,'prone']] },
  ],
  props:[
    { k:'altar', x:0, z:0, stones:12, trench:true, wet:48, dry:true },
    { k:'altar', x:20, z:10, stones:8, wood:true },
  ],
  signs:{ fire:{x:0,z:0,h:160,y:1.3} },

  stage:[
    { t:  0, hour:14.2, dark:0, light:0.95, sky:0xa8c0d4, sun:0.9, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:0.7, lifeSea:1, lifeAir:1, lifeLand:1, fire:0,
      fogN:500, fogF:1800, cd:230, cy:60, ca:0.00, cl:10, cfov:58, ox:0, oz:8, cut:true },
    { t: 22, cd:170, cy:42, cl:9, ox:0, oz:4, ca:0.03 },
    { t: 44, cd:120, cy:36, cl:6, ox:0, oz:0, ca:0.06 },             /* the wood, and the water poured */
    { t: 62, cd:150, cy:40, cl:8, ca:0.08 },
    /* ---- at the time of bringing the evening offering ---- */
    { t: 63 },
    { t: 66, hour:15.6, light:0.84, sky:0xc4a888, sun:0.7, cd:110, cy:24, cl:12, ox:0, oz:-2, ca:0.52, cut:true },  /* from beyond the altar: the naḇi and his lifted hands */
    { t: 86, cd:130, cy:30, cl:14, ca:0.55 },
    { t:101, cd:260, cy:70, cl:30, ox:0, oz:4, ca:0.02, cut:true },
    { t:102, fire:0 },
    { t:110, fire:0.55, shake:0.5 },                                   /* then the fire of (YAHUAH) HWHY fell */
    { t:118, fire:1, shake:0.1, cd:220, cy:56, cl:16 },
    { t:124, shake:0, cd:300, cy:90, cl:8, ca:0.05 },                  /* and all the people fell on their faces */
    { t:146, cd:420, cy:120, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE FIRE ON KARMEL' },
    { t: 63.0, to: 66.6, text:'AT THE TIME OF THE EVENING OFFERING' },
  ],
  fades:[
    { t: 61.5, to: 67.0, hold:1.2 },
  ],
  caps:[
    { t:  5.0, to: 26.0, q:['1malakim',18,21] },
    { t: 26.0, to: 44.0, q:['1malakim',18,30] },
    { t: 44.0, to: 61.0, q:['1malakim',18,33] },
    { t: 67.0, to: 86.0, q:['1malakim',18,36] },
    { t: 86.0, to:101.0, q:['1malakim',18,37] },
    { t:102.0, to:124.0, q:['1malakim',18,38] },
    { t:124.0, to:146.0, q:['1malakim',18,39] },
  ],
});
