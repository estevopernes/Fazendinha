// ====================== MODELOS 3D (low-poly, feitos por código) ======================
const MATS={};
function M(c){return MATS[c]||(MATS[c]=new THREE.MeshLambertMaterial({color:c}));}
function sh(m){m.castShadow=true;m.receiveShadow=true;return m;}
function box(w,h,d,c){return sh(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c)));}
function cyl(rt,rb,h,c,s){return sh(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,s||10),M(c)));}
function sph(r,c,ws,hs){return sh(new THREE.Mesh(new THREE.SphereGeometry(r,ws||12,hs||9),M(c)));}
function cone(r,h,c,s){return sh(new THREE.Mesh(new THREE.ConeGeometry(r,h,s||8),M(c)));}
function prism(w,h,d,c){const m=sh(new THREE.Mesh(new THREE.CylinderGeometry(w/2,w/2,d,3),M(c)));m.rotation.x=Math.PI/2;m.rotation.z=Math.PI/2;m.scale.set(h/(w*0.5)*0.58,1,1);return m;}
function grp(...ch){const g2=new THREE.Group();ch.forEach(c=>c&&g2.add(c));return g2;}
function at(m,x,y,z){m.position.set(x,y,z);return m;}
function rot(m,x,y,z){m.rotation.set(x||0,y||0,z||0);return m;}
function scl(m,x,y,z){m.scale.set(x,y==null?x:y,z==null?x:z);return m;}
function roofP(w,h,d,c){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(0,h);s.lineTo(w/2,0);s.lineTo(-w/2,0);const geo=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false});geo.translate(0,0,-d/2);return sh(new THREE.Mesh(geo,M(c)));}

// ---------- modelos do Farm Pack (dados em 72_modelos.js) ----------
// Monta as geometrias uma vez e reaproveita (todas as cópias usam a mesma geometria e o mesmo material).
// Se algo falhar, FP.ok fica false e o jogo usa os modelos antigos feitos por código.
const FP={ok:false,geo:{},mat:null};
function fpInit(){if(FP.ok||typeof FP_BIN==='undefined')return;try{
  const raw=atob(FP_BIN),u8=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)u8[i]=raw.charCodeAt(i);
  let tv=0,ti=0;for(const k in FP_META){tv+=FP_META[k].v;ti+=FP_META[k].i;}
  const Pq=new Uint16Array(u8.buffer,0,tv*3),Tq=new Uint16Array(u8.buffer,tv*6,tv*2),Iq=new Uint16Array(u8.buffer,tv*10,ti),Nq=new Int8Array(u8.buffer,tv*10+ti*2,tv*3);
  let ov=0,oi=0;
  for(const k in FP_META){const m=FP_META[k],pos=new Float32Array(m.v*3),uv=new Float32Array(m.v*2);
    for(let i=0;i<m.v;i++){const j=(ov+i);for(let a=0;a<3;a++)pos[i*3+a]=m.lo[a]+Pq[j*3+a]/65535*(m.hi[a]-m.lo[a]);uv[i*2]=Tq[j*2]/65535;uv[i*2+1]=Tq[j*2+1]/65535;}
    const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.BufferAttribute(pos,3));gm.setAttribute('normal',new THREE.BufferAttribute(Nq.slice(ov*3,(ov+m.v)*3),3,true));
    gm.setAttribute('uv',new THREE.BufferAttribute(uv,2));gm.setIndex(new THREE.BufferAttribute(Iq.slice(oi,oi+m.i),1));gm.computeBoundingSphere();FP.geo[k]=gm;ov+=m.v;oi+=m.i;}
  const tex=new THREE.TextureLoader().load(FP_ATLAS);tex.flipY=false;tex.generateMipmaps=false;tex.minFilter=THREE.LinearFilter;
  FP.mat=new THREE.MeshPhongMaterial({map:tex,specular:0x2a2a2a,shininess:24});FP.ok=true;
}catch(e){console.warn('Farm Pack: usando modelos antigos',e);FP.ok=false;}}
function fpSize(k){const m=FP_META[k];return{x:m.hi[0]-m.lo[0],y:m.hi[1]-m.lo[1],z:m.hi[2]-m.lo[2]};}
function fp(k,s){const m=sh(new THREE.Mesh(FP.geo[k],FP.mat));if(s)m.scale.setScalar(s);return m;}
// cabe numa área w×d (em casas do mapa), mantendo a proporção
function fpFit(k,w,d){const z=fpSize(k);return fp(k,Math.min(w/z.x,d/z.z));}
function fpH(k,h){return fp(k,h/fpSize(k).y);}
// cerca feita de painéis do pacote, de (x1,z1) até (x2,z2)
function fpFence(G2,x1,z1,x2,z2,k){const len=Math.hypot(x2-x1,z2-z1),ang=Math.atan2(-(z2-z1),x2-x1),n=Math.max(1,Math.round(len/.5)),w=fpSize(k).x;
  for(let i=0;i<n;i++){const f=(i+.5)/n,p=fp(k);p.scale.set(len/n/w*1.04,.5,.7);p.position.set(x1+(x2-x1)*f,0,z1+(z2-z1)*f);p.rotation.y=ang;G2.add(p);}}

// ---------- cenário fixo ----------
function mkTree(s){const t=grp(at(cyl(.09,.13,.8,'#8a5a33',7),0,.4,0),at(sph(.45,'#3f9a35'),-.22,.95,0),at(sph(.45,'#4aa83c'),.22,.95,.08),at(sph(.5,'#56b845'),0,1.3,-.05),at(sph(.38,'#4aa83c'),.05,1.05,.3));
  for(const [x,y,z] of [[-.3,1.1,.3],[.35,1.25,.2],[.1,1.5,.3],[-.2,1.35,-.35]])t.add(at(sph(.07,'#e2483d',6,5),x,y,z));return scl(t,s||1);}
function mkBush(s){return scl(grp(at(sph(.28,'#46a83a'),-.18,.2,0),at(sph(.3,'#52b843'),.16,.22,.05),at(sph(.32,'#5cc447'),0,.36,-.05)),s);}
function mkRock(s){const m=sh(new THREE.Mesh(new THREE.DodecahedronGeometry(.3,0),M('#c4bfb2')));m.scale.set(1,.55,.85);m.position.y=.1;return scl(grp(m),s);}
function mkHouse(){const w=HOUSE.w*U,d=2.6,h=1.6;const g2=grp(at(box(w,h,d,'#f6ead0'),0,h/2,0));
  const r=at(roofP(w+.35,1.2,d+.4,'#d0583a'),0,h,0);g2.add(r);
  g2.add(at(box(.5,.9,.06,'#3d7fb8'),0,.45,d/2+.02));g2.add(at(sph(.04,'#f6c445',6,5),.17,.45,d/2+.06));
  for(const x of [-w/3,w/3]){g2.add(at(box(.55,.5,.06,'#bfe3f2'),x,1,d/2+.02));g2.add(at(box(.65,.08,.15,'#c4573a'),x,.72,d/2+.06));for(let i=0;i<3;i++)g2.add(at(sph(.06,i%2?'#f6c445':'#e2483d',6,5),x-.2+i*.2,.8,d/2+.1));}
  g2.add(at(box(.3,.8,.3,'#9a5b3a'),w/3,h+.8,-.3));g2.add(at(box(w+.1,.12,d+.1,'#e2d2b0'),0,.06,0));return g2;}
