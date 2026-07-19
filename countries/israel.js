/* Israel — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Israel",
c:[0.1855,0.2635],
p:[[[0.186,0.2585],[0.186,0.2605],[0.184,0.261],[0.185,0.2645],[0.1865,0.2645],[0.186,0.266],[0.1865,0.267],[0.1885,0.265],[0.1895,0.2665],[0.1925,0.2755],[0.191,0.2745],[0.184,0.27],[0.184,0.27],[0.184,0.27],[0.184,0.2675],[0.1835,0.2675],[0.1835,0.2645],[0.182,0.2605],[0.182,0.2585],[0.182,0.2585],[0.1835,0.2575],[0.1835,0.2565],[0.1845,0.2555],[0.186,0.2575],[0.1855,0.2585],[0.186,0.2585]]]
});
