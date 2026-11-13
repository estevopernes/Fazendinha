import {NodeIO} from '@gltf-transform/core';
import {prune,dedup,unpartition} from '@gltf-transform/functions';
const io=new NodeIO();
const doc=await io.read(process.argv[2]);
for(const m of doc.getRoot().listMeshes())for(const p of m.listPrimitives()){const t=p.getAttribute('TANGENT');if(t){p.setAttribute('TANGENT',null);}}
await doc.transform(prune(),dedup(),unpartition());
await io.write(process.argv[3],doc);
