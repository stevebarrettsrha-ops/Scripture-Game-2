/* ============ THE FIFTH SCROLL: THE YEARS BETWEEN THE WORDS ============
   YASHAR — the upright book, ninety-one chapters of what the other scrolls
   pass over in a line.

   "Is it not written in the Scroll of Yashar?" is asked twice in the account
   as though everybody had a copy. This is that book, and what it is FOR is
   the joins: the hundred and thirty years before Shith, the sixty-five
   before Methushelaḥ, the reign of Ḥanoḵ and the seven days of men following
   him out to a place he never came back from, the night Aḇram was born.
   It counts the years nothing else counts.

   SO THIS FILM IS THE ONLY ONE THAT NEVER STOPS MOVING. One unbroken swing
   round the anchor from the first frame to the last — no cuts, only fades
   between the movements — because a book of generations is a book about time
   going on while nobody is watching. The sun crosses with it: bright morning
   at the forming of the man, high noon through the generations, a white cold
   sky at the whirlwind, and the last of the light on Shinar.

   AND THE SNOW IS IN THE BOOK. The kings sent men to the place where Ḥanoḵ
   went up and found the earth there filled with snow and great stones of
   snow upon it — which is why the sky goes to that thin bleached blue at the
   hundred and fiftieth second and the fog is let out to the horizon. It is
   the one place in this game where a stage dial is set from a detail of
   weather in the text.                                                   */

STORY.scene({
  id:'yashar',
  name:'THE YEARS BETWEEN THE WORDS',
  book:'yashar',
  anchor:'coast',
  next:null,

  stage:[
    /* early morning, low and warm, close to the ground it is about */
    { t:  0, hour:7.4, dark:0, light:0.92, sky:0xa8c0d8, sun:0.86, moon:0.35, stars:0, firm:0.05,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1, man:1,
      fogN:300, fogF:940, cd:130, cy:30, ca:0.00, cl:7, cfov:58, cut:true },
    { t: 18, hour:8.2, cd:150, cy: 38, cl: 9, ca:0.028 },      /* the breath, and the woman */
    { t: 36, hour:9, cd:180, cy: 50, cl:11, ca:0.058 },      /* the garden, and the charge */
    /* ---- the generations, and the sun climbing over them ---- */
    { t: 58, hour:11.4, cd:240, cy: 78, cl:15, ca:0.095, light:1, sun:1, sky:0x9fc5e8,
      fogN:380, fogF:1160, man:0 },
    { t: 80, hour:12.2, cd:210, cy: 64, cl:13, ca:0.130 },      /* Ḥanoḵ walked with Aluahim */
    { t:102, hour:12.9, cd:170, cy: 46, cl:10, ca:0.165 },      /* called out of his house */
    /* ---- and on the seventh day he went up ---- */
    { t:126, hour:13.4, cd:330, cy:145, cl: 6, ca:0.205, cfov:54, light:1.0, sky:0xbcd3e6,
      sun:1, firm:0.16, fogN:520, fogF:2200, far:1 },
    { t:150, hour:14, cd:560, cy:205, cl: 0, ca:0.245, sky:0xd2e2ee, sun:0.92, clouds:1,
      fogN:700, fogF:3600 },                         /* the earth filled with snow */
    { t:172, hour:14.8, cd:500, cy:182, cl: 0, ca:0.280, sky:0xc4d8e8 },
    /* ---- the ark, and after it the nations ---- */
    { t:196, hour:16, cd:300, cy:120, cl:12, ca:0.315, sky:0x9ab6cf, sun:0.86, light:0.94,
      firm:0.08, fogN:420, fogF:1500, far:1 },
    { t:220, hour:17.2, cd:240, cy: 86, cl:14, ca:0.350, far:0, fogN:360, fogF:1120 },
    /* ---- the night Aḇram was born, and Shinar under it ---- */
    { t:244, hour:20.4, cd:190, cy: 60, cl:12, ca:0.385, light:0.52, sun:0.10, sky:0x4a5570,
      moon:0.9, stars:0.75, fogN:280, fogF:900 },
    { t:268, hour:22, cd:230, cy: 80, cl:16, ca:0.420, light:0.40, sun:0, sky:0x2e3752,
      moon:1, stars:0.95 },
    { t:292, hour:23.2, cd:280, cy:100, cl:20, ca:0.455 },
  ],

  titles:[
    { t:  1.2, to:  5.6, text:'THE YEARS BETWEEN THE WORDS' },
    { t:120.0, to:125.0, text:'AND ON THE SEVENTH DAY' },
    { t:238.0, to:243.0, text:'AND IN THAT NIGHT' },
  ],

  fades:[
    { t: 52.0, to: 57.5, hold:1.0 },
    { t:118.5, to:125.5, hold:1.6 },
    { t:190.0, to:195.5, hold:1.2 },
    { t:236.0, to:243.5, hold:1.4 },
  ],

  caps:[
    /* --- the forming of the man, as this book tells it --- */
    { t:  6.0, to: 17.0, q:['yashar',1,1] },
    { t: 18.0, to: 35.0, q:['yashar',1,2,3] },
    { t: 36.0, to: 51.0, q:['yashar',1,7] },
    /* --- and the years began to be counted --- */
    { t: 58.0, to: 79.0, q:['yashar',2,1] },
    { t: 80.0, to:101.0, q:['yashar',3,1,2] },
    { t:102.0, to:117.0, q:['yashar',3,4] },
    /* --- the whirlwind, the horses and chariots of fire --- */
    { t:126.0, to:149.0, q:['yashar',3,36] },
    { t:150.0, to:171.0, q:['yashar',3,38] },
    { t:172.0, to:189.0, q:['yashar',4,1] },
    /* --- go thou with thy household into the ark --- */
    { t:196.0, to:219.0, q:['yashar',6,1] },
    { t:220.0, to:235.0, q:['yashar',7,1] },
    /* --- and in the night that Aḇram was born, and Shinar under it --- */
    { t:244.0, to:267.0, q:['yashar',8,1] },
    { t:268.0, to:290.0, q:['yashar',11,1] },
  ],
});
