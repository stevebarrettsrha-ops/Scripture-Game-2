/* Uruguay — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Uruguay",
c:[-0.5655,0.3795],
p:[[[-0.564,0.3575],[-0.5595,0.3635],[-0.5565,0.376],[-0.554,0.3795],[-0.55,0.3915],[-0.547,0.4005],[-0.546,0.4085],[-0.5515,0.4055],[-0.552,0.41],[-0.5575,0.408],[-0.568,0.399],[-0.5725,0.391],[-0.5765,0.3855],[-0.5805,0.375],[-0.585,0.3685],[-0.5865,0.3605],[-0.583,0.3595],[-0.5805,0.361],[-0.576,0.358],[-0.5695,0.3575],[-0.564,0.3575]]]
});
