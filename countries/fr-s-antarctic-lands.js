/* Fr. S. Antarctic Lands — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Fr. S. Antarctic Lands",
c:[0.7235,0.271],
p:[[[0.7185,0.277],[0.7235,0.2695],[0.7285,0.2575],[0.7295,0.2575],[0.7305,0.262],[0.7235,0.2815],[0.721,0.2805],[0.7195,0.278],[0.7185,0.277]]]
});
