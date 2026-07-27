/* THE SCENES — one to an entry, and every one of them data.
   A scene is a short piece of film the engine plays with the camera: it takes
   the body out of the traveller's hands, drops the letterbox, dresses the
   world for the shot, moves the eye through a list of marks, holds a verse on
   the screen, and puts everything back exactly as it found it.

   Add one here and it exists. Nothing else needs touching.

   name    a name to play it by.
   dur     how long it runs, in seconds.
   lines   verses; ONE is taken at random each time it plays. [text, reference]
   cap     [in, out] — when the verse is on the screen.
   set     how the world is DRESSED while it runs. Every field is optional:
             letterbox  the black bars
             hideHud    the button rail, the compass rose, the place-line
             hideVoidWall  the dark cylinder at the rim comes down — it is the
                        right thing to see from WITHIN the world, and a smooth
                        blank across the sight from without
             glass      how solid the firmament is drawn (0..1)
             voidDark   how far the sky gives way to the outer darkness (0..1)
             stars      the host of the sky (0..1)
             outerDeep  the deep beyond the vault (0..1)
             noSnow     no drift of blowing snow across the shot
             fadeIn/fadeOut  seconds the dressing takes to come up and go down
   actor   what the traveller does:
             stand : true   set him upright, facing his bearing
             reach : [a,b,c,d]  he lifts a hand between a and b, and lowers it
                                between c and d
             keep  : true   leave the body exactly as the mode had it
   shots   THE MARKS THE EYE MOVES THROUGH. Each is:
             t   when this mark is reached
             d   how far the eye stands from him
             y   how far above his feet
             s   swung round: 0 straight BEHIND him, 1 out in FRONT of him
             L   where it looks: this far out along his own bearing
             h   and this far above his feet
           Everything between two marks is eased, so nothing ever snaps.  */

/* ---- AT THE WORLD'S EDGE ----
   He has walked out across two thousand feet of ice to where the firmament
   comes down to meet it, and he sets his hand upon the glass. The wall of
   night goes down, the day drains out of the sky, and the host of the
   shamayim stands in the outer dark on every side. */
EARTH.scene({
  name:'firmament',
  dur:14.0,
  cap:[2.6,11.8],
  lines:[
    ['“He stretches out the north over empty space, and hangs the earth upon nothing.”','IYOB 26:7'],
    ['“It is He who sits above the circle of the earth — who stretches out the heavens like a curtain, and spreads them out like a tent to dwell in.”','YASHA’YAHU 40:22'],
    ['“He has inscribed a circle upon the face of the waters, at the boundary of light and darkness.”','IYOB 26:10'],
  ],
  set:{ letterbox:true, hideHud:true, hideVoidWall:true, noSnow:true,
        glass:0.33, voidDark:1.0, stars:0.92, outerDeep:0.94,
        fadeIn:3.2, fadeOut:2.0 },
  actor:{ stand:true, reach:[1.1,2.6,11.6,12.8] },
  shots:[
    /*  t     dist  lift  swing   out    up      what is seen                */
    { t: 0.0, d: 54, y: 12, s:0.00, L: 320, h:  40 },  /* over his shoulder — ice, rim, glass */
    { t: 2.6, d: 34, y: 13, s:0.10, L: 110, h:  22 },  /* closer; he lifts his hand   */
    { t: 5.4, d: 30, y:  5, s:0.52, L:   4, h:  23 },  /* low at his side — the hand ON the glass */
    { t: 8.4, d: 46, y: 52, s:0.16, L: 900, h: 120 },  /* back and up — out past the rim */
    { t:11.4, d: 74, y: 96, s:0.06, L:2200, h: 300 },  /* the hold upon the abyss     */
    { t:14.0, d: 50, y: 12, s:0.02, L: 300, h:  34 },  /* and back to his shoulder    */
  ],
});

/* ---- THE FLOOR OF THE DEEP ----
   And the other end of the same world. He has gone down eleven kilometres of
   black water and stands on the deepest ground there is. No sky here, no
   host, no glass — only the dark, the floor, and how far it is back up. */
EARTH.scene({
  name:'hadal',
  dur:9.0,
  cap:[1.6,7.4],
  lines:[
    ['“Have you entered into the springs of the sea? Or have you walked in the recesses of the deep?”','IYOB 38:16'],
    ['“You cast me into the deep, into the heart of the seas, and the flood surrounded me.”','YONAH 2:3'],
    ['“He uncovers deep things out of darkness, and brings the shadow of death to light.”','IYOB 12:22'],
  ],
  set:{ letterbox:true, hideHud:true, fadeIn:1.6, fadeOut:1.4 },
  actor:{ keep:true },
  shots:[
    { t: 0.0, d: 26, y:  9, s:0.00, L: 120, h:  14 },  /* off his shoulder, on the floor */
    { t: 3.2, d: 40, y: 16, s:0.55, L:  30, h:  10 },  /* swung round him, low over the ground */
    { t: 6.4, d: 58, y: 40, s:0.95, L:   0, h:   6 },  /* drawn off and up — one man in the dark */
    { t: 9.0, d: 30, y: 11, s:0.10, L: 120, h:  12 },  /* and back to him              */
  ],
});
