/* Botswana — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Botswana",
c:[0.2585,0.568],
p:[[[0.306,0.5425],[0.2945,0.5535],[0.2875,0.5615],[0.286,0.5665],[0.284,0.57],[0.2785,0.573],[0.278,0.576],[0.278,0.5785],[0.272,0.5825],[0.2635,0.586],[0.258,0.587],[0.2535,0.588],[0.249,0.5915],[0.2475,0.595],[0.243,0.5985],[0.239,0.603],[0.2315,0.6065],[0.2285,0.6055],[0.228,0.602],[0.22,0.5995],[0.217,0.5995],[0.2115,0.5845],[0.2215,0.5805],[0.2145,0.562],[0.222,0.559],[0.236,0.551],[0.2405,0.5515],[0.246,0.5465],[0.249,0.5455],[0.2535,0.5415],[0.2555,0.5415],[0.261,0.5435],[0.2635,0.5435],[0.2675,0.545],[0.2815,0.545],[0.2855,0.5435],[0.2865,0.545],[0.291,0.547],[0.2985,0.5435],[0.306,0.5425]]]
});
