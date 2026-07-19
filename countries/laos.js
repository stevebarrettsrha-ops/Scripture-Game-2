/* Laos — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Laos",
c:[0.3865,-0.0945],
p:[[[0.402,-0.126],[0.402,-0.119],[0.4065,-0.117],[0.406,-0.1105],[0.403,-0.112],[0.3985,-0.111],[0.395,-0.104],[0.39,-0.1025],[0.387,-0.096],[0.388,-0.091],[0.39,-0.09],[0.391,-0.086],[0.3905,-0.084],[0.395,-0.0775],[0.3905,-0.076],[0.3845,-0.0765],[0.385,-0.072],[0.3815,-0.071],[0.3805,-0.068],[0.3785,-0.069],[0.3735,-0.074],[0.375,-0.0745],[0.3745,-0.078],[0.3685,-0.076],[0.367,-0.079],[0.37,-0.084],[0.3745,-0.088],[0.3725,-0.096],[0.3765,-0.0995],[0.379,-0.096],[0.3815,-0.0945],[0.3825,-0.103],[0.3875,-0.1105],[0.391,-0.116],[0.393,-0.1225],[0.396,-0.1255],[0.402,-0.126]]]
});
