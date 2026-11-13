'use strict';
// ====================== DATA ======================
const T=56, COLS=18, ROWS=26, W=COLS*T, H=ROWS*T;
// Tempos de propósito irregulares (segundos). Cada semente tem preço, XP e rendimento próprios.
const CROPS={
  alface:{n:'Alface',cost:5,sell:3,t:60,y:4,xp:1,lvl:1},
  cenoura:{n:'Cenoura',cost:8,sell:5,t:95,y:4,xp:2,lvl:1},
  batata:{n:'Batata',cost:14,sell:8,t:200,y:4,xp:3,lvl:2},
  tomate:{n:'Tomate',cost:22,sell:12,t:420,y:5,xp:6,lvl:2},
  pepino:{n:'Pepino',cost:20,sell:9,t:330,y:5,xp:5,lvl:3},
  milho:{n:'Milho',cost:30,sell:18,t:780,y:4,xp:9,lvl:3},
  morango:{n:'Morango',cost:45,sell:15,t:1500,y:6,xp:14,lvl:4},
  abobora:{n:'Abóbora',cost:60,sell:80,t:2400,y:2,xp:18,lvl:5},
  girassol:{n:'Girassol',cost:50,sell:30,t:1080,y:4,xp:12,lvl:6},
  melancia:{n:'Melancia',cost:90,sell:70,t:3900,y:2,xp:26,lvl:7},
  berinjela:{n:'Berinjela',cost:110,sell:45,t:5400,y:4,xp:32,lvl:8},
  uva:{n:'Uva',cost:160,sell:50,t:10800,y:6,xp:48,lvl:9},
  abacaxi:{n:'Abacaxi',cost:240,sell:140,t:21600,y:3,xp:70,lvl:10},
  // Sementes raras (pagas com cash)
  girassolarco:{n:'Girassol arco-íris',cash:6,sell:90,t:1800,y:4,xp:20,lvl:1,base:'girassol',tint:'rainbow'},
  abogigante:{n:'Abóbora gigante',cash:8,sell:600,t:3000,y:1,xp:30,lvl:1,base:'abobora',tint:'giant'},
  uvadourada:{n:'Uva dourada',cash:12,sell:120,t:7200,y:6,xp:45,lvl:1,base:'uva',tint:'gold'},
};
// Produção por ciclo: galinha 6 ovos e vaca 2 L de leite a cada 10 min (pedido do Estevão); os demais seguem a mesma lógica.
const ANIMALS={
  galinha:{n:'Galinha',cost:150,xp:3,lays:true,prod:'ovo',qty:6,t:600,pxp:2,lvl:1,speed:36},
  vaca:{n:'Vaca',cost:200,xp:4,prod:'leite',qty:2,t:600,pxp:3,lvl:2,speed:20},
  ovelha:{n:'Ovelha',cost:450,xp:8,prod:'la',qty:5,t:1200,pxp:5,lvl:3,speed:24},
  cabra:{n:'Cabra',cost:400,xp:8,prod:'leitecabra',qty:5,t:1800,pxp:7,lvl:4,speed:30},
  pavao:{n:'Pavão',cost:900,xp:15,prod:'pena',qty:3,t:3600,pxp:12,lvl:6,speed:22},
  // Animais exóticos (pagos com cash)
  galinhadourada:{n:'Galinha dourada',cash:30,lays:true,xp:10,prod:'ovodourado',qty:3,t:900,pxp:4,lvl:1,speed:36,base:'galinha',skin:'gold'},
  ovelhanegra:{n:'Ovelha negra',cash:45,xp:15,prod:'lanegra',qty:3,t:1500,pxp:7,lvl:1,speed:24,base:'ovelha',skin:'black'},
  pavaobranco:{n:'Pavão branco',cash:80,xp:25,prod:'penabranca',qty:2,t:3600,pxp:15,lvl:1,speed:22,base:'pavao',skin:'white'},
};
const bt=a=>(ANIMALS[a.type]&&ANIMALS[a.type].base)||a.type;
const PEN_TYPES={
  galinheiro:{n:'Galinheiro',animal:'galinha',w:4,h:3,cost:300,xp:8,lvl:1,ground:'#c9a86a'},
  curral:{n:'Curral',animal:'vaca',w:5,h:4,cost:500,xp:12,lvl:2,ground:'#86c25e'},
  aprisco:{n:'Estábulo das ovelhas',animal:'ovelha',w:4,h:3,cost:700,xp:15,lvl:3,ground:'#93c96a'},
  cabril:{n:'Cabril',animal:'cabra',w:4,h:3,cost:650,xp:15,lvl:4,ground:'#bfa36e'},
  viveiro:{n:'Viveiro do pavão',animal:'pavao',w:4,h:3,cost:1500,xp:25,lvl:6,ground:'#8cc768'},
};
const PEN_CAP=4;
const penFor=animal=>{const b=(ANIMALS[animal]&&ANIMALS[animal].base)||animal;return Object.keys(PEN_TYPES).find(k=>PEN_TYPES[k].animal===b);};
const DECO={
  cerca:{n:'Cerca de madeira',cost:10,xp:1,lvl:1},
  flores:{n:'Canteiro de flores',cost:35,xp:2,lvl:1},
  cercab:{n:'Cerca branca',cost:25,xp:2,lvl:2},
  banco:{n:'Banco de madeira',cost:60,xp:3,lvl:2},
  arvore:{n:'Árvore frutífera',cost:80,xp:4,lvl:3},
  carrinho:{n:'Carrinho de mão',cost:90,xp:4,lvl:3},
  espantalho:{n:'Espantalho',cost:120,xp:6,lvl:4},
  poco:{n:'Poço',cost:250,xp:10,lvl:5},
  fonte:{n:'Fonte de pedra',cash:40,xp:20,lvl:1},
  moinho:{n:'Moinho de vento',cash:60,xp:30,lvl:1},
};
const CASH_PACKS=[{cash:50,brl:4.90},{cash:110,brl:9.90,tag:'+10%'},{cash:240,brl:19.90,tag:'+20%'},{cash:650,brl:49.90,tag:'+30%'},{cash:1400,brl:99.90,tag:'+40%'}];
const PRODUCTS={ovo:{n:'Ovo',pl:'ovos',u:'un',sell:5},leite:{n:'Leite',pl:'litros de leite',u:'litro',sell:15},la:{n:'Lã',pl:'lãs',u:'un',sell:20},leitecabra:{n:'Leite de cabra',pl:'litros de leite',u:'litro',sell:25},pena:{n:'Pena de pavão',pl:'penas',u:'un',sell:120},ovodourado:{n:'Ovo dourado',pl:'ovos dourados',u:'un',sell:25},lanegra:{n:'Lã negra',pl:'lãs negras',u:'un',sell:50},penabranca:{n:'Pena branca',pl:'penas brancas',u:'un',sell:300}};
const BARN_UP=[{cap:150,cost:800,lvl:2},{cap:200,cost:2000,lvl:4},{cap:300,cost:4500,lvl:6},{cap:400,cost:9000,lvl:8},{cap:550,cost:16000,lvl:10},{cap:750,cost:28000,lvl:12},{cap:1000,cost:45000,lvl:15}];
const DOG_COST=400, FOOD_COST=40, FOOD_SECS=15*60;
const plotCost=n=>30+Math.max(0,n-8)*6;
// Limites por nível: liberam aos poucos para ninguém encher a fazenda de uma vez.
const maxPlots=l=>Math.min(60,8+(l-1)*2);
const maxAnimals=(k,l)=>{const A=ANIMALS[k];if(A.cash)return Math.max(0,1+Math.floor((l-1)/3));return l<A.lvl?0:(A.lays?2:1)+(l-A.lvl);};
const maxPens=(k,l)=>{const P=PEN_TYPES[k];return l<P.lvl?0:1+Math.floor((l-P.lvl)/3);};
const need=l=>20+l*25;
const itemName=k=>CROPS[k]?CROPS[k].n:PRODUCTS[k]?PRODUCTS[k].n:k;
const itemSell=k=>CROPS[k]?CROPS[k].sell:PRODUCTS[k]?PRODUCTS[k].sell:0;

