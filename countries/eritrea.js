/* Eritrea — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Eritrea",
c:[0.2665,0.322],
p:[[[0.2495,0.338],[0.2475,0.3365],[0.245,0.328],[0.2435,0.3245],[0.244,0.322],[0.2475,0.318],[0.2485,0.3135],[0.2555,0.316],[0.2605,0.3185],[0.265,0.318],[0.276,0.3155],[0.2815,0.3155],[0.2865,0.315],[0.2895,0.315],[0.2935,0.3135],[0.2925,0.316],[0.29,0.318],[0.287,0.3185],[0.2825,0.318],[0.2785,0.319],[0.276,0.3185],[0.2695,0.321],[0.266,0.3245],[0.2635,0.3245],[0.261,0.328],[0.256,0.329],[0.257,0.3335],[0.2495,0.338]]]
});
