/* Moldova — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Moldova",
c:[0.114,0.2095],
p:[[[0.104,0.2075],[0.1045,0.2065],[0.1065,0.2045],[0.11,0.205],[0.1115,0.204],[0.114,0.2045],[0.1145,0.2065],[0.1165,0.2065],[0.118,0.208],[0.12,0.2085],[0.12,0.2095],[0.121,0.2095],[0.1205,0.2105],[0.118,0.2115],[0.1175,0.211],[0.117,0.212],[0.1175,0.2125],[0.1175,0.215],[0.1175,0.217],[0.117,0.218],[0.115,0.216],[0.1145,0.2135],[0.113,0.2115],[0.1095,0.21],[0.107,0.2085],[0.1055,0.2075],[0.104,0.2075]]]
});
