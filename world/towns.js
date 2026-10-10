/* ================= THE TOWNS OF THE LAND, EACH IN ITS PLACE =================
   At the true measure of the earth (ROADMAP Phase T) a land is a hundred and fifty kilometres
   long, and one village to a nation leaves it empty. These are the towns of Yasharal and her
   neighbours by their true latitude and longitude (the tell or the site of the old town, not the
   modern city), named as the Besorah names them, so that a man walking from Yahrushalayim to
   Bĕyth Leḥem walks nine kilometres and finds the town where it stood.

   n     the name, as the Besorah spells it
   lat, lon   the place of the old town
   size  'city' (walled, many quarters) · 'town' (a market, a well, a hundred houses and more) ·
         'village' (a few dozen houses)
   land  the nation it is reckoned to (by its name in countries/)
   by    what stands there, from the Besorah or the record of the land, for the town's own dress

   Read by the engine through EARTH.townList (Phase T6). */
(function(){
const T=[
  /* Yahuḏah and the hill country */
  {n:'Bĕyth Leḥem',  lat:31.7050, lon:35.2024, size:'town',    land:'Yasharal', by:'the city of Dawiḏ, on its ridge over the fields of the shepherds'},
  {n:'Bĕyth Anyah',  lat:31.7717, lon:35.2614, size:'village', land:'Yasharal', by:'beyond the Mount of Olives, on the road down to Yahriḥo'},
  {n:'Ḥeḇron',       lat:31.5326, lon:35.0998, size:'town',    land:'Yasharal', by:'the city of the fathers, high in the hills of Yahuḏah'},
  {n:'Ramah',        lat:31.8500, lon:35.2330, size:'village', land:'Yasharal', by:'on its height north of the city'},
  {n:'Giḇ‛on',       lat:31.8470, lon:35.1850, size:'town',    land:'Yasharal', by:'the great pool cut in the rock'},
  {n:'Bĕyth Ḥoron',  lat:31.8770, lon:35.1270, size:'village', land:'Yasharal', by:'at the head of the ascent from the plain'},
  {n:'Bĕyth Shemesh',lat:31.7510, lon:34.9760, size:'town',    land:'Yasharal', by:'where the hills of Yahuḏah meet the low country'},
  {n:'Emmaus',       lat:31.8390, lon:34.9900, size:'village', land:'Yasharal', by:'at the foot of the hills, on the road to the coast'},
  {n:'Arad',         lat:31.2800, lon:35.1260, size:'town',    land:'Yasharal', by:'at the edge of the Negeḇ'},
  {n:'Be’ĕrsheḇa',   lat:31.2450, lon:34.8410, size:'town',    land:'Yasharal', by:'the wells of the fathers, at the edge of the wilderness'},
  /* the rift */
  {n:'Yahriḥo',      lat:31.8710, lon:35.4440, size:'town',    land:'Yasharal', by:'the city of palm trees, at the spring below the ascent'},
  {n:'Bĕyth She’an', lat:32.5040, lon:35.5030, size:'city',    land:'Yasharal', by:'where the great valley comes down to the Yardĕn'},
  /* Shomeron and the middle hills */
  {n:'Shiloh',       lat:32.0550, lon:35.2890, size:'village', land:'Yasharal', by:'where the Tent of Meeting stood'},
  {n:'Sheḵem',       lat:32.2130, lon:35.2820, size:'town',    land:'Yasharal', by:'between Gerizim and Ebal, by the well of Ya‛aqoḇ'},
  {n:'Shomeron',     lat:32.2760, lon:35.1950, size:'city',    land:'Yasharal', by:'on her hill, the city of the kings of the north'},
  /* the coast and the plain */
  {n:'Yapho',        lat:32.0540, lon:34.7520, size:'town',    land:'Yasharal', by:'the port on its rock, the house of Shim‛on the tanner'},
  {n:'Lod',          lat:31.9510, lon:34.8880, size:'town',    land:'Yasharal', by:'in the plain of Sharon, on the road from Yapho to the hills'},
  {n:'Caesarea',     lat:32.5000, lon:34.8920, size:'city',    land:'Yasharal', by:'the harbour of Herodes, its theatre by the sea'},
  {n:'Ashdoḏ',       lat:31.7550, lon:34.6600, size:'town',    land:'Yasharal', by:'Azotus of the Philistines, near the shore'},
  {n:'Ashqelon',     lat:31.6640, lon:34.5440, size:'city',    land:'Yasharal', by:'on the shore, behind its rampart of earth'},
  {n:'Azzah',        lat:31.5020, lon:34.4630, size:'city',    land:'Yasharal', by:'the last city on the road down to Mitsrayim'},
  {n:'Akko',         lat:32.9210, lon:35.0700, size:'town',    land:'Yasharal', by:'the port at the north end of the bay'},
  {n:'Meḡiddo',      lat:32.5850, lon:35.1840, size:'town',    land:'Yasharal', by:'the tell over the pass, guarding the great plain'},
  /* the Galil and the lake */
  {n:'Natsareth',    lat:32.7020, lon:35.2970, size:'village', land:'Yasharal', by:'in the hills of the lower Galil'},
  {n:'Qanah',        lat:32.7460, lon:35.3420, size:'village', land:'Yasharal', by:'over the valley north of Natsareth'},
  {n:'Kephar Naḥum', lat:32.8810, lon:35.5750, size:'town',    land:'Yasharal', by:'on the north shore of the lake, its assembly of black stone'},
  {n:'Bĕyth Tsaiḏa', lat:32.9100, lon:35.6300, size:'village', land:'Yasharal', by:'where the Yardĕn comes into the lake'},
  {n:'Miḡdal',       lat:32.8250, lon:35.5150, size:'town',    land:'Yasharal', by:'on the west shore, the town of the fish-curers'},
  {n:'Ḥatsor',       lat:33.0170, lon:35.5680, size:'city',    land:'Yasharal', by:'the great tell of the north'},
  {n:'Dan',          lat:33.2490, lon:35.6520, size:'town',    land:'Yasharal', by:'at the springs of the Yardĕn'}
];
window.EARTH=window.EARTH||{};
EARTH.townList=(EARTH.townList||[]).concat(T);
})();
