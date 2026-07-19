/* Egypt — this land's own file. Edit freely; the game rebuilds from it on reload.
   n     : the land's name as shown in the game
   c     : centre of the land [u,v] on the circle of the earth (u=r·sin lon, v=r·cos lon, r=(90-lat)/180)
   p     : coastline rings — arrays of [u,v] points (first point = last point closes the ring)
   verse : OPTIONAL — { t:"the words", ref:"BOOK 1:2" } shown the first time you come ashore here
   site  : OPTIONAL — [lat, lon] to place this land's village at a spot you choose */
EARTH.country({
n:"Egypt",
c:[0.1805,0.2915],
p:[[[0.2265,0.302],[0.205,0.317],[0.1835,0.3305],[0.1595,0.3425],[0.151,0.324],[0.1425,0.306],[0.139,0.3025],[0.139,0.299],[0.1375,0.297],[0.138,0.294],[0.145,0.2905],[0.1505,0.2895],[0.156,0.288],[0.159,0.2875],[0.162,0.284],[0.163,0.2815],[0.167,0.2785],[0.171,0.277],[0.1735,0.2785],[0.174,0.276],[0.1785,0.275],[0.1825,0.2725],[0.184,0.27],[0.184,0.27],[0.191,0.2745],[0.1925,0.2755],[0.1925,0.2785],[0.1935,0.2825],[0.194,0.286],[0.1935,0.2875],[0.1905,0.287],[0.187,0.2865],[0.179,0.282],[0.179,0.283],[0.184,0.2865],[0.1905,0.289],[0.199,0.294],[0.2025,0.295],[0.206,0.2965],[0.214,0.298],[0.2135,0.2995],[0.216,0.3025],[0.225,0.302],[0.2265,0.302]]]
});
