/* HEWN STONE — stone dressed by a man's iron

   The living rock of this world is UNHEWN: it is what a hill is made of and
   what a shaft is cut through. THIS is what a mason makes of it — squared,
   faced, ready to lay. It is a WORK (world/works.js), and it is the one
   thing an altar may not be built of, which is the reason it exists as its
   own block at all rather than as a name for rock.

   One block, one file. Add a file, add a line to world/manifest.js. */
EARTH.block({
  id:'hewn-stone', name:'Hewn Stone',
  tex:{all:'hewnStone'},
  hardness:3.6,         /* seconds to break it by hand */
  tool:'pick', drops:'hewn-stone',
  opaque:true, gravity:false,
  verse:{ t:'And the sovereign commanded and they brought large stones, precious stones, to lay the foundation of the House with hewn stones.',
          ref:'MELAKIM ALEPH 5:17' }
});
