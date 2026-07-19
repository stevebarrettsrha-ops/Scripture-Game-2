/* Denmark — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Denmark",
c:[0.0315,0.1845],
p:[[[0.0335,0.1915],[0.0315,0.193],[0.029,0.1925],[0.027,0.1895],[0.026,0.184],[0.0265,0.1825],[0.027,0.1805],[0.03,0.18],[0.0305,0.178],[0.033,0.176],[0.0335,0.179],[0.0325,0.181],[0.0335,0.1825],[0.0355,0.183],[0.035,0.185],[0.034,0.185],[0.032,0.189],[0.0335,0.1915]],[[0.0405,0.184],[0.042,0.1865],[0.041,0.191],[0.037,0.189],[0.036,0.1865],[0.0405,0.184]]]
});
