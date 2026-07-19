/* Sweden — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Sweden",
c:[0.042,0.145],
p:[[[0.033,0.17],[0.034,0.1665],[0.0355,0.162],[0.035,0.1555],[0.0325,0.153],[0.031,0.146],[0.0315,0.1405],[0.034,0.14],[0.034,0.138],[0.033,0.136],[0.0345,0.1275],[0.035,0.121],[0.035,0.117],[0.037,0.1165],[0.037,0.113],[0.041,0.113],[0.04,0.1095],[0.041,0.1085],[0.0445,0.11],[0.049,0.1125],[0.0525,0.12],[0.054,0.122],[0.051,0.125],[0.05,0.1295],[0.052,0.1325],[0.0495,0.138],[0.0465,0.144],[0.047,0.152],[0.05,0.1555],[0.0535,0.1575],[0.053,0.164],[0.0505,0.1665],[0.052,0.1755],[0.0515,0.181],[0.0475,0.1815],[0.047,0.1865],[0.043,0.1875],[0.041,0.1825],[0.037,0.177],[0.033,0.17]]]
});
