/* Kyrgyzstan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Kyrgyzstan",
c:[0.2595,0.0745],
p:[[[0.2505,0.0865],[0.2485,0.0845],[0.249,0.0815],[0.253,0.075],[0.25,0.0735],[0.2495,0.0705],[0.2535,0.065],[0.2535,0.063],[0.2555,0.056],[0.257,0.0495],[0.2595,0.0475],[0.261,0.045],[0.262,0.0455],[0.2635,0.0535],[0.2655,0.0555],[0.265,0.0615],[0.268,0.064],[0.266,0.069],[0.266,0.0725],[0.2675,0.0775],[0.269,0.0775],[0.2695,0.079],[0.2675,0.088],[0.264,0.093],[0.2625,0.0985],[0.26,0.097],[0.2625,0.092],[0.2615,0.09],[0.263,0.0865],[0.261,0.0795],[0.2565,0.084],[0.257,0.0875],[0.254,0.0905],[0.2515,0.0855],[0.2505,0.0865]]]
});