function mkBarn(){const w=BARN.w*U,d=2.7,h=1.9;const g2=grp(at(box(w,h,d,'#e0763a'),0,h/2,0));
  const r=at(roofP(w+.3,1.3,d+.35,'#7a3a22'),0,h,0);g2.add(r);
  const dw=1.3,dh=1.35;g2.add(at(box(dw,dh,.06,'#fff3dc'),0,dh/2,d/2+.02));g2.add(at(box(dw-.14,dh-.14,.07,'#c4573a'),0,dh/2,d/2+.03));
  const x1=rot(box(.08,1.7,.08,'#fff3dc'),0,0,Math.atan2(dw,dh));const x2=rot(box(.08,1.7,.08,'#fff3dc'),0,0,-Math.atan2(dw,dh));g2.add(at(x1,0,dh/2,d/2+.07));g2.add(at(x2,0,dh/2,d/2+.07));
  g2.add(at(rot(cyl(.25,.25,.06,'#fff3dc',14),Math.PI/2),0,h+.45,d/2+.15));g2.add(at(rot(cyl(.17,.17,.07,'#5a3a1f',14),Math.PI/2),0,h+.45,d/2+.17));
  for(const [x,z] of [[w/2+.35,.6],[w/2+.3,-.2]])g2.add(at(rot(cyl(.32,.32,.5,'#e8c46a',14),Math.PI/2,0,Math.PI/2),x,.32,z));
  return g2;}
function mkDogHouse(has){const g2=new THREE.Group();if(!has)return g2;g2.add(at(box(.75,.5,.6,'#3d7fb8'),0,.25,0));g2.add(at(roofP(.95,.4,.75,'#c4573a'),0,.5,0));g2.add(at(box(.26,.32,.04,'#2b1d12'),0,.18,.31));g2.add(at(cyl(.14,.12,.08,'#9aa4ad',12),.55,.04,.25));return g2;}
function build3DStatic(){
  const s=R3.scene;
  const outer=new THREE.Mesh(new THREE.PlaneGeometry(120,120),M('#5cb944'));outer.rotation.x=-Math.PI/2;outer.position.set(W*U/2,-.02,H*U/2);outer.receiveShadow=true;s.add(outer);
  const tex=new THREE.CanvasTexture(bgCanvas);tex.anisotropy=4;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(W*U,H*U),new THREE.MeshLambertMaterial({map:tex}));ground.rotation.x=-Math.PI/2;ground.position.set(W*U/2,0,H*U/2);ground.receiveShadow=true;s.add(ground);
  const water=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshLambertMaterial({color:'#4cc2f0',transparent:true,opacity:.85}));water.rotation.x=-Math.PI/2;water.scale.set(POND.rx*U,POND.ry*U,1);water.position.set(POND.x*U,.02,POND.y*U);s.add(water);R3.water=water;
  for(const [dx,dy] of [[-55,18],[45,-18],[60,26]]){const l=at(rot(cyl(.18,.18,.02,'#5aa83c',12)),(POND.x+dx)*U,.05,(POND.y+dy)*U);s.add(l);}
  fpInit();
  if(FP.ok){build3DPack(s);R3.farmG=new THREE.Group();s.add(R3.farmG);R3.dyn=new THREE.Group();s.add(R3.dyn);R3.sig='';R3.objs=new Map();return;}
  const house=mkHouse();house.position.set((HOUSE.x+HOUSE.w/2)*U,0,(HOUSE.y+HOUSE.h)*U-1.4);s.add(house);
  const barn=mkBarn();barn.position.set((BARN.x+BARN.w/2)*U,0,(BARN.y+BARN.h)*U-1.45);s.add(barn);
  for(const t of TREES){const m=mkTree(.95+((t[0]*7+t[1])%5)/20);m.position.set(t[0]*U,0,t[1]*U);m.rotation.y=t[0];s.add(m);}
  for(const b of BUSHES){const m=mkBush(b[2]);m.position.set(b[0]*U,0,b[1]*U);s.add(m);}
  for(const r of ROCKS){const m=mkRock(r[2]/10);m.position.set(r[0]*U,0,r[1]*U);m.rotation.y=r[0];s.add(m);}
  R3.farmG=new THREE.Group();s.add(R3.farmG);R3.dyn=new THREE.Group();s.add(R3.dyn);R3.sig='';R3.objs=new Map();
}
// cenário com os modelos do Farm Pack (casa, celeiro, árvores, enfeites fixos)
function build3DPack(s){const put=(m,x,z,ry)=>{m.position.set(x,0,z);if(ry)m.rotation.y=ry;s.add(m);return m;};
  put(fp('casa',.98),(HOUSE.x+HOUSE.w/2)*U,(HOUSE.y+HOUSE.h/2)*U+.1);
  put(fp('celeiro',.78),(BARN.x+BARN.w/2)*U,(BARN.y+BARN.h/2)*U+.1);
  const TK=['macieira','pinheiro','laranjeira','betula'],TH={macieira:1.9,pinheiro:2.1,laranjeira:2,betula:2.1};
  TREES.forEach((t,i)=>{const k=TK[i%4],v=.9+((t[0]*7+t[1])%5)/25;put(fpH(k,TH[k]*v),t[0]*U,t[1]*U,t[0]);});
  for(const b of BUSHES)put(fpH('arbusto',.8*b[2]),b[0]*U,b[1]*U,b[0]);
  for(const r of ROCKS)put(fp('pedra',r[2]/10*.45),r[0]*U,r[1]*U,r[0]);
  // enfeites fixos (fora da área de construir)
  put(fp('silo',.42),7.9,1.7);put(fp('caixadagua',.36),10.2,1.5);
  put(fp('feno',.5),11.5,1.2,.4);put(fp('barril',.55),17.55,3.95);put(fp('barril',.5),17.1,4.05,.8);put(fp('caixote',.5),11.6,2.3,.3);
  for(const x of [5.9,9.4,15.2])put(fp('poste',.55),x,4.05);
  put(fp('placa',.6),12.4,25.45,-.5);
}

// ---------- cercas, abrigos, canteiros ----------
function fenceLine(G2,x1,z1,x2,z2,dark,post){const len=Math.hypot(x2-x1,z2-z1),ang=Math.atan2(-(z2-z1),x2-x1);
  for(const h of [.13,.26]){const r=box(len,.045,.04,dark);r.position.set((x1+x2)/2,h,(z1+z2)/2);r.rotation.y=ang;G2.add(r);}
  const n=Math.max(1,Math.round(len/.42));for(let i=0;i<=n;i++){const p=box(.07,.36,.07,post);p.position.set(x1+(x2-x1)*i/n,.18,z1+(z2-z1)*i/n);G2.add(p);}}
