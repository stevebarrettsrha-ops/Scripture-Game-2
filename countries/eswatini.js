/* eSwatini — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"eSwatini",
c:[0.3375,0.552],
p:[[[0.3445,0.5495],[0.3435,0.553],[0.3385,0.557],[0.331,0.558],[0.33,0.556],[0.3315,0.553],[0.3315,0.551],[0.334,0.549],[0.3395,0.5465],[0.342,0.548],[0.3445,0.5495]]]
});
