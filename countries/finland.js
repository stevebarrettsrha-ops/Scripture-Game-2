/* Finland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Finland",
c:[0.06,0.1235],
p:[[[0.0555,0.102],[0.0575,0.1055],[0.062,0.1075],[0.062,0.112],[0.0675,0.116],[0.0685,0.121],[0.0725,0.1235],[0.0735,0.127],[0.079,0.1285],[0.0795,0.1315],[0.079,0.1355],[0.077,0.1445],[0.077,0.1445],[0.077,0.1445],[0.0725,0.1475],[0.069,0.1515],[0.065,0.1545],[0.0625,0.152],[0.059,0.1515],[0.0575,0.146],[0.0545,0.142],[0.0545,0.1385],[0.0555,0.1345],[0.0585,0.1265],[0.0595,0.125],[0.058,0.123],[0.054,0.122],[0.0525,0.12],[0.049,0.1125],[0.0445,0.11],[0.041,0.1085],[0.0415,0.107],[0.0445,0.1085],[0.047,0.1075],[0.0495,0.1075],[0.0505,0.1045],[0.0495,0.1005],[0.0515,0.0975],[0.0545,0.0985],[0.0555,0.102]]]
});
