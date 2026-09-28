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
     verse    the ONE VERSE the short scene holds when it is taken up (§5).
              Every one of these came out of the Besorah by
              tools/extract-besorah.js and is checked by `--check`; `words`
              beside it is narration in the game's own voice and carries no
              chapter and verse, which is the distinction §5 insists on.
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
   one to stand for it would have been inventing an assignment the brief did
   not make — so Ararat waited for a scroll that belongs on it. It has one
   now: THE SCROLL OF THE FLOOD, among the scrolls of the events below.     */

EARTH.scroll({ id:'bereshith', book:'BERĔSHITH', name:'THE SCROLL OF THE BEGINNING',
  country:'Yasharal', bearing:0.6,
  verse:{ t:'In the beginning Aluahim created the shamayim and the earth.',
          ref:'BERĔSHITH 1:1' },
  words:'“In the beginning Aluahim created the shamayim and the earth.” The scroll of the making of the world is yours.' });

EARTH.scroll({ id:'adam-eve-1', book:'ADAM AND HAWWAH 1', name:'THE FIRST SCROLL OF ADAWM AND ḤAWWAH',
  country:'South Africa', bearing:2.1, at:{ cave:true, near:'The Drakensberg' },
  verse:{ t:'On the third day, Aluahim planted the garden in the east of the earth, on the border of the world eastward, beyond which, towards the sun-rising, one finds nothing but water, that encompasses the whole world, and reaches to the borders of shamayim.',
          ref:'ADAM AND HAWWAH 1 1:1' },
  words:'The garden lay eastward, on the border of the world — and this scroll tells where it stood, and of the Cave of Treasures below it.' });

EARTH.scroll({ id:'adam-eve-2', book:'ADAM AND HAWWAH 2', name:'THE SECOND SCROLL OF ADAWM AND ḤAWWAH',
  country:'South Africa', bearing:4.0, at:{ cave:true, near:'The Drakensberg' },
  /* the days after the garden, which Adawm and Ḥawwah lived out in the caves
     under it — its own cave in the same range as the first (Round 107) */
  verse:{ t:"When Luluwa heard Qayin's words, she wept and went to call her father and mother, and told them how that Qayin had killed his brother Heḇal.",
          ref:'ADAM AND HAWWAH 2 1:1' },
  words:'The days of Adawm after the garden, and of his sons, and of the offering that was and was not received.' });

EARTH.scroll({ id:'chanok', book:'ḤANOḴ', name:'THE SCROLL OF ḤANOḴ',
  country:'Ethiopia', bearing:1.3, at:{ cave:true },
  verse:{ t:'The words of the berakah of Ḥanoḵ, wherewith he baruk the elect and righteous, who will be living in the days of tribulation, when all the wicked and wicked are to be removed.',
          ref:'ḤANOḴ 1:1' },
  words:'“And Ḥanoḵ walked with Aluahim, and he was no more, for Aluahim took him.” The scroll of the seventh from Adawm.' });

EARTH.scroll({ id:'yashar', book:'YASHAR', name:'THE SCROLL OF YASHAR',
  country:'Lebanon', bearing:5.2,
  verse:{ t:'And Aluahim formed man from the ground, and he blew into his nostrils the breath of life, and man became a living nephesh endowed with speech.',
          ref:'YASHAR 1:2' },
  words:'“Is it not written in the Scroll of Yashar?” The upright book, that tells the years between the words.' });

EARTH.scroll({ id:'yobelim', book:'YOḆELIM', name:'THE SCROLL OF JUBILEES',
  country:'Egypt', bearing:3.4,
  verse:{ t:'It happened in the first year of the exodus of the children of Yasharal out of Mitsrayim, in the third month, on the sixteenth day of the month, that Aluahim spoke to Mosheh, saying, "Come up to Me on the Mountain, and I will give you two tablets of stone of the law and the mitsvah, which I have written, that you may teach them."',
          ref:'YOḆELIM 1:1' },
  words:'The division of the days, the weeks of years and the jubilees, from the making of the world to the mountain.' });

EARTH.scroll({ id:'chanok-eth', book:'ḤANOḴ HABASHIY', name:'THE ETHIOPIC SCROLL OF ḤANOḴ',
  country:'Sudan', bearing:0.2,
  verse:{ t:'The words of the berakah of Ḥanoḵ, with which he baruk the elect and righteous, who will be living in the day of tribulation, when all the wicked and wicked are to be removed.',
          ref:'ḤANOḴ HABASHIY 1:1' },
  words:'The watchers, the courses of the lights, and the parables — a hundred and eight chapters of what Ḥanoḵ was shown.' });

EARTH.scroll({ id:'shamoth', book:'SHAMOTH', name:'THE SCROLL OF THE GOING OUT',
  country:'Jordan', bearing:2.7, at:{ mount:'Mount Sinai' },
  verse:{ t:"And the Mal'ak of (YAHUAH) HWHY appeared to him in a flame of fire from the midst of a bush. And he looked and saw the bush burning with fire, but the bush was not consumed.",
          ref:'SHAMOTH 3:2' },
  words:'The going out from Mitsrayim, the sea divided, and the mountain that burned with fire.' });

