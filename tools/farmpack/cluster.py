import json,sys,re
B=json.load(open(sys.argv[1])); n=len(B); P=list(range(n))
def f(i):
    while P[i]!=i: P[i]=P[P[i]]; i=P[i]
    return i
m=0.02
# skip big ground tiles from merging (only allow them to be their own)
big=[ (o['mx'][0]-o['mn'][0])*(o['mx'][2]-o['mn'][2])>20 for o in B]
idx=sorted(range(n),key=lambda i:B[i]['mn'][0])
for a in range(n):
    i=idx[a]
    if big[i]: continue
    for b in range(a+1,n):
        j=idx[b]
        if B[j]['mn'][0]>B[i]['mx'][0]+m: break
        if big[j]: continue
        if B[j]['mn'][2]<=B[i]['mx'][2]+m and B[i]['mn'][2]<=B[j]['mx'][2]+m: P[f(i)]=f(j)
C={}
for i in range(n): C.setdefault(f(i),[]).append(i)
out=[]
for k,v in C.items():
    mn=[min(B[i]['mn'][a] for i in v) for a in range(3)]; mx=[max(B[i]['mx'][a] for i in v) for a in range(3)]
    names=sorted(set(re.sub(r'(\.\d+)?_NewAtlas$','',B[i]['n']) for i in v))
    out.append(dict(nodes=[B[i]['i'] for i in v],mn=mn,mx=mx,tris=sum(B[i]['tris'] for i in v),names=names))
out.sort(key=lambda c:(round(c['mn'][2]),c['mn'][0]))
for i,c in enumerate(out): c['id']=i
json.dump(out,open(sys.argv[2],'w'))
for c in out:
    sz=[round(c['mx'][a]-c['mn'][a],2) for a in range(3)]
    print(c['id'],len(c['nodes']),c['tris'],sz,[round(x,1) for x in c['mn']],' '.join(c['names'])[:150])
