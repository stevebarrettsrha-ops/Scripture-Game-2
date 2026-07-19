/* Lithuania — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Lithuania",
c:[0.0785,0.1765],
p:[[[0.085,0.171],[0.0865,0.173],[0.085,0.176],[0.0855,0.179],[0.083,0.1825],[0.08,0.184],[0.0785,0.1825],[0.0765,0.183],[0.076,0.1815],[0.0755,0.18],[0.074,0.18],[0.07,0.18],[0.068,0.176],[0.0705,0.173],[0.076,0.1715],[0.0785,0.1695],[0.0795,0.1705],[0.081,0.17],[0.085,0.171]]]
});