function mkTrough(kind){return grp(at(box(.75,.16,.26,'#a8723f'),0,.08,0),at(box(.66,.04,.18,kind==='water'?'#4cc2f0':'#e8c46a'),0,.165,0));}
function mkPen(p){const P=PEN_TYPES[p.type],Gq=penGeo(p),G2=new THREE.Group();
  const x0=Gq.x*U,z0=Gq.y*U,x1=(Gq.x+Gq.w)*U,z1=(Gq.y+Gq.h)*U;
  const gr=box(x1-x0,.03,z1-z0,P.ground);gr.position.set((x0+x1)/2,.015,(z0+z1)/2);gr.castShadow=false;G2.add(gr);
  if(FP.ok){fpFence(G2,x0,z0,x1,z0,'cerca');fpFence(G2,x0,z0,x0,z1,'cerca');fpFence(G2,x1,z0,x1,z1,'cerca');fpFence(G2,x0,z1,x1,z1,'cerca');
    G2.add(at(fpFit('cocho',.75,.4),Gq.feed.x*U,0,Gq.feed.y*U));G2.add(at(fp('balde',.85),Gq.water.x*U,0,Gq.water.y*U));
    if(Gq.house){const h=Gq.house;G2.add(at(fpFit('galinheiro',h.w*U*1.15,h.h*U*1.3),(h.x+h.w/2)*U,0,(h.y+h.h*.5)*U));}
    if(Gq.shed){const h=Gq.shed;G2.add(at(fpFit('estabulo',h.w*U*1.05,h.h*U*1.35),(h.x+h.w/2)*U,0,(h.y+h.h*.55)*U));}
    if(Gq.perch){const h=Gq.perch;G2.add(at(box(.06,.55,.06,'#7a4f2a'),h.x*U-.25,.27,h.y*U));G2.add(at(box(.06,.55,.06,'#7a4f2a'),h.x*U+.25,.27,h.y*U));G2.add(at(box(.6,.06,.06,'#8a5a33'),h.x*U,.55,h.y*U));}
    return G2;}
  const dk='#8a5a2a',po='#c98a4a';fenceLine(G2,x0,z0,x1,z0,dk,po);fenceLine(G2,x0,z0,x0,z1,dk,po);fenceLine(G2,x1,z0,x1,z1,dk,po);fenceLine(G2,x0,z1,x1,z1,dk,po);
  const f=mkTrough('feed');f.position.set(Gq.feed.x*U,0,Gq.feed.y*U);G2.add(f);const w=mkTrough('water');w.position.set(Gq.water.x*U,0,Gq.water.y*U);G2.add(w);
  if(Gq.house){const h=Gq.house,c=grp(at(box(h.w*U,.55,h.h*U*.7,'#c99a64'),0,.275,0),at(roofP(h.w*U+.15,.4,h.h*U*.7+.15,'#3f8a35'),0,.55,0),at(box(.22,.3,.04,'#2b1d12'),0,.15,h.h*U*.35+.01));c.position.set((h.x+h.w/2)*U,0,(h.y+h.h*.5)*U);G2.add(c);G2.add(at(rot(cyl(.18,.18,.04,'#e8c46a',12)),(h.x+12)*U,.03,(h.y+h.h+8)*U));}
  if(Gq.shed){const h=Gq.shed,c=new THREE.Group();for(const [x,z] of [[-.75,-.4],[.75,-.4],[-.75,.4],[.75,.4]])c.add(at(box(.07,.7,.07,'#8a5a33'),x,.35,z));c.add(at(roofP(1.8,.35,1.05,'#c4573a'),0,.7,0));c.add(at(rot(cyl(.3,.3,.45,'#e8c46a',14),Math.PI/2,0,Math.PI/2),0,.25,0));c.position.set((h.x+h.w/2)*U,0,(h.y+h.h*.6)*U);G2.add(c);}
  if(Gq.perch){const h=Gq.perch;G2.add(at(box(.06,.55,.06,'#7a4f2a'),h.x*U-.25,.27,h.y*U));G2.add(at(box(.06,.55,.06,'#7a4f2a'),h.x*U+.25,.27,h.y*U));G2.add(at(box(.6,.06,.06,'#8a5a33'),h.x*U,.55,h.y*U));}
  return G2;}
function mkDeco(d,f){const x=d.c+.5,z=d.r+.5,G2=new THREE.Group();
  if(FP.ok){const m=mkDecoPack(d,f,x,z,G2);if(m)return m;}
  if(d.type==='cerca'||d.type==='cercab'){const dk=d.type==='cercab'?'#e8e2d4':'#8a5a2a',po=d.type==='cercab'?'#fffdf6':'#c98a4a';
    const has=(dc,dr)=>f.deco.some(o=>(o.type==='cerca'||o.type==='cercab')&&o.c===d.c+dc&&o.r===d.r+dr);const L=has(-1,0),R=has(1,0),Up=has(0,-1),D=has(0,1),alone=!L&&!R&&!Up&&!D;
    if(L||alone||(!Up&&!D))fenceLine(G2,x-.5,z,x,z,dk,po);if(R||alone||(!Up&&!D))fenceLine(G2,x,z,x+.5,z,dk,po);if(Up)fenceLine(G2,x,z-.5,x,z,dk,po);if(D)fenceLine(G2,x,z,x,z+.5,dk,po);return G2;}
  const at2=m=>{m.position.set(x,0,z);G2.add(m);return G2;};
  if(d.type==='flores'){const g3=grp(at(box(.8,.12,.8,'#6b4326'),0,.06,0));const cols=['#e2483d','#f6c445','#c94f8a','#fff7e3','#9a5bc4'];for(let i=0;i<9;i++){const px=-.27+(i%3)*.27,pz=-.27+Math.floor(i/3)*.27;g3.add(at(cyl(.015,.015,.18,'#3f8a35',5),px,.2,pz));g3.add(at(sph(.07,cols[i%5],8,6),px,.3,pz));}return at2(g3);}
  if(d.type==='arvore')return at2(mkTree(.8));
  if(d.type==='banco'){return at2(grp(at(box(.8,.06,.25,'#b9824a'),0,.25,0),at(box(.8,.18,.05,'#b9824a'),0,.42,-.12),at(box(.06,.25,.22,'#6b4326'),-.33,.12,0),at(box(.06,.25,.22,'#6b4326'),.33,.12,0)));}
  if(d.type==='carrinho'){return at2(grp(at(box(.5,.2,.35,'#3f8a35'),0,.28,0),at(rot(cyl(.12,.12,.06,'#3b2a1a',12),Math.PI/2),.28,.12,0),at(box(.5,.04,.04,'#8a5a33'),-.4,.3,.12),at(box(.5,.04,.04,'#8a5a33'),-.4,.3,-.12),at(sph(.08,'#e9862b'),-.05,.42,0),at(sph(.08,'#e2483d'),.1,.42,.06)));}
  if(d.type==='espantalho'){const g3=grp(at(box(.06,1.1,.06,'#8a5a33'),0,.55,0),at(box(.7,.05,.05,'#8a5a33'),0,.8,0),at(box(.3,.35,.18,'#3d7fb8'),0,.75,0),at(sph(.14,'#f3e3b0'),0,1.05,0),at(cyl(.24,.24,.03,'#c9a033',14),0,1.17,0),at(cyl(.11,.13,.14,'#c9a033',10),0,1.25,0));g3.userData.sway=1;return at2(g3);}
  if(d.type==='poco'){return at2(grp(at(cyl(.32,.34,.4,'#a8a29a',14),0,.2,0),at(cyl(.26,.26,.02,'#2f5a7a',14),0,.4,0),at(box(.06,.7,.06,'#8a5a33'),-.28,.65,0),at(box(.06,.7,.06,'#8a5a33'),.28,.65,0),at(roofP(.8,.3,.5,'#c4573a'),0,.95,0),at(box(.12,.12,.12,'#b9824a'),0,.6,0)));}
  if(d.type==='fonte'){const g3=grp(at(cyl(.4,.44,.18,'#c9c2b4',16),0,.09,0),at(cyl(.34,.34,.02,'#4cc2f0',16),0,.19,0),at(cyl(.06,.08,.45,'#c9c2b4',10),0,.4,0),at(cyl(.18,.12,.08,'#c9c2b4',12),0,.62,0));const jet=at(sph(.07,'#9fdcf7'),0,.72,0);jet.userData.jet=1;g3.add(jet);return at2(g3);}
  if(d.type==='moinho'){const g3=grp(at(cyl(.2,.32,1.2,'#fff3dc',8),0,.6,0),at(cone(.3,.35,'#c4573a',8),0,1.37,0));const bl=new THREE.Group();for(let i=0;i<4;i++){const b=at(box(.08,.6,.02,'#e8dcc0'),0,.32,0);const h=new THREE.Group();h.add(b);h.rotation.z=i*Math.PI/2;bl.add(h);}bl.position.set(0,1.1,.3);bl.userData.spin=1;g3.add(bl);return at2(g3);}
  return G2;}

