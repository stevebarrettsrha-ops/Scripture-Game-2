/* Cuba — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Cuba",
c:[-0.3725,0.0675],
p:[[[-0.368,0.05],[-0.3675,0.0555],[-0.3665,0.0605],[-0.3675,0.067],[-0.369,0.07],[-0.367,0.0755],[-0.368,0.0785],[-0.37,0.0845],[-0.3715,0.089],[-0.371,0.091],[-0.371,0.0955],[-0.373,0.095],[-0.372,0.1],[-0.3725,0.1055],[-0.374,0.105],[-0.376,0.101],[-0.3775,0.0965],[-0.378,0.092],[-0.381,0.0825],[-0.377,0.0865],[-0.376,0.0835],[-0.3765,0.079],[-0.3755,0.0765],[-0.3725,0.0745],[-0.3735,0.0705],[-0.373,0.0645],[-0.3725,0.062],[-0.373,0.0535],[-0.372,0.051],[-0.3705,0.0535],[-0.371,0.047],[-0.3745,0.0425],[-0.375,0.04],[-0.376,0.039],[-0.377,0.036],[-0.377,0.033],[-0.375,0.0365],[-0.3725,0.0375],[-0.371,0.0405],[-0.3695,0.0435],[-0.3685,0.0485],[-0.368,0.05]]]
});
