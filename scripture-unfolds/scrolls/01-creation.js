/* ================= THE FIRST SCROLL: THE CREATION =================
   BERĔSHITH 1:1 — 2:3, entire. Every verse of the six days is on the screen
   in its turn, and the world DOES what the verse says while it is said:

     v2   darkness on the face of the deep      the world is put out
     v3   let light come to be                  light, and no sun to make it
     v6   let an expanse come to be             the firmament vault rises
     v9   let the dry land appear               the earth rises out of the sea
     v14  let lights come to be                 sun, moon and the host
     v20  let the waters teem                   the living things of sea and air
     v24  let the earth bring forth             the beasts of the field
     v27  in the image of Aluahim               the man stands
     2:2  He rested on the seventh day          and everything is still

   NOT ONE WORD IS TYPED HERE. Each caption names a book, chapter and verse,
   and the words are drawn out of the Besorah as the scene runs.

   The clock below is in seconds from the first frame.                     */

/* the six days each get their own colour of light */
const SKY_DARK = 0x05070f;   /* the deep, before the light          */
const SKY_FIRST= 0xe6d6a4;   /* the light of the first day — sourceless */
const SKY_DAY  = 0x9fc5e8;   /* the day, once the sky is made       */
const SKY_EVE  = 0xe58a4a;   /* evening                              */

