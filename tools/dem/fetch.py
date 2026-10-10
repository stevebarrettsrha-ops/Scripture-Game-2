# python3 fetch.py OUTDIR z lat0 lat1 lon0 lon1 — fetch AWS Terrain Tiles (terrarium) covering a box
import sys, os, math, urllib.request, time
out,z,la0,la1,lo0,lo1=sys.argv[1],int(sys.argv[2]),*map(float,sys.argv[3:7])
def tile(lat,lon):
    n=2**z; x=(lon+180)/360*n; la=math.radians(max(-85.05,min(85.05,lat))); y=(1-math.log(math.tan(la)+1/math.cos(la))/math.pi)/2*n
    return int(min(n-1,x)),int(min(n-1,y))
x0,y1=tile(la0,lo0); x1,y0=tile(la1,lo1)
n=0
for x in range(x0,x1+1):
  for y in range(y0,y1+1):
    p=f"{out}/{z}/{x}/{y}.png"
    if os.path.exists(p) and os.path.getsize(p)>0: continue
    os.makedirs(os.path.dirname(p),exist_ok=True)
    for a in range(4):
      try:
        urllib.request.urlretrieve(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",p); n+=1; break
      except Exception as e:
        time.sleep(2**a)
print('z',z,'x',x0,x1,'y',y0,y1,'fetched',n)
