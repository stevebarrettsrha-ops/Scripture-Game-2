/* W. Sahara — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"W. Sahara",
c:[-0.076,0.354],
p:[[[-0.052,0.3425],[-0.052,0.343],[-0.0525,0.344],[-0.054,0.352],[-0.074,0.348],[-0.0765,0.362],[-0.0825,0.3615],[-0.085,0.3635],[-0.0855,0.372],[-0.1105,0.365],[-0.1125,0.3665],[-0.1115,0.3645],[-0.1115,0.3645],[-0.097,0.368],[-0.0955,0.3665],[-0.0925,0.3645],[-0.0885,0.3575],[-0.0785,0.354],[-0.074,0.3475],[-0.072,0.3475],[-0.0695,0.3435],[-0.064,0.344],[-0.062,0.345],[-0.0595,0.3455],[-0.057,0.345],[-0.0535,0.345],[-0.053,0.3425],[-0.052,0.3425]]]
});