const BARN={x:12*T,y:0.5*T,w:5.4*T,h:3.8*T};
const HOUSE={x:1*T,y:0.6*T,w:4.4*T,h:3.6*T};
const DOGHOUSE={x:13*T,y:5.6*T};
const POND={x:15.9*T,y:22.4*T,rx:1.9*T,ry:1.25*T};
const GATE={x:11.45*T,y:H+30};
const TREES=[[0.5*T,6.4*T],[0.5*T,10.2*T],[0.5*T,14.3*T],[0.5*T,18.2*T],[0.5*T,22.4*T],[2.2*T,25.7*T],[6*T,25.8*T],[9.6*T,25.7*T],[13.2*T,25.8*T],[17.2*T,25.7*T],[6.6*T,3.8*T],[10.2*T,3.5*T]];
const BUSHES=[[0.3*T,8*T,1],[0.4*T,12*T,.9],[0.3*T,16.2*T,1.1],[0.4*T,20.3*T,.9],[4*T,25.5*T,1],[8*T,25.6*T,1.1],[11.5*T,25.6*T,.9],[15*T,25.5*T,1],[8.5*T,3.9*T,.9],[11*T,3.7*T,.8]];
const ROCKS=[[0.5*T,24.4*T,12],[17.4*T,20.2*T,10],[13.6*T,24.6*T,9],[5.6*T,3.2*T,8]];
const NAMES=['ana.roca','joao_milho','bia.flores','tio.zeca','duda.horta','marquinhos_rural'];
const COLORS=['#d9483d','#3d9bd1','#9a5bc4','#e08a2a','#2f9a6a','#c94f8a','#5a6bd8','#8a6b3a'];

