/* Sierra Leone — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Sierra Leone",
c:[-0.0915,0.443],
p:[[[-0.103,0.4385],[-0.0985,0.437],[-0.0975,0.436],[-0.096,0.435],[-0.0935,0.4355],[-0.0915,0.4345],[-0.0855,0.436],[-0.084,0.438],[-0.0825,0.441],[-0.083,0.4425],[-0.082,0.444],[-0.0825,0.446],[-0.0805,0.446],[-0.0845,0.448],[-0.0885,0.4505],[-0.0895,0.452],[-0.0915,0.453],[-0.0935,0.4525],[-0.099,0.449],[-0.1025,0.445],[-0.103,0.443],[-0.103,0.4385]]]
});