// enfeites com os modelos do Farm Pack; devolve null para os que continuam feitos por código
function mkDecoPack(d,f,x,z,G2){const at2=m=>{m.position.set(x,0,z);G2.add(m);return G2;};
  if(d.type==='cerca'||d.type==='cercab'){const k=d.type;
    const has=(dc,dr)=>f.deco.some(o=>(o.type==='cerca'||o.type==='cercab')&&o.c===d.c+dc&&o.r===d.r+dr);const L=has(-1,0),R=has(1,0),Up=has(0,-1),D=has(0,1),alone=!L&&!R&&!Up&&!D;
    if(L||alone||(!Up&&!D))fpFence(G2,x-.5,z,x,z,k);if(R||alone||(!Up&&!D))fpFence(G2,x,z,x+.5,z,k);if(Up)fpFence(G2,x,z-.5,x,z,k);if(D)fpFence(G2,x,z,x,z+.5,k);return G2;}
  if(d.type==='flores'){const g3=grp(at(box(.8,.1,.8,'#6b4326'),0,.05,0));[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(([px,pz],i)=>g3.add(at(rot(fp(i%2?'flor2':'flor1',.55),0,i*1.7,0),px,.08,pz)));return at2(g3);}
  if(d.type==='arvore')return at2(rot(fpH('macieira',1.5),0,x,0));
  if(d.type==='carrinho')return at2(rot(fpFit('carrinho',.75,.95),0,-.6,0));
  if(d.type==='poco')return at2(fpFit('poco',.95,.95));
  if(d.type==='moinho'){const s=1.1/fpSize('moinho').x,g3=grp(fp('moinho',s)),p=FP_META.moinho_pas.piv;
    // a hélice gira em volta do próprio eixo (pivô calculado na conversão)
    const pv=new THREE.Group();pv.position.set(p[0]*s,p[1]*s,p[2]*s);pv.add(fp('moinho_pas',s));pv.userData.spin=1;g3.add(pv);return at2(g3);}
  return null;}

// ---------- plantas (4 fases) ----------
const CROPC={tomate:'#e2483d',morango:'#d93a4a',berinjela:'#5b2a7a',uva:'#6a2a7a',pepino:'#4f8a2a',abobora:'#e9862b',melancia:'#2f7a2f',milho:'#f4d23c',cenoura:'#f08a2c',batata:'#c9a46a',alface:'#8fd56a',girassol:'#f7c623',abacaxi:'#e8a43a'};
const SPOTS4=[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]],SPOTS2=[[-.18,0],[.18,0]];
function mkCrop(k,stage){const C0=CROPS[k]||{},b=C0.base||k,tint=C0.tint,G2=new THREE.Group();
  if(stage===0){G2.add(scl(at(sph(.28,'#7a4a26',10,6),0,.0,0),1,.25,1));for(const [x,z] of [[-.1,0],[.05,.08],[.1,-.07]])G2.add(at(sph(.035,'#e8d6a0',6,4),x,.07,z));return G2;}
  if(stage===1){for(const [x,z] of SPOTS4){G2.add(at(cyl(.012,.015,.14,'#3f8a35',5),x,.07,z));G2.add(at(rot(scl(sph(.05,'#7cc85a',7,5),1,.35,.6),0,0,.5),x-.04,.15,z));G2.add(at(rot(scl(sph(.05,'#6fbf4a',7,5),1,.35,.6),0,0,-.5),x+.04,.15,z));}return G2;}
  const fl=stage===2,fr=stage===3,green='#4aa83c',green2='#5cc447';
  const fruitC=tint==='gold'?'#f2c94c':CROPC[b];
  switch(b){
    case 'alface':for(const [x,z] of SPOTS4){const r=fr?.14:.1;G2.add(scl(at(sph(r,'#6fbf4a'),x,r*.7,z),1,.8,1));G2.add(at(sph(r*.7,'#bfe88a'),x,r*1.1,z));}break;
    case 'cenoura':for(const [x,z] of SPOTS4){for(let i=0;i<3;i++)G2.add(at(rot(cone(.025,.3,green,5),0,0,(i-1)*.35),x+(i-1)*.04,.17,z));if(fl)G2.add(at(sph(.05,'#fffdf2',6,5),x,.36,z));if(fr)G2.add(at(rot(cone(.06,.16,'#f08a2c',8),Math.PI),x,.02,z));}break;
    case 'batata':for(const [x,z] of SPOTS2){G2.add(at(sph(.17,green),x,.17,z));G2.add(at(sph(.13,green2),x+.05,.28,z-.03));if(fl)for(let i=0;i<3;i++)G2.add(at(sph(.035,'#efe6ff',6,5),x-.08+i*.08,.38,z+.06));if(fr)for(let i=0;i<3;i++)G2.add(scl(at(sph(.07,'#c9a46a',8,6),x-.12+i*.12,.04,z+.2),1.2,.8,1));}break;
    case 'tomate':case 'berinjela':for(const [x,z] of SPOTS2){G2.add(at(box(.03,.62,.03,'#b9824a'),x,.31,z));for(let i=0;i<4;i++)G2.add(at(sph(.1-i*.012,i%2?green:green2),x+(i%2?.06:-.06),.12+i*.13,z));
      if(fl)for(let i=0;i<4;i++)G2.add(at(sph(.03,b==='tomate'?'#f6d02c':'#a77ad6',6,4),x+(i%2?-.1:.1),.15+i*.12,z+.06));
      if(fr)for(let i=0;i<(b==='tomate'?5:3);i++){const m=b==='tomate'?sph(.06,fruitC,10,8):scl(sph(.06,fruitC,10,8),1,1.8,1);G2.add(at(m,x+(i%2?-.11:.11),.12+i*(b==='tomate'?.1:.14),z+.07));}}break;
    case 'pepino':for(const x of [-.28,.28])G2.add(at(box(.035,.7,.035,'#b9824a'),x,.35,0));for(const y of [.25,.45,.62])G2.add(at(box(.6,.025,.025,'#b9824a'),0,y,0));
      for(let i=0;i<7;i++)G2.add(scl(at(sph(.09,i%2?green:green2,8,6),-.24+i*.08,.15+(i%3)*.18,.03),1,1,.5));
      if(fl)for(let i=0;i<4;i++)G2.add(at(sph(.035,'#f6d02c',6,4),-.18+i*.12,.3+(i%2)*.2,.08));
      if(fr)for(let i=0;i<4;i++)G2.add(at(cyl(.035,.035,.18,fruitC,8),-.18+i*.12,.32+(i%2)*.15,.09));break;
    case 'milho':for(const [x,z] of SPOTS4){G2.add(at(cyl(.025,.03,.8,'#5f9a3a',6),x,.4,z));for(let i=0;i<3;i++)G2.add(at(rot(scl(sph(.12,green,6,4),1,.12,.35),0,i*2,.4),x,.2+i*.2,z));
      if(fl||fr)G2.add(at(cone(.05,.14,'#d9b24a',6),x,.86,z));if(fr)G2.add(at(rot(cyl(.04,.04,.16,fruitC,8),0,0,.4),x+.06,.48,z));}break;
    case 'morango':for(const [x,z] of SPOTS4){G2.add(scl(at(sph(.12,green),x,.06,z),1,.55,1));if(fl)G2.add(at(sph(.03,'#fffdf2',6,4),x,.13,z+.05));if(fr)for(let i=0;i<2;i++)G2.add(at(rot(cone(.04,.08,fruitC,8),Math.PI),x-.05+i*.1,.06,z+.1));}break;
    case 'abobora':case 'melancia':{for(const [x,z] of [[-.25,-.2],[.25,-.15],[-.2,.22],[.22,.25]])G2.add(scl(at(sph(.13,b==='abobora'?green:'#3f8a35',8,6),x,.06,z),1,.35,1));
      if(fl)G2.add(at(cone(.07,.12,'#f6c445',8),0,.1,0));
      if(fr){const big=tint==='giant'?1.45:1;if(b==='abobora'){G2.add(scl(at(sph(.24*big,fruitC,14,10),0,.17*big,0),1,.72,1));G2.add(at(cyl(.025,.03,.1,'#5b7a2a',6),0,.33*big,0));}
        else{G2.add(scl(at(sph(.24,fruitC,14,10),0,.16,0),1.3,.75,1));G2.add(scl(at(sph(.241,'#1f5a2a',14,10),0,.16,0),1.31,.74,.6));}}break;}
    case 'girassol':for(const [x,z] of [[-.18,-.12],[.18,-.12],[0,.18]]){G2.add(at(cyl(.025,.03,.85,'#4f8a35',6),x,.42,z));G2.add(at(rot(scl(sph(.1,green,6,4),1,.12,.5),0,.6,.3),x,.35,z));
      if(fl)G2.add(at(sph(.07,green2,8,6),x,.88,z));
      if(fr){const head=new THREE.Group();const n=12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const pc=tint==='rainbow'?['#e2483d','#f08a2c','#f7c623','#5aa83c','#3d9bd1','#9a5bc4'][i%6]:'#f7c623';head.add(at(scl(sph(.06,pc,6,4),1,.4,1),Math.cos(a)*.13,Math.sin(a)*.13,0));}head.add(at(scl(sph(.09,'#6a3f1a',10,6),1,1,.35),0,0,.01));head.rotation.y=Math.PI/4;head.rotation.x=-.3;head.position.set(x,.9,z);G2.add(head);}}break;
    case 'uva':for(const x of [-.32,.32])G2.add(at(box(.04,.8,.04,'#8a5a33'),x,.4,0));G2.add(at(box(.75,.05,.3,'#8a5a33'),0,.8,0));for(let i=0;i<6;i++)G2.add(scl(at(sph(.1,i%2?green:green2,8,6),-.3+i*.12,.86,(i%2?.06:-.06)),1,.5,1));
      if(fl)for(const x of [-.18,.05,.22])G2.add(at(sph(.04,'#c9e08a',6,4),x,.7,0));
      if(fr)for(const x of [-.18,.05,.22]){for(let r=0;r<3;r++)for(let j=0;j<3-r;j++)G2.add(at(sph(.035,fruitC,6,5),x+(j-(2-r)/2)*.06,.72-r*.06,0));}break;
    case 'abacaxi':for(const [x,z] of SPOTS2){for(let i=0;i<7;i++){const a=i/7*Math.PI*2;G2.add(at(rot(cone(.03,.3,'#5f8f5a',4),Math.cos(a)*.7,0,Math.sin(a)*.7),x+Math.cos(a)*.06,.13,z+Math.sin(a)*.06));}
      if(fl)G2.add(at(cone(.05,.12,'#c94f8a',8),x,.22,z));if(fr){G2.add(scl(at(sph(.09,fruitC,10,8),x,.28,z),1,1.35,1));G2.add(at(cone(.05,.14,'#3f7a45',6),x,.47,z));}}break;
  }
  if(fr)G2.userData.ready=1;
  return G2;}
