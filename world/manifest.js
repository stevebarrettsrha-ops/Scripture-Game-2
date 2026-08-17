/* ============================================================
   THE MANIFEST — every file of the world, in the order it must be read
   ------------------------------------------------------------
   THE FAULT THIS FILE MENDS. `index.html` carried three hundred and
   sixty-five <script src> tags, and `scripture-unfolds/index.html`
   carried the same three hundred and sixty-five again with `../` in
   front of each — the same list, written twice, and about to be written
   twice more as the blocks and the authored places arrive. Two copies of
   an ORDERED list is a bug with a date on it: the day someone adds a
   country to one and not the other, the two games are different worlds.

   THE ORDER IS THE WHOLE POINT. The registry in the page must stand
   before any file that declares into it, every country before the engine
   that rasterises them, every creature before the fauna table that names
   it, and `js/engine.js` last of all. So this is a LIST, not a set, and
   nothing here may be sorted.

   HOW IT IS LOADED, AND WHY IT IS NOT ALL AT ONCE ANY MORE.
   `async=false` is the one thing that makes a dynamically inserted script
   keep its place in the queue: the browser fetches in parallel and runs
   strictly in the order the tags were added. That much is unchanged, and
   it is the reason this could be done at all without a build step.

   WHAT WAS WRONG WITH IT. All three hundred and sixty-five were appended
   in one go, and **one file that failed to arrive killed the whole
   world**: the promise rejected, the loading screen said "A file of the
   world could not be read: creatures/jerboa.js", and that was the end of
   it — a game of a hundred and seventy-six countries refusing to start
   over one gerbil. There was no retry, and a browser asked for three
   hundred and sixty-five files at once over `file://` — or a phone on a
   thin connection, or a disk with a scanner sitting on it — will drop one
   sooner or later. It is not a rare event; it is a Tuesday.

   SO IT IS LOADED IN ORDERED BATCHES, and each batch is awaited before
   the next is appended. The order is therefore exactly what it always
   was, and a file that fails is TRIED AGAIN — twice more, in its own
   place, before the next batch exists.

   AND WHAT HAPPENS IF IT STILL WILL NOT COME. That depends entirely on
   whether the world can stand without it, and the answer is written into
   SKIPPABLE below rather than guessed at: a CREATURE or a CITY is looked
   up by name and its absence costs exactly one beast or one town, so the
   voyage sails without it and says so. A COUNTRY or a BLOCK is positional
   — country ids and block ids are the file's place in this list — so one
   missing would silently shift every id after it and hand the traveller a
   different world with the same save file. Those are fatal, and rightly.

   ADDING A THING TO THE WORLD is still: write the file, add one line
   here. That property is the project's most important, and it is not
   weakened by this file — it is the only place the line now goes.
   ============================================================ */
