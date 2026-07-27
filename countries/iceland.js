/* Iceland — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Iceland",
c:[-0.0455,0.1295],
p:[[[-0.033,0.1265],[-0.034,0.13],[-0.0325,0.1345],[-0.0365,0.1375],[-0.0445,0.139],[-0.047,0.1395],[-0.05,0.1375],[-0.056,0.1335],[-0.053,0.132],[-0.0565,0.1275],[-0.0525,0.128],[-0.0515,0.1265],[-0.056,0.1235],[-0.053,0.121],[-0.0495,0.1215],[-0.0475,0.126],[-0.043,0.1245],[-0.041,0.127],[-0.0365,0.125],[-0.033,0.1265]]],
/* ---- this land's own shores: how the sea comes up to meet it ---- */
beaches:[
  {n:"Reynisfjara of the Black Sand", lat:63.4, lon:-19.04, r:620, wadeM:3.4, wadeR:130, roll:1.6, sand:'black'},
  {n:"The Shore of Vík", lat:63.42, lon:-19.01, r:420, wadeM:4.0, wadeR:100, roll:1.9, sand:'shingle'}
]
});
