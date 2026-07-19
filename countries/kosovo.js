/* Kosovo — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Kosovo",
c:[0.0945,0.246],
p:[[[0.094,0.2505],[0.093,0.2485],[0.092,0.2485],[0.0905,0.2475],[0.091,0.246],[0.0915,0.245],[0.0915,0.243],[0.092,0.2425],[0.093,0.243],[0.094,0.243],[0.095,0.244],[0.0955,0.244],[0.097,0.2445],[0.0975,0.244],[0.0975,0.2455],[0.0975,0.2465],[0.0975,0.2465],[0.0965,0.2475],[0.0945,0.249],[0.0945,0.25],[0.094,0.2505]]]
});
