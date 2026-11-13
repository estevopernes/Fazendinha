import sys,json,base64,io,numpy as np
from PIL import Image
D=sys.argv[1]; meta=json.load(open(D+'/meta.json'))
pos=[];nrm=[];uvs=[];idx=[];hdr={}
for k,m in meta.items():
    P=np.fromfile(f'{D}/{k}.p',np.float32).reshape(-1,3);N=np.fromfile(f'{D}/{k}.n',np.float32).reshape(-1,3)
    T=np.fromfile(f'{D}/{k}.t',np.float32).reshape(-1,2);I=np.fromfile(f'{D}/{k}.s',np.uint32)
    used=np.unique(I);remap=np.full(len(P),-1,np.int64);remap[used]=np.arange(len(used))
    P=P[used];N=N[used];T=T[used];I=remap[I].astype(np.uint16)
    assert len(used)<65536
    lo=P.min(0);hi=P.max(0);rng=np.maximum(hi-lo,1e-6)
    pos.append(np.round((P-lo)/rng*65535).astype(np.uint16).reshape(-1))
    uvs.append(np.round(np.clip(T,0,1)*65535).astype(np.uint16).reshape(-1))
    nrm.append(np.clip(np.round(N*127),-127,127).astype(np.int8).reshape(-1))
    idx.append(I)
    hdr[k]=dict(v=int(len(P)),i=int(len(I)),lo=[round(float(x),4) for x in lo],hi=[round(float(x),4) for x in hi])
    if m.get('piv'): hdr[k]['piv']=[round(x,4) for x in m['piv']]
blob=b''.join([np.concatenate(pos).tobytes(),np.concatenate(uvs).tobytes(),np.concatenate(idx).tobytes(),np.concatenate(nrm).tobytes()])
im=Image.open(sys.argv[2]).convert('RGB').resize((256,1024),Image.BOX)
b=io.BytesIO();im.save(b,'PNG',optimize=True);png=b.getvalue()
tv=sum(h['v'] for h in hdr.values());ti=sum(h['i'] for h in hdr.values())
print('verts',tv,'tris',ti//3,'blob',len(blob),'png',len(png))
with open(sys.argv[3],'w') as f:
    f.write('// ====================== MODELOS DO FARM PACK (gerado) ======================\n')
    f.write('// Modelos 3D do pacote "Farm Pack Low-poly" (LionStudio, CGTrader, licença Royalty Free comprada pelo Estevão).\n')
    f.write('// Gerado por tools/farmpack/ a partir do GLTF original: só os modelos usados, simplificados e quantizados.\n')
    f.write('// Não edite à mão. Formato: posições uint16, uv uint16, índices uint16, normais int8 (nessa ordem).\n')
    f.write('const FP_META='+json.dumps(hdr,separators=(',',':'))+';\n')
    f.write("const FP_ATLAS='data:image/png;base64,"+base64.b64encode(png).decode()+"';\n")
    f.write("const FP_BIN='"+base64.b64encode(blob).decode()+"';\n")
