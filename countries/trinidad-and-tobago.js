/* Trinidad and Tobago — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Trinidad and Tobago",
c:[-0.388,0.211],
p:[[[-0.3875,0.209],[-0.385,0.2125],[-0.384,0.214],[-0.388,0.2155],[-0.3915,0.21],[-0.392,0.209],[-0.3895,0.21],[-0.3875,0.209]]]
});
