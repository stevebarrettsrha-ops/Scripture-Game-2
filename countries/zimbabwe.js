/* Zimbabwe — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Zimbabwe",
c:[0.299,0.525],
p:[[[0.323,0.5335],[0.3175,0.536],[0.315,0.5385],[0.31,0.54],[0.306,0.5425],[0.2985,0.5435],[0.291,0.547],[0.2865,0.545],[0.2855,0.5435],[0.2815,0.545],[0.2675,0.545],[0.2635,0.5435],[0.261,0.5435],[0.2555,0.5415],[0.266,0.5365],[0.2695,0.536],[0.2725,0.534],[0.276,0.528],[0.282,0.52],[0.285,0.518],[0.285,0.5155],[0.289,0.5105],[0.2955,0.506],[0.297,0.5075],[0.3045,0.503],[0.309,0.5015],[0.3115,0.5015],[0.316,0.4995],[0.3215,0.498],[0.3255,0.504],[0.326,0.5085],[0.3275,0.512],[0.33,0.5125],[0.3305,0.516],[0.3295,0.517],[0.3295,0.522],[0.323,0.5335]]]
});
