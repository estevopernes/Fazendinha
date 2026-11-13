import {MeshoptSimplifier as S,MeshoptEncoder as E} from 'meshoptimizer';
import fs from 'fs';
await S.ready;await E.ready;
const dir=process.argv[2];const meta=JSON.parse(fs.readFileSync(dir+'/meta.json'));
for(const [k,m] of Object.entries(meta)){
  const rd=f=>{const b=fs.readFileSync(f);return b.buffer.slice(b.byteOffset,b.byteOffset+b.length);};const P=new Float32Array(rd(`${dir}/${k}.p`));
  let I=new Uint32Array(rd(`${dir}/${k}.i`));
  if(m.ratio<1){const tgt=Math.floor(I.length*m.ratio/3)*3;const [out,err]=S.simplify(I,P,3,tgt,0.02,[]);console.log(k,I.length/3,'->',out.length/3,'err',err.toFixed(4));I=out;}
  // reordena para cache de vértices e leitura sequencial (comprime melhor)
  I=new Uint32Array(I);const [remap,unique]=E.reorderMesh(I,true,false);
  fs.writeFileSync(`${dir}/${k}.s`,Buffer.from(I.buffer,I.byteOffset,I.byteLength));
  fs.writeFileSync(`${dir}/${k}.r`,Buffer.from(remap.buffer,remap.byteOffset,remap.byteLength));
}