(function(){
'use strict';
const FILES=[
  'countries/fiji.js',
  'countries/tanzania.js',
  'countries/w-sahara.js',
  'countries/canada.js',
  'countries/united-states-of-america.js',
  'countries/kazakhstan.js',
  'countries/uzbekistan.js',
  'countries/papua-new-guinea.js',
  'countries/indonesia.js',
  'countries/argentina.js',
  'countries/chile.js',
  'countries/dem-rep-congo.js',
  'countries/somalia.js',
  'countries/kenya.js',
  'countries/sudan.js',
  'countries/chad.js',
  'countries/haiti.js',
  'countries/dominican-rep.js',
  'countries/russia.js',
  'countries/bahamas.js',
  'countries/falkland-is.js',
  'countries/norway.js',
  'countries/greenland.js',
  'countries/fr-s-antarctic-lands.js',
  'countries/timor-leste.js',
  'countries/south-africa.js',
  'countries/lesotho.js',
  'countries/mexico.js',
  'countries/uruguay.js',
  'countries/brazil.js',
  'countries/bolivia.js',
  'countries/peru.js',
  'countries/colombia.js',
  'countries/panama.js',
  'countries/costa-rica.js',
  'countries/nicaragua.js',
  'countries/honduras.js',
  'countries/el-salvador.js',
  'countries/guatemala.js',
  'countries/belize.js',
  'countries/venezuela.js',
  'countries/guyana.js',
  'countries/suriname.js',
  'countries/france.js',
  'countries/ecuador.js',
  'countries/puerto-rico.js',
  'countries/jamaica.js',
  'countries/cuba.js',
  'countries/zimbabwe.js',
  'countries/botswana.js',
  'countries/namibia.js',
  'countries/senegal.js',
  'countries/mali.js',
  'countries/mauritania.js',
  'countries/benin.js',
  'countries/niger.js',
  'countries/nigeria.js',
  'countries/cameroon.js',
  'countries/togo.js',
  'countries/ghana.js',
  'countries/cote-d-ivoire.js',
  'countries/guinea.js',
  'countries/guinea-bissau.js',
  'countries/liberia.js',
  'countries/sierra-leone.js',
  'countries/burkina-faso.js',
  'countries/central-african-rep.js',
  'countries/congo.js',
  'countries/gabon.js',
  'countries/eq-guinea.js',
  'countries/zambia.js',
  'countries/malawi.js',
  'countries/mozambique.js',
  'countries/eswatini.js',
  'countries/angola.js',
  'countries/burundi.js',
  'countries/israel.js',
  'countries/lebanon.js',
  'countries/madagascar.js',
  'countries/palestine.js',
  'countries/gambia.js',
  'countries/tunisia.js',
  'countries/algeria.js',
  'countries/jordan.js',
  'countries/united-arab-emirates.js',
  'countries/qatar.js',
  'countries/kuwait.js',
  'countries/iraq.js',
  'countries/oman.js',
  'countries/vanuatu.js',
  'countries/cambodia.js',
  'countries/thailand.js',
  'countries/laos.js',
  'countries/myanmar.js',
  'countries/vietnam.js',
  'countries/north-korea.js',
  'countries/south-korea.js',
  'countries/mongolia.js',
  'countries/india.js',
  'countries/bangladesh.js',
  'countries/bhutan.js',
  'countries/nepal.js',
  'countries/pakistan.js',
  'countries/afghanistan.js',
  'countries/tajikistan.js',
  'countries/kyrgyzstan.js',
  'countries/turkmenistan.js',
  'countries/iran.js',
  'countries/syria.js',
  'countries/armenia.js',
  'countries/sweden.js',
  'countries/belarus.js',
  'countries/ukraine.js',
  'countries/poland.js',
  'countries/austria.js',
  'countries/hungary.js',
  'countries/moldova.js',
  'countries/romania.js',
  'countries/lithuania.js',
  'countries/latvia.js',
  'countries/estonia.js',
  'countries/germany.js',
  'countries/bulgaria.js',
  'countries/greece.js',
  'countries/turkey.js',
  'countries/albania.js',
  'countries/croatia.js',
  'countries/switzerland.js',
  'countries/luxembourg.js',
  'countries/belgium.js',
  'countries/netherlands.js',
  'countries/portugal.js',
  'countries/spain.js',
  'countries/ireland.js',
  'countries/new-caledonia.js',
  'countries/solomon-is.js',
  'countries/new-zealand.js',
  'countries/australia.js',
  'countries/sri-lanka.js',
  'countries/china.js',
  'countries/taiwan.js',
  'countries/italy.js',
  'countries/denmark.js',
  'countries/united-kingdom.js',
  'countries/iceland.js',
  'countries/azerbaijan.js',
  'countries/georgia.js',
  'countries/philippines.js',
  'countries/malaysia.js',
  'countries/brunei.js',
  'countries/slovenia.js',
  'countries/finland.js',
  'countries/slovakia.js',
  'countries/czechia.js',
  'countries/eritrea.js',
  'countries/japan.js',
  'countries/paraguay.js',
  'countries/yemen.js',
  'countries/saudi-arabia.js',
  'countries/n-cyprus.js',
  'countries/cyprus.js',
  'countries/morocco.js',
  'countries/egypt.js',
  'countries/libya.js',
  'countries/ethiopia.js',
  'countries/djibouti.js',
  'countries/somaliland.js',
  'countries/uganda.js',
  'countries/rwanda.js',
  'countries/bosnia-and-herz.js',
  'countries/north-macedonia.js',
  'countries/serbia.js',
  'countries/montenegro.js',
  'countries/kosovo.js',
  'countries/trinidad-and-tobago.js',
  'countries/s-sudan.js',
  'cities/tsor.js',
  'cities/yapho.js',
  'cities/no-amon.js',
  'cities/korinthos.js',
  'cities/ostia.js',
  'cities/tarshish.js',
  'cities/ephesus.js',
  'cities/londin.js',
  'cities/massilia.js',
  'cities/lisbon.js',
  'cities/tingis.js',
  'cities/muziris.js',
  'cities/canton.js',
  'cities/sakai.js',
  'cities/new-haven.js',
  'cities/bahia.js',
  'cities/cape.js',
  'cities/amsteldam.js',
  /* THE PALETTE — every colour in the world, named once, as the pigments a */
  /* painter of that world actually ground. It must be loaded before the */
  /* engine: the engine's first act is to paint its textures out of it. */
  'world/palette.js',
  'world/rivers.js',
  'world/verses.js',
  'world/landmarks.js',
  'world/waterfalls.js',
  'world/deeps.js',
  'world/scenes.js',
  /* THE SCROLLS HIDDEN IN THE EARTH — what the voyage is for */
  'world/scrolls.js',
  /* WHICH BEASTS WALK IN WHICH LAND. One line to a nation; edit it and */
  /* reload, and that country carries different creatures. */
  'world/fauna.js',
  /* WHICH SUBSTANCES LIE UNDER WHICH LAND, and how deep, and how often. */
  /* The same shape again: one line to a substance, naming the countries. */
  'world/minerals.js',
  /* AND WHAT A MAN CAN MAKE OF THEM — the named works, each with its verse, */
  /* and one of them that refuses a material outright. Not a tech tree. */
  'world/works.js',
  /* AND WHAT GROWS IN IT. The same shape: one line to a nation, naming the */
  /* trees, orchards, bushes, berries and herbs that land bears. */
  'world/flora.js',
  /* EVERY LIVING THING, ONE TO A FILE. Edit any of these and reload; the */
  /* beast is rebuilt from its own file. `metres` in each file is the beast's */
  /* TRUE adult length, and the game scales the model to match it. */
  'creatures/fish.js',
  'creatures/puffer.js',
  'creatures/jelly.js',
  'creatures/crab.js',
  'creatures/squid.js',
  'creatures/anglerfish.js',
  'creatures/sardine.js',
  'creatures/mackerel.js',
  'creatures/salmon.js',
  'creatures/cod.js',
  'creatures/tuna.js',
  'creatures/turtle.js',
  'creatures/ray.js',
  'creatures/dolphin.js',
  'creatures/shark.js',
  'creatures/hammerhead.js',
  'creatures/whale-shark.js',
  'creatures/orca.js',
  'creatures/narwhal.js',
  'creatures/whale.js',
  /* THE BEASTS OF THE FIELD, one to a file, the same as the beasts of the */
  /* sea above. `metres` is the beast's TRUE adult length (or height, where */
  /* the file says axis:'y'); the game draws the whole herd of them at one */
  /* scale, in proportion with the cattle already standing in the villages. */
  'creatures/giraffe.js',
  'creatures/zebra.js',
  'creatures/wildebeest.js',
  'creatures/gazelle.js',
  'creatures/oryx.js',
  'creatures/buffalo.js',
  'creatures/rhino.js',
  'creatures/hippo.js',
  'creatures/warthog.js',
  'creatures/cheetah.js',
  'creatures/leopard.js',
  'creatures/hyena.js',
  'creatures/jackal.js',
  'creatures/baboon.js',
  'creatures/meerkat.js',
  'creatures/gorilla.js',
  'creatures/chimpanzee.js',
  'creatures/okapi.js',
  'creatures/lemur.js',
  'creatures/tiger.js',
  'creatures/panda.js',
  'creatures/redpanda.js',
  'creatures/mule.js',
  'creatures/orangutan.js',
  'creatures/waterbuffalo.js',
  'creatures/yak.js',
  'creatures/snowleopard.js',
  'creatures/macaque.js',
  'creatures/tapir.js',
  'creatures/komodo.js',
  'creatures/peacock.js',
  'creatures/saiga.js',
  'creatures/boar.js',
  'creatures/fox.js',
  'creatures/arcticfox.js',
  'creatures/badger.js',
  'creatures/lynx.js',
  'creatures/bison.js',
  'creatures/moose.js',
  'creatures/reindeer.js',
  'creatures/chamois.js',
  'creatures/hedgehog.js',
  'creatures/cougar.js',
  'creatures/jaguar.js',
  'creatures/llama.js',
  'creatures/alpaca.js',
  'creatures/capybara.js',
  'creatures/sloth.js',
  'creatures/armadillo.js',
  'creatures/anteater.js',
  'creatures/raccoon.js',
  'creatures/skunk.js',
  'creatures/coyote.js',
  'creatures/pronghorn.js',
  'creatures/howler.js',
  'creatures/kangaroo.js',
  'creatures/koala.js',
  'creatures/wombat.js',
  'creatures/emu.js',
  'creatures/dingo.js',
  'creatures/cassowary.js',
  'creatures/kiwi.js',
  'creatures/tasdevil.js',
  'creatures/polarbear.js',
  'creatures/muskox.js',
  'creatures/otter.js',
  'creatures/beaver.js',
  'creatures/platypus.js',
  /* and the beasts of the waste, which had none of its own */
  'creatures/wildass.js',
  'creatures/addax.js',
  'creatures/blackbuck.js',
  'creatures/caracal.js',
  'creatures/bustard.js',
  'creatures/jerboa.js',
  'creatures/viper.js',
  'creatures/scorpion.js',
  /* and of the ice, which had four beasts and now has its own life */
  'creatures/mammoth.js',
  'creatures/arcticwolf.js',
  'creatures/wolverine.js',
  'creatures/arctichare.js',
  'creatures/ermine.js',
  'creatures/lemming.js',
  'creatures/ptarmigan.js',
  'creatures/penguin.js',
  /* and of the rivers and the deep */
  'creatures/seal.js',
  'creatures/walrus.js',
  'creatures/octopus.js',
  'creatures/swordfish.js',
  'creatures/barracuda.js',
  'creatures/manatee.js',
  'creatures/trout.js',
  'creatures/catfish.js',
  'creatures/piranha.js',
  'creatures/sturgeon.js',
  'creatures/riverdolphin.js',
  'creatures/beluga.js',
  'creatures/greenlandshark.js',
  'creatures/arcticchar.js',
  /* THE REEF IN FULL: the anemone and its clownfish, the grazers and the */
  /* hunters of the coral, and the still things of the bed. */
  'creatures/clownfish.js',
  'creatures/anemone.js',
  'creatures/seahorse.js',
  'creatures/parrotfish.js',
  'creatures/angelfish.js',
  'creatures/lionfish.js',
  'creatures/moray.js',
  'creatures/lobster.js',
  'creatures/starfish.js',
  'creatures/urchin.js',
  /* THE OPEN SEA: the great pelagic fish, the schooling silver, and the */
  /* whales and sharks that were wanting. */
  'creatures/marlin.js',
  'creatures/sunfish.js',
  'creatures/flyingfish.js',
  'creatures/herring.js',
  'creatures/anchovy.js',
  'creatures/spermwhale.js',
  'creatures/tigershark.js',
  /* THE DEEP, PEOPLED AT LAST: the twilight zone, the midnight zone, the */
  /* abyssal plain and the hadal trenches, each with its true tenants. */
  'creatures/lanternfish.js',
  'creatures/hatchetfish.js',
  'creatures/barreleye.js',
  'creatures/viperfish.js',
  'creatures/dragonfish.js',
  'creatures/gulper.js',
  'creatures/siphonophore.js',
  'creatures/giantsquid.js',
  'creatures/dumbo.js',
  'creatures/isopod.js',
  'creatures/seacucumber.js',
  'creatures/tripodfish.js',
  'creatures/grenadier.js',
  'creatures/snailfish.js',
  'creatures/amphipod.js',
  /* THE GRASS OF THE EARTH. What grows where, read by the chunk mesher when */
  /* it draws a blade AND by every beast that walks out to eat one. */
  /* THE MEASURE OF EVERY LIVING THING. One table of true adult sizes, in */
  /* metres, and everything in the world is built to it — so every creature */
  /* stands beside the traveller at the size it really is. */
  'js/size.js',
  'js/grass.js',
  /* AND EVERYTHING WOODY AND EVERYTHING BEARING: the forms every tree, bush, */
  /* cane and herb in the world is built out of. */
  'js/flora.js',
  'js/water.js',
  'js/waterfall.js',
  /* WHERE EVERY CREATURE MAKES ITS HOME — nest, eyrie, scrape, den, burrow, */
  /* warren, lair, lodge, holt and mound, each to the kind that builds it. */
  'js/nest.js',
  /* AND THE YOUNG IN THEM: the chicks in the nest, and the calf, cub, foal, */
  /* kid, pup and joey at their mothers' foot. */
  'js/chicks.js',
  'js/baby-animals.js',
  /* THE DAY'S WORK OF EVERY LIVING THING: what hours each creature keeps, */
  /* what pace it goes at, where it sleeps, and the small business of its day */
  /* — the dust-bath, the wallow, the watch — one table the engine obeys. */
  /* THE LAW OF THE FOOTFALL — walk, pace, trot, canter, gallop, bound. Four */
  /* numbers to a gait, and the engine reads them. */
  /* THE HOLLOW PLACES OF THE EARTH — the law of the caves. It is handed the */
  /* countries they belong to and knows nothing else of this world. */
  'js/caves.js',
  'js/gait.js',
  'js/behavior.js',
  /* THE TWO GREAT LIGHTS: the sun's circuit and the moon's, their arcs over */
  /* the traveller's sky, and the whole law of day, dusk and true sunset. */
  'js/sun-moon.js',
  /* THE FOUR SEASONS: the law of the year and its zones — tropical, */
  /* temperate and polar — and the traveller's hand upon it. */
  'js/season.js',
  /* EVERY KIND OF BLOCK THE WORLD IS MADE OF, one to a file. They declare
     into the registry and are read by the mesher, the hand and the works;
     the order among them fixes nothing but their numbering, and the save
     carries a table of their names so that numbering may change safely. */
  'blocks/alabaster.js',
  'blocks/altar.js',
  'blocks/bench.js',
  'blocks/bitumen.js',
  'blocks/brick.js',
  'blocks/clay-band.js',
  'blocks/cobble.js',
  'blocks/copper-ore.js',
  'blocks/dirt.js',
  'blocks/emerald.js',
  'blocks/flint.js',
  'blocks/flint-axe.js',
  'blocks/flint-hoe.js',
  'blocks/flint-knife.js',
  'blocks/flint-pick.js',
  'blocks/flint-spade.js',
  'blocks/glass.js',
  'blocks/gold-ore.js',
  'blocks/grass.js',
  'blocks/hay.js',
  'blocks/hewn-stone.js',
  'blocks/ice.js',
  'blocks/iron-ore.js',
  'blocks/jasper.js',
  'blocks/kiln.js',
  'blocks/leaves.js',
  'blocks/log.js',
  'blocks/path.js',
  'blocks/planks.js',
  'blocks/roof-tile.js',
  'blocks/ruby.js',
  'blocks/salt.js',
  'blocks/sapphire.js',
  'blocks/sand.js',
  'blocks/shoham.js',
  'blocks/silver-ore.js',
  'blocks/snow.js',
  'blocks/bucket.js',
  'blocks/soil.js',
  'blocks/stone.js',
  'blocks/topaz.js',
  'blocks/water-bucket.js',
  'blocks/water.js',
  'blocks/wool.js',
  'js/engine.js',
];

window.MANIFEST={
  files:FILES,
  count:FILES.length,
  /* `prefix` is what stands before every path — '' for the voyage itself,
     '../' for SCRIPTURE UNFOLDS, which is one folder down and raises the
     same world. `onProgress(done,total)` is called as they land, so a
     loading screen can move. Resolves when the last of them has RUN, not
     merely arrived. */
  /* a file whose absence costs one thing and not the world — see the head
     of this file. Everything else is positional and its loss is fatal. */
  skippable(f){ return /^(creatures|cities)\//.test(f); },
  /* the files that were asked for three times and never came, and that the
     world could stand without. Empty on a whole world; the page names them
     to the traveller rather than leaving a hole where a beast should be. */
  lost:[],

  load(prefix,onProgress){
    prefix=prefix||'';
    const FILES2=FILES, BATCH=32, TRIES=3;
    const head=document.head||document.documentElement;
    let done=0;
    const lost=[];
    /* one file, in its own place in the queue, tried until it comes */
    function one(f,attempt){
      return new Promise(res=>{
        const s=document.createElement('script');
        s.src=prefix+f;
        /* THE ONE LINE THAT MATTERS: without it a dynamically inserted
           script is async, and the files would run in whatever order they
           happened to arrive in — which for an ordered world is no order
           at all. */
        s.async=false;
        s.onload=()=>res(null);
        s.onerror=()=>res(new Error('could not read '+prefix+f));
        head.appendChild(s);
      }).then(err=>{
        if(!err) return null;
        if(attempt<TRIES) return one(f,attempt+1);   /* again, in its place */
        return err;
      });
    }
    function batch(i){
      if(i>=FILES2.length){
        if(lost.length) MANIFEST.lost=lost.slice();
        return Promise.resolve();
      }
      const slice=FILES2.slice(i,i+BATCH);
      return Promise.all(slice.map(f=>one(f,1).then(err=>{
        done++; if(onProgress) onProgress(done,FILES2.length);
        return err?{f,err}:null;
      }))).then(res=>{
        for(const r of res){
          if(!r) continue;
          if(MANIFEST.skippable(r.f)){
            lost.push(r.f); MANIFEST.lost=lost.slice();
            if(window.console) console.warn('THE WORLD IS SHORT ONE THING: '+r.err.message+
              ' — it is looked up by name, so the voyage sails without it.');
          }
          /* positional — its place in this list IS its id, and a world built
             without it would hand the traveller different stone under the same
             save file. Better to stop, and say plainly why. */
          else throw new Error('A file of the world could not be read: '+prefix+r.f+
            '. The world cannot stand without it — every block and every country is '+
            'known by its place in the list, so what was built would be a different '+
            'world under the same log. Open it again; if it still will not come, that '+
            'file is missing from beside this page.');
        }
        return batch(i+BATCH);
      });
    }
    if(!FILES.length) return Promise.resolve();
    return batch(0);
  }
};
})();
