/* Estonia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Estonia",
c:[0.0765,0.156],
p:[[[0.0795,0.15],[0.0795,0.15],[0.0805,0.1505],[0.08,0.154],[0.083,0.1585],[0.083,0.1605],[0.0805,0.162],[0.077,0.161],[0.0755,0.161],[0.0735,0.163],[0.0725,0.16],[0.072,0.161],[0.0695,0.16],[0.068,0.157],[0.0705,0.154],[0.0735,0.152],[0.077,0.1515],[0.0795,0.15],[0.0795,0.15]]]
});
