/* Tajikistan — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Tajikistan",
c:[0.27,0.094],
p:[[[0.272,0.111],[0.268,0.106],[0.2635,0.1055],[0.261,0.1085],[0.259,0.1065],[0.261,0.1025],[0.259,0.0995],[0.256,0.0965],[0.257,0.09],[0.259,0.092],[0.261,0.092],[0.2615,0.09],[0.2625,0.092],[0.26,0.097],[0.2625,0.0985],[0.264,0.093],[0.2675,0.088],[0.2695,0.079],[0.275,0.079],[0.275,0.0775],[0.277,0.075],[0.279,0.0755],[0.282,0.0755],[0.2805,0.081],[0.2795,0.084],[0.281,0.088],[0.2805,0.09],[0.281,0.092],[0.279,0.0935],[0.2745,0.0915],[0.274,0.093],[0.2725,0.092],[0.2705,0.094],[0.2715,0.097],[0.2735,0.098],[0.274,0.099],[0.2725,0.102],[0.2745,0.1045],[0.273,0.1055],[0.273,0.1095],[0.272,0.111]]]
});
