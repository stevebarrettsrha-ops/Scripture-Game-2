/* ================= THE SCROLLS HIDDEN IN THE EARTH =================
   The scrolls are what the voyage is FOR. Each one lies in a named land,
   near the village or the great city of that land, and taking it up writes
   it into the log for good — and opens its passage in SCRIPTURE UNFOLDS,
   which reads the same log.

   The golden arrow over the traveller's head points to the nearest one he
   has not yet found. When they are all gathered it has nothing left to
   point at, and says so.

   Add one here and it exists; nothing else needs touching.

     id       what the log calls it, and what the story layer unlocks
     book     the scroll of the Besorah it carries
     name     what is shown when it is taken up
     country  the land it lies in — must match a country's name exactly
     bearing  which way out from that land's site it lies (radians), so two
              scrolls in one land never land on the same stone
     words    what is said when it is taken up
     at       OPTIONAL — a PLACE that overrides the country and the bearing:
                { mount:'Mount Sinai' }  the highest ground of that height
                { cave:true }            deep in a hollow, under real rock

   ---- WHY THREE OF THEM NAME A PLACE ----
   §5 of the brief: *"Make the great scrolls cost something. With caves in the
   world, put them where they belong."* A scroll lying on open grass two
   hundred paces from a village is a thing a man walks past; the same scroll
   at the top of a climb, or at the end of a dark passage with a torch in his
   hand, is a thing he WENT AND GOT.

   Only the three the brief names are moved:
     · the Cave of Treasures, under the garden — Adam and Ḥawwah I;
     · the Scroll of the Going Out at the top of Sinai — Shamoth;
     · Ḥanoḵ in the Ethiopian highlands, reached through the ranges.

   §5 also says *"Mount Ararat — the scroll on the summit"* and does NOT say
   which scroll. None of the eight is the account of the flood, and choosing
   one to stand for it would be inventing an assignment the brief did not
   make. Ararat waits for a scroll that belongs on it. It is written here so
   that the omission is a decision and not an oversight.                     */

EARTH.scroll({ id:'bereshith', book:'BERĔSHITH', name:'THE SCROLL OF THE BEGINNING',
  country:'Yasharal', bearing:0.6,
  words:'“In the beginning Aluahim created the shamayim and the earth.” The scroll of the making of the world is yours.' });

EARTH.scroll({ id:'adam-eve-1', book:'ADAM AND HAWWAH 1', name:'THE FIRST SCROLL OF ADAWM AND ḤAWWAH',
  country:'Iraq', bearing:2.1, at:{ cave:true },
  words:'The garden lay eastward, on the border of the world — and this scroll tells where it stood, and of the Cave of Treasures below it.' });

EARTH.scroll({ id:'adam-eve-2', book:'ADAM AND HAWWAH 2', name:'THE SECOND SCROLL OF ADAWM AND ḤAWWAH',
  country:'Iran', bearing:4.0,
  words:'The days of Adawm after the garden, and of his sons, and of the offering that was and was not received.' });

EARTH.scroll({ id:'chanok', book:'ḤANOḴ', name:'THE SCROLL OF ḤANOḴ',
  country:'Ethiopia', bearing:1.3, at:{ cave:true },
  words:'“And Ḥanoḵ walked with Aluahim, and he was no more, for Aluahim took him.” The scroll of the seventh from Adawm.' });

EARTH.scroll({ id:'yashar', book:'YASHAR', name:'THE SCROLL OF YASHAR',
  country:'Lebanon', bearing:5.2,
  words:'“Is it not written in the Scroll of Yashar?” The upright book, that tells the years between the words.' });

EARTH.scroll({ id:'yobelim', book:'YOḆELIM', name:'THE SCROLL OF JUBILEES',
  country:'Egypt', bearing:3.4,
  words:'The division of the days, the weeks of years and the jubilees, from the making of the world to the mountain.' });

EARTH.scroll({ id:'chanok-eth', book:'ḤANOḴ HABASHIY', name:'THE ETHIOPIC SCROLL OF ḤANOḴ',
  country:'Sudan', bearing:0.2,
  words:'The watchers, the courses of the lights, and the parables — a hundred and eight chapters of what Ḥanoḵ was shown.' });

EARTH.scroll({ id:'shamoth', book:'SHAMOTH', name:'THE SCROLL OF THE GOING OUT',
  country:'Jordan', bearing:2.7, at:{ mount:'Mount Sinai' },
  words:'The going out from Mitsrayim, the sea divided, and the mountain that burned with fire.' });
