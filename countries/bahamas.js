/* Bahamas — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Bahamas",
c:[-0.3555,0.076],
p:[[[-0.3445,0.067],[-0.3435,0.07],[-0.343,0.074],[-0.3445,0.0745],[-0.3465,0.068],[-0.3445,0.067]],[[-0.342,0.074],[-0.343,0.079],[-0.3475,0.079],[-0.347,0.078],[-0.344,0.0775],[-0.3425,0.074],[-0.342,0.074]],[[-0.3525,0.0735],[-0.352,0.0755],[-0.356,0.0785],[-0.3595,0.0795],[-0.36,0.078],[-0.357,0.0755],[-0.356,0.073],[-0.3525,0.0735]]]
});
