/* ========= THE SEVENTH SCROLL: THE COURSES OF THE LIGHTS =========
   ḤANOḴ HABASHIY — a hundred and eight chapters, and this film takes the
   third of them that nothing else in this game could show.

   TWO BOOKS OF ḤANOḴ STAND ON THIS SHELF and they must not be one film told
   twice. The shorter scroll is the one about the earth going wrong — the
   oath on Hermon, the giants, the four looking down — and that is
   04-chanok.js, and it ends by carrying him up out of it. This one begins
   where that one ends and never comes down: the courses of the luminaries,
   the six doors the sun rises in and the six it sets in, the moon's measured
   light, the twelve doors at the ends of the earth from which the winds go
   out, the four quarters, the pillars of the shamayim, and the firmament of
   the shamayim above at the end of the earth.

   AND THIS IS THE FILM THIS PARTICULAR GAME WAS BUILT TO SHOW. Everything
   Urial walks him through is a description of the world in §1 of the brief —
   a disc with a rim, a vault standing on it, the two lights going round
   INSIDE the vault and returning by the north to rise again. This project
   models all of it. So the film does one long climb, from the water at the
   first caption to the vault at the last, with the coarse carpet on beneath
   it the whole way — because from up there the streamed ring is a raft, and
   the earth this book describes must run out to a rim or the reading of it
   is a lie.

   THE ONE THING IT WILL NOT DO is go up far enough to look down on the whole
   disc from outside. The voyage has a chart for that and the chart is not a
   place — it is a map that takes over as the eye leaves the world. A film
   about the ends of the earth is filmed FROM the earth, looking out.     */

STORY.scene({
  id:'chanok-eth',
  name:'THE COURSES OF THE LIGHTS',
  book:'chanok-eth',
  anchor:'coast',
  next:null,

  stage:[
    /* the water, before first light — every luminary in the film is still to come */
    { t:  0, hour:4.8, dark:0.30, light:0.46, sky:0x2c3854, sun:0, moon:0.85, stars:0.95, firm:0.14,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1,
      fogN:340, fogF:1200, cd:220, cy: 54, ca:0.00, cl:10, cfov:60, cut:true },
    { t: 22, hour:5.8, cd:260, cy: 88, cl:14, ca:0.030, dark:0.16, light:0.68, sky:0x5b5a72,
      sun:0.35, moon:0.5, stars:0.55 },              /* the luminaries do not change their orbits */
    /* ---- the sun has its rising in the eastern doors ---- */
    { t: 46, hour:7.4, cd:340, cy:160, cl:18, ca:0.062, dark:0, light:0.94, sky:0xa8b9cd,
      sun:0.95, moon:0.2, stars:0.10, firm:0.22, far:1, clouds:0.62,
      fogN:520, fogF:2400 },
    { t: 72, hour:10.2, cd:440, cy:250, cl:16, ca:0.095, light:1, sun:1, sky:0x9fc5e8,
      clouds:0.30, fogN:640, fogF:3200 },
    { t: 98, hour:12.6, cd:560, cy:350, cl:12, ca:0.130, firm:0.32, clouds:0.12, fogF:4000 },
    /* ---- and after this law, the law of the smaller luminary ---- */
    { t:126, hour:14.6, cd:660, cy:440, cl: 8, ca:0.165, light:0.80, sun:0.45, sky:0x7d8fae,
      moon:0.85, stars:0.35, firm:0.40, clouds:0.05, fogF:4600 },
    { t:152, hour:16.8, cd:760, cy:530, cl: 6, ca:0.200, light:0.62, sun:0.12, sky:0x4f5c7e,
      moon:1, stars:0.75, firm:0.50, clouds:0, fogF:5200 },
    /* ---- twelve doors at the ends of the earth ---- */
    { t:180, hour:18.6, cd:880, cy:620, cl: 3, ca:0.238, cfov:66, light:0.56, sky:0x3d4a6b,
      stars:0.88, firm:0.62, clouds:0, fogN:800, fogF:6000 },
    { t:208, hour:20, cd:1000, cy:700, cl: 0, ca:0.276, fogF:6600 },
    { t:236, hour:21.2, cd:1120, cy:780, cl: 0, ca:0.314, light:0.50, sky:0x33405f,
      stars:0.95, firm:0.74 },
    /* ---- the pillars of the shamayim, and the firmament above ---- */
    { t:266, hour:22.4, cd:1240, cy:880, cl: 0, ca:0.352, cfov:70, light:0.46, sky:0x27314b,
      stars:1, firm:0.88, fogF:7400 },
    { t:296, hour:23.4, cd:1340, cy:980, cl: 0, ca:0.390, firm:1, sky:0x1c2540 },
    { t:322, hour:24.2, cd:1400, cy:1040, cl: 0, ca:0.424 },
  ],

  titles:[
    { t:  1.2, to:  5.8, text:'THE COURSES OF THE LIGHTS' },
    { t:174.0, to:179.0, text:'AT THE ENDS OF THE EARTH' },
    { t:260.0, to:265.0, text:'AND THE FIRMAMENT ABOVE' },
  ],

  fades:[
    { t: 40.0, to: 45.5, hold:1.0 },
    { t:172.0, to:179.5, hold:1.4 },
    { t:258.0, to:265.5, hold:1.4 },
  ],

  caps:[
    /* --- observe everything that takes place in the sky --- */
    { t:  6.0, to: 21.0, q:['chanok-eth',2,1] },
    { t: 22.0, to: 39.0, q:['chanok-eth',5,1] },
    /* --- the book of the courses of the luminaries --- */
    { t: 46.0, to: 71.0, q:['chanok-eth',72,1] },
    { t: 72.0, to: 97.0, q:['chanok-eth',72,2,3] },
    { t: 98.0, to:121.0, q:['chanok-eth',72,5] },
    /* --- and the smaller luminary, and her measure --- */
    { t:126.0, to:151.0, q:['chanok-eth',73,1,2] },
    { t:152.0, to:171.0, q:['chanok-eth',73,3] },
    /* --- the twelve doors, and the four quarters --- */
    { t:180.0, to:207.0, q:['chanok-eth',76,1,2] },
    { t:208.0, to:235.0, q:['chanok-eth',77,1,2] },
    { t:236.0, to:257.0, q:['chanok-eth',33,2] },
    /* --- the pillars of the shamayim --- */
    { t:266.0, to:295.0, q:['chanok-eth',18,2,3] },
    { t:296.0, to:320.0, q:['chanok-eth',18,5] },
  ],
});
