/* ============ THE SIXTH SCROLL: THE DIVISION OF THE DAYS ============
   YOḆELIM — the book that counts.

   Every other scroll on this shelf tells you what happened. This one tells
   you WHEN, and insists on it: six days and a shabbath, fifty-two weeks,
   three hundred and sixty-four days to the year and not one day out of
   place, seven years to a week of years and forty-nine yobelim from the days
   of Adawm to the mountain Mosheh is standing on while he is told all of it.

   SO THE FILM IS A DAY. The one track in this game where the stage dials are
   not dressing but the SUBJECT: it opens in the last dark before dawn, the
   sun comes up over the course of the first movement, stands at noon while
   the six days are recited, goes down through the evening as the weeks are
   counted, and the host comes out for the yobelim. When the last caption
   names the forty-nine jubilees the sun is coming up again — because that is
   what the book says a year is, and this world keeps that year.

   IT IS ALSO THE ONLY FILM ANCHORED IN THE HIGH GROUND. `anchor:'coast'` is
   the shore every other scroll is staged on; this one is a man on a mountain
   in a cloud for six days, so the camera is kept high and the cloud is kept
   on him — the `clouds` dial at its full through the whole of the first
   movement, which is the nearest thing this stage has to an overshadowing. */

STORY.scene({
  id:'yobelim',
  name:'THE DIVISION OF THE DAYS',
  book:'yobelim',
  anchor:'coast',
  next:null,

  stage:[
    /* the last dark before the morning of the sixteenth day */
    { t:  0, hour:4.4, dark:0.42, light:0.34, sky:0x1e2740, sun:0, moon:0.9, stars:0.95, firm:0.10,
      land:1, sea:1, clouds:1, lifeSea:1, lifeAir:1, lifeLand:1,
      fogN:300, fogF:1000, cd:300, cy:150, ca:0.00, cl:22, cfov:60, cut:true },
    { t: 20, hour:5.6, cd:270, cy:132, cl:20, ca:0.025, dark:0.24, light:0.52, sky:0x4b4360,
      sun:0.25, moon:0.6, stars:0.55 },              /* come up to Me on the Mountain */
    { t: 42, hour:7.2, cd:240, cy:116, cl:18, ca:0.055, dark:0.08, light:0.78, sky:0x8d7f86,
      sun:0.65, moon:0.2, stars:0.10 },              /* the cloud overshadowed it six days */
    { t: 64, hour:9, cd:210, cy: 98, cl:16, ca:0.085, dark:0, light:0.94, sky:0xa9bcd2,
      sun:0.92, moon:0, stars:0 },                   /* the flame on the top */
    /* ---- write the complete history: six days, and the seventh ---- */
    { t: 88, hour:11.4, cd:250, cy:112, cl:18, ca:0.120, light:1, sun:1, sky:0x9fc5e8,
      fogN:400, fogF:1240 },
    { t:112, hour:12.6, cd:300, cy:140, cl:22, ca:0.155 },
    { t:136, hour:13.8, cd:340, cy:168, cl:26, ca:0.190 },      /* the sun, for a great sign */
    /* ---- and the weeks were counted, and the light went down ---- */
    { t:162, hour:15.6, cd:300, cy:132, cl:20, ca:0.225, light:0.86, sun:0.74, sky:0xb3a795 },
    { t:186, hour:17.4, cd:260, cy:110, cl:17, ca:0.255, light:0.66, sun:0.34, sky:0x8f7a72 },
    { t:210, hour:19.4, cd:280, cy:124, cl:19, ca:0.290, light:0.46, sun:0.06, sky:0x4d4a63,
      moon:0.7, stars:0.55, fogN:320, fogF:1060 },
    /* ---- forty-nine yobelim from the days of Adawm until this day ---- */
    { t:236, hour:21.6, cd:330, cy:160, cl:24, ca:0.325, light:0.32, sun:0, sky:0x232c48,
      moon:1, stars:1, firm:0.22 },
    { t:262, hour:23.4, cd:360, cy:186, cl:28, ca:0.360 },
    /* ---- and the year comes round, which is the whole of the book ---- */
    { t:276, hour:27.4, cd:320, cy:158, cl:24, ca:0.395, dark:0.10, light:0.62, sky:0x6b5f77,
      sun:0.40, moon:0.4, stars:0.30 },
    { t:296, hour:30.2, cd:290, cy:138, cl:21, ca:0.420, dark:0, light:0.94, sky:0xa9bcd2,
      sun:0.92, moon:0, stars:0 },
  ],

  titles:[
    { t:  1.2, to:  5.6, text:'THE DIVISION OF THE DAYS' },
    { t: 82.0, to: 87.0, text:'WRITE THE COMPLETE HISTORY' },
    { t:230.0, to:235.0, text:'AND THE YOḆELIM SHALL PASS BY' },
  ],

  fades:[
    { t: 80.0, to: 87.5, hold:1.4 },
    { t:156.0, to:161.5, hold:1.0 },
    { t:228.0, to:235.5, hold:1.4 },
  ],

  caps:[
    /* --- come up to Me on the Mountain --- */
    { t:  6.0, to: 19.0, q:['yobelim',1,1] },
    { t: 20.0, to: 41.0, q:['yobelim',1,2] },
    { t: 42.0, to: 63.0, q:['yobelim',1,3] },
    { t: 64.0, to: 79.0, q:['yobelim',1,4] },
    /* --- how in six days He finished all His works --- */
    { t: 88.0, to:111.0, q:['yobelim',2,1] },
    { t:112.0, to:135.0, q:['yobelim',2,9] },
    { t:136.0, to:155.0, q:['yobelim',4,17] },
    /* --- and the weeks of days that make the year --- */
    { t:162.0, to:185.0, q:['yobelim',6,30] },
    { t:186.0, to:209.0, q:['yobelim',6,32] },
    { t:210.0, to:227.0, q:['yobelim',4,23] },
    /* --- forty-nine yobelim from the days of Adawm --- */
    { t:236.0, to:261.0, q:['yobelim',50,4] },
    { t:262.0, to:294.0, q:['yobelim',1,5] },
  ],
});
