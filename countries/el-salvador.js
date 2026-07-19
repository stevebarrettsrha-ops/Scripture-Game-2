/* El Salvador — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"El Salvador",
c:[-0.423,0.008],
p:[[[-0.42,0.0045],[-0.4205,0.007],[-0.4215,0.0085],[-0.422,0.011],[-0.423,0.011],[-0.422,0.0145],[-0.4225,0.016],[-0.423,0.017],[-0.4255,0.0165],[-0.4265,0.0155],[-0.4265,0.0115],[-0.426,0.0085],[-0.425,0.0055],[-0.425,0.0015],[-0.4235,-0.0005],[-0.423,-0.0005],[-0.4215,0.002],[-0.421,0.0035],[-0.42,0.003],[-0.42,0.0045]]]
});
