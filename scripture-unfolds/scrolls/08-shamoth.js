/* ============ THE EIGHTH SCROLL: THE GOING OUT ============
   SHAMOTH — the bush that burned and was not consumed, the column of cloud
   and the column of fire, the sea gone back by a strong east ruach, and the
   mountain in smoke.

   THIS IS THE SCROLL THAT STANDS ON SINAI in the voyage: `at:{mount:'Mount
   Sinai'}` in world/scrolls.js, ninety-four courses up, and a man has to
   climb for it. What he unlocks by climbing is this.

   FOUR MOVEMENTS, AND EACH ONE HAS ITS OWN LIGHT, which is the whole reason
   this book films well on a stage built out of dials:

     the bush   dusk in a wilderness, everything dark but one thing burning
     the column cloud by day and fire by night — the stage runs both, in
                order, because the verse says the one did not cease by day
                nor the other by night
     the sea    the morning watch: a strong east ruach all night and then the
                waters divided at the break of day, so this movement alone
                is anchored out over water and the light comes up in it
     the mount  Sinai in smoke, all of it, and the smoke going up like the
                smoke of a furnace — the darkest sky in the film, in the
                middle of the day

   The eye is kept LOW throughout, lower than any other film on this shelf.
   Nothing here is seen from the shamayim: every one of these four things was
   seen by people standing on the ground, frightened, at a distance.      */

STORY.scene({
  id:'shamoth',
  name:'THE GOING OUT',
  book:'shamoth',
  anchor:'coast',
  next:null,

  stage:[
    /* the back of the wilderness, at the end of the day */
    { t:  0, hour:18.2, dark:0.14, light:0.66, sky:0x8a6f5e, sun:0.34, moon:0.25, stars:0.10, firm:0.04,
      land:1, sea:1, clouds:0.5, lifeSea:1, lifeAir:1, lifeLand:1, man:1,
      fogN:200, fogF:720, cd:120, cy: 26, ca:0.00, cl: 6, cfov:58, cut:true },
    { t: 18, hour:18.7, cd: 92, cy: 18, cl: 4, ca:0.022, light:0.58, sky:0x7a5a4c, sun:0.20 },
    { t: 40, hour:19.2, cd: 74, cy: 13, cl: 3, ca:0.045, light:0.50, sky:0x6a4a42, sun:0.10,
      fogN:150, fogF:520 },                          /* take your sandals off your feet */
    { t: 62, hour:19.7, cd: 88, cy: 17, cl: 4, ca:0.070, light:0.56, sky:0x74544a, sun:0.14 },
    /* ---- the column of cloud by day ---- */
    { t: 88, hour:32, cd:200, cy: 56, cl:12, ca:0.105, dark:0, light:1, sky:0x9fc5e8, sun:1,
      moon:0, stars:0, clouds:1, man:0, fogN:340, fogF:1080 },
    /* ---- and the column of fire by night ---- */
    { t:110, hour:45, cd:180, cy: 48, cl:10, ca:0.135, dark:0.36, light:0.40, sky:0x232b46,
      sun:0, moon:0.9, stars:0.95, fogN:260, fogF:860 },
    /* ---- the sea, and a strong east ruach all that night ---- */
    { t:136, hour:47, cd:150, cy: 30, cl: 5, ca:0.170, dark:0.42, light:0.36, sky:0x1b2138,
      moon:0.7, stars:0.9, clouds:1, fogN:220, fogF:780 },
    { t:162, hour:51, cd:170, cy: 34, cl: 5, ca:0.205, dark:0.28, light:0.50, sky:0x3b3a54,
      moon:0.4, stars:0.5 },                         /* the morning watch */
    { t:188, hour:53.6, cd:210, cy: 46, cl: 7, ca:0.240, dark:0.06, light:0.82, sky:0x9b8478,
      sun:0.55, moon:0.1, stars:0, fogN:300, fogF:1000 },  /* the break of day */
    { t:214, hour:56.2, cd:250, cy: 62, cl:10, ca:0.275, dark:0, light:0.96, sky:0xa9c2da, sun:0.9 },
    /* ---- and the mountain was in smoke, all of it ---- */
    { t:242, hour:60, cd:180, cy: 44, cl: 9, ca:0.310, dark:0.30, light:0.54, sky:0x4a4038,
      sun:0.18, clouds:1, fogN:190, fogF:640 },
    { t:266, hour:61.2, cd:140, cy: 32, cl: 6, ca:0.340, dark:0.44, light:0.40, sky:0x332c26,
      sun:0.05, fogN:150, fogF:520 },
    { t:292, hour:62.4, cd:120, cy: 26, cl: 5, ca:0.368, dark:0.52, light:0.34, sky:0x241f1c, sun:0 },
    { t:316, hour:63.4, cd:170, cy: 40, cl: 8, ca:0.398, dark:0.46, light:0.38, sky:0x2b2521 },
  ],

  titles:[
    { t:  1.2, to:  5.6, text:'THE GOING OUT' },
    { t: 82.0, to: 87.0, text:'AND THEY WENT OUT' },
    { t:236.0, to:241.0, text:'AND THE MOUNTAIN BURNED WITH FIRE' },
  ],

  fades:[
    { t: 80.0, to: 87.5, hold:1.4 },
    { t:130.0, to:135.5, hold:1.0 },
    { t:234.0, to:241.5, hold:1.6 },
  ],

  caps:[
    /* --- the bush burning, and not consumed --- */
    { t:  6.0, to: 17.0, q:['shamoth',3,1] },
    { t: 18.0, to: 39.0, q:['shamoth',3,2,3] },
    { t: 40.0, to: 61.0, q:['shamoth',3,5] },
    { t: 62.0, to: 79.0, q:['shamoth',3,7] },
    /* --- a column of cloud, and a column of fire --- */
    { t: 88.0, to:109.0, q:['shamoth',13,21] },
    { t:110.0, to:129.0, q:['shamoth',13,22] },
    /* --- and the waters were divided --- */
    { t:136.0, to:161.0, q:['shamoth',14,21] },
    { t:162.0, to:187.0, q:['shamoth',14,22] },
    { t:188.0, to:213.0, q:['shamoth',14,27] },
    { t:214.0, to:233.0, q:['shamoth',14,28] },
    /* --- and Mount Sinai was in smoke, all of it --- */
    { t:242.0, to:265.0, q:['shamoth',19,16] },
    { t:266.0, to:291.0, q:['shamoth',19,18] },
    { t:292.0, to:314.0, q:['shamoth',20,21] },
  ],
});
