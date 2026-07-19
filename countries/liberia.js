/* Liberia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Liberia",
c:[-0.0735,0.4565],
p:[[[-0.067,0.4525],[-0.0675,0.454],[-0.0675,0.4565],[-0.0695,0.459],[-0.0675,0.4605],[-0.065,0.4615],[-0.0615,0.464],[-0.0615,0.4665],[-0.0625,0.467],[-0.064,0.4715],[-0.066,0.471],[-0.074,0.4675],[-0.0805,0.462],[-0.087,0.4575],[-0.0915,0.453],[-0.0895,0.452],[-0.0885,0.4505],[-0.0845,0.448],[-0.0805,0.446],[-0.079,0.4465],[-0.0765,0.446],[-0.074,0.45],[-0.075,0.452],[-0.0735,0.4535],[-0.0715,0.454],[-0.0695,0.452],[-0.067,0.4525]]]
});
