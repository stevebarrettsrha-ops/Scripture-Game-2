/* Puerto Rico — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Puerto Rico",
c:[-0.365,0.159],
p:[[[-0.3635,0.1595],[-0.3625,0.163],[-0.363,0.165],[-0.365,0.1635],[-0.367,0.159],[-0.369,0.155],[-0.367,0.154],[-0.366,0.1545],[-0.3635,0.1595]]]
});
