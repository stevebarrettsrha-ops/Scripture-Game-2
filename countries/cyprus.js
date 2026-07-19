/* Cyprus — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Cyprus",
c:[0.1675,0.2555],
p:[[[0.165,0.2565],[0.166,0.256],[0.1665,0.255],[0.1675,0.2545],[0.168,0.2545],[0.1685,0.255],[0.1685,0.2545],[0.1695,0.254],[0.17,0.2535],[0.1705,0.253],[0.171,0.2535],[0.1675,0.2585],[0.165,0.259],[0.163,0.258],[0.165,0.2565]]]
});