/* ================= THE SCROLLS OF THE EVENTS =================
   The eight above are the BOOKS. These are the ACCOUNT itself, laid where it
   happened: the flood on Ararat, the tower at Baḇel, the calling out of Ur,
   Moriyah and Bĕyth ʼĔl, Yosĕph by the pyramids, the sea divided, Neḇo,
   the walls of Yahriḥo, the valley of Ĕlah, the House, Karmel, Ninewĕh, the
   lions' den and the queen in Persia — so that sailing the earth and going
   ashore is walking the story from the ark to the exile, and every scroll
   taken up is one event of it remembered at its own place.

   (This pays the debt noted above: Ararat has its scroll now, and it IS the
   account of the flood.)

   at:{ landmark:'…' } lays the scroll just outside the court of a named
   work of the ancients (world/landmarks.js) on its bearing; `country` is
   still given, and is used if that landmark is ever taken off the chart.
   Every verse here came out of the Besorah by tools/extract-besorah.js, and
   `--check` holds it to the letter. */

EARTH.scroll({ id:'flood', book:'BERĔSHITH', name:'THE SCROLL OF THE FLOOD',
  country:'Turkey', bearing:0, at:{ mount:'Mount Ararat' },
  verse:{ t:'And in the seventh month, the seventeenth day of the month, the ark rested on the mountains of Ararat.',
          ref:'BERĔSHITH 8:4' },
  words:'Forty days of rain, and a world gone under the waters — and on these heights the ark of Noaḥ came to rest, and the earth was given back.' });

EARTH.scroll({ id:'babel', book:'BERĔSHITH', name:'THE SCROLL OF THE TOWER',
  country:'Iraq', bearing:0.5, at:{ landmark:'Babel — Etemenanki of Babylon' },
  verse:{ t:'That is why its name was called Baḇal, because there (YAHUAH) HWHY confused the language of all the earth and from there (YAHUAH) HWHY scattered them over the face of all the earth.',
          ref:'BERĔSHITH 11:9' },
  words:'Here men of one speech built a tower to reach the shamayim, and here their tongues were confused and they were scattered over all the earth.' });

EARTH.scroll({ id:'abram', book:'BERĔSHITH', name:'THE SCROLL OF THE CALLING OF AḆRAM',
  country:'Iraq', bearing:2.6, at:{ landmark:'The Ziggurat of Ur' },
  verse:{ t:'And (YAHUAH) HWHY said to Aḇram, “Go yourself out of your land, from your relatives and from your father’s house, to a land which I show you.',
          ref:'BERĔSHITH 12:1' },
  words:'Out of Ur of the Chaldeans Aḇram was called, to leave his father’s house and go to a land he had not seen.' });

EARTH.scroll({ id:'sedom', book:'BERĔSHITH', name:'THE SCROLL OF SEḎOM AND AMORAH',
  country:'Jordan', bearing:4.3,
  verse:{ t:'And (YAHUAH) HWHY rained sulphur and fire on Seḏom and Amorah, from (YAHUAH) HWHY out of the shamayim.',
          ref:'BERĔSHITH 19:24' },
  words:'By the salt sea the cities of the plain were overthrown, and Lot was brought out of them by the hand.' });

EARTH.scroll({ id:'moriyah', book:'BERĔSHITH', name:'THE SCROLL OF MORIYAH',
  country:'Yahudah', bearing:2.2,
  verse:{ t:'And He said, “Take your son, now, your only son Yahtsḥaq, whom you love and go to the land of Moriyah and offer him there as a burnt offering on one of the mountains which I command you.”',
          ref:'BERĔSHITH 22:2' },
  words:'On a mountain in the land of Moriyah, Aḇraham bound his son on the altar — and a ram was provided in his stead.' });

EARTH.scroll({ id:'bethel', book:'BERĔSHITH', name:'THE SCROLL OF BĔYTH ʼĔL',
  country:'Yahudah', bearing:0.3,
  verse:{ t:'And he dreamed and saw a ladder set up on the earth and its top reached to the shamayim and saw mal\'akim of Aluahim going up and coming down on it.',
          ref:'BERĔSHITH 28:12' },
  words:'Ya‛aqoḇ lay down with a stone for his pillow and dreamed of a ladder to the shamayim, and called the place the House of Al.' });

EARTH.scroll({ id:'yoseph', book:'BERĔSHITH', name:'THE SCROLL OF YOSĔPH',
  country:'Egypt', bearing:5.4, at:{ landmark:'The Pyramids of Giza' },
  verse:{ t:'And Pharaoh said to Yosĕph, “See, I have set you over all the land of Mitsrayim.”',
          ref:'BERĔSHITH 41:41' },
  words:'Sold by his brothers, a slave and then a prisoner — and at the last set over all the land of Mitsrayim, to keep the world alive through seven years of famine.' });

