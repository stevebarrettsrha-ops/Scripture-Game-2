/* Guatemala — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Guatemala",
c:[-0.4135,-0.002],
p:[[[-0.419,-0.0165],[-0.4175,-0.016],[-0.416,-0.015],[-0.415,-0.016],[-0.4105,-0.0125],[-0.4105,-0.0035],[-0.409,-0.003],[-0.4085,-0.0045],[-0.4075,-0.005],[-0.406,-0.0075],[-0.404,-0.0105],[-0.404,-0.007],[-0.401,-0.007],[-0.401,-0.0005],[-0.401,0.006],[-0.4055,0.006],[-0.4115,0.0055],[-0.4115,0.0075],[-0.4125,0.01],[-0.412,0.0105],[-0.4125,0.013],[-0.4145,0.0095],[-0.4165,0.006],[-0.4175,0.0055],[-0.4185,0.006],[-0.42,0.0045],[-0.42,0.003],[-0.421,0.0035],[-0.4215,0.002],[-0.423,-0.0005],[-0.4235,-0.0005],[-0.4225,-0.0045],[-0.4225,-0.009],[-0.4215,-0.0125],[-0.419,-0.0165]]]
});
