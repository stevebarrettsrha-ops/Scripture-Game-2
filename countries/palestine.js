/* Yahudah — the hill country that holds Yahrushalayim, as it was BCE. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Yahudah",
verse:{ t:"And Yahudah and Yisharal dwelt safely, each man under his vine and under his fig tree, from Dan even to Be'ersheba.",
        ref:"MELAKIM ALEPH 4:25" },
c:[0.1865,0.264],
p:[[[0.1885,0.265],[0.1865,0.267],[0.186,0.266],[0.1865,0.2645],[0.185,0.2645],[0.184,0.261],[0.186,0.2605],[0.188,0.263],[0.1885,0.265]]]
});
