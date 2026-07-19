/* Luxembourg — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Luxembourg",
c:[0.0235,0.222],
p:[[[0.0235,0.2205],[0.024,0.2215],[0.0245,0.224],[0.023,0.224],[0.022,0.2235],[0.0225,0.2205],[0.0235,0.2205]]]
});
