/* Vietnam — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Vietnam",
c:[0.3915,-0.112],
p:[[[0.428,-0.1095],[0.424,-0.115],[0.4215,-0.123],[0.4195,-0.1185],[0.4115,-0.1295],[0.405,-0.1285],[0.402,-0.126],[0.396,-0.1255],[0.393,-0.1225],[0.391,-0.116],[0.3875,-0.1105],[0.3825,-0.103],[0.3815,-0.0945],[0.379,-0.096],[0.3765,-0.0995],[0.3725,-0.096],[0.3745,-0.088],[0.37,-0.084],[0.367,-0.079],[0.3645,-0.082],[0.3635,-0.0875],[0.3615,-0.0935],[0.357,-0.098],[0.3585,-0.1015],[0.3575,-0.1075],[0.361,-0.1075],[0.362,-0.111],[0.3615,-0.118],[0.3685,-0.1105],[0.3755,-0.107],[0.3795,-0.1065],[0.3835,-0.113],[0.3885,-0.1215],[0.39,-0.1285],[0.393,-0.1345],[0.4015,-0.141],[0.411,-0.143],[0.4165,-0.1385],[0.4225,-0.131],[0.429,-0.1265],[0.4365,-0.1185],[0.434,-0.1145],[0.4295,-0.1155],[0.428,-0.1095]]]
});
