/* Jamaica — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Jamaica",
c:[-0.389,0.0875],
p:[[[-0.388,0.0855],[-0.3875,0.09],[-0.388,0.094],[-0.389,0.0955],[-0.3905,0.091],[-0.3915,0.089],[-0.3915,0.085],[-0.3905,0.0805],[-0.389,0.081],[-0.388,0.084],[-0.388,0.0855]]]
});
