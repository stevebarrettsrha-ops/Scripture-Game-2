/* Serbia — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Serbia",
c:[0.091,0.2395],
p:[[[0.079,0.232],[0.079,0.232],[0.0815,0.2295],[0.084,0.2285],[0.087,0.23],[0.0885,0.2315],[0.091,0.2315],[0.0925,0.2335],[0.0955,0.234],[0.096,0.2325],[0.0975,0.233],[0.097,0.234],[0.098,0.2345],[0.0975,0.236],[0.0985,0.238],[0.1015,0.2395],[0.1005,0.2415],[0.1005,0.2435],[0.1015,0.244],[0.101,0.245],[0.099,0.246],[0.0975,0.2465],[0.0975,0.2465],[0.0975,0.2455],[0.0975,0.244],[0.097,0.2445],[0.0955,0.244],[0.095,0.244],[0.094,0.243],[0.093,0.243],[0.092,0.2425],[0.0915,0.243],[0.0915,0.245],[0.091,0.246],[0.091,0.2455],[0.089,0.245],[0.0875,0.245],[0.0865,0.2445],[0.085,0.244],[0.086,0.243],[0.0855,0.2405],[0.083,0.239],[0.083,0.2365],[0.0815,0.237],[0.0815,0.237],[0.0825,0.2345],[0.0805,0.2335],[0.079,0.232]]]
});
