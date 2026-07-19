/* United Arab Emirates — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"United Arab Emirates",
c:[0.2965,0.2135],
p:[[[0.286,0.227],[0.2865,0.226],[0.288,0.2265],[0.2905,0.222],[0.2935,0.218],[0.296,0.215],[0.2955,0.2095],[0.2955,0.2035],[0.295,0.1985],[0.297,0.1985],[0.301,0.2],[0.2995,0.203],[0.302,0.205],[0.3035,0.2045],[0.3025,0.2075],[0.3045,0.209],[0.3055,0.212],[0.307,0.2135],[0.307,0.215],[0.2935,0.229],[0.2875,0.2275],[0.286,0.227]]]
});