function mkWeed(){const g3=new THREE.Group();for(let i=0;i<5;i++)g3.add(at(rot(cone(.04,.25,i%2?'#4d6b22':'#5f7f2a',4),0,0,(i-2)*.3),(i-2)*.07,.12,.1));g3.add(at(sph(.04,'#b36ad6',6,4),.12,.22,.1));return g3;}

// ---------- animais ----------
function mkAnimal3(a){const ty=bt(a),sk=(ANIMALS[a.type]||{}).skin,G2=new THREE.Group(),P={legs:[],head:null,tail:null,fan:null,body:null};
  const leg=(x,z,h,c,r)=>{const piv=new THREE.Group();piv.position.set(x,h,z);const l=at(cyl(r||.025,r||.025,h,c,5),0,-h/2,0);piv.add(l);P.legs.push(piv);G2.add(piv);};
  if(ty==='galinha'){const body=sk==='gold'?'#f2c94c':a.v?'#c87a3a':'#fffdf6';leg(-.03,.04,.1,'#e08a2a',.012);leg(-.03,-.04,.1,'#e08a2a',.012);
    G2.add(scl(at(sph(.13,body),0,.17,0),1.1,.9,.85));G2.add(at(rot(cone(.06,.12,a.v?'#5a3a1a':body,5),0,0,.9),-.14,.22,0));
    const h=new THREE.Group();h.add(sph(.07,body));h.add(at(sph(.03,'#d9483d',6,4),-.01,.07,0));h.add(at(sph(.025,'#d9483d',6,4),.03,.065,0));h.add(at(rot(cone(.025,.06,'#f0a030',5),0,0,-Math.PI/2),.08,0,0));h.add(at(sph(.012,'#1d140c',4,3),.04,.02,.05));h.add(at(sph(.012,'#1d140c',4,3),.04,.02,-.05));
    h.position.set(.11,.3,0);P.head=h;P.h0=h.position.clone();G2.add(h);}
  else if(ty==='vaca'){for(const [x,z] of [[-.22,.11],[-.22,-.11],[.2,.11],[.2,-.11]])leg(x,z,.26,'#fbf7ee',.045);
    const bd=at(box(.62,.3,.32,'#fbf7ee'),0,.4,0);G2.add(bd);for(const [x,y,z,s] of [[-.1,.45,.165,.12],[.15,.36,.165,.09],[0,.43,-.165,.13],[-.2,.35,-.165,.08]])G2.add(at(box(s*1.6,s,.01,'#2b2620'),x,y,z));
    G2.add(at(sph(.06,'#f3a7a7',6,5),.05,.24,0));
    const h=new THREE.Group();h.add(box(.2,.2,.2,'#fbf7ee'));h.add(at(box(.08,.12,.21,'#f3b8a8'),.11,-.04,0));h.add(at(rot(cone(.025,.1,'#efe0b8',5),0,0,0),0,.14,.07));h.add(at(rot(cone(.025,.1,'#efe0b8',5),0,0,0),0,.14,-.07));h.add(at(box(.04,.06,.1,'#8a5a33'),-.04,.07,.13));h.add(at(box(.04,.06,.1,'#8a5a33'),-.04,.07,-.13));
    h.add(at(sph(.018,'#1d140c',4,3),.07,.04,.1));h.add(at(sph(.018,'#1d140c',4,3),.07,.04,-.1));h.position.set(.38,.55,0);P.head=h;P.h0=h.position.clone();G2.add(h);G2.add(at(sph(.035,'#f6c445',6,5),.33,.4,0));
    const t=new THREE.Group();t.add(at(cyl(.012,.012,.22,'#fbf7ee',4),0,-.11,0));t.add(at(sph(.03,'#3b2a1a',5,4),0,-.22,0));t.position.set(-.31,.5,0);P.tail=t;G2.add(t);}
  else if(ty==='ovelha'){const wc=sk==='black'?'#4a4242':'#f7f1e1';for(const [x,z] of [[-.15,.08],[-.15,-.08],[.13,.08],[.13,-.08]])leg(x,z,.2,'#3a2d26',.03);
    for(const [x,y,z] of [[-.15,.32,0],[0,.36,.06],[0,.36,-.06],[.14,.33,0],[-.05,.26,.1],[-.05,.26,-.1],[.06,.42,0]])G2.add(at(sph(.13,wc,9,7),x,y,z));
    const h=new THREE.Group();h.add(scl(sph(.08,'#3a2d26'),1.2,1,.9));h.add(at(sph(.06,wc,7,5),-.03,.07,0));h.add(at(rot(scl(sph(.04,'#3a2d26',5,4),1.4,.5,.8),0,.6,0),-.02,.02,.09));h.add(at(rot(scl(sph(.04,'#3a2d26',5,4),1.4,.5,.8),0,-.6,0),-.02,.02,-.09));h.position.set(.28,.36,0);P.head=h;P.h0=h.position.clone();G2.add(h);}
  else if(ty==='cabra'){for(const [x,z] of [[-.15,.08],[-.15,-.08],[.14,.08],[.14,-.08]])leg(x,z,.26,'#cdbb9a',.025);G2.add(scl(at(sph(.17,'#d8c7aa',10,8),0,.36,0),1.35,.8,.75));
    const h=new THREE.Group();h.add(scl(sph(.08,'#d8c7aa'),1.3,1,.9));h.add(at(cone(.03,.08,'#f4efe4',5),.06,-.08,0));h.add(at(rot(cone(.02,.14,'#6b5a44',5),0,0,.8),-.05,.1,.04));h.add(at(rot(cone(.02,.14,'#6b5a44',5),0,0,.8),-.05,.1,-.04));h.add(at(sph(.015,'#1d140c',4,3),.06,.03,.06));h.add(at(sph(.015,'#1d140c',4,3),.06,.03,-.06));
    h.position.set(.3,.52,0);P.head=h;P.h0=h.position.clone();G2.add(h);G2.add(at(rot(cone(.025,.1,'#bfa883',4),0,0,.8),-.25,.44,0));}
  else if(ty==='pavao'){const bc=sk==='white'?'#f4f1ea':'#2a6fc9',t1=sk==='white'?'#e6dfd0':'#2f8f6a',t2=sk==='white'?'#f7f3ea':'#3aa57a';leg(0,.03,.14,'#8a7a5a',.012);leg(0,-.03,.14,'#8a7a5a',.012);
    G2.add(scl(at(sph(.11,bc),0,.22,0),1.1,1.15,.85));G2.add(at(rot(cyl(.025,.035,.22,bc,6),0,0,-.2),.06,.36,0));
    const h=new THREE.Group();h.add(sph(.05,bc));h.add(at(rot(cone(.015,.05,'#d9c27a',4),0,0,-Math.PI/2),.06,0,0));for(let i=-1;i<=1;i++)h.add(at(sph(.013,t1,4,3),-.01,.08,i*.02));h.position.set(.09,.48,0);P.head=h;P.h0=h.position.clone();G2.add(h);
    const fan=new THREE.Group();for(let i=0;i<11;i++){const a=(i/10-.5)*Math.PI*.95;const f=new THREE.Group();f.add(at(box(.025,.42,.012,i%2?t1:t2),0,.21,0));f.add(at(scl(sph(.035,sk==='white'?'#ffffff':'#e2b43a',6,4),1,1,.3),0,.38,.01));f.add(at(scl(sph(.02,sk==='white'?'#f0ece2':'#2a6fc9',5,3),1,1,.4),0,.38,.02));f.rotation.x=a;fan.add(f);}
    fan.position.set(-.08,.22,0);fan.rotation.y=Math.PI/2;P.fan=fan;G2.add(fan);}
  G2.userData.P=P;return G2;}
