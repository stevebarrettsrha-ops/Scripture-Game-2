/* ================= THE SECOND SCROLL: THE GARDEN =================
   BERĔSHITH 2:4-25 — the mist, the forming of the man out of the dust, the
   garden planted eastward, the two trees, the four riverheads, the charge to
   work it and guard it, the naming of every living thing, the deep sleep,
   and the woman brought to the man.

   And then the scroll changes hands. ADAM AND HAWWAH 1 takes up the same
   moment from the other side and tells what BERĔSHITH does not: WHERE the
   garden stood, what lay north and south of it, and the cave in the rock
   below it that Adawm was given to live in. The two books are read together
   here, in that order, because that is the order they happened in.        */

STORY.scene({
  id:'eden',
  name:'THE GARDEN IN ĔḎEN',
  book:'bereshith',
  anchor:'coast',
  next:null,

  stage:[
    /* the world stands finished now: lit, vaulted, dry, and full of life */
    { t:  0, dark:0, light:1, sky:0x9fc5e8, sun:1, moon:1, stars:1, firm:0.10,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, fogN:400, fogF:1080,
      cd:300, cy:120, ca:0.00, cl:24, cfov:62, cut:true },
    { t: 19, cd:210, cy: 70, cl:14, ca:0.03, man:1 },  /* the breath of life */
    { t: 32, cd:170, cy: 46, cl: 9, ca:0.055 },     /* the garden planted */
    { t: 56, cd:230, cy: 88, cl:18, ca:0.09 },      /* the river, and its four heads */
    { t: 81, cd:150, cy: 38, cl: 7, ca:0.12 },      /* the charge, and the command */
    { t:104, cd:190, cy: 54, cl:11, ca:0.155 },     /* the naming of the beasts */
    { t:131, cd:120, cy: 28, cl: 5, ca:0.185 },     /* the deep sleep */
    { t:155, cd:140, cy: 33, cl: 6, ca:0.215 },     /* bone of my bones */
    { t:178, cd:200, cy: 62, cl:13, ca:0.245 },
    /* ---- and the other scroll takes it up ---- */
    { t:187, cd:420, cy:190, cl:30, cfov:58, ca:0.27, fogF:4200 },
    { t:213, cd:300, cy:110, cl:18, ca:0.315 },
    { t:238, cd:240, cy: 80, cl:14, ca:0.35 },
  ],

  titles:[
    { t:  1.2, to:  6.4, text:'THE GARDEN IN ĔḎEN' },
    { t:180.5, to:186.0, text:'AND WHERE IT STOOD' },
  ],

  fades:[
    { t:178.0, to:184.0, hold:1.4 },
  ],

  caps:[
    /* --- the mist, and the man formed out of the dust --- */
    { t:  8.0, to: 18.0, q:['bereshith',2,5,6] },
    { t: 19.0, to: 31.0, q:['bereshith',2,7] },
    /* --- the garden, and the two trees --- */
    { t: 32.0, to: 42.0, q:['bereshith',2,8] },
    { t: 43.0, to: 55.0, q:['bereshith',2,9] },
    /* --- the river, and the four heads of it --- */
    { t: 56.0, to: 70.0, q:['bereshith',2,10,11] },
    { t: 71.0, to: 80.0, q:['bereshith',2,13,14] },
    /* --- to work it and to guard it, and the one command --- */
    { t: 81.0, to: 92.0, q:['bereshith',2,15] },
    { t: 93.0, to:103.0, q:['bereshith',2,16,17] },
    /* --- it is not good for the man to be alone --- */
    { t:104.0, to:114.0, q:['bereshith',2,18] },
    /* --- and whatever the man called each living creature --- */
    { t:115.0, to:129.0, q:['bereshith',2,19] },
    { t:130.0, to:142.0, q:['bereshith',2,20] },
    /* --- the deep sleep, and the woman brought to the man --- */
    { t:143.0, to:154.0, q:['bereshith',2,21] },
    { t:155.0, to:165.0, q:['bereshith',2,22] },
    { t:166.0, to:177.0, q:['bereshith',2,23] },
    /* --- ADAM AND HAWWAH 1 takes up the same moment --- */
    { t:187.0, to:200.0, q:['adam-eve-1',1,1] },
    { t:201.0, to:212.0, q:['adam-eve-1',1,2] },
    { t:213.0, to:224.0, q:['adam-eve-1',1,8] },
    { t:225.0, to:237.0, q:['adam-eve-1',1,9] },
  ],
});
