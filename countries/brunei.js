/* Brunei — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Brunei",
c:[0.429,-0.2],
p:[[[0.424,-0.202],[0.427,-0.2025],[0.43,-0.204],[0.4315,-0.2],[0.434,-0.1995],[0.433,-0.1945],[0.43,-0.197],[0.424,-0.202]]]
});
