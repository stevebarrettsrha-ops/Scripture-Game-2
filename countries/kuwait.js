/* Kuwait — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Kuwait",
c:[0.2495,0.2265],
p:[[[0.2475,0.223],[0.2505,0.224],[0.251,0.225],[0.2555,0.2265],[0.2525,0.23],[0.2495,0.229],[0.2455,0.2325],[0.2445,0.226],[0.2475,0.223]]]
});
