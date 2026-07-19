/* Iraq — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Iraq",
c:[0.2195,0.224],
p:[[[0.203,0.249],[0.197,0.245],[0.2025,0.233],[0.1995,0.2265],[0.1965,0.224],[0.198,0.221],[0.1975,0.2165],[0.1985,0.2145],[0.2035,0.211],[0.2055,0.2105],[0.2065,0.2085],[0.214,0.2105],[0.2175,0.2095],[0.22,0.2115],[0.2195,0.2145],[0.2215,0.2185],[0.228,0.2195],[0.235,0.2165],[0.24,0.2175],[0.2425,0.2205],[0.2435,0.2195],[0.246,0.2215],[0.25,0.221],[0.2475,0.223],[0.2445,0.226],[0.2455,0.2325],[0.2375,0.24],[0.218,0.243],[0.209,0.246],[0.203,0.249]]]
});