STORY.scene({
  id:'creation',
  name:'THE CREATION',
  book:'bereshith',
  anchor:'coast',
  next:'eden',

  /* ---------------- WHAT THE WORLD DOES ---------------- */
  stage:[
    /* ===== IN THE BEGINNING — the deep, and the darkness upon it ===== */
    { t:  0, dark:1, light:0.02, sky:SKY_DARK, sun:0, moon:0, stars:0,
      firm:0, land:0, sea:1, clouds:0, fogN:1, fogF:340,
      lifeSea:0, lifeAir:0, lifeLand:0,
      cd: 92, cy: 13, ca:0.00, cl:2, cfov:64, cut:true },
    /* and the Ruach of Aluahim moving on the face of the waters */
    { t: 30, ca:0.05, cd:104, cy:15 },

    /* ===== THE FIRST DAY — let light come to be ===== */
    { t: 41, dark:1, light:0.02, ca:0.062 },
    { t: 45, dark:0.06, light:1.00, sky:SKY_FIRST, fogF:900, cd:112, cy:22, ca:0.07 },
    { t: 55, ca:0.085 },
    /* He separated the light from the darkness — evening, and morning */
    { t: 64, dark:0.10, sky:SKY_EVE, ca:0.10 },
    { t: 70, dark:0.88, light:0.10, sky:SKY_DARK, ca:0.11 },
    { t: 75, dark:0.05, light:1.00, sky:SKY_FIRST, ca:0.125 },

    /* ===== THE SECOND DAY — the expanse in the midst of the waters ===== */
    { t: 89, sky:SKY_DAY, cd:130, cy:40, cl:20, cfov:68, ca:0.145 },
    { t:100, firm:1.0, cd:168, cy:96, cl:52, ca:0.17 },        /* the vault rises */
    { t:112, clouds:1.0, cd:186, cy:120, cl:66, ca:0.19 },     /* the waters above */
    { t:120, ca:0.205 },

    /* ===== THE THIRD DAY — and let the dry land appear ===== */
    { t:127, cd:330, cy:150, cl:16, cfov:62, ca:0.225, fogF:1080 },
    { t:134, land:0 },
    { t:150, land:1, cd:340, cy:165, ca:0.255 },                /* THE EARTH RISES */
    { t:170, cd:250, cy: 96, cl:12, ca:0.29 },                 /* in among the grass and the trees */
    { t:185, cd:210, cy: 74, ca:0.315 },

    /* ===== THE FOURTH DAY — the two great lights, and the stars ===== */
    { t:191, cd:230, cy:110, cl:70, cfov:66, ca:0.335 },
    { t:200, sun:1, ca:0.35 },
    { t:214, moon:1, stars:1, ca:0.375 },
    { t:232, ca:0.405, cd:240, cy:120 },

    /* ===== THE FIFTH DAY — the waters teem, and the birds fly ===== */
    { t:245, cd:170, cy:44, cl:8, cfov:64, ca:0.425 },
    { t:252, lifeSea:1, lifeAir:1 },                            /* THE WATERS TEEM, AND THE BIRDS FLY */
    { t:285, ca:0.475, cd:150, cy:34 },

    /* ===== THE SIXTH DAY — the beasts of the earth, and the man ===== */
    { t:293, cd:128, cy:26, cl:6, cfov:62, ca:0.495 },
    { t:300, lifeLand:1 },                                     /* THE BEASTS OF THE EARTH */
    { t:330, ca:0.545, cd:112, cy:22 },
    { t:334, man:1 },                                         /* IN THE IMAGE OF ALUAHIM */
    { t:369, cd: 96, cy:19, ca:0.575 },

    /* ===== THE SEVENTH DAY — and He rested ===== */
    { t:383, cd:220, cy: 92, cl:24, cfov:60, ca:0.60 },
    { t:418, cd:280, cy:130, cl:36, ca:0.645 },
  ],

  /* ---------------- WHAT IS NAMED ---------------- */
  titles:[
    { t:  1.4, to:  6.4, text:'IN THE BEGINNING' },
    { t: 35.0, to: 40.0, text:'THE FIRST DAY'   },
    { t: 83.0, to: 88.0, text:'THE SECOND DAY'  },
    { t:127.0, to:132.0, text:'THE THIRD DAY'   },
    { t:191.0, to:196.0, text:'THE FOURTH DAY'  },
    { t:245.0, to:250.0, text:'THE FIFTH DAY'   },
    { t:293.0, to:298.0, text:'THE SIXTH DAY'   },
    { t:383.0, to:388.0, text:'THE SEVENTH DAY' },
  ],

  /* ---------------- THE DARK BETWEEN THE DAYS ---------------- */
  fades:[
    { t: 76.0, to: 82.0, hold:1.4 },
    { t:120.0, to:126.0, hold:1.4 },
    { t:184.0, to:190.0, hold:1.4 },
    { t:238.0, to:244.0, hold:1.4 },
    { t:286.0, to:292.0, hold:1.4 },
    { t:376.0, to:382.0, hold:1.6 },
  ],

  /* ---------------- AND WHAT THE SCRIPTURE SAYS ----------------
     q: [book, chapter, verse] — or [book, chapter, from, to] for a run. */
  caps:[
    /* --- in the beginning --- */
    { t:  6.5, to: 15.5, q:['bereshith',1,1] },
    { t: 16.5, to: 29.5, q:['bereshith',1,2] },
    /* --- the first day --- */
    { t: 41.0, to: 50.0, q:['bereshith',1,3] },
    { t: 51.0, to: 61.0, q:['bereshith',1,4] },
    { t: 62.0, to: 75.0, q:['bereshith',1,5] },
    /* --- the second day --- */
    { t: 89.0, to: 99.0, q:['bereshith',1,6] },
    { t:100.0, to:111.5, q:['bereshith',1,7] },
    { t:112.5, to:119.5, q:['bereshith',1,8] },
    /* --- the third day --- */
    { t:133.0, to:144.0, q:['bereshith',1,9] },
    { t:145.0, to:155.0, q:['bereshith',1,10] },
    { t:156.0, to:168.0, q:['bereshith',1,11] },
    { t:169.0, to:179.0, q:['bereshith',1,12] },
    { t:180.0, to:183.5, q:['bereshith',1,13] },
    /* --- the fourth day --- */
    { t:197.0, to:210.0, q:['bereshith',1,14,15] },
    { t:211.0, to:222.0, q:['bereshith',1,16] },
    { t:223.0, to:233.0, q:['bereshith',1,17,18] },
    { t:234.0, to:237.5, q:['bereshith',1,19] },
    /* --- the fifth day --- */
    { t:251.0, to:262.0, q:['bereshith',1,20] },
    { t:263.0, to:275.0, q:['bereshith',1,21] },
    { t:276.0, to:283.0, q:['bereshith',1,22] },
    { t:284.0, to:285.5, q:['bereshith',1,23] },
    /* --- the sixth day --- */
    { t:299.0, to:309.0, q:['bereshith',1,24] },
    { t:310.0, to:319.0, q:['bereshith',1,25] },
    { t:320.0, to:333.0, q:['bereshith',1,26] },
    { t:334.0, to:343.0, q:['bereshith',1,27] },
    { t:344.0, to:354.0, q:['bereshith',1,28] },
    { t:355.0, to:368.0, q:['bereshith',1,29,30] },
    { t:369.0, to:375.5, q:['bereshith',1,31] },
    /* --- the seventh day --- */
    { t:389.0, to:396.0, q:['bereshith',2,1] },
    { t:397.0, to:405.0, q:['bereshith',2,2] },
    { t:406.0, to:416.0, q:['bereshith',2,3] },
  ],
});
