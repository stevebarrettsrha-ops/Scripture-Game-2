/* Albania — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Albania",
c:[0.093,0.254],
p:[[[0.098,0.255],[0.0985,0.2565],[0.097,0.2575],[0.0975,0.2595],[0.0965,0.2625],[0.0955,0.2625],[0.095,0.2615],[0.092,0.2605],[0.0905,0.2585],[0.0895,0.2545],[0.0895,0.253],[0.0885,0.252],[0.0885,0.252],[0.088,0.2505],[0.089,0.2475],[0.0895,0.2485],[0.0905,0.2475],[0.092,0.2485],[0.093,0.2485],[0.094,0.2505],[0.094,0.2505],[0.094,0.2525],[0.0955,0.2545],[0.098,0.255]]]
});
