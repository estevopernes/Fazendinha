# Junta os modelos em src/72_modelos.js.
# Formato (tudo comprimido com deflate e em base64; o jogo descomprime com DecompressionStream):
#   posições (3 canais) e uv (2 canais) quantizados em QB bits, gravados como diferença para o vértice anterior (zigzag),
#   índices como diferença para o anterior (zigzag); cada canal de 16 bits é gravado "byte alto" depois "byte baixo";
#   normais em octaedro (2 x int8) por canal.
import sys,json,base64,io,zlib,numpy as np
from PIL import Image
QB=11
D=sys.argv[1]; meta=json.load(open(D+'/meta.json'))
pos=[];nrm=[];uvs=[];idx=[];hdr={}
for k,m in meta.items():
    P=np.fromfile(f'{D}/{k}.p',np.float32).reshape(-1,3);N=np.fromfile(f'{D}/{k}.n',np.float32).reshape(-1,3)
    T=np.fromfile(f'{D}/{k}.t',np.float32).reshape(-1,2);I=np.fromfile(f'{D}/{k}.s',np.uint32);R=np.fromfile(f'{D}/{k}.r',np.uint32)
    nv=int(I.max())+1; R=np.concatenate([R,np.full(len(P)-len(R),0xffffffff,np.uint32)]); used=R!=0xffffffff
    P2=np.zeros((nv,3),np.float32);N2=np.zeros((nv,3),np.float32);T2=np.zeros((nv,2),np.float32)
    P2[R[used]]=P[used];N2[R[used]]=N[used];T2[R[used]]=T[used]
    assert nv<65536
    lo=P2.min(0);hi=P2.max(0);rng=np.maximum(hi-lo,1e-6);q=(1<<QB)-1
    pos.append(np.round((P2-lo)/rng*q).astype(np.int32))
    uvs.append(np.round(np.clip(T2,0,1)*q).astype(np.int32))
    n=N2/np.maximum(np.abs(N2).sum(1,keepdims=True),1e-9); ox=n[:,0].copy(); oy=n[:,1].copy(); neg=n[:,2]<0
    ox[neg]=(1-np.abs(n[neg,1]))*np.sign(n[neg,0]+1e-12); oy[neg]=(1-np.abs(n[neg,0]))*np.sign(n[neg,1]+1e-12)
    nrm.append(np.clip(np.round(np.stack([ox,oy],1)*127),-127,127).astype(np.int8))
    idx.append(I.astype(np.int32))
    hdr[k]=dict(v=nv,i=int(len(I)),lo=[round(float(x),4) for x in lo],hi=[round(float(x),4) for x in hi])
    if m.get('piv'): hdr[k]['piv']=[round(x,4) for x in m['piv']]
def zz(d): return ((d<<1)^(d>>31)).astype(np.uint32)&0xffff
def chan(a):  # delta + zigzag + bytes altos/baixos
    d=zz(np.diff(a,prepend=0)).astype(np.uint16); b=d.view(np.uint8).reshape(-1,2); return b[:,1].tobytes()+b[:,0].tobytes()
P=np.concatenate(pos);T=np.concatenate(uvs);I=np.concatenate(idx);N=np.concatenate(nrm)
raw=b''.join([chan(P[:,0]),chan(P[:,1]),chan(P[:,2]),chan(T[:,0]),chan(T[:,1]),chan(I)]+[N[:,c].tobytes() for c in range(2)])
blob=zlib.compress(raw,9)
im=Image.open(sys.argv[2]).convert('RGB').resize((256,1024),Image.BOX)
b=io.BytesIO();im.save(b,'PNG',optimize=True);png=b.getvalue()
print('verts',len(P),'tris',len(I)//3,'raw',len(raw),'deflate',len(blob),'png',len(png))
with open(sys.argv[3],'w') as f:
    f.write('// ====================== MODELOS DO FARM PACK (gerado) ======================\n')
    f.write('// Modelos 3D do pacote "Farm Pack Low-poly" (LionStudio, CGTrader, licença Royalty Free comprada pelo Estevão).\n')
    f.write('// Gerado por tools/farmpack/ a partir do GLTF original: só os modelos usados, simplificados, quantizados e comprimidos.\n')
    f.write('// Não edite à mão. Formato descrito em tools/farmpack/pack.py; quem lê é fpLoad() em 75_three.js.\n')
    f.write(f'const FP_QB={QB};\n')
    f.write('const FP_META='+json.dumps(hdr,separators=(',',':'))+';\n')
    f.write("const FP_ATLAS='data:image/png;base64,"+base64.b64encode(png).decode()+"';\n")
    f.write("const FP_BIN='"+base64.b64encode(blob).decode()+"';\n")
