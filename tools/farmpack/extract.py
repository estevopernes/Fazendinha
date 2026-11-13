import sys,json,re,os,numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from gl import *
G0=G(sys.argv[1]); g=G0.g; W=worlds(g)
C={c['id']:c for c in json.load(open(sys.argv[2]))}
OUT=sys.argv[3]; os.makedirs(OUT,exist_ok=True)
# key: (cluster ids, include-regex, exclude-regex, target_ratio)
A={
 'casa':([321],None,None,.55),
 'celeiro':([254],None,None,.6),
 'galinheiro':([322],None,None,1),
 'estabulo':([325],None,None,1),
 'cocho':([352],None,None,1),
 'balde':([442],None,None,1),
 'cerca':([328],None,None,1),
 'cercab':([368],None,None,1),
 'macieira':([119],None,None,.6),
 'laranjeira':([120],None,None,.6),
 'pinheiro':([105],None,None,.6),
 'betula':([140],None,None,.8),
 'arbusto':([143],None,None,.25),
 'pedra':([85],None,None,1),
 'flor1':([151],None,None,.35),
 'flor2':([153],None,None,.35),
 'poco':([431],None,None,.5),
 'carrinho':([432],None,None,.45),
 'moinho':([256],None,r'^wings',.6),
 'moinho_pas':([256],r'^wings',None,1),
 'silo':([301],None,None,.8),
 'caixadagua':([296],None,None,.8),
 'feno':([409],None,None,1),
 'barril':([506],None,None,.6),
 'caixote':([503],None,None,1),
 'poste':([164],None,None,.8),
 'placa':([179],None,None,1),
}
meta={}
for key,(cids,inc,exc,ratio) in A.items():
    allnodes=[n for c in cids for n in C[c]['nodes']]
    # origin from whole cluster
    mn=np.min([C[c]['mn'] for c in cids],0); mx=np.max([C[c]['mx'] for c in cids],0)
    org=np.array([(mn[0]+mx[0])/2,mn[1],(mn[2]+mx[2])/2])
    P=[];N=[];T=[];I=[];base=0
    for n in allnodes:
        nm=g['nodes'][n].get('name','')
        if inc and not re.search(inc,nm): continue
        if exc and re.search(exc,nm): continue
        M=W[n]; Nm=np.linalg.inv(M[:3,:3]).T
        for p in g['meshes'][g['nodes'][n]['mesh']]['primitives']:
            pos=G0.acc(p['attributes']['POSITION']).astype(np.float64)
            pw=(M[:3,:3]@pos.T).T+M[:3,3]-org
            nr=(Nm@G0.acc(p['attributes']['NORMAL']).astype(np.float64).T).T
            nr/=np.linalg.norm(nr,axis=1,keepdims=True)+1e-12
            uv=G0.acc(p['attributes']['TEXCOORD_0'])
            idx=G0.acc(p['indices']).reshape(-1).astype(np.uint32) if 'indices' in p else np.arange(len(pos),dtype=np.uint32)
            if p.get('mode',4)==5:
                a=idx[:-2];b=idx[1:-1];c=idx[2:];odd=(np.arange(len(a))%2)==1
                a2=np.where(odd,b,a);b2=np.where(odd,a,b)
                t=np.stack([a2,b2,c],1);t=t[(t[:,0]!=t[:,1])&(t[:,1]!=t[:,2])&(t[:,0]!=t[:,2])];idx=t.reshape(-1)
            if np.linalg.det(M[:3,:3])<0: idx=idx.reshape(-1,3)[:,::-1].reshape(-1)
            P.append(pw);N.append(nr);T.append(uv);I.append(idx+base);base+=len(pos)
    P=np.concatenate(P).astype(np.float32);N=np.concatenate(N).astype(np.float32);T=np.concatenate(T).astype(np.float32);I=np.concatenate(I).astype(np.uint32)
    piv=None
    if key=='moinho_pas':
        lo=P.min(0);hi=P.max(0);c=(lo+hi)/2;piv=[float(c[0]),float(c[1]),float(hi[2])]
        P=P-np.array([c[0],c[1],hi[2]],dtype=np.float32)
    for nm,arr in (('p',P),('n',N),('t',T),('i',I)): arr.tofile(f'{OUT}/{key}.{nm}')
    meta[key]=dict(nv=len(P),ni=len(I),ratio=ratio,piv=piv)
    print(key,len(P),len(I)//3)
json.dump(meta,open(f'{OUT}/meta.json','w'))