function mkDog3(){const G2=new THREE.Group(),P={legs:[],head:null,tail:null};
  const leg=(x,z)=>{const piv=new THREE.Group();piv.position.set(x,.18,z);piv.add(at(cyl(.03,.03,.18,'#a8662f',5),0,-.09,0));P.legs.push(piv);G2.add(piv);};
  for(const [x,z] of [[-.13,.07],[-.13,-.07],[.12,.07],[.12,-.07]])leg(x,z);
  const body=scl(at(sph(.14,'#b8743a',10,8),0,.26,0),1.45,.8,.8);G2.add(body);G2.add(scl(at(sph(.1,'#e9c08e',8,6),.08,.22,0),1.2,.7,.75));
  const h=new THREE.Group();h.add(sph(.11,'#b8743a'));h.add(scl(at(sph(.07,'#e9c08e',8,6),.1,-.03,0),1.2,.8,.9));h.add(at(sph(.025,'#1d140c',6,4),.18,-.01,0));h.add(at(sph(.018,'#1d140c',4,3),.07,.04,.06));h.add(at(sph(.018,'#1d140c',4,3),.07,.04,-.06));
  h.add(at(rot(scl(sph(.05,'#7a4a22',6,4),.6,1.4,.5),.3),-.02,0,.1));h.add(at(rot(scl(sph(.05,'#7a4a22',6,4),.6,1.4,.5),-.3),-.02,0,-.1));h.add(at(rot(cyl(.075,.075,.025,'#d9483d',10),0,0,Math.PI/2.4),-.06,-.08,0));
  h.position.set(.22,.38,0);P.head=h;P.h0=h.position.clone();G2.add(h);
  const t=new THREE.Group();t.add(at(cyl(.018,.012,.16,'#b8743a',5),0,.08,0));t.position.set(-.2,.3,0);t.rotation.z=.6;P.tail=t;G2.add(t);
  G2.userData.P=P;return G2;}
function mkPerson3(v){const G2=new THREE.Group(),P={legs:[],head:null};
  for(const z of [.05,-.05]){const piv=new THREE.Group();piv.position.set(0,.28,z);piv.add(at(cyl(.035,.035,.28,'#2f4d7a',5),0,-.14,0));P.legs.push(piv);G2.add(piv);}
  G2.add(at(box(.2,.3,.24,v.color),0,.43,0));
  for(const z of [.15,-.15]){const piv=new THREE.Group();piv.position.set(0,.56,z);piv.add(at(cyl(.03,.03,.26,'#f2c79a',5),0,-.13,0));P.legs.push(piv);G2.add(piv);}
  const h=new THREE.Group();h.add(sph(.12,v.skin||'#e8b48a'));h.add(at(cyl(.21,.21,.02,'#e8c46a',14),0,.08,0));h.add(at(cyl(.1,.12,.1,'#e8c46a',10),0,.14,0));h.add(at(sph(.015,'#1d140c',4,3),.11,.01,.04));h.add(at(sph(.015,'#1d140c',4,3),.11,.01,-.04));
  h.position.set(0,.72,0);P.head=h;G2.add(h);
  const sack=at(sph(.12,'#b9824a',8,6),-.16,.4,0);sack.visible=false;P.sack=sack;G2.add(sack);
  G2.userData.P=P;return G2;}
function mkEgg(k){const m=scl(sph(.045,k==='ovodourado'?'#f2c94c':'#fff4dc',8,6),1,1.3,1);m.position.y=.06;return grp(m);}