EARTH.scroll({ id:'red-sea', book:'SHAMOTH', name:'THE SCROLL OF THE SEA DIVIDED',
  country:'Egypt', bearing:1.6,
  verse:{ t:'And Mosheh stretched out his hand over the sea. And (YAHUAH) HWHY caused the sea to go back by a strong east ruach all that night and made the sea into dry land and the waters were divided.',
          ref:'SHAMOTH 14:21' },
  words:'Between the chariots of Pharaoh and the sea, the waters were divided, and Yasharal went through on dry ground.' });

EARTH.scroll({ id:'nebo', book:'DAḆARIM', name:'THE SCROLL OF MOUNT NEḆO',
  country:'Jordan', bearing:1,
  verse:{ t:'And Mosheh went up from the desert plains of Mo’aḇ to Mount Neḇo, to the top of Pisgah, which is opposite Yahriḥo. And (YAHUAH) HWHY showed him all the land of Gil‛aḏ as far as Dan,',
          ref:'DAḆARIM 34:1' },
  words:'After forty years in the wilderness, Mosheh went up and was shown the whole land of promise — and died there, looking on it.' });

EARTH.scroll({ id:'yericho', book:'YAHUSHA', name:'THE SCROLL OF YAHRIḤO',
  country:'Yahudah', bearing:4.8, at:{ landmark:'The Walls of Yericho' },
  verse:{ t:'And the people shouted when the kohanim blew the horns. And it came to be when the people heard the sound of the horn and the people shouted with a great shout, that the wall fell down flat. And the people went up into the city, every man straight before him and they captured the city.',
          ref:'YAHUSHA 6:20' },
  words:'Seven days they went round the city in silence, and on the seventh the horns sounded, the people shouted, and the walls fell flat.' });

EARTH.scroll({ id:'golyath', book:'1 SHAMU\'AL', name:'THE SCROLL OF THE VALLEY OF ĔLAH',
  country:'Yasharal', bearing:3.2,
  verse:{ t:'Thus Dawiḏ prevailed over the Philistine with a sling and a stone and smote the Philistine and killed him and there was no sword in the hand of Dawiḏ.',
          ref:'1 SHAMU\'AL 17:50' },
  words:'A shepherd boy with a sling and five smooth stones, and the champion of the Philistines lying on his face in the valley.' });

EARTH.scroll({ id:'temple', book:'1 MALAḴIM', name:'THE SCROLL OF THE HOUSE',
  country:'Yahudah', bearing:3.9,
  verse:{ t:'And it came to be, when the kohanim came out of the Qodash (Set Apart Place), that the cloud filled the House of (YAHUAH) HWHY,',
          ref:'1 MALAḴIM 8:10' },
  words:'Shelomoh built the House on the mountain, of cedar and hewn stone — and when it was finished the cloud filled it.' });

EARTH.scroll({ id:'karmel', book:'1 MALAḴIM', name:'THE SCROLL OF KARMEL',
  country:'Yasharal', bearing:5.6,
  verse:{ t:'Then the fire of (YAHUAH) HWHY fell and consumed the burnt offering and the wood and the stones and the dust and it licked up the water that was in the trench.',
          ref:'1 MALAḴIM 18:38' },
  words:'Eliyahu alone against the prophets of Baʽal on the mountain, the altar drenched with water — and the fire fell.' });

EARTH.scroll({ id:'yonah', book:'YONAH', name:'THE SCROLL OF YONAH',
  country:'Iraq', bearing:1.4, at:{ landmark:'The Gates of Nineveh' },
  verse:{ t:'And the men of Ninewĕh believed in Aluahim and proclaimed a fast and put on sackcloth, from the greatest to the least of them.',
          ref:'YONAH 3:5' },
  words:'The prophet who fled by sea and was swallowed by a great fish came at last to the gates of Ninewĕh — and the great city turned.' });

EARTH.scroll({ id:'danial', book:'DANI\'AL', name:'THE SCROLL OF DANI’AL',
  country:'Iraq', bearing:3.6, at:{ landmark:'Babel — Etemenanki of Babylon' },
  verse:{ t:'“My Al has sent His mal\'ak and has shut the lions’ mouths and they did not harm me, because I was found innocent before Him. And also before you, O sovereign, I have done no harm.”',
          ref:'DANI\'AL 6:22' },
  words:'Carried away to Baḇel, faithful in the court of its kings, thrown to the lions — and the lions’ mouths were shut.' });

EARTH.scroll({ id:'ester', book:'ESTĔR', name:'THE SCROLL OF ESTĔR',
  country:'Iran', bearing:1,
  verse:{ t:'“For if you keep entirely silent at this time, relief and deliverance shall arise for the Yahuḏim from another place, while you and your father’s house perish. And who knows whether you have come to the reign for such a time as this?”',
          ref:'ESTĔR 4:14' },
  words:'A queen in Persia who went in to the king unbidden, at the risk of her life, and her people were saved.' });
