/* Namibia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Namibia",
c:[0.19,0.5885],
p:[[[0.217,0.5995],[0.224,0.619],[0.215,0.625],[0.2095,0.6275],[0.2025,0.6285],[0.197,0.63],[0.1945,0.628],[0.19,0.628],[0.1855,0.632],[0.176,0.6305],[0.1705,0.6275],[0.167,0.623],[0.163,0.62],[0.1575,0.6125],[0.1555,0.606],[0.1535,0.6035],[0.1485,0.6025],[0.1425,0.5995],[0.1355,0.594],[0.132,0.591],[0.1225,0.5875],[0.121,0.5835],[0.126,0.5815],[0.132,0.5795],[0.1385,0.578],[0.145,0.579],[0.1465,0.578],[0.187,0.566],[0.1945,0.5665],[0.2185,0.5585],[0.2355,0.549],[0.243,0.5445],[0.249,0.542],[0.2535,0.5415],[0.2535,0.5415],[0.249,0.5455],[0.246,0.5465],[0.2405,0.5515],[0.236,0.551],[0.222,0.559],[0.2145,0.562],[0.2215,0.5805],[0.2115,0.5845],[0.217,0.5995]]]
});
