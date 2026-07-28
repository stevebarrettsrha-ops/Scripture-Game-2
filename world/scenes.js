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
           Everything between two marks is eased, so nothing ever snaps.

   ================= AND FOR A LONG PASSAGE =================
   Everything above makes one good short shot. These make a FILM:

   caps    A CAPTION TRACK — as many lines as the passage wants, each with
           its own hour: [{t, to, text, ref}]. (`lines`+`cap` still gives
           one random verse for the whole scene, as before.)
   titles  [{t, to, text}] — a named passage, shown large. Put one inside a
           fade and it reads as a chapter heading.
   fades   [{t, to, hold}] — the screen goes to black, sits for `hold`, and
           comes back by `to`. THIS IS WHAT CUTS A LONG SCENE INTO
           PASSAGES; without it a two-minute scene is one endless take.
   set.hour  the hour the scene wants (0..24). The world's own clock is put
           back untouched at the end — so a passage written for dusk plays
           at dusk whenever the traveller comes to it.

   and every SHOT may also carry:
             fwd   carry the anchor this far along his bearing …
             side  … this far to his right …
             up    … and this far above him. THIS IS WHAT LETS A SCENE
                   TRAVEL: down a valley, up a mountain, out over the sea,
                   instead of circling one spot for ever.
             lside swing the look-at off the bearing too
             fov   the lens: 40 is long and flat, 90 is wide and hurls the
                   world away from you. Move it against `d` for the vertigo
                   shot — the dolly-zoom.
             roll  the horizon tipped off level — the dutch angle
             cut   TRUE for a HARD CUT: the eye does not travel to this
                   mark, it simply IS there. Without it every shot blends
                   into the next.
             ease  'smooth' (default), 'linear' for a steady crawl, 'hold'
                   to sit dead still and then arrive all at once.

   THE PLAYER MAY ALWAYS LEAVE: ESC, F or SPACE ends any scene at once.   */

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

/* ---- THE COMING OF THE EVENING ----
   A LONG PASSAGE, and the proof that one can be written: seventy seconds in
   four movements, cut apart by fades, each titled, narrated the whole way
   through by its own caption track, travelling out across the land instead
   of turning on one spot, and set at the hour it wants whatever hour the
   traveller brought with him.
   It is played by name — __VDBG.playScene('evening', at) — and is here as
   much to be READ as to be watched: every long-form feature is used once. */
EARTH.scene({
  name:'evening',
  dur:70.0,
  set:{ letterbox:true, hideHud:true, hour:18.4, fadeIn:2.4, fadeOut:2.2 },
  actor:{ stand:true },
  titles:[
    { t: 0.4, to: 4.0, text:'THE EVENING' },
    { t:19.4, to:23.0, text:'THE FIELD' },
    { t:39.4, to:43.0, text:'THE HEIGHT' },
    { t:57.4, to:61.0, text:'AND THE NIGHT' },
  ],
  fades:[
    { t:18.4, to:24.0, hold:1.6 },     /* between the movements the world goes */
    { t:38.4, to:44.0, hold:1.6 },     /* dark, is named, and comes back        */
    { t:56.4, to:62.0, hold:1.6 },
  ],
  caps:[
    { t: 5.0, to:11.0, text:'“The sun knows its going down.”', ref:'TEHILLIM 104:19' },
    { t:11.8, to:17.6, text:'“You make darkness, and it is night, wherein all the beasts of the forest creep forth.”', ref:'TEHILLIM 104:20' },
    { t:25.0, to:31.0, text:'“He causes the grass to grow for the cattle, and herb for the service of man.”', ref:'TEHILLIM 104:14' },
    { t:31.8, to:37.6, text:'“Man goes forth unto his work and to his labour until the evening.”', ref:'TEHILLIM 104:23' },
    { t:45.0, to:51.0, text:'“The high hills are a refuge for the wild goats, and the rocks for the conies.”', ref:'TEHILLIM 104:18' },
    { t:51.8, to:55.8, text:'“O YAHUAH, how manifold are Your works! In wisdom You have made them all.”', ref:'TEHILLIM 104:24' },
    { t:63.0, to:69.0, text:'“The earth is full of Your riches.”', ref:'TEHILLIM 104:24' },
  ],
  shots:[
    /* ---- I. THE EVENING — the eye drawn back and up off his shoulder ---- */
    { t: 0.0, d: 26, y:  9, s:0.05, L: 200, h:  26, fov:62 },
    { t: 9.0, d: 62, y: 34, s:0.02, L: 520, h:  60, fov:58, ease:'linear' },
    { t:18.4, d:110, y: 74, s:0.00, L: 900, h:  90, fov:54, ease:'linear' },
    /* ---- II. THE FIELD — a HARD CUT, then a long travelling crawl out
       across the country, the anchor itself carried forward ---- */
    { t:24.0, d: 20, y:  7, s:0.62, L:  60, h:   8, fov:70, cut:true },
    { t:31.0, d: 22, y:  8, s:0.70, L:  90, h:  10, fwd: 260, side: 40, ease:'linear' },
    { t:38.4, d: 26, y: 11, s:0.78, L: 120, h:  12, fwd: 620, side: 90, ease:'linear' },
    /* ---- III. THE HEIGHT — cut again, and climb: the anchor lifts, the
       lens goes long, and the horizon tips a little off level ---- */
    { t:44.0, d: 44, y: 20, s:0.30, L: 300, h:  40, fov:66, up:  60, cut:true },
    { t:50.0, d: 90, y: 90, s:0.20, L: 700, h: 120, fov:52, up: 320, roll:0.05, ease:'linear' },
    { t:56.4, d:150, y:170, s:0.12, L:1400, h: 220, fov:44, up: 760, roll:0.09, ease:'linear' },
    /* ---- IV. AND THE NIGHT — back to the man, small under the whole of it ---- */
    { t:62.0, d: 34, y: 13, s:0.08, L: 260, h:  30, fov:62, cut:true },
    { t:70.0, d: 58, y: 26, s:0.04, L: 460, h:  54, fov:60, ease:'linear' },
  ],
});
