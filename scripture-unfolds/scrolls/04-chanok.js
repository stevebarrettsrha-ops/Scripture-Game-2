/* ============ THE FOURTH SCROLL: THE SEVENTH FROM ADAWM ============
   ḤANOḴ — the book of the man who walked with Aluahim and was taken.

   It is two things at once and the film is built on the seam between them.
   The first is what went WRONG on the earth: two hundred of the Watchers
   swearing an oath on the summit of Hermon, the daughters of men, the
   giants, and the four looking down from the shamayim at the blood. The
   second is what happened to ḤANOḴ himself — the clouds inviting him, the
   mist summoning him, borne up out of it into the place of the luminaries
   and the treasuries of the stars.

   SO THE TRACK GOES DOWN AND THEN UP, and means both literally. It opens at
   a clear noon. As the Watchers descend the light goes out of the sky and
   the sky itself goes to iron; by the giants it is the darkest daylight in
   this game. Then the camera LEAVES — the four look down from a great
   height, and from there it never returns to the ground: the firmament comes
   up, the host comes out, and the last third of the film is played above the
   world with the coarse carpet under it, because at that height the streamed
   ring is not the earth, it is a raft.                                   */

STORY.scene({
  id:'chanok',
  name:'THE SEVENTH FROM ADAWM',
  book:'chanok',
  anchor:'coast',
  next:null,

  stage:[
    /* a clear noon over a finished world */
    { t:  0, hour:12, dark:0, light:1, sky:0x9fc5e8, sun:1, moon:0.5, stars:0, firm:0.06,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1,
      fogN:400, fogF:1140, cd:260, cy:88, ca:0.00, cl:18, cfov:62, cut:true },
    { t: 22, hour:12.6, cd:200, cy: 62, cl:13, ca:0.030 },      /* the vision of the Set Apart One */
    { t: 40, hour:13.2, cd:150, cy: 40, cl: 9, ca:0.055 },      /* He will tread upon the earth */
    /* ---- and it came to pass when the children of men had multiplied ---- */
    { t: 58, hour:13.9, cd:180, cy: 48, cl:11, ca:0.085, light:0.86, sky:0x8fa9b8, sun:0.72 },
    { t: 76, hour:14.6, cd:140, cy: 34, cl: 7, ca:0.115, light:0.68, sky:0x7b7f88, sun:0.40,
      fogN:260, fogF:820 },
    /* ---- the oath on the summit, and what was born of it ---- */
    { t: 94, hour:15.4, cd:120, cy: 30, cl: 6, ca:0.145, light:0.52, sky:0x5f5a58, sun:0.18,
      dark:0.12, clouds:1, fogN:200, fogF:660 },
    { t:112, hour:16, cd: 96, cy: 24, cl: 5, ca:0.170, light:0.40, sky:0x4b423e, sun:0.06,
      dark:0.22, lifeLand:0, lifeAir:0 },
    /* ---- AND THEN MICHAAL, URIAL, RAPHAAL AND GABRIAL LOOKED DOWN ----
       the one cut in the film, and it is a cut on purpose: the eye is not
       carried up to the gates of shamayim, it is already there */
    { t:130, hour:16.6, cd:900, cy:760, cl:0, ca:0.195, cfov:52, dark:0.16, light:0.62,
      sky:0x6d7f93, sun:0.5, stars:0.20, firm:0.30, far:1, clouds:0,
      fogN:900, fogF:5200, cut:true },
    { t:152, hour:17.2, cd:1050, cy:840, cl:0, ca:0.225 },      /* the earth cries out */
    { t:172, hour:17.8, cd:1180, cy:900, cl:0, ca:0.255, stars:0.35 },  /* the book of the reprimand */
    /* ---- the clouds invited me and a mist summoned me ---- */
    { t:196, hour:19.6, cd:1400, cy:1180, cl:0, ca:0.290, dark:0.30, light:0.55, sky:0x3f5470,
      sun:0.24, moon:0.9, stars:0.72, firm:0.62, clouds:0, fogF:7200 },
    { t:218, hour:21, cd:1620, cy:1420, cl:0, ca:0.325, dark:0.44, light:0.46, sky:0x22314c,
      sun:0.08, stars:0.95, firm:0.85 },
    /* ---- the places of the luminaries, and the treasuries of the stars ---- */
    { t:240, hour:22.4, cd:1780, cy:1560, cl:0, ca:0.360, dark:0.54, sky:0x141d33, sun:0,
      stars:1, firm:1, clouds:0 },
    { t:266, hour:23.4, cd:1900, cy:1660, cl:0, ca:0.400 },
  ],

  titles:[
    { t:  1.2, to:  5.8, text:'THE SEVENTH FROM ADAWM' },
    { t:124.5, to:129.0, text:'AND THEY LOOKED DOWN' },
    { t:190.0, to:195.0, text:'AND THE RUCHOT BORE ME UPWARD' },
  ],

  fades:[
    { t:122.5, to:129.5, hold:1.6 },
    { t:188.0, to:195.5, hold:1.4 },
  ],

  caps:[
    /* --- the words of the berakah, and the vision --- */
    { t:  6.0, to: 21.0, q:['chanok',1,1] },
    { t: 22.0, to: 39.0, q:['chanok',1,2] },
    { t: 40.0, to: 57.0, q:['chanok',1,4,5] },
    /* --- when the children of men had multiplied --- */
    { t: 58.0, to: 75.0, q:['chanok',3,1,2] },
    { t: 76.0, to: 93.0, q:['chanok',3,4] },
    /* --- two hundred, on the summit of Hermon --- */
    { t: 94.0, to:111.0, q:['chanok',3,5] },
    { t:112.0, to:121.0, q:['chanok',3,9] },
    /* --- and the four looked down --- */
    { t:130.0, to:151.0, q:['chanok',4,1] },
    { t:152.0, to:171.0, q:['chanok',4,2,3] },
    { t:172.0, to:187.0, q:['chanok',5,1] },
    /* --- borne up out of it --- */
    { t:196.0, to:217.0, q:['chanok',5,8] },
    { t:218.0, to:239.0, q:['chanok',6,1,2] },
    { t:240.0, to:264.0, q:['chanok',6,3] },
  ],
});
