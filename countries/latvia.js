/* Latvia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Latvia",
c:[0.0775,0.167],
p:[[[0.083,0.1605],[0.085,0.161],[0.0865,0.1635],[0.0885,0.1655],[0.0865,0.169],[0.085,0.171],[0.081,0.17],[0.0795,0.1705],[0.0785,0.1695],[0.076,0.1715],[0.0705,0.173],[0.068,0.176],[0.0665,0.172],[0.0665,0.1685],[0.0685,0.1655],[0.0725,0.1685],[0.075,0.167],[0.0735,0.163],[0.0755,0.161],[0.077,0.161],[0.0805,0.162],[0.083,0.1605]]]
});
