/* Senegal — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Senegal",
c:[-0.1065,0.409],
p:[[[-0.122,0.4065],[-0.1235,0.4015],[-0.1265,0.3985],[-0.123,0.3985],[-0.1185,0.396],[-0.1165,0.3935],[-0.1135,0.3925],[-0.11,0.394],[-0.1065,0.3935],[-0.1025,0.3945],[-0.0995,0.397],[-0.0955,0.3995],[-0.092,0.4045],[-0.0885,0.4095],[-0.0885,0.413],[-0.088,0.416],[-0.0855,0.4185],[-0.0855,0.4205],[-0.086,0.422],[-0.087,0.4225],[-0.091,0.421],[-0.0915,0.4215],[-0.0935,0.4215],[-0.0985,0.4185],[-0.102,0.418],[-0.115,0.414],[-0.1175,0.414],[-0.1195,0.4135],[-0.1235,0.413],[-0.1235,0.4085],[-0.117,0.4105],[-0.1155,0.4105],[-0.114,0.4105],[-0.111,0.41],[-0.108,0.412],[-0.105,0.413],[-0.1015,0.4125],[-0.103,0.4105],[-0.1055,0.411],[-0.1075,0.4105],[-0.11,0.4085],[-0.1125,0.408],[-0.1145,0.4085],[-0.122,0.4065]]]
});
