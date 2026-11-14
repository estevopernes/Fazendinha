// ====================== ICONS ======================
const ICON={};
function makeIcons(){
  const S2=96;
  const def=(k,fn)=>{const c=document.createElement('canvas');c.width=c.height=S2;const x=c.getContext('2d');x.save();x.translate(S2/2,S2/2);x.scale(S2/64,S2/64);fn(x);x.restore();ICON[k]={c,url:c.toDataURL()};};
  def('coin',x=>{circ(x,0,0,24,'#f6c445','#a4730f',3);circ(x,0,0,17,null,'#d9a020',2.5);x.fillStyle='#a4730f';x.font='bold 22px Fredoka, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('F',0,1);});
  const cropScale={tomate:1,pepino:1,milho:.95,girassol:.95,uva:1.05,berinjela:1.1,abacaxi:1.25,alface:1.35,cenoura:1.15,batata:1.2,morango:1.3,abobora:1.25,melancia:1.25};
  for(const k in CROPS)def(k,x=>{const s=cropScale[CROPS[k].base||k]||1;x.save();const b0=CROPS[k].base||k;const tall=['tomate','pepino','milho','girassol','uva','berinjela'].includes(b0);if(CROPS[k].tint==='giant')x.scale(.8,.8);x.translate(0,tall?26:14);x.scale(s,s);drawGrown(x,k,3,1,0);x.restore();});
  def('ovo',x=>{ell(x,-8,4,11,14,'#fff4dc',OUT,2);ell(x,9,8,10,12,'#f3dcb2',OUT,2);ell(x,-11,-2,3,4,'rgba(255,255,255,.8)');});
  def('leite',x=>{rr(x,-13,-16,26,36,6);x.fillStyle='#fdfdf8';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();rr(x,-9,-26,18,12,3);x.fillStyle='#3d9bd1';x.fill();x.stroke();rr(x,-13,0,26,10,0);x.fillStyle='#3d9bd1';x.fill();});
  def('leitecabra',x=>{rr(x,-13,-16,26,36,6);x.fillStyle='#fdfdf8';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();rr(x,-9,-26,18,12,3);x.fillStyle='#8a6b3a';x.fill();x.stroke();rr(x,-13,0,26,10,0);x.fillStyle='#c9a46a';x.fill();});
  def('la',x=>{circ(x,0,2,20,'#f7efe0',OUT,2);for(let i=-2;i<=2;i++){x.beginPath();x.arc(0,2,20,-1.2+i*.35,0.6+i*.35);x.strokeStyle='#d8cbb0';x.lineWidth=2;x.stroke();}line(x,14,16,26,24,'#d8cbb0',3);});
  def('pena',x=>{x.save();x.rotate(-.6);line(x,0,26,0,-20,'#4a6a2a',2.5);ell(x,0,-12,9,16,'#2f8f6a');ell(x,0,-14,6,9,'#e2b43a');ell(x,0,-14,4,6,'#2a6fc9');ell(x,0,-14,2,3,'#173a6a');x.restore();});
  def('cash',x=>{x.beginPath();x.moveTo(0,-24);x.lineTo(20,-8);x.lineTo(12,20);x.lineTo(-12,20);x.lineTo(-20,-8);x.closePath();x.fillStyle='#2fbf8a';x.fill();x.strokeStyle='#17724f';x.lineWidth=3;x.stroke();x.beginPath();x.moveTo(-20,-8);x.lineTo(20,-8);x.moveTo(0,-24);x.lineTo(-7,-8);x.lineTo(0,20);x.lineTo(7,-8);x.lineTo(0,-24);x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.6;x.stroke();ell(x,-8,-12,4,2.4,'rgba(255,255,255,.7)');});
  def('ovodourado',x=>{ell(x,-6,4,12,15,'#f2c94c',OUT,2);ell(x,-10,-3,3,4,'rgba(255,255,255,.8)');star(x,12,-12,6,'#fff6a8');star(x,14,10,4,'#fff6a8');});
  def('lanegra',x=>{circ(x,0,2,20,'#4a4242',OUT,2);for(let i=-2;i<=2;i++){x.beginPath();x.arc(0,2,20,-1.2+i*.35,0.6+i*.35);x.strokeStyle='#6a6060';x.lineWidth=2;x.stroke();}line(x,14,16,26,24,'#6a6060',3);});
  def('penabranca',x=>{x.save();x.rotate(-.6);line(x,0,26,0,-20,'#8a8070',2.5);ell(x,0,-12,9,16,'#f4f1ea',OUT,1);ell(x,0,-14,5,7,'#e6dfd0');ell(x,0,-14,2.4,3.4,'#fff');x.restore();star(x,16,-16,5,'#fff6a8');});
  def('racao',x=>{rr(x,-16,-20,32,40,6);x.fillStyle='#d9483d';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();rr(x,-10,-6,20,14,4);x.fillStyle='#fff7e3';x.fill();ell(x,-3,1,3,2.4,'#8a5a33');ell(x,4,1,3,2.4,'#8a5a33');ell(x,0,-3,2,1.6,'#8a5a33');});
  def('canteiro',x=>{x.save();x.scale(1.05,1.05);x.translate(-28,-28);drawPlotSoil(x,{c:0,r:0,water:false,crop:null});x.restore();});
  for(const k in DECO)def('d_'+k,x=>{const f={deco:[{type:k,c:0,r:0}]};x.save();x.translate(-28,{arvore:-22,espantalho:-24,poco:-20,banco:-34,carrinho:-34,fonte:-30,moinho:-14}[k]??-30);if(k==='moinho'){x.scale(.8,.8);x.translate(7,4);}if(k==='arvore'){x.scale(.8,.8);x.translate(6,-4);}drawDeco(x,{type:k,c:0,r:0},f,0,true);x.restore();});
  const an=(k,s,dy)=>def(k+'_a',x=>{x.save();x.scale(s,s);x.translate(0,dy);drawAnimal(x,{type:k,x:0,y:0,dir:1,state:'idle',phase:0,prod:0,v:0},0);x.restore();});
  an('galinha',1.9,10);an('vaca',1.15,14);an('ovelha',1.4,14);an('cabra',1.3,16);an('pavao',1.2,16);an('galinhadourada',1.9,10);an('ovelhanegra',1.4,14);an('pavaobranco',1.2,16);
  for(const k in PEN_TYPES)def('pen_'+k,x=>{rr(x,-28,-18,56,40,6);x.fillStyle=PEN_TYPES[k].ground;x.fill();for(let i=-28;i<=28;i+=9){rr(x,i-1.5,-24,3,8,1);x.fillStyle='#b9824a';x.fill();rr(x,i-1.5,16,3,8,1);x.fill();}line(x,-28,-20,28,-20,'#7a4f2a',2.4);line(x,-28,20,28,20,'#7a4f2a',2.4);x.save();x.translate(0,12);const s={galinha:1.25,vaca:.7,ovelha:.85,cabra:.8,pavao:.75}[PEN_TYPES[k].animal];x.scale(s,s);drawAnimal(x,{type:PEN_TYPES[k].animal,x:0,y:0,dir:1,state:'idle',phase:0,prod:0,v:0},0);x.restore();});
  def('cachorro_a',x=>{x.save();x.scale(1.45,1.45);x.translate(-2,14);drawDog(x,{x:0,y:0,dir:1,state:'idle',phase:0},0,true);x.restore();});
  def('t_mao',x=>{x.fillStyle='#f2c79a';x.strokeStyle=OUT;x.lineWidth=2.5;rr(x,-14,-6,28,26,9);x.fill();x.stroke();for(let i=0;i<4;i++){rr(x,-14+i*7,-24+(i===0||i===3?6:0),7,22,3.5);x.fill();x.stroke();}rr(x,-26,-2,14,8,4);x.fill();x.stroke();});
  def('t_regar',x=>{rr(x,-20,-10,28,26,6);x.fillStyle='#3d9bd1';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();x.beginPath();x.moveTo(8,0);x.lineTo(26,-16);x.lineTo(28,-12);x.lineTo(8,8);x.closePath();x.fill();x.stroke();x.beginPath();x.arc(-6,-12,10,Math.PI,0);x.stroke();for(let i=0;i<3;i++)ell(x,24+i*3,-4+i*7,2,3,'#7cc4ec');});
  def('t_loja',x=>{rr(x,-22,-6,44,28,3);x.fillStyle='#fff7e3';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();for(let i=0;i<5;i++){x.beginPath();x.moveTo(-24+i*10,-6);x.lineTo(-14+i*10,-6);x.lineTo(-14+i*10,-22);x.lineTo(-24+i*10,-22);x.closePath();x.fillStyle=i%2?'#fff7e3':'#d9483d';x.fill();x.stroke();}rr(x,-8,4,16,18,2);x.fillStyle='#8a5a33';x.fill();x.stroke();});
  def('t_viz',x=>{circ(x,-10,-10,9,'#f2c79a',OUT,2);rr(x,-22,0,24,20,10);x.fillStyle='#3d9bd1';x.fill();x.stroke();circ(x,11,-7,9,'#c98d5c',OUT,2);rr(x,-1,3,24,18,10);x.fillStyle='#d9483d';x.fill();x.stroke();});
  def('t_celeiro',x=>{x.beginPath();x.moveTo(-24,-4);x.lineTo(0,-24);x.lineTo(24,-4);x.lineTo(24,22);x.lineTo(-24,22);x.closePath();x.fillStyle='#d98a3a';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();rr(x,-10,4,20,18,1);x.fillStyle='#fff7e3';x.fill();x.stroke();line(x,-10,4,10,22,OUT,2);line(x,10,4,-10,22,OUT,2);});
  def('t_voltar',x=>{x.beginPath();x.moveTo(-22,0);x.lineTo(0,-20);x.lineTo(22,0);x.lineTo(16,0);x.lineTo(16,20);x.lineTo(-16,20);x.lineTo(-16,0);x.closePath();x.fillStyle='#fff7e3';x.fill();x.strokeStyle=OUT;x.lineWidth=2.5;x.stroke();rr(x,-6,6,12,14,2);x.fillStyle='#3d9bd1';x.fill();x.stroke();});
  def('t_erva',x=>{x.fillStyle='#5b7a2a';x.strokeStyle=OUT;x.lineWidth=2;for(let i=-2;i<=2;i++){x.beginPath();x.moveTo(i*7-4,20);x.lineTo(i*9,-18+Math.abs(i)*6);x.lineTo(i*7+4,20);x.closePath();x.fill();x.stroke();}line(x,-24,-20,24,22,'#d9483d',5);});
  def('t_roubar',x=>{x.beginPath();x.moveTo(-18,-6);x.quadraticCurveTo(-26,24,0,24);x.quadraticCurveTo(26,24,18,-6);x.closePath();x.fillStyle='#b9824a';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();rr(x,-14,-14,28,9,4);x.fill();x.stroke();x.fillStyle='#3b2a1a';x.font='bold 18px Fredoka, sans-serif';x.textAlign='center';x.fillText('$',0,14);});
  def('t_colher',x=>{x.save();x.rotate(.5);rr(x,-3,-8,6,30,3);x.fillStyle='#b9824a';x.fill();x.strokeStyle=OUT;x.lineWidth=2;x.stroke();x.beginPath();x.arc(-6,-10,16,-Math.PI*.9,-Math.PI*.1);x.strokeStyle='#9aa4ad';x.lineWidth=5;x.stroke();x.restore();});
}

// ====================== RUNTIME ======================
let T0=0, fxs=[], parts=[], visitor=null, mode='home', visiting=null, tool='mao', busy=false, placing=null;
const curFarm=()=>mode==='visit'?visiting.farm:S.home;
function fx(x,y,text,color){const P=iso(x,y);fxs.push({x:P.x,y:P.y,text,color,t:0});}
function burstS(x,y){for(let i=0;i<24;i++)parts.push({x,y,vx:rnd(-120,120),vy:rnd(-220,-60),t:0,c:pick(['#f6c445','#e2483d','#3d9bd1','#3f8a35','#fff7e3'])});}
function puff(x,y,c){const P=iso(x,y);for(let i=0;i<10;i++)parts.push({x:P.x,y:P.y,vx:rnd(-60,60),vy:rnd(-90,-20),t:0,c:c||'#fff7e3',s:3});}
const penCount=(f,p)=>f.animals.filter(a=>a.pen===p.id).length;

function updAnimal(a,dt,farm){
  const A=ANIMALS[a.type],pen=penById(farm,a.pen);if(!pen)return;const G=penGeo(pen);
  a.hunger+=dt/45;a.thirst+=dt/38;
  if(A.lays){const onGround=farm.eggs.filter(e=>e.pen===a.pen).length;
    if(onGround<PEN_CAP*A.qty){const b=Math.floor(a.prod*A.qty);a.prod+=dt/A.t;const af=Math.floor(a.prod*A.qty);
      if(af>b){farm.eggs.push({x:a.x-a.dir*7,y:a.y+1,t:0,pen:a.pen,k:A.prod});if(farm===S.home&&Math.random()<.5)fx(a.x,a.y-24,'có-có!','#b07a12');a.state='lay';a.timer=.8;}
      if(a.prod>=1)a.prod-=1;}}
  else if(!a.ready){a.prod+=dt/A.t;if(a.prod>=1){a.prod=1;a.ready=true;}}
  if(a.state==='walk'){
    const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);
    if(d<2){a.x=a.tx;a.y=a.ty;
      if(a.purpose==='eat'){a.state='eat';a.timer=rnd(3,5);a.dir=Math.sign((G.feed.x-a.x)-(G.feed.y-a.y))||1;}
      else if(a.purpose==='drink'){a.state='drink';a.timer=rnd(2.5,4);a.dir=Math.sign((G.water.x-a.x)-(G.water.y-a.y))||1;}
      else{a.state='idle';a.timer=rnd(.8,3);}
      a.purpose=null;}
    else{const sp=A.speed*dt;a.x+=dx/d*Math.min(sp,d);a.y+=dy/d*Math.min(sp,d);a.dir=(dx-dy)>0?1:-1;a.phase+=dt;}
    return;}
  if(a.state==='display')a.dispT=(a.dispT||0)+dt;
  a.timer-=dt;if(a.timer>0)return;
  if(a.state==='eat')a.hunger=0;if(a.state==='drink')a.thirst=0;if(a.state==='display')a.dispT=0;
  if(a.thirst>1&&Math.random()<.8){const side=Math.random()<.5?-1:1;a.tx=G.water.x+side*rnd(30,40);a.ty=G.water.y+rnd(2,8);a.purpose='drink';a.state='walk';return;}
  if(a.hunger>1&&Math.random()<.8){const side=Math.random()<.5?-1:1;a.tx=G.feed.x+side*rnd(30,40);a.ty=G.feed.y+rnd(2,8);a.purpose='eat';a.state='walk';return;}
  const r=Math.random();
  if(r<.5){const p=inPen(pen,22);a.tx=p.x;a.ty=p.y;a.state='walk';}
  else if(bt(a)==='galinha'&&r<.85){a.state='peck';a.timer=rnd(1.2,2.6);}
  else if(bt(a)==='pavao'&&r<.75){a.state='display';a.timer=rnd(3,5);a.dispT=0;}
  else if(bt(a)!=='galinha'&&bt(a)!=='pavao'&&r<.8){a.state='graze';a.timer=rnd(2,4);}
  else{a.state='idle';a.timer=rnd(1,2.5);}
}
function dogSpot(f){if(Math.random()<.45){return Math.random()<.6?[11.5*T,rnd(5,24)*T]:[rnd(1,17)*T,4.55*T];}
  for(let i=0;i<20;i++){const c=ri(1,17),r=ri(5,24);const o=occAt(f,c,r);if(!o||o.crop!==undefined||o.type==='flores')return[c*T+T/2,r*T+T*.8];}
  return[DOGHOUSE.x+34,DOGHOUSE.y+30];}
function updDog(d,dt,farm){
  if(d.sayT>0)d.sayT-=dt;
  const awake=dogAwake(farm);
  const moveTo=(x,y,sp)=>{const dx=x-d.x,dy=y-d.y,dd=Math.hypot(dx,dy);if(dd<3)return true;d.x+=dx/dd*Math.min(sp*dt,dd);d.y+=dy/dd*Math.min(sp*dt,dd);d.dir=(dx-dy)>0?1:-1;d.phase+=dt;return false;};
  if(d.state==='chase'){const tg=d.target;if(!tg){d.state='idle';return;}d.timerC=(d.timerC||0)+dt;if(d.timerC>.3&&Math.random()<dt*3){d.say=pick(['AU! AU!','GRRR!','AU AU AU!']);d.sayT=.8;}
    const tx=tg.x-(tg.x>d.x?14:-14),ty=tg.y;if(moveTo(tx,ty,270)){d.timerC=0;d.state='bite';d.timer=1.3;d.say='NHAC!';d.sayT=1.6;if(d.onBite){const fn=d.onBite;d.onBite=null;fn();}}return;}
  if(d.state==='bite'){d.timer-=dt;d.phase+=dt*3;const tg=d.target;if(tg){d.x+=(tg.x-(tg.x>d.x?14:-14)-d.x)*Math.min(1,dt*6);d.y+=(tg.y-d.y)*Math.min(1,dt*6);}if(d.timer<=0){d.state='return';d.target=null;const s=dogSpot(farm);d.tx=s[0];d.ty=s[1];}return;}
  if(!awake){if(moveTo(DOGHOUSE.x+34,DOGHOUSE.y+30,60))d.state='sleep';else d.state='walk';return;}
  if(d.state==='sleep')d.state='idle';
  if(d.state==='walk'||d.state==='return'){if(!d.tx){const s=dogSpot(farm);d.tx=s[0];d.ty=s[1];}if(moveTo(d.tx,d.ty,d.state==='return'?110:70)){d.state='idle';d.timer=rnd(1.5,4);}return;}
  d.timer-=dt;if(d.timer<=0){if(Math.random()<.75){const s=dogSpot(farm);d.tx=s[0];d.ty=s[1];d.state='walk';}else{d.timer=rnd(2,4);if(Math.random()<.3){d.say='au!';d.sayT=1;}}}
}

// ---- regras do canteiro ----
const canWater=p=>p.crop&&p.prog>=.5&&p.prog<1&&!p.water;
function waterPlot(p){p.water=true;p.prog=Math.min(1,p.prog+.1);if(p.prog>=1){p.qty=CROPS[p.crop].y;p.stolen=0;}}
function clearPlot(p){p.crop=null;p.prog=0;p.water=false;p.qty=0;p.stolen=0;p.st=-1;p.pop=0;}

// ---- vizinho visitando a SUA fazenda ----
function plotXY(p){return{x:p.c*T+T*.62,y:p.r*T+T*.62};}
function planVisit(n){
  const plots=S.home.plots;const q=[];
  const ready=plots.filter(p=>p.crop&&p.prog>=1&&p.qty>Math.ceil(CROPS[p.crop].y/2));
  const helps=plots.filter(p=>p.weed||p.bug||canWater(p));
  const thief=Math.random()<n.thief;
  if(thief&&ready.length)q.push({k:'steal',p:pick(ready)});
  for(const p of helps.sort(()=>Math.random()-.5)){if(q.length>=5)break;q.push({k:p.weed?'weed':p.bug?'bug':'water',p});}
  if(!thief)for(const p of plots.filter(p=>p.crop&&p.prog>=1&&p.qty>0)){if(q.length>=5||barnFree()<p.qty)break;q.push({k:'harvest',p});}
  q.sort((a,b)=>a.k==='steal'?1:b.k==='steal'?-1:0);
  return q.slice(0,5);
}
function startVisitor(){
  if(mode!=='home'||visitor||!S.neighbors.length)return;
  const n=pick(S.neighbors);const q=planVisit(n);if(!q.length)return;
  visitor={handle:n.handle,color:n.color,skin:pick(['#e8b48a','#c98d5c','#8d5a3a','#f2c79a']),x:GATE.x,y:GATE.y,dir:1,state:'walk',q,cur:null,timer:0,done:[],sack:false,n};
  toast('@'+n.handle+' chegou para visitar sua fazenda!');
  nextTarget();
}
function nextTarget(){const v=visitor;v.cur=v.q.shift()||null;
  if(!v.cur){v.state='leave';v.tx=GATE.x;v.ty=GATE.y;return;}
  if(!stillValid(v.cur)){nextTarget();return;}
  const xy=plotXY(v.cur.p);v.tx=xy.x-22;v.ty=xy.y+10;v.state='walk';}
function stillValid(a){const p=a.p;return a.k==='water'?canWater(p):a.k==='weed'?p.weed:a.k==='bug'?p.bug:(p.crop&&p.prog>=1&&p.qty>0);}
function updVisitor(dt){
  const v=visitor;if(!v)return;
  const sp=v.state==='flee'?220:130;
  if(v.state==='walk'||v.state==='leave'||v.state==='flee'){const dx=v.tx-v.x,dy=v.ty-v.y,d=Math.hypot(dx,dy);
    if(d<3){if(v.state==='walk'){v.state='act';v.timer=v.cur.k==='steal'?2.4:1.1;
        if(v.cur.k==='steal'){v.sack=true;const f=S.home;if(dogAwake(f)){const dog=f.dog;dog.state='chase';dog.target=v;dog.say='GRRR!';dog.sayT=1.2;dog.onBite=()=>bitten();
          centerOn(v.x,v.y);toast('Pega ladrão! @'+v.handle+' está roubando sua plantação!');}}}
      else finishVisitor();return;}
    v.x+=dx/d*Math.min(sp*dt,d);v.y+=dy/d*Math.min(sp*dt,d);v.dir=(dx-dy)>0?1:-1;
    if(v.state==='flee'&&Math.random()<dt*4)puff(v.x,v.y-2,'#d9b77e');return;}
  if(v.state==='act'){
    if(v.cur.k==='steal'&&S.home.dog&&S.home.dog.state==='chase'){if(v.timer>0.3)v.timer-=dt;return;}
    v.timer-=dt;if(v.timer>0)return;
    applyVisitorAction(v.cur);nextTarget();}
}
function applyVisitorAction(a){const v=visitor,p=a.p,xy=plotXY(p);if(!stillValid(a))return;
  if(a.k==='water'){waterPlot(p);puff(xy.x,xy.y-10,'#7cc4ec');v.done.push('regou');}
  else if(a.k==='weed'){p.weed=false;puff(xy.x,xy.y-10,'#7a9a3a');v.done.push('tirou erva');}
  else if(a.k==='bug'){p.bug=false;puff(xy.x,xy.y-10,'#d9483d');v.done.push('matou praga');}
  else if(a.k==='harvest'){if(barnFree()<p.qty)return;addBarn(p.crop,p.qty);fx(xy.x,xy.y-30,'+'+p.qty+' '+CROPS[p.crop].n,'#3f8a35');v.done.push('colheu '+CROPS[p.crop].n.toLowerCase()+' p/ você');clearPlot(p);}
  else if(a.k==='steal'){p.qty--;p.stolen++;fx(xy.x,xy.y-30,'-1 '+CROPS[p.crop].n,'#d9483d');v.done.push('ROUBOU '+CROPS[p.crop].n.toLowerCase());}
}
function bitten(){const v=visitor;if(!v)return;v.state='flee';v.q=[];v.sack=false;v.tx=GATE.x;v.ty=GATE.y;
  fx(v.x,v.y-62,'AAAI!','#d9483d');puff(v.x,v.y-20,'#fff');shake=12;
  const loss=ri(15,35);addCoins(loss,S.home.dog.x,S.home.dog.y);
  v.done.push('tentou roubar e foi MORDIDO');v.bit=loss;
  toast('O cachorro mordeu @'+v.handle+' no flagra! Fugiu e deixou '+loss+' moedas.',4000);}
function finishVisitor(){const v=visitor;visitor=null;if(!v.done.length)return;
  const sm=v.done.reduce((m,x)=>{m[x]=(m[x]||0)+1;return m;},{});const txt=Object.entries(sm).map(([k,c])=>c>1?k+' ×'+c:k).join(', ');
  logEv('@'+v.handle+': '+txt+(v.bit?' (você ganhou '+v.bit+' moedas)':''));
  if(!v.bit)toast('@'+v.handle+' '+txt+'.');save();}
function instantVisit(){const n=pick(S.neighbors);if(!n)return null;const q=planVisit(n);if(!q.length)return null;const done=[];
  for(const a of q){if(!stillValid(a))continue;const p=a.p;
    if(a.k==='steal'){if(dogAwake(S.home)){const loss=ri(15,35);S.coins+=loss;done.push('tentou roubar e foi mordido (+'+loss+' moedas)');break;}p.qty--;p.stolen++;done.push('roubou '+CROPS[p.crop].n.toLowerCase());}
    else if(a.k==='water'){waterPlot(p);done.push('regou');}else if(a.k==='weed'){p.weed=false;done.push('tirou erva');}else if(a.k==='bug'){p.bug=false;done.push('matou praga');}
    else{if(barnFree()<p.qty)continue;addBarn(p.crop,p.qty);done.push('colheu p/ você');clearPlot(p);}}
  if(!done.length)return null;const c=done.reduce((m,x)=>{m[x]=(m[x]||0)+1;return m;},{});const txt=Object.entries(c).map(([k,v])=>v>1?k+' ×'+v:k).join(', ');
  logEv('@'+n.handle+': '+txt);return '@'+n.handle+' '+txt;}

// ====================== LOOP ======================
let lastT=performance.now(), shake=0, weedClock=0, saveClock=0;
function stageTick(plots){for(const p of plots){if(!p.crop)continue;const s=stageOf(p.prog);if(p.st!==s){if(p.st>=0&&p.st<s){p.pop=1;const xy=plotXY(p);puff(xy.x,xy.y-14,s===3?'#f6c445':s===2?'#fff7e3':'#9ad66a');}p.st=s;}if(p.pop>0)p.pop=Math.max(0,p.pop-.02);}}
function frame(now){
  const dt=Math.min(.05,(now-lastT)/1000);lastT=now;T0+=dt;
  const farm=curFarm();
  growPlots(S.home.plots,dt);if(mode==='visit')growPlots(visiting.farm.plots,dt);
  stageTick(farm.plots);
  for(const a of farm.animals)updAnimal(a,dt,farm);
  if(mode==='visit')for(const a of S.home.animals){if(!ANIMALS[a.type].lays&&!a.ready){a.prod+=dt/ANIMALS[a.type].t;if(a.prod>=1){a.prod=1;a.ready=true;}}}
  if(farm.dog)updDog(farm.dog,dt,farm);
  for(const e of farm.eggs)e.t=(e.t||0)+dt;
  updVisitor(dt);
  weedClock+=dt;if(weedClock>30){weedClock=0;weedTick(S.home.plots,.03);}
  saveClock+=dt;if(saveClock>5){saveClock=0;save();}
  if(mode==='home'&&!visitor&&!placing&&Date.now()>S.nextVisit){S.nextVisit=Date.now()+rnd(55,100)*1000;startVisitor();}
  fxs=fxs.filter(f=>(f.t+=dt)<1.4);
  parts=parts.filter(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;return p.t<1.2;});
  if(shake>0)shake=Math.max(0,shake-dt*30);
  if(!spCover)render(farm); // atrás da abertura não precisa desenhar
  requestAnimationFrame(frame);
}
function render2D(farm){
  g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='#4fae3b';g.fillRect(0,0,view.sw,view.sh);
  shx=shake?rnd(-shake,shake):0;shy=shake?rnd(-shake,shake):0;
  groundT();
  g.fillStyle='#5cb944';g.fillRect(-W*.6,-H*.3,W*2.2,H*1.6);
  g.drawImage(bgCanvas,0,0);
  for(const p of farm.plots)drawPlotSoil(g,p);
  for(const p of farm.pens){const G=penGeo(p);g.drawImage(penGround(p),G.x,G.y);}
  if(placing&&placing.c!=null)drawGhost(g,farm,true);
  camT();for(const p of farm.pens)drawPenBack(g,p);
  const ents=[],E=(x,y,d)=>ents.push({k:x+y,d});
  E(HOUSE.x+HOUSE.w/2,HOUSE.y+HOUSE.h,()=>{bb(HOUSE.x+HOUSE.w/2,HOUSE.y+HOUSE.h,.62);drawHouse(g);});
  E(BARN.x+BARN.w/2,BARN.y+BARN.h,()=>{bb(BARN.x+BARN.w/2,BARN.y+BARN.h,.62);drawBarn(g);});
  E(DOGHOUSE.x,DOGHOUSE.y+22,()=>{bb(DOGHOUSE.x,DOGHOUSE.y+22);drawDogHouse(g,!!farm.dog,dogAwake(farm));});
  for(const p of farm.pens){const G=penGeo(p);
    if(G.house){const h=G.house;E(h.x+h.w/2,h.y+h.h,()=>{bb(h.x+h.w/2,h.y+h.h,.8);drawCoopHouse(g,h);});}
    if(G.shed){const h=G.shed;E(h.x+h.w/2,h.y+h.h,()=>{bb(h.x+h.w/2,h.y+h.h,.8);drawShed(g,h);});}
    if(G.perch)E(G.perch.x,G.perch.y,()=>{bb(G.perch.x,G.perch.y);drawPerch(g,G.perch);});
    E(G.feed.x,G.feed.y,()=>{bb(G.feed.x,G.feed.y);drawTrough(g,G.feed,'feed');});E(G.water.x,G.water.y,()=>{bb(G.water.x,G.water.y);drawTrough(g,G.water,'water');});
    const cnt=penCount(farm,p);E(G.x+G.w,G.y+G.h,()=>{camT();drawPenFront(g,p,cnt);});}
  for(const t of TREES)E(t[0],t[1],()=>{bb(t[0],t[1]);drawTree(g,t[0],t[1],T0);});
  for(const b of BUSHES)E(b[0],b[1],()=>{bb(b[0],b[1]);drawBush(g,b[0],b[1],b[2],T0);});
  for(const d of farm.deco){const fence=d.type==='cerca'||d.type==='cercab';const ax=d.c*T+T/2,ay=d.r*T+T*.85;E(ax,fence?d.r*T+T/2:ay,()=>{if(fence)camT();else bb(ax,ay);drawDeco(g,d,farm,T0);});}
  for(const p of farm.plots)if(p.crop){const xy=plotXY(p);E(xy.x,xy.y,()=>{bb(xy.x,xy.y);drawCrop(g,xy.x,xy.y,p.crop,p.prog,T0,p.pop);});}
  for(const e of farm.eggs)E(e.x,e.y,()=>{bb(e.x,e.y);const pop=Math.min(1,(e.t||1)*4);g.translate(e.x,e.y);g.scale(pop,pop);ell(g,0,-4,4.2,5.4,e.k==='ovodourado'?'#f2c94c':'#fff4dc',OUT,1);if(e.k==='ovodourado'&&Math.sin(T0*5+e.x)>.6)star(g,3,-9,2.5,'#fff6a8');ell(g,-1.4,-6,1.2,1.6,'rgba(255,255,255,.9)');});
  for(const a of farm.animals)E(a.x,a.y,()=>{bb(a.x,a.y);drawAnimal(g,a,T0);});
  if(farm.dog){const d=farm.dog;E(d.x,d.y,()=>{bb(d.x,d.y);drawDog(g,d,T0);});}
  if(visitor&&mode==='home'){const v=visitor;E(v.x,v.y,()=>{bb(v.x,v.y);drawPerson(g,v,T0);});}
  if(mode==='visit')E(me.x,me.y,()=>{bb(me.x,me.y);drawPerson(g,me,T0);});
  ents.sort((a,b)=>a.k-b.k);for(const e of ents)e.d();
  for(const p of farm.plots){bb(p.c*T+T/2,p.r*T+T/2);drawPlotOverlay(g,p,T0,mode==='home');}
  if(mode==='home')for(const a of farm.animals)if(a.ready){bb(a.x,a.y);const A=ANIMALS[a.type];const by=a.y-(bt(a)==='pavao'?46:50)+Math.sin(T0*3+a.x)*2;circ(g,a.x,by,16,'#fff7e3',OUT,1.6);g.beginPath();g.moveTo(a.x-4,by+14);g.lineTo(a.x,by+21);g.lineTo(a.x+4,by+14);g.fillStyle='#fff7e3';g.fill();g.drawImage(ICON[A.prod].c,a.x-12,by-13,24,24);
    g.font='800 10px Nunito, sans-serif';g.textAlign='center';rr(g,a.x+6,by+4,18,13,6);g.fillStyle='#3f8a35';g.fill();g.fillStyle='#fff';g.fillText('×'+A.qty,a.x+15,by+14);}
  if(farm.dog&&farm.dog.sayT>0){const d=farm.dog;bb(d.x,d.y);const big=d.say.length>3;g.save();g.font=(big?'700 17px':'700 12px')+' Fredoka, sans-serif';const tw=g.measureText(d.say).width+14;rr(g,d.x-tw/2,d.y-56,tw,big?26:19,9);g.fillStyle=big?'#d9483d':'#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1.4;g.stroke();g.fillStyle=big?'#fff':'#3b2a1a';g.textAlign='center';g.fillText(d.say,d.x,d.y-(big?37:42));g.restore();}
  if(farm.dog&&!dogAwake(farm)&&mode==='home'){bb(DOGHOUSE.x,DOGHOUSE.y);g.save();g.font='800 11px Nunito, sans-serif';g.textAlign='center';const msg='Sem ração: o cachorro dorme';const tw=g.measureText(msg).width+12;rr(g,DOGHOUSE.x-tw/2,DOGHOUSE.y-50,tw,18,9);g.fillStyle='rgba(255,247,227,.94)';g.fill();g.fillStyle='#d9483d';g.fillText(msg,DOGHOUSE.x,DOGHOUSE.y-37);g.restore();}
  if(placing&&placing.c!=null)drawGhost(g,farm,false);
  camT();
  for(const p of parts){g.globalAlpha=Math.max(0,1-p.t/1.2);circ(g,p.x,p.y,p.s||3.5,p.c);}g.globalAlpha=1;
  for(const f of fxs){const a=1-f.t/1.4;g.save();g.globalAlpha=a;g.font='700 15px Fredoka, sans-serif';g.textAlign='center';g.lineWidth=4;g.strokeStyle='rgba(255,247,227,.95)';g.strokeText(f.text,f.x,f.y-f.t*30);g.fillStyle=f.color;g.fillText(f.text,f.x,f.y-f.t*30);g.restore();}
}
function drawGhost2D(g,f,ground){const P=placing;const ok=canPlace(f,P.c,P.r,P.w,P.h);P.ok=ok;
  if(ground){g.save();g.globalAlpha=.85;
    for(let y=P.r;y<P.r+P.h;y++)for(let x=P.c;x<P.c+P.w;x++){rr(g,x*T+2,y*T+2,T-4,T-4,6);g.fillStyle=occAt(f,x,y)?'rgba(217,72,61,.5)':'rgba(170,240,120,.55)';g.fill();}
    rr(g,P.c*T,P.r*T,P.w*T,P.h*T,8);g.setLineDash([7,5]);g.strokeStyle=ok?'#fff7e3':'#d9483d';g.lineWidth=3;g.stroke();g.setLineDash([]);g.restore();return;}
  const ax=P.c*T+P.w*T/2,ay=P.r*T+P.h*T/2;bb(ax,ay);
  g.save();g.font='700 14px Fredoka, sans-serif';g.textAlign='center';const label=(ok?'':'Não cabe aqui · ')+P.name;const tw=g.measureText(label).width+16;
  rr(g,ax-tw/2,ay-48,tw,22,8);g.fillStyle=ok?'#fff7e3':'#d9483d';g.fill();g.fillStyle=ok?'#3b2a1a':'#fff';g.fillText(label,ax,ay-32);g.restore();}

