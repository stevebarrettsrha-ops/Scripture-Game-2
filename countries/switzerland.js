/* Switzerland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Switzerland",
c:[0.0345,0.2375],
p:[[[0.0395,0.2325],[0.0395,0.2335],[0.0395,0.235],[0.0415,0.2355],[0.0435,0.2355],[0.0435,0.238],[0.042,0.239],[0.0385,0.239],[0.038,0.2415],[0.036,0.2415],[0.035,0.241],[0.033,0.243],[0.031,0.2435],[0.029,0.243],[0.0275,0.2405],[0.0255,0.2415],[0.0255,0.239],[0.028,0.2355],[0.0275,0.2345],[0.0295,0.2345],[0.0305,0.2335],[0.034,0.233],[0.0345,0.2315],[0.0395,0.2325]]]
});
