/* Côte d'Ivoire — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Côte d'Ivoire",
c:[-0.0505,0.453],
p:[[[-0.062,0.439],[-0.061,0.4385],[-0.059,0.4395],[-0.053,0.4405],[-0.0515,0.439],[-0.05,0.4395],[-0.0475,0.439],[-0.047,0.4415],[-0.045,0.441],[-0.0415,0.4405],[-0.0385,0.442],[-0.037,0.444],[-0.0335,0.4455],[-0.031,0.444],[-0.0275,0.444],[-0.022,0.446],[-0.0205,0.454],[-0.024,0.4585],[-0.0265,0.4645],[-0.023,0.4695],[-0.0235,0.4715],[-0.0275,0.4715],[-0.033,0.47],[-0.038,0.4695],[-0.048,0.47],[-0.054,0.471],[-0.0625,0.472],[-0.064,0.4715],[-0.0625,0.467],[-0.0615,0.4665],[-0.0615,0.464],[-0.065,0.4615],[-0.0675,0.4605],[-0.0695,0.459],[-0.0675,0.4565],[-0.0675,0.454],[-0.067,0.4525],[-0.066,0.4525],[-0.065,0.45],[-0.0655,0.449],[-0.0645,0.4485],[-0.0615,0.448],[-0.063,0.4435],[-0.0645,0.441],[-0.0635,0.439],[-0.062,0.439]]]
});
