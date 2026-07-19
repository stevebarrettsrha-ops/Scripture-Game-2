/* Eq. Guinea — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Eq. Guinea",
c:[0.086,0.4835],
p:[[[0.0815,0.4805],[0.0955,0.478],[0.0965,0.4845],[0.0845,0.487],[0.0815,0.4875],[0.08,0.487],[0.0815,0.4805]]]
});
