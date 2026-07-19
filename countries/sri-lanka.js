/* Sri Lanka — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Sri Lanka",
c:[0.4515,0.0725],
p:[[[0.4535,0.0655],[0.459,0.0675],[0.46,0.071],[0.46,0.0785],[0.455,0.0815],[0.447,0.0815],[0.439,0.076],[0.443,0.0715],[0.447,0.0685],[0.4535,0.0655]]]
});
