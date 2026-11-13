import json,base64,numpy as np,sys,re
CT={5120:np.int8,5121:np.uint8,5122:np.int16,5123:np.uint16,5125:np.uint32,5126:np.float32}
NC={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
class G:
    def __init__(s,p):
        s.g=json.load(open(p)); s.bufs={}
    def buf(s,i):
        if i not in s.bufs:
            u=s.g['buffers'][i]['uri']; s.bufs[i]=base64.b64decode(u.split(',',1)[1])
        return s.bufs[i]
    def acc(s,i):
        a=s.g['accessors'][i]; bv=s.g['bufferViews'][a['bufferView']]
        b=s.buf(bv['buffer']); dt=CT[a['componentType']]; n=NC[a['type']]
        off=bv.get('byteOffset',0)+a.get('byteOffset',0); st=bv.get('byteStride')
        isz=np.dtype(dt).itemsize*n
        if st and st!=isz:
            raw=np.frombuffer(b,dtype=np.uint8,count=st*(a['count']-1)+isz,offset=off)
            arr=np.lib.stride_tricks.as_strided(raw,(a['count'],isz),(st,1)).copy().view(dt).reshape(a['count'],n)
        else:
            arr=np.frombuffer(b,dtype=dt,count=a['count']*n,offset=off).reshape(a['count'],n)
        return arr.astype(np.float32) if dt==np.float32 else arr
def qmat(t,r,s):
    t=t or [0,0,0]; r=r or [0,0,0,1]; s=s or [1,1,1]
    x,y,z,w=r
    R=np.array([[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]])
    M=np.eye(4); M[:3,:3]=R*np.array(s); M[:3,3]=t; return M
def local(nd):
    if 'matrix' in nd: return np.array(nd['matrix']).reshape(4,4).T
    return qmat(nd.get('translation'),nd.get('rotation'),nd.get('scale'))
def worlds(g):
    W={}
    def rec(i,P):
        M=P@local(g['nodes'][i]); W[i]=M
        for c in g['nodes'][i].get('children',[]): rec(c,M)
    for r in g['scenes'][0]['nodes']: rec(r,np.eye(4))
    return W
