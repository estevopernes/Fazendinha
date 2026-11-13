import sys,json,os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from gl import *
G0=G(sys.argv[1]); g=G0.g; W=worlds(g); out=[]
for i,nd in enumerate(g['nodes']):
    if nd.get('mesh') is None: continue
    m=g['meshes'][nd['mesh']]; tris=0; mn=np.full(3,1e9); mx=-mn
    for p in m['primitives']:
        a=g['accessors'][p['attributes']['POSITION']]
        lo=np.array(a['min']+[1]); hi=np.array(a['max']+[1])
        corners=np.array([[x,y,z,1] for x in (lo[0],hi[0]) for y in (lo[1],hi[1]) for z in (lo[2],hi[2])])
        wc=(W[i]@corners.T).T[:,:3]; mn=np.minimum(mn,wc.min(0)); mx=np.maximum(mx,wc.max(0))
        tris+=(g['accessors'][p['indices']]['count'] if 'indices' in p else a['count'])//3
    out.append(dict(i=i,n=nd.get('name'),mn=mn.round(3).tolist(),mx=mx.round(3).tolist(),tris=tris,nv=sum(g['accessors'][p['attributes']['POSITION']]['count'] for p in m['primitives']),attrs=list(m['primitives'][0]['attributes'].keys())))
json.dump(out,open(sys.argv[2],'w'))
print(len(out), sum(o['tris'] for o in out))
