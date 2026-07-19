/* Guinea-Bissau — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Guinea-Bissau",
c:[-0.1135,0.418],
p:[[[-0.1235,0.413],[-0.1195,0.4135],[-0.1175,0.414],[-0.115,0.414],[-0.102,0.418],[-0.1025,0.4195],[-0.1035,0.42],[-0.103,0.422],[-0.1045,0.4225],[-0.106,0.422],[-0.1085,0.4225],[-0.1105,0.4215],[-0.1145,0.4235],[-0.118,0.42],[-0.121,0.419],[-0.122,0.417],[-0.122,0.416],[-0.1235,0.4145],[-0.1235,0.413]]]
});
