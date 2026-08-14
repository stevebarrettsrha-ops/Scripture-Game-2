/* ============ THE THIRD SCROLL: THE DAYS AFTER THE GARDEN ============
   ADAM AND HAWWAH 2 — and it opens on a murder.

   The garden is behind them. This is the book of what a family does after
   the worst day of its life: they bury the boy in the cave they live in,
   they mourn a hundred and forty days, another son is born, and the old man
   dies in the same cave and is laid beside him. Then the two lines part —
   Qayin's down to the plain, Shith's kept up on the mountain — and the book
   ends with Ḥanoḵ still ministering in that cave, which is the thread the
   next scroll picks up.

   WHY IT LOOKS THE WAY IT DOES. No stage dial in this file makes the world;
   the world already stands. What the track does instead is take the SUN off
   it — a flat overcast, the light down, the fog drawn in close — and then
   walk the whole scene from that grey afternoon down into night, so that by
   the last caption the only things in the sky are the lesser light and the
   host. Nothing is invented to carry the grief; the hour of the day carries
   it, and the hour of the day is a thing this world already has.        */

STORY.scene({
  id:'after-eden',
  name:'THE DAYS AFTER THE GARDEN',
  book:'adam-eve-2',
  anchor:'coast',
  next:null,

  stage:[
    /* an overcast afternoon: the world entire, and the sun taken off it */
    { t:  0, hour:15, dark:0.06, light:0.80, sky:0x8ea3ae, sun:0.30, moon:0, stars:0, firm:0,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1,
      fogN:220, fogF:760, cd:170, cy:44, ca:0.00, cl:12, cfov:60, cut:true },
    { t: 20, hour:15.6, cd:140, cy: 34, cl: 9, ca:0.020 },      /* they cried aloud */
    { t: 47, hour:16.4, cd: 96, cy: 22, cl: 5, ca:0.045, fogN:150, fogF:560 },  /* to the cave */
    { t: 61, hour:17, cd: 88, cy: 18, cl: 4, ca:0.060, dark:0.10 },  /* a hundred and forty days */
    /* ---- and a son is born, and the light comes back a little ---- */
    { t: 80, hour:14, cd:180, cy: 52, cl:14, ca:0.085, dark:0.02, light:0.92, sun:0.55,
      sky:0x9fb4bd, fogN:260, fogF:900 },
    { t: 94, hour:14.8, cd:150, cy: 40, cl:10, ca:0.110 },
    /* ---- the old man's end, and the evening comes on ---- */
    { t:114, hour:16.6, cd:110, cy: 26, cl: 6, ca:0.140, light:0.74, sun:0.34, sky:0x8a8f9b },
    { t:129, hour:17.8, cd: 92, cy: 20, cl: 4, ca:0.160, light:0.60, sun:0.16, sky:0x6f7280 },
    { t:143, hour:18.8, cd:130, cy: 32, cl: 8, ca:0.185, light:0.44, sun:0.04, sky:0x54566a,
      moon:0.5, stars:0.30, fogN:200, fogF:700 },
    /* ---- and the two lines part, under the host of the shamayim ---- */
    { t:163, hour:20.6, cd:230, cy: 74, cl:16, ca:0.215, light:0.30, sun:0, sky:0x2b2f45,
      moon:1, stars:0.85, fogN:240, fogF:840 },
    { t:196, hour:22.4, cd:300, cy:104, cl:22, ca:0.250 },
  ],

  titles:[
    { t:  1.2, to:  5.6, text:'THE DAYS AFTER THE GARDEN' },
    { t:158.0, to:162.0, text:'AND THE TWO LINES PARTED' },
  ],

  fades:[
    { t: 73.5, to: 79.5, hold:1.0 },
    { t:107.5, to:113.5, hold:1.0 },
    { t:156.5, to:162.5, hold:1.2 },
  ],

  caps:[
    /* --- the killing, and the finding --- */
    { t:  6.0, to: 19.0, q:['adam-eve-2',1,1] },
    { t: 20.0, to: 32.0, q:['adam-eve-2',1,2] },
    { t: 33.0, to: 46.0, q:['adam-eve-2',1,3] },
    /* --- and he was carried to the cave they lived in --- */
    { t: 47.0, to: 60.0, q:['adam-eve-2',1,4] },
    { t: 61.0, to: 73.0, q:['adam-eve-2',1,5] },
    /* --- and another son was given --- */
    { t: 80.0, to: 93.0, q:['adam-eve-2',2,1] },
    { t: 94.0, to:107.0, q:['adam-eve-2',5,1] },
    /* --- the end of the first man, in the same cave --- */
    { t:114.0, to:128.0, q:['adam-eve-2',8,1] },
    { t:129.0, to:142.0, q:['adam-eve-2',9,1] },
    { t:143.0, to:156.0, q:['adam-eve-2',10,1] },
    /* --- the mountain kept, and the plain gone down to --- */
    { t:163.0, to:177.0, q:['adam-eve-2',11,1] },
    { t:178.0, to:194.0, q:['adam-eve-2',22,1] },
  ],
});