// ====================== UTIL ======================
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
const hashStr=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const seeded=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const hhmm=ts=>{const d=new Date(ts);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
function fmtT(s){s=Math.max(0,Math.ceil(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;if(h)return h+'h'+(m?String(m).padStart(2,'0'):'');if(m)return m+'min'+(x?' '+x+'s':'');return x+'s';}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function ell(g,x,y,rx,ry,fill,stroke,lw){g.beginPath();g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1.4;g.stroke();}}
function circ(g,x,y,r,fill,stroke,lw){ell(g,x,y,r,r,fill,stroke,lw);}
function line(g,x1,y1,x2,y2,c,w){g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.strokeStyle=c;g.lineWidth=w||1.5;g.lineCap='round';g.stroke();}
function leaf(g,x,y,l,w,a,c){g.save();g.translate(x,y);g.rotate(a);ell(g,l/2,0,l/2,w,c,OUT,.7);line(g,1,0,l*.85,0,'rgba(30,70,20,.35)',.7);g.restore();}
const OUT='rgba(59,42,26,.75)';

// ====================== MAP / GRID ======================
let uid=1;const nid=()=>'p'+(Date.now()%1e7)+'_'+(uid++);
function blockedTile(c,r){
  if(c<1||c>=COLS||r<5||r>=ROWS-1)return true;
  if(c===11)return true;
  if((c===12||c===13)&&(r===5||r===6))return true;
  if(c>=14&&r>=21&&r<=23)return true;
  return false;
}
function occAt(f,c,r){
  if(blockedTile(c,r))return'blocked';
  for(const p of f.plots)if(p.c===c&&p.r===r)return p;
  for(const p of f.pens){const P=PEN_TYPES[p.type];if(c>=p.c&&c<p.c+P.w&&r>=p.r&&r<p.r+P.h)return p;}
  for(const d of f.deco)if(d.c===c&&d.r===r)return d;
  return null;
}
function canPlace(f,c,r,w,h){for(let y=r;y<r+h;y++)for(let x=c;x<c+w;x++)if(occAt(f,x,y))return false;return true;}
const geo=new Map();
function penGeo(p){let g2=geo.get(p.id);if(g2)return g2;const P=PEN_TYPES[p.type];const x=p.c*T+6,y=p.r*T+12,w=P.w*T-12,h=P.h*T-16;
  g2={x,y,w,h,feed:{x:x+44,y:y+h-22},water:{x:x+120,y:y+h-22}};
  if(p.type==='galinheiro')g2.house={x:x+w-84,y:y+6,w:76,h:62};
  if(p.type==='curral'){g2.feed={x:x+50,y:y+40};g2.water={x:x+130,y:y+40};g2.shed={x:x+w-100,y:y+4,w:92,h:58};}
  if(p.type==='viveiro')g2.perch={x:x+w-50,y:y+40};
  geo.set(p.id,g2);return g2;}
function inPen(p,margin=18){const G=penGeo(p);let x,y,tries=0;const block=G.house||G.shed;
  do{x=rnd(G.x+margin,G.x+G.w-margin);y=rnd(G.y+margin+16,G.y+G.h-margin);tries++;}
  while(block&&x>block.x-16&&x<block.x+block.w+16&&y>block.y&&y<block.y+block.h+18&&tries<40);return{x,y};}

// ====================== STATE ======================
const KEY='fazendinha-v3';
let S;
function makeAnimal(type,pen){const p=inPen(pen);return{type,pen:pen.id,x:p.x,y:p.y,tx:p.x,ty:p.y,dir:Math.random()<.5?1:-1,state:'idle',timer:rnd(.2,2),phase:Math.random()*9,hunger:Math.random(),thirst:Math.random(),prod:Math.random()*.5,ready:false,v:Math.random()<.35?1:0,purpose:null};}
function makeDog(){return{x:DOGHOUSE.x+34,y:DOGHOUSE.y+30,tx:0,ty:0,dir:1,state:'idle',timer:1,phase:0,target:null,say:'',sayT:0};}
function newPlot(c,r){return{c,r,crop:null,prog:0,water:false,weed:false,bug:false,qty:0,stolen:0,st:-1,pop:0};}
function newPen(type,c,r){return{id:nid(),type,c,r};}
function plant(p,k,prog){p.crop=k;p.prog=prog||0;p.water=false;p.qty=0;p.stolen=0;p.st=stageOf(prog||0);p.pop=0;if(p.prog>=1)p.qty=CROPS[k].y;}
const stageOf=pr=>pr>=1?3:pr>=.75?2:pr>=.5?1:0;
function freshState(){
  const f={plots:[],pens:[],deco:[],animals:[],eggs:[],dog:null,dogFood:0};
  for(let r=6;r<8;r++)for(let c=5;c<9;c++)f.plots.push(newPlot(c,r));
  const P=f.plots;
  plant(P[0],'alface',1);plant(P[1],'cenoura',1);plant(P[2],'tomate',1);plant(P[3],'alface',.82);
  plant(P[4],'cenoura',.6);plant(P[5],'alface',.3);plant(P[6],'cenoura',.1);P[6].weed=true;
  const gal=newPen('galinheiro',1,6);const cur=newPen('curral',1,10);f.pens.push(gal,cur);
  for(let i=0;i<2;i++)f.animals.push(makeAnimal('galinha',gal));f.animals[0].prod=.93;
  f.animals.push(makeAnimal('vaca',cur));
  for(let c=5;c<=8;c++)f.deco.push({type:'cerca',c,r:5});
  f.deco.push({type:'flores',c:9,r:6},{type:'flores',c:9,r:7},{type:'arvore',c:7,r:9});
  return{v:3,name:'Você',color:'#3f8a35',coins:500,cash:20,xp:0,level:1,seed:'alface',barnCap:100,
    home:f,barn:{alface:6,ovo:3},neighbors:NAMES.slice(0,4).map(makeNeighbor),
    log:[{t:Date.now(),m:'Bem-vindo à sua fazenda! Plante, cuide dos bichos e visite os vizinhos.'}],
    last:Date.now(),nextVisit:Date.now()+30000,insta:null,seenHelp:false};
}
function makeNeighbor(handle){
  const R=seeded(hashStr(handle));
  const n={handle,color:COLORS[hashStr(handle)%COLORS.length],lvl:2+Math.floor(R()*10),thief:R()<.5?.7:.25,used:0,day:today(),farm:null,ts:Date.now()};
  n.farm=makeNeighborFarm(n,R);return n;
}
function makeNeighborFarm(n,R){
  const f={plots:[],pens:[],deco:[],animals:[],eggs:[],dog:null,dogFood:0};
  const keys=Object.keys(CROPS).filter(k=>CROPS[k].lvl<=n.lvl&&!CROPS[k].cash);
  const cols=5+Math.floor(R()*5),rows=3+Math.floor(R()*4);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const p=newPlot(2+c,6+r);
    if(R()<.88){const pr=R()<.45?1:.05+R()*.9;plant(p,keys[Math.floor(R()*keys.length)],pr);if(pr>=.5&&pr<1&&R()<.4)p.water=true;p.weed=pr<1&&R()<.18;p.bug=pr<1&&!p.weed&&R()<.14;}
    f.plots.push(p);}
  const spots=[['galinheiro',13,8],['curral',1,16],['aprisco',13,12],['cabril',6,17],['viveiro',13,16]];
  for(const [t,c,r] of spots){if(t==='galinheiro'||R()<.6){if(!canPlace(f,c,r,PEN_TYPES[t].w,PEN_TYPES[t].h))continue;const pen=newPen(t,c,r);f.pens.push(pen);const k=1+Math.floor(R()*4);for(let i=0;i<k;i++)f.animals.push(makeAnimal(PEN_TYPES[t].animal,pen));}}
  for(let c=2;c<2+cols;c++)if(R()<.7&&!occAt(f,c,5))f.deco.push({type:R()<.5?'cerca':'cercab',c,r:5});
  if(R()<.6){f.dog=makeDog();f.dogFood=Date.now()+3600e3;}
  f.dogName=['Thor','Pipoca','Bolinha','Fumaça','Paçoca','Faísca'][Math.floor(R()*6)];
  return f;
}
function load(hot){
  if(hot&&hot.S){S=hot.S;return;}
  try{const raw=localStorage.getItem(KEY);if(raw)S=JSON.parse(raw);}catch(e){}
  if(!S||S.v!==3)S=freshState();
  catchUp();
}
function save(){S.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

// ====================== SIMULATION ======================
function growPlots(plots,dt){for(const p of plots){if(!p.crop||p.prog>=1||p.weed||p.bug)continue;p.prog+=dt/CROPS[p.crop].t;if(p.prog>=1){p.prog=1;p.qty=CROPS[p.crop].y;p.stolen=0;}}}
const barnUsed=()=>Object.values(S.barn).reduce((a,b)=>a+b,0);
const barnFree=()=>Math.max(0,S.barnCap-barnUsed());
function penById(f,id){return f.pens.find(p=>p.id===id);}
function catchUp(){
  const el=Math.min((Date.now()-(S.last||Date.now()))/1000,24*3600);
  if(el<5)return;
  growPlots(S.home.plots,el);
  for(const a of S.home.animals){const A=ANIMALS[a.type];
    if(A.lays){const pen=penById(S.home,a.pen);const tot=a.prod*A.qty+el/A.t*A.qty;const n=Math.min(A.qty,Math.floor(tot)-Math.floor(a.prod*A.qty));for(let i=0;i<n&&pen;i++){const p=inPen(pen,24);S.home.eggs.push({x:p.x,y:p.y,t:1,pen:pen.id,k:A.prod});}a.prod=(tot/A.qty)%1;}
    else if(!a.ready){a.prod+=el/A.t;if(a.prod>=1){a.prod=1;a.ready=true;}}}
  for(const n of S.neighbors){growPlots(n.farm.plots,(Date.now()-n.ts)/1000);n.ts=Date.now();}
  if(el>90){const visits=Math.min(3,Math.floor(el/150)+1);const msgs=[];for(let i=0;i<visits;i++){const r=instantVisit();if(r)msgs.push(r);}
    if(msgs.length)setTimeout(()=>toast('Enquanto você esteve fora: '+msgs.join(' · '),5000),900);}
}
function weedTick(plots,chance){for(const p of plots){if(p.crop&&p.prog<1&&!p.weed&&!p.bug){const r=Math.random();if(r<chance)p.weed=true;else if(r<chance*1.8)p.bug=true;}}}
function dogAwake(f){return !!f.dog&&f.dogFood>Date.now();}

// ====================== XP / MONEY ======================
function addXP(n,x,y){if(!n)return;S.xp+=n;if(x!=null)fx(x,y-18,'+'+n+' XP','#3f8a35');
  while(S.xp>=need(S.level)){S.xp-=need(S.level);S.level++;S.coins+=50;S.cash=(S.cash||0)+10;
    const un=[...Object.values(CROPS),...Object.values(ANIMALS),...Object.values(PEN_TYPES),...Object.values(DECO)].filter(o=>o.lvl===S.level&&!o.cash).map(o=>o.n);
    toast('Nível '+S.level+'! +50 moedas e +10 cash'+(un.length?' · Liberou: '+un.join(', '):''),4500);burstS(view.w/2,view.h/2);}
  hud();}
function addCoins(n,x,y){S.coins+=n;if(x!=null&&n)fx(x,y-34,(n>0?'+':'')+n,'#b07a12');hud();}
function addBarn(k,n){S.barn[k]=(S.barn[k]||0)+n;}
function logEv(m){S.log.unshift({t:Date.now(),m});S.log=S.log.slice(0,40);}
