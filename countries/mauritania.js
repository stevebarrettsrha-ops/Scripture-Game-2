/* Mauritania — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Mauritania",
c:[-0.085,0.385],
p:[[[-0.1125,0.3665],[-0.1105,0.365],[-0.0855,0.372],[-0.085,0.3635],[-0.0825,0.3615],[-0.0765,0.362],[-0.074,0.348],[-0.054,0.352],[-0.0525,0.344],[-0.031,0.36],[-0.0405,0.359],[-0.04,0.383],[-0.039,0.4075],[-0.038,0.408],[-0.04,0.412],[-0.0685,0.408],[-0.07,0.4095],[-0.0725,0.4085],[-0.077,0.409],[-0.0815,0.4065],[-0.084,0.406],[-0.0855,0.409],[-0.0885,0.4095],[-0.092,0.4045],[-0.0955,0.3995],[-0.0995,0.397],[-0.1025,0.3945],[-0.1065,0.3935],[-0.11,0.394],[-0.1135,0.3925],[-0.1165,0.3935],[-0.116,0.3905],[-0.1135,0.3885],[-0.111,0.3835],[-0.1105,0.378],[-0.1105,0.3755],[-0.109,0.373],[-0.11,0.37],[-0.1125,0.3665]]]
});
