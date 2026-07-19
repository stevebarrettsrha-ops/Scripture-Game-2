/* Paraguay — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Paraguay",
c:[-0.5305,0.3375],
p:[[[-0.52,0.323],[-0.521,0.327],[-0.5275,0.3305],[-0.5225,0.341],[-0.519,0.344],[-0.5165,0.351],[-0.5165,0.3535],[-0.52,0.357],[-0.521,0.3595],[-0.519,0.363],[-0.516,0.366],[-0.5145,0.3695],[-0.517,0.3715],[-0.5205,0.372],[-0.5245,0.372],[-0.5295,0.3735],[-0.5385,0.3675],[-0.5445,0.3605],[-0.5505,0.3495],[-0.5555,0.339],[-0.5425,0.344],[-0.5415,0.341],[-0.5455,0.33],[-0.549,0.3165],[-0.5525,0.308],[-0.554,0.286],[-0.546,0.287],[-0.5435,0.2855],[-0.5365,0.288],[-0.5265,0.3035],[-0.5215,0.312],[-0.5185,0.322],[-0.52,0.323]]]
});
