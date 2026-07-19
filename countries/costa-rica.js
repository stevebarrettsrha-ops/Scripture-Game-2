/* Costa Rica — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Costa Rica",
c:[-0.443,0.0455],
p:[[[-0.443,0.058],[-0.444,0.055],[-0.446,0.0555],[-0.447,0.057],[-0.4475,0.056],[-0.4485,0.0565],[-0.4495,0.056],[-0.451,0.0555],[-0.45,0.051],[-0.449,0.0495],[-0.448,0.0505],[-0.447,0.05],[-0.446,0.0475],[-0.445,0.0445],[-0.4445,0.0415],[-0.443,0.041],[-0.4425,0.039],[-0.444,0.0395],[-0.4455,0.038],[-0.444,0.036],[-0.4435,0.0335],[-0.4425,0.0325],[-0.441,0.0325],[-0.439,0.0335],[-0.4385,0.031],[-0.437,0.033],[-0.4365,0.034],[-0.4375,0.039],[-0.4365,0.0405],[-0.437,0.043],[-0.438,0.0445],[-0.438,0.047],[-0.4365,0.0485],[-0.4395,0.051],[-0.441,0.054],[-0.443,0.058]]]
});
