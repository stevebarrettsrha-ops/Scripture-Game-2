/* ============ THE NINETEENTH SCROLL: THE ROAD TO DAMASCUS ============
   ACTS 9 — Sha'ul, still breathing threats against the taught ones of the
   Master, on the road with letters for the assemblies; near Damascus a light
   flashing around him from the shamayim; fallen to the ground, and a voice:
   "Sha'ul, Sha'ul, why do you persecute Me?" — "I am Yahusha, whom you
   persecute"; the men with him standing speechless, hearing the voice but
   seeing no one; and Sha'ul led by the hand into Damascus.

   PLAYED ON THE ROAD UP FROM THE SOUTH-WEST, a few kilometres short of the
   city, with the eye looking along it toward Damascus.

   THE MASTER IS NOT DRAWN. The men with him saw no one (9:7), and neither
   does the eye: what is shown is the light out of the shamayim (`glory`,
   standing over him and flooding the road) and Sha'ul on the ground in it.
   The words He spoke are read, as every word here is.

   (No recordings: read by caption alone, with the music under it.) */

STORY.scene({
  id:'dammeseq',
  name:'THE ROAD TO DAMASCUS',
  book:'acts',
  anchor:{ ll:[33.436,36.192], seek:'flat', r:500, toward:[33.513,36.292] },
  music:'tense',
  musicAt:[[20,'holy']],
  next:null,

  set:{ clear:[-24,-40,24,40] },

  cast:[
    { id:'shaul', as:'man', robe:0x3a4a6a, cloth:0xe4ddcc, sash:0x8a6a3a, seed:44,
      keys:[ {t:0,x:-1,z:-34}, {t:24,x:0,z:-2}, {t:38,x:0,z:0,pose:'prone',face:0.5,cut:true},
             {t:74,x:0,z:0,pose:'kneel',face:0.5,cut:true}, {t:108,pose:'stand',face:0.5}, {t:110,x:0.2,z:0.2}, {t:132,x:1.4,z:36} ] },
    { id:'c1', as:'man', seed:51, robe:0x6a5a48, keys:[ {t:0,x:-2.6,z:-37}, {t:24,x:-2.4,z:-5}, {t:26,face:'shaul'}, {t:110,x:-0.8,z:0.6}, {t:132,x:0.4,z:36.6} ] },
    { id:'c2', as:'man', seed:57, robe:0x7a6a50, keys:[ {t:0,x:2.2,z:-38}, {t:24,x:2.6,z:-5.6}, {t:26,face:'shaul'}, {t:110,x:2.6,z:-1}, {t:132,x:3.4,z:35} ] },
    { id:'c3', as:'soldier', seed:63, keys:[ {t:0,x:-0.4,z:-41}, {t:24,x:-0.6,z:-8}, {t:26,face:'shaul'}, {t:110,x:-0.4,z:-3}, {t:132,x:1,z:32} ] },
    { id:'c4', as:'soldier', seed:69, keys:[ {t:0,x:1.8,z:-43}, {t:24,x:1.6,z:-9.6}, {t:26,face:'shaul'}, {t:110,x:2,z:-4}, {t:132,x:2.6,z:31} ] },
  ],
  herds:[ { kind:'donkey', n:1, x:4.2, z:-7, turn:0.55 } ],
  signs:{ glory:{x:0,z:0,h:70,r:140,foot:16,top:6} },

  stage:[
    /* the road at midday (Acts 22:6), the city still some way off */
    { t:  0, hour:11.6, dark:0, light:0.96, sky:0xb4c8dc, sun:1, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, glory:0, shake:0,
      fogN:500, fogF:1800, cd:200, cy:44, ca:0.06, cl:8, cfov:56, ox:0, oz:-26, cut:true },
    { t: 20, cd:160, cy:38, cl:8, ox:0, oz:-6, ca:0.04 },
    { t: 22, glory:1, light:1.0, shake:0.3 },                         /* suddenly a light flashed around him */
    { t: 26, shake:0 },
    { t: 38, cd:140, cy:40, cl:4, ox:0, oz:-1, ca:0.07 },
    { t: 56, cd:180, cy:70, cl:30, ca:0.05 },                         /* "I am Yahusha, whom you persecute" — light */
    { t: 74, cd:120, cy:34, cl:6, ca:0.08 },
    { t: 92, cd:200, cy:40, cl:8, ox:0, oz:-4, ca:0.45, cut:true },   /* the men journeying with him, speechless */
    { t:108, glory:0, light:0.96, cd:220, cy:44, ox:0, oz:4, ca:0.06, cut:true },
    { t:132, cd:320, cy:70, cl:10, ox:0, oz:20, ca:0.08 },
  ],

  titles:[
    { t:  0.8, to:  4.6, text:'THE ROAD TO DAMASCUS' },
  ],
  fades:[
    { t: 91.0, to: 93.0, hold:0.4 },
    { t:107.0, to:109.0, hold:0.4 },
  ],
  caps:[
    { t:  5.0, to: 20.0, q:['acts',9,1] },
    { t: 21.0, to: 38.0, q:['acts',9,3] },
    { t: 38.0, to: 56.0, q:['acts',9,4] },
    { t: 56.0, to: 74.0, q:['acts',9,5] },
    { t: 74.0, to: 92.0, q:['acts',9,6] },
    { t: 93.0, to:107.0, q:['acts',9,7] },
    { t:109.0, to:132.0, q:['acts',9,8] },
  ],
});
