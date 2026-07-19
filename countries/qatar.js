/* Qatar — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Qatar",
c:[0.28,0.2255],
p:[[[0.281,0.229],[0.2775,0.227],[0.2765,0.2235],[0.277,0.222],[0.2795,0.2215],[0.282,0.2235],[0.284,0.2265],[0.283,0.2285],[0.281,0.229]]]
});
