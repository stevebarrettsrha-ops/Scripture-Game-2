/* Cambodia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Cambodia",
c:[0.415,-0.1105],
p:[[[0.422,-0.094],[0.4155,-0.091],[0.41,-0.0945],[0.407,-0.1035],[0.406,-0.1105],[0.4065,-0.117],[0.402,-0.119],[0.402,-0.126],[0.405,-0.1285],[0.4115,-0.1295],[0.4195,-0.1185],[0.4215,-0.123],[0.424,-0.115],[0.428,-0.1095],[0.429,-0.103],[0.4265,-0.099],[0.422,-0.094]]]
});
