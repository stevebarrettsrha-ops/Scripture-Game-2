/* Gambia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Gambia",
c:[-0.112,0.41],
p:[[[-0.122,0.4065],[-0.1145,0.4085],[-0.1125,0.408],[-0.11,0.4085],[-0.1075,0.4105],[-0.1055,0.411],[-0.103,0.4105],[-0.1015,0.4125],[-0.105,0.413],[-0.108,0.412],[-0.111,0.41],[-0.114,0.4105],[-0.1155,0.4105],[-0.117,0.4105],[-0.1235,0.4085],[-0.122,0.4065]]]
});
