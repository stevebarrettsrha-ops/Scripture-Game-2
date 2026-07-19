/* Ireland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Ireland",
c:[-0.027,0.2005],
p:[[[-0.0215,0.1995],[-0.0215,0.2035],[-0.025,0.208],[-0.0315,0.2105],[-0.0365,0.209],[-0.033,0.2035],[-0.034,0.198],[-0.0285,0.194],[-0.0255,0.192],[-0.025,0.195],[-0.0265,0.198],[-0.024,0.198],[-0.0215,0.1995]]]
});
