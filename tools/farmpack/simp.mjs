import {MeshoptSimplifier as S} from 'meshoptimizer';
import fs from 'fs';
await S.ready;
const dir=process.argv[2];const meta=JSON.parse(fs.readFileSync(dir+'/meta.json'));
for(const [k,m] of Object.entries(meta)){
  const rd=f=>{const b=fs.readFileSync(f);return b.buffer.slice(b.byteOffset,b.byteOffset+b.length);};const P=new Float32Array(rd(`${dir}/${k}.p`));
  let I=new Uint32Array(rd(`${dir}/${k}.i`));
  if(m.ratio<1){const tgt=Math.floor(I.length*m.ratio/3)*3;const [out,err]=S.simplify(I,P,3,tgt,0.02,[]);console.log(k,I.length/3,'->',out.length/3,'err',err.toFixed(4));I=out;}
  fs.writeFileSync(`${dir}/${k}.s`,Buffer.from(I.buffer,I.byteOffset,I.byteLength));
}