// ---------- sincronização estado → cena ----------
const OBJ=new WeakMap();
function objFor(o,make){let m=OBJ.get(o);if(!m){m=make();OBJ.set(o,m);}if(!m.parent)R3.dyn.add(m);m.userData.seen=R3.frameId;return m;}
function headingTo(m,dx,dz,dt,k){if(Math.abs(dx)+Math.abs(dz)<1e-4)return;const target=Math.atan2(-dz,dx);let d=target-m.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));m.rotation.y+=d*Math.min(1,dt*(k||8));}
function animateLegs(P,moving,t,sp){P.legs.forEach((l,i)=>{l.rotation.z=moving?Math.sin(t*sp+(i%2?Math.PI:0))*.55:l.rotation.z*.8;});}
function syncFarm(farm){
  const sig=mode+'|'+(visiting?visiting.handle:'')+'|'+farm.pens.map(p=>p.id).join(',')+'|'+farm.deco.map(d=>d.type+d.c+'_'+d.r).join(',')+'|'+!!farm.dog;
  if(sig!==R3.sig){R3.sig=sig;const G2=R3.farmG;while(G2.children.length)G2.remove(G2.children[0]);
    for(const p of farm.pens)G2.add(mkPen(p));for(const d of farm.deco){const m=mkDeco(d,farm);G2.add(m);}
    const dh=mkDogHouse(!!farm.dog);dh.position.set(DOGHOUSE.x*U,0,(DOGHOUSE.y+10)*U);G2.add(dh);}
}
function render(farm){
  if(!R3){g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,view.sw,view.sh);return;}
  R3.frameId=(R3.frameId||0)+1;const t=T0,dt=1/60;
  shx=shake?rnd(-shake,shake):0;shy=shake?rnd(-shake,shake):0;updCamera();
  syncFarm(farm);
  R3.farmG.traverse(o=>{if(o.userData.spin)o.rotation.z=t*1.6;if(o.userData.jet)o.position.y=.72+Math.abs(Math.sin(t*4))*.08;if(o.userData.sway)o.rotation.z=Math.sin(t*1.2)*.05;});
  // canteiros
  for(const p of farm.plots){const m=objFor(p,()=>{const g3=new THREE.Group();const soil=box(.92,.1,.92,'#a8692f');soil.position.y=.05;soil.castShadow=false;g3.add(soil);for(let i=-1;i<=1;i++){const f=box(.84,.02,.06,'#8a5426');f.position.set(0,.105,i*.25);f.castShadow=false;g3.add(f);}g3.userData.soil=soil;return g3;});
    m.position.set((p.c+.5),0,(p.r+.5));m.userData.soil.material=M(p.water?'#6a3a18':'#a8692f');
    const st=p.crop?stageOf(p.prog):-1,key=p.crop?p.crop+st+(st===3?'_'+Math.min(p.qty,9):''):'';
    if(m.userData.key!==key){if(m.userData.crop)m.remove(m.userData.crop);m.userData.key=key;if(p.crop){const c=mkCrop(p.crop,st);c.position.y=.1;m.add(c);m.userData.crop=c;}else m.userData.crop=null;}
    const c=m.userData.crop;if(c){const local=st===1?(p.prog-.5)/.25:st===2?(p.prog-.75)/.25:1;const base=st===1?.55+local*.45:st===2?.8+local*.2:1;const b=p.pop>0?1+Math.sin((1-p.pop)*Math.PI*3)*p.pop*.25:1;c.scale.set(base,base*b,base);c.rotation.z=Math.sin(t*1.5+p.c)*.03;}
    if(!!p.weed!==!!m.userData.weed){if(m.userData.weed){m.remove(m.userData.weed);m.userData.weed=null;}else{const w=mkWeed();w.position.y=.1;m.add(w);m.userData.weed=w;}}
    if(p.bug&&!m.userData.bug){const b=grp(at(sph(.05,'#d9483d',6,5),0,0,0),at(sph(.025,'#3b2a1a',5,4),.05,0,0));m.add(b);m.userData.bug=b;}else if(!p.bug&&m.userData.bug){m.remove(m.userData.bug);m.userData.bug=null;}
    if(m.userData.bug)m.userData.bug.position.set(Math.sin(t*3+p.c)*.25,.25,Math.cos(t*2.6+p.r)*.25);}
  for(const e of farm.eggs){const m=objFor(e,()=>mkEgg(e.k));m.position.set(e.x*U,0,e.y*U);const s=Math.min(1,(e.t||1)*4);m.scale.setScalar(s);}
  for(const a of farm.animals){const m=objFor(a,()=>mkAnimal3(a)),P=m.userData.P;const nx=a.x*U,nz=a.y*U,dx=nx-m.position.x,dz=nz-m.position.z;
    const moving=a.state==='walk';if(m.userData.init){if(moving)headingTo(m,dx,dz,dt);}else{m.rotation.y=a.dir>0?-Math.PI/4:Math.PI*.75;m.userData.init=1;}
    if((a.state==='eat'||a.state==='drink')&&m.userData.faceT!==a.state){const pen=penById(farm,a.pen);if(pen){const G=penGeo(pen),o=a.state==='eat'?G.feed:G.water;m.rotation.y=Math.atan2(-(o.y-a.y),o.x-a.x);}m.userData.faceT=a.state;}if(!(a.state==='eat'||a.state==='drink'))m.userData.faceT=null;
    m.position.set(nx,moving?Math.abs(Math.sin(t*11+a.phase))*.025:0,nz);animateLegs(P,moving,t,ANIMALS[a.type].speed>30?16:11);
    const down=a.state==='eat'||a.state==='drink'||a.state==='graze'||a.state==='peck'||a.state==='lay';
    if(P.head){const h=P.head,h0=P.h0;const tgt=down?(bt(a)==='galinha'||bt(a)==='pavao'?{x:h0.x+.05,y:.08+(Math.sin(t*16+a.phase)>0?.04:0)}:{x:h0.x+.04,y:h0.y-.28+Math.sin(t*9)*.015}):{x:h0.x,y:h0.y+Math.sin(t*2+a.phase)*.01};h.position.x+=(tgt.x-h.position.x)*.25;h.position.y+=(tgt.y-h.position.y)*.25;}
    if(P.tail)P.tail.rotation.x=Math.sin(t*3+a.phase)*.3;
    if(P.fan){const open=a.state==='display'?Math.min(1,(a.dispT||0)/.6):0;P.fan.userData.o=(P.fan.userData.o||0)+(open-(P.fan.userData.o||0))*.15;const o=P.fan.userData.o;P.fan.children.forEach((f,i)=>{const base=(i/10-.5)*Math.PI*.95;f.rotation.x=base*(.12+o*.88);});P.fan.rotation.z=(1-o)*1.25;P.fan.position.y=.22+o*.05;}
    if(bt(a)==='ovelha'){const s=1+(a.ready?.12:a.prod*.08);m.scale.set(1,s,s);}}
  if(farm.dog){const d=farm.dog,m=objFor(d,mkDog3),P=m.userData.P;const nx=d.x*U,nz=d.y*U,dx=nx-m.position.x,dz=nz-m.position.z;const moving=Math.hypot(dx,dz)>1e-4;
    if(moving)headingTo(m,dx,dz,dt,12);const sleep=d.state==='sleep';m.position.set(nx,d.state==='bite'?Math.abs(Math.sin(t*20))*.12:(moving?Math.abs(Math.sin(t*14))*.03:0),nz);
    animateLegs(P,moving,t,d.state==='chase'?24:13);P.tail.rotation.x=Math.sin(t*(d.state==='chase'?28:16))*.6;
    const hy=sleep?.2:d.state==='chase'||d.state==='bite'?.33:.38;P.head.position.y+=(hy-P.head.position.y)*.2;m.scale.y=sleep?.7:1;}
  const people=[];if(visitor&&mode==='home')people.push(visitor);if(mode==='visit')people.push(me);
  for(const v of people){const m=objFor(v,()=>mkPerson3(v)),P=m.userData.P;const nx=v.x*U,nz=v.y*U,dx=nx-m.position.x,dz=nz-m.position.z;const moving=Math.hypot(dx,dz)>1e-4;
    if(moving)headingTo(m,dx,dz,dt,12);m.position.set(nx,moving?Math.abs(Math.sin(t*14))*.03:0,nz);animateLegs(P,moving||v.state==='act',t,v.state==='flee'?24:13);P.sack.visible=!!v.sack;}
  for(const o of [...R3.dyn.children])if(o.userData.seen!==R3.frameId)R3.dyn.remove(o);
  if(R3.water)R3.water.material.opacity=.8+Math.sin(t*2)*.05;
  R3.renderer.render(R3.scene,R3.camera);
  overlay(farm);
}
// ---------- camada 2D: balões, barras, textos ----------
function overlay(farm){
  g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,view.sw,view.sh);
  const zs=clamp(ZS*1.3,.7,1.4);
  for(const p of farm.plots){const P=iso(p.c*T+T/2,p.r*T+T/2);
    if(p.crop&&p.prog<1){const w=40*zs;rr(g,P.x-w/2,P.y+10*zs,w,5,2.5);g.fillStyle='rgba(59,42,26,.6)';g.fill();rr(g,P.x-w/2,P.y+10*zs,w*p.prog,5,2.5);g.fillStyle=p.weed||p.bug?'#d9483d':'#9ad66a';g.fill();}
    if(canWater(p)){const Q=iso(p.c*T+T/2,p.r*T+T/2,40);const by=Q.y+Math.sin(T0*3+p.c)*2;circ(g,Q.x,by,10,'#fff7e3',OUT,1.2);g.beginPath();g.moveTo(Q.x,by-6);g.quadraticCurveTo(Q.x+6,by+2,Q.x,by+4);g.quadraticCurveTo(Q.x-6,by+2,Q.x,by-6);g.fillStyle='#3d9bd1';g.fill();}
    if(p.crop&&p.prog>=1){const Q=iso(p.c*T+T*.8,p.r*T+T*.2,46);const s=(Math.sin(T0*4+p.c+p.r)+1)/2;g.save();g.globalAlpha=.5+s*.5;star(g,Q.x,Q.y,4+s*2.5,'#fff6a8');g.restore();}}
  for(const p of farm.pens){const Gq=penGeo(p),P2=PEN_TYPES[p.type];const Q=iso(Gq.x+Gq.w/2,Gq.y+Gq.h+6);g.save();g.font='700 11px Fredoka, sans-serif';const label=P2.n+' '+penCount(farm,p)+'/'+PEN_CAP;const tw=g.measureText(label).width+12;rr(g,Q.x-tw/2,Q.y,tw,16,5);g.fillStyle='rgba(255,247,227,.92)';g.fill();g.fillStyle='#3b2a1a';g.textAlign='center';g.fillText(label,Q.x,Q.y+12);g.restore();}
  const HH={galinha:30,vaca:52,ovelha:44,cabra:48,pavao:44};
  if(mode==='home')for(const a of farm.animals)if(a.ready){const A=ANIMALS[a.type];const Q=iso(a.x,a.y,HH[bt(a)]+18);const bx=Q.x,by=Q.y-14+Math.sin(T0*3+a.x)*2;circ(g,bx,by,16,'#fff7e3',OUT,1.6);g.beginPath();g.moveTo(bx-4,by+14);g.lineTo(bx,by+21);g.lineTo(bx+4,by+14);g.fillStyle='#fff7e3';g.fill();g.drawImage(ICON[A.prod].c,bx-12,by-13,24,24);
    g.font='800 10px Nunito, sans-serif';g.textAlign='center';rr(g,bx+6,by+4,18,13,6);g.fillStyle='#3f8a35';g.fill();g.fillStyle='#fff';g.fillText('×'+A.qty,bx+15,by+14);}
  if(farm.dog&&farm.dog.sayT>0){const d=farm.dog,Q=iso(d.x,d.y,34);const big=d.say.length>3;g.save();g.font=(big?'700 17px':'700 12px')+' Fredoka, sans-serif';const tw=g.measureText(d.say).width+14;rr(g,Q.x-tw/2,Q.y-30,tw,big?26:19,9);g.fillStyle=big?'#d9483d':'#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1.4;g.stroke();g.fillStyle=big?'#fff':'#3b2a1a';g.textAlign='center';g.fillText(d.say,Q.x,Q.y-(big?11:16));g.restore();}
  if(farm.dog&&farm.dog.state==='sleep'){const d=farm.dog,Q=iso(d.x,d.y,26);const zz=(T0*1.2)%1;g.save();g.globalAlpha=1-zz;g.fillStyle='#3b2a1a';g.font='bold 13px Fredoka, sans-serif';g.fillText('z',Q.x+8+zz*8,Q.y-zz*14);g.restore();}
  if(farm.dog&&!dogAwake(farm)&&mode==='home'){const Q=iso(DOGHOUSE.x,DOGHOUSE.y,50);g.save();g.font='800 11px Nunito, sans-serif';g.textAlign='center';const msg='Sem ração: o cachorro dorme';const tw=g.measureText(msg).width+12;rr(g,Q.x-tw/2,Q.y-18,tw,18,9);g.fillStyle='rgba(255,247,227,.94)';g.fill();g.fillStyle='#d9483d';g.fillText(msg,Q.x,Q.y-5);g.restore();}
  const people=[];if(visitor&&mode==='home')people.push(visitor);if(mode==='visit')people.push(me);
  for(const v of people){const Q=iso(v.x,v.y,56);g.save();g.font='800 11px Nunito, sans-serif';const tw=g.measureText('@'+v.handle).width+10;rr(g,Q.x-tw/2,Q.y-16,tw,16,8);g.fillStyle='rgba(255,247,227,.95)';g.fill();g.strokeStyle=v.color;g.lineWidth=1.5;g.stroke();g.fillStyle='#3b2a1a';g.textAlign='center';g.fillText('@'+v.handle,Q.x,Q.y-4);g.restore();}
  if(placing&&placing.c!=null){const P=placing,ok=canPlace(farm,P.c,P.r,P.w,P.h);P.ok=ok;
    for(let y=P.r;y<P.r+P.h;y++)for(let x=P.c;x<P.c+P.w;x++){const c=[iso(x*T+3,y*T+3),iso((x+1)*T-3,y*T+3),iso((x+1)*T-3,(y+1)*T-3),iso(x*T+3,(y+1)*T-3)];g.beginPath();c.forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.closePath();g.fillStyle=occAt(farm,x,y)?'rgba(217,72,61,.5)':'rgba(170,240,120,.55)';g.fill();}
    const c=[iso(P.c*T,P.r*T),iso((P.c+P.w)*T,P.r*T),iso((P.c+P.w)*T,(P.r+P.h)*T),iso(P.c*T,(P.r+P.h)*T)];g.beginPath();c.forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.closePath();g.setLineDash([7,5]);g.strokeStyle=ok?'#fff7e3':'#d9483d';g.lineWidth=3;g.stroke();g.setLineDash([]);
    const Q=iso((P.c+P.w/2)*T,(P.r+P.h/2)*T,40);g.save();g.font='700 14px Fredoka, sans-serif';g.textAlign='center';const label=(ok?'':'Não cabe aqui · ')+P.name;const tw=g.measureText(label).width+16;rr(g,Q.x-tw/2,Q.y-16,tw,22,8);g.fillStyle=ok?'#fff7e3':'#d9483d';g.fill();g.fillStyle=ok?'#3b2a1a':'#fff';g.fillText(label,Q.x,Q.y);g.restore();}
  for(const p of parts){g.globalAlpha=Math.max(0,1-p.t/1.2);circ(g,p.x,p.y,p.s||3.5,p.c);}g.globalAlpha=1;
  for(const f of fxs){const a=1-f.t/1.4;g.save();g.globalAlpha=a;g.font='700 15px Fredoka, sans-serif';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(255,247,227,.95)';g.strokeText(f.text,f.x,f.y-f.t*30);g.fillStyle=f.color;g.fillText(f.text,f.x,f.y-f.t*30);g.restore();}
}
