// plural em português para os nomes do jogo (pavão → pavões, curral → currais, galinha dourada → galinhas douradas)
function plw(w){if(/ão$/.test(w))return w.slice(0,-2)+'ões';if(/al$/.test(w))return w.slice(0,-1)+'is';if(/il$/.test(w))return w.slice(0,-1)+'s';if(/[sx]$/.test(w))return w;return w+'s';}
function plural(n){const w=n.split(' ');const i=w.findIndex(x=>/^(de|da|das|do|dos)$/.test(x));return(i>0?w.slice(0,i).map(plw).concat(w.slice(i)):w.map(plw)).join(' ');}
const qtd=(k,nome)=>k+' '+(k===1?nome:plural(nome));
// ====================== INPUT ======================
const ptrs=new Map();let drag=null,pinch=null;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1)drag={sx:e.clientX,sy:e.clientY,cx:cam.tx,cy:cam.ty,moved:false};
  else if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:cam.z};if(drag)drag.moved=true;}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&ptrs.size>=2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);setZoom(pinch.z*d/pinch.d,(a.x+b.x)/2,(a.y+b.y)/2);return;}
  if(drag){const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.hypot(dx,dy)>8)drag.moved=true;if(drag.moved){panTo(drag,e.clientX,e.clientY);}}});
const endPtr=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);
  if(ptrs.size<2)pinch=null;
  if(ptrs.size===0&&drag){if(!drag.moved)tap(e.clientX,e.clientY);drag=null;}
  else if(ptrs.size===1){const [p]=[...ptrs.values()];drag={sx:p.x,sy:p.y,cx:cam.tx,cy:cam.ty,moved:true};}};
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);drag=null;pinch=null;});
cv.addEventListener('wheel',e=>{e.preventDefault();setZoom(cam.z*(e.deltaY>0?.9:1.1),e.clientX,e.clientY);},{passive:false});

function plotAt(f,x,y){const c=Math.floor(x/T),r=Math.floor(y/T);return f.plots.find(p=>p.c===c&&p.r===r);}
function penAt(f,x,y){return f.pens.find(p=>{const G=penGeo(p);return x>G.x&&x<G.x+G.w&&y>G.y&&y<G.y+G.h+8;});}
const stageName=pr=>['semente','brotando','florindo','pronto'][stageOf(pr)];
function collectEggs(f,penId,x,y){const eggs=f.eggs.filter(e=>e.pen===penId);if(!eggs.length)return false;const K=eggs[0].k||'ovo';
  const free=barnFree();if(free<=0){toast('Celeiro cheio! Venda itens ou amplie o celeiro.');return true;}
  const take=eggs.slice(0,free);f.eggs=f.eggs.filter(e=>!take.includes(e));for(const e of take)puff(e.x,e.y-4);
  const by={};for(const e of take){const k=e.k||'ovo';by[k]=(by[k]||0)+1;}let xp=0;for(const k in by){addBarn(k,by[k]);const A=Object.values(ANIMALS).find(a=>a.prod===k)||ANIMALS.galinha;xp+=by[k]/A.qty*A.pxp;}fx(x,y-14,'+'+qtd(take.length,'ovo'),'#b07a12');addXP(Math.max(1,Math.round(xp)),x,y);
  if(take.length<eggs.length)toast('Celeiro cheio! '+(eggs.length-take.length>1?'Ficaram ':'Ficou ')+qtd(eggs.length-take.length,'ovo')+' no galinheiro.');save();return true;}
function tap(px,py){
  if(busy)return;const W0=inv(px,py),x=W0.x,y=W0.y;const near=(wx,wy,off,r)=>{const P=iso(wx,wy,off);return Math.hypot(P.x-px,P.y-py)<r*clamp(ZS*1.3,.8,1.6);};
  if(mode==='visit'){visitTap(x,y);return;}
  const f=S.home;
  if(placing){placeTap(x,y);return;}
  let best=null,bd=26;for(const e of f.eggs){const P=iso(e.x,e.y);const d=Math.hypot(P.x-px,P.y-4-py);if(d<bd){bd=d;best=e;}}
  if(best){collectEggs(f,best.pen,best.x,best.y);return;}
  for(const a of f.animals){if(!a.ready)continue;if(near(a.x,a.y,bt(a)==='pavao'?46:50,28)||near(a.x,a.y,16,26)){
    const A=ANIMALS[a.type],P=A.prod;if(barnFree()<A.qty){toast('Celeiro cheio! Precisa de '+A.qty+' espaços livres.');return;}
    a.ready=false;a.prod=0;addBarn(P,A.qty);fx(a.x,a.y-44,'+'+A.qty+' '+PRODUCTS[P].n,'#b07a12');addXP(A.pxp,a.x,a.y-22);puff(a.x,a.y-30);save();return;}}
  {const P=iso(BARN.x+BARN.w/2,BARN.y+BARN.h/2,40);if((x>BARN.x-10&&x<BARN.x+BARN.w+10&&y>BARN.y-10&&y<BARN.y+BARN.h+10)||Math.hypot(P.x-px,P.y-py)<60*ZS){openBarn();return;}}
  if(near(DOGHOUSE.x,DOGHOUSE.y+22,16,34)||(f.dog&&near(f.dog.x,f.dog.y,14,26))){
    if(!f.dog){openShop('cachorro');return;}
    if(!dogAwake(f)){openShop('cachorro');toast('Seu cachorro está com fome. Dê ração para ele vigiar.');return;}
    f.dog.say='au au!';f.dog.sayT=1.2;toast('Ração dura mais '+fmtT((f.dogFood-Date.now())/1000)+'.');return;}
  const p=plotAt(f,x,y);
  if(p){const xy=plotXY(p);
    if(p.weed){p.weed=false;puff(xy.x,xy.y-10,'#7a9a3a');addXP(1,xy.x,xy.y);return;}
    if(p.bug){p.bug=false;puff(xy.x,xy.y-10,'#d9483d');addXP(1,xy.x,xy.y);return;}
    if(p.crop&&p.prog>=1){const C=CROPS[p.crop];if(barnFree()<p.qty){toast('Celeiro cheio! Precisa de '+p.qty+' espaços. Venda ou amplie.');return;}
      addBarn(p.crop,p.qty);fx(xy.x,xy.y-34,'+'+p.qty+' '+C.n,'#3f8a35');addXP(C.xp,xy.x,xy.y);puff(xy.x,xy.y-10,'#f6c445');
      if(p.stolen)toast('Roubaram '+p.stolen+' '+C.n.toLowerCase()+' daqui!');clearPlot(p);save();return;}
    if(p.crop){const C=CROPS[p.crop];
      if((tool==='regar'||tool==='mao')&&canWater(p)){waterPlot(p);puff(xy.x,xy.y-10,'#7cc4ec');fx(xy.x,xy.y-30,'-10% do tempo','#3d9bd1');save();return;}
      let msg=C.n+' · '+stageName(p.prog)+' · falta '+fmtT((1-p.prog)*C.t);
      if(tool==='regar'&&p.prog<.5)msg='Só dá para regar quando chegar a 50%. '+msg;
      else if(tool==='regar'&&p.water)msg='Este plantio já foi regado (só uma vez). '+msg;
      else if(p.prog<.5)msg+=' · rega libera em 50%';
      toast(msg);return;}
    if(tool==='regar'){toast('Canteiro vazio. Escolha uma semente para plantar.');return;}
    const k=S.seed,C=CROPS[k];if(C.lvl>S.level){openShop('sementes');return;}
    if(C.cash){if((S.cash||0)<C.cash){toast('Falta cash para plantar '+C.n.toLowerCase()+'.');openShop('cash');return;}S.cash-=C.cash;fx(xy.x,xy.y-34,'-'+C.cash+' cash','#17724f');hud();}
    else{if(S.coins<C.cost){toast('Faltam moedas para plantar '+C.n.toLowerCase()+'.');return;}addCoins(-C.cost,xy.x,xy.y);}plant(p,k,0);puff(xy.x,xy.y-6,'#b98a5a');save();return;}
  const pen=penAt(f,x,y);
  if(pen){const P=PEN_TYPES[pen.type],A=ANIMALS[P.animal],an=f.animals.filter(a=>a.pen===pen.id);
    if(!an.length){toast(P.n+' vazio. Compre '+plural(A.n.toLowerCase())+' na loja (até '+PEN_CAP+').');return;}
    const next=pen.type==='galinheiro'?'próximo ovo em '+fmtT(Math.min(...an.map(a=>((Math.floor(a.prod*A.qty)+1)/A.qty-a.prod)*A.t))):
      (an.some(a=>a.ready)?'tem produto pronto!':'pronto em '+fmtT(Math.min(...an.map(a=>(1-a.prod)*A.t))));
    toast(P.n+': '+an.length+'/'+PEN_CAP+' '+(an.length>1?plural(A.n.toLowerCase()):A.n.toLowerCase())+' · '+next);return;}
  if(tool==='plantar'){toast('Plante nos canteiros. Para ter mais, compre canteiros na loja (aba Decoração).');}
}

// ---- colocar itens comprados ----
function startPlacing(o){placing=o;placing.c=null;closeSheet();tool='mao';buildTools();showPlacebar();
  toast(o.multi?'Toque na grama para colocar. Toque em Pronto quando terminar.':'Toque na grama onde quer colocar: '+o.name+'.');}
function placeCost(){const P=placing;return P.kind==='plot'?plotCost(S.home.plots.length):P.cashCost||P.cost;}
function showPlacebar(){const b=$('placebar');if(!placing){b.hidden=true;return;}b.hidden=false;
  const cost=placeCost();
  b.innerHTML='<span class="pl-t">'+esc(placing.name)+' <span class="price"><img alt="" src="'+ICON[placing.cashCost?'cash':'coin'].url+'">'+cost+'</span></span>'+
    (placing.multi?'':'<button class="btn small" id="pl-ok"'+(placing.c==null||!placing.ok?' disabled':'')+'>Colocar aqui</button>')+
    '<button class="btn small alt" id="pl-x">'+(placing.multi?'Pronto':'Cancelar')+'</button>';
  const ok=$('pl-ok');if(ok)ok.onclick=confirmPlace;$('pl-x').onclick=()=>{placing=null;showPlacebar();};}
function placeTap(x,y){const P=placing,f=S.home;P.c=Math.floor(x/T)-Math.floor((P.w-1)/2);P.r=Math.floor(y/T)-Math.floor((P.h-1)/2);P.ok=canPlace(f,P.c,P.r,P.w,P.h);
  if(P.multi){if(P.ok)confirmPlace();else toast('Este lugar está ocupado.');P.c=P.multi?P.c:null;}
  showPlacebar();}
function confirmPlace(){const P=placing,f=S.home;if(!P||P.c==null||!canPlace(f,P.c,P.r,P.w,P.h))return;
  const cost=placeCost();if(P.cashCost){if((S.cash||0)<cost){toast('Falta cash.');return;}S.cash-=cost;hud();}else{if(S.coins<cost){toast('Faltam moedas.');return;}addCoins(-cost,(P.c+P.w/2)*T,P.r*T+20);}
  if(P.kind==='plot'){if(f.plots.length>=maxPlots(S.level)){toast('Limite de canteiros do nível '+S.level+' atingido.');placing=null;showPlacebar();return;}f.plots.push(newPlot(P.c,P.r));addXP(1,P.c*T+T/2,P.r*T+T/2);}
  else if(P.kind==='deco'){f.deco.push({type:P.type,c:P.c,r:P.r});addXP(DECO[P.type].xp,P.c*T+T/2,P.r*T+T/2);}
  else if(P.kind==='pen'){const pen=newPen(P.type,P.c,P.r);f.pens.push(pen);addXP(PEN_TYPES[P.type].xp,(P.c+P.w/2)*T,P.r*T+30);toast(PEN_TYPES[P.type].n+' pronto! Agora compre os animais na loja.');}
  puff((P.c+P.w/2)*T,(P.r+P.h/2)*T,'#d9b77e');save();
  if(!P.multi){placing=null;}else P.c=null;showPlacebar();}

// ---- você visitando um vizinho ----
let me={x:0,y:0,dir:1,state:'idle',handle:'você',color:'#3f8a35',skin:'#e8b48a'};
function visit(n){
  closeSheet();visitor=null;placing=null;showPlacebar();
  if(n.day!==today()){n.day=today();n.used=0;}
  const e=(Date.now()-n.ts)/1000;growPlots(n.farm.plots,e);weedTick(n.farm.plots,.1);n.ts=Date.now();
  for(const p of n.farm.plots)p.st=p.crop?stageOf(p.prog):-1;
  if(n.farm.dog)n.farm.dogFood=Date.now()+3600e3;
  visiting=n;mode='visit';tool='colher';me.handle=S.insta||'você';me.color=S.color;me.x=GATE.x;me.y=H-60;me.state='idle';me.sack=false;
  centerOn(5.7*T,7.1*T);
  buildTools();hud();
  toast(n.farm.dog?'Cuidado: '+n.farm.dogName+' vigia esta fazenda!':'Você chegou na fazenda de @'+n.handle+'.');
}
function goHome(){mode='home';visiting=null;tool='mao';busy=false;me.state='idle';centerOn(5.7*T,7.1*T);buildTools();hud();save();}
function visitTap(x,y){
  const n=visiting,f=n.farm;
  const p=plotAt(f,x,y);if(!p){const pen=penAt(f,x,y);if(pen)toast(PEN_TYPES[pen.type].n+' de @'+n.handle+'.');return;}
  if(n.used>=5){toast('Você já usou as 5 ações de hoje aqui. Volte amanhã!');return;}
  const xy=plotXY(p);
  const walkTo=()=>{me.x=xy.x-22;me.y=xy.y+10;me.dir=1;me.state='act';setTimeout(()=>{if(me.state==='act')me.state='idle';},700);};
  const use=()=>{n.used++;hud();save();if(n.used>=5)setTimeout(()=>toast('Ações acabaram por hoje. Toque em Voltar para ir para casa.'),1200);};
  if(tool==='colher'){if(!(p.crop&&p.prog>=1&&p.qty>0)){toast('Aqui não tem nada maduro para colher.');return;}walkTo();
    puff(xy.x,xy.y-10,'#f6c445');fx(xy.x,xy.y-30,'Ajudou @'+n.handle,'#3f8a35');clearPlot(p);addXP(2,xy.x,xy.y);addCoins(5,xy.x,xy.y);use();return;}
  if(tool==='regar'){if(!canWater(p)){toast(p.crop&&p.prog<.5?'Só dá para regar a partir de 50%.':p.water?'Este plantio já foi regado.':'Este canteiro não precisa de água.');return;}walkTo();waterPlot(p);puff(xy.x,xy.y-10,'#7cc4ec');addXP(1,xy.x,xy.y);addCoins(3,xy.x,xy.y);use();return;}
  if(tool==='erva'){if(!(p.weed||p.bug)){toast('Sem ervas daninhas nem pragas aqui.');return;}walkTo();const w=p.weed;if(w)p.weed=false;else p.bug=false;puff(xy.x,xy.y-10,w?'#7a9a3a':'#d9483d');addXP(2,xy.x,xy.y);addCoins(4,xy.x,xy.y);use();return;}
  if(tool==='roubar'){
    if(!(p.crop&&p.prog>=1&&p.qty>0)){toast('Só dá para roubar o que está maduro.');return;}
    if(p.qty<=Math.ceil(CROPS[p.crop].y/2)){toast('Já roubaram demais daqui. O resto é do dono!');return;}
    if(barnFree()<1){toast('Seu celeiro está cheio.');return;}
    walkTo();use();
    if(dogAwake(f)&&Math.random()<.55){busy=true;me.state='act';me.sack=true;const d=f.dog;d.state='chase';d.target=me;d.say='GRRR!';d.sayT=1.2;
      d.onBite=()=>{me.state='flee';me.sack=false;shake=12;fx(me.x,me.y-62,'AAAI!','#d9483d');puff(me.x,me.y-20,'#fff');const loss=Math.min(S.coins,ri(20,40));addCoins(-loss,me.x,me.y);
        toast(f.dogName+' te mordeu! Você perdeu '+loss+' moedas e saiu correndo.',4000);logEv('Você foi mordido por '+f.dogName+' na fazenda de @'+n.handle+' (-'+loss+')');
        const run=()=>{if(mode!=='visit')return;me.dir=1;me.y+=3.5;me.x+=(GATE.x-me.x)*.04;if(Math.random()<.3)puff(me.x,me.y-2,'#d9b77e');if(me.y<H+60)requestAnimationFrame(run);};run();
        setTimeout(goHome,2200);};
      return;}
    p.qty--;p.stolen++;addBarn(p.crop,1);fx(xy.x,xy.y-30,'+1 '+CROPS[p.crop].n,'#d9483d');puff(xy.x,xy.y-10,'#f6c445');me.sack=true;
    if(f.dog&&dogAwake(f)){f.dog.say='au?';f.dog.sayT=1;}
    logEv('Você roubou 1 '+CROPS[p.crop].n.toLowerCase()+' de @'+n.handle);return;}
}

// ====================== UI ======================
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hud(){
  $('coins').textContent=S.coins.toLocaleString('pt-BR');$('cash').textContent=(S.cash||0).toLocaleString('pt-BR');
  $('lv').textContent='Nível '+S.level;$('xpb').style.width=Math.min(100,S.xp/need(S.level)*100)+'%';
  $('nm').textContent=S.insta?'@'+S.insta:S.name;$('av').textContent=(S.insta||S.name)[0].toUpperCase();$('av').style.background=S.color;
  const vb=$('visitbar');
  if(mode==='visit'){vb.hidden=false;const left=5-visiting.used;vb.innerHTML='Fazenda de <b>@'+esc(visiting.handle)+'</b> · ações<span class="pips">'+[0,1,2,3,4].map(i=>'<i class="'+(i<left?'':'off')+'"></i>').join('')+'</span>';}
  else vb.hidden=true;
}
function buildTools(){
  const el=$('tools');let list;
  if(mode==='home')list=[['mao','Mão','t_mao'],['plantar',CROPS[S.seed].n,S.seed],['regar','Regar','t_regar'],['loja','Loja','t_loja'],['celeiro','Celeiro','t_celeiro'],['viz','Vizinhos','t_viz']];
  else list=[['colher','Colher','t_colher'],['regar','Regar','t_regar'],['erva','Ervas','t_erva'],['roubar','Roubar','t_roubar'],['voltar','Voltar','t_voltar']];
  el.innerHTML=list.map(([k,l,ic])=>'<button class="tool'+(k===tool?' on':'')+(k==='roubar'?' danger':'')+'" data-k="'+k+'"><img alt="" src="'+ICON[ic].url+'"><small>'+esc(l)+'</small></button>').join('');
}
$('tools').addEventListener('click',e=>{const b=e.target.closest('.tool');if(!b||busy)return;const k=b.dataset.k;
  if(k==='loja'){openShop('sementes');return;}if(k==='celeiro'){openBarn();return;}if(k==='viz'){openNeighbors();return;}if(k==='voltar'){goHome();return;}
  if(k==='plantar'&&tool==='plantar'){openShop('sementes');return;}
  tool=k;buildTools();
  const tips={mao:'Mão: colhe, coleta ovos e produtos, tira ervas, rega e planta.',plantar:'Toque num canteiro vazio para plantar. Toque de novo no botão para trocar a semente.',regar:'Rega única por plantio, liberada a partir de 50%. Corta 10% do tempo.',colher:'Colha o que estiver maduro para ajudar seu vizinho.',erva:'Tire ervas daninhas e pragas do vizinho.',roubar:'Roube 1 da colheita madura. Se tiver cachorro acordado...'};
  if(tips[k])toast(tips[k]);});

let toastT;function toast(m,ms){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),ms||3000);}

let sheetTab=null,sheetKind=null;
function openSheet(title,tabs,tab,render){sheetKind=render;sheetTab=tab;$('sh-t').textContent=title;
  $('sh-tabs').innerHTML=tabs.map(([k,l])=>'<button class="tab'+(k===tab?' on':'')+'" data-t="'+k+'">'+l+'</button>').join('');$('sh-tabs').hidden=!tabs.length;$('sheet').classList.toggle('tabbed',!!tabs.length);
  render(tab);$('sh-b').scrollTop=0;$('sheet').hidden=false;$('scrim').hidden=false;}
function closeSheet(){$('sheet').hidden=true;$('scrim').hidden=true;sheetKind=null;}
$('sh-x').onclick=closeSheet;$('scrim').onclick=closeSheet;
$('sh-tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;sheetTab=b.dataset.t;[...$('sh-tabs').children].forEach(x=>x.classList.toggle('on',x===b));sheetKind(sheetTab);$('sh-b').scrollTop=0;});
const price=(n,c)=>'<span class="price'+(c?' cashp':'')+'"><img alt="" src="'+ICON[c?'cash':'coin'].url+'">'+n.toLocaleString('pt-BR')+'</span>';
// linhas do cartão: cada trecho entre " · " fica inteiro (não quebra no meio de "1min 35s" ou "rende 4")
const ln=(...a)=>'<span class="ln">'+a.filter(Boolean).map(x=>x.replace(/<[^>]+>/g,'').length<=16?'<span class="nw">'+x+'</span>':x).join(' · ')+'</span>';
const card=(attr,icon,name,meta,cost,lock,extra,isCash)=>'<button class="item'+(lock?' locked':'')+(extra||'')+(isCash?' rare':'')+'" '+attr+'><img alt="" src="'+ICON[icon].url+'"><span class="nm">'+name+'</span><span class="meta">'+meta+'</span>'+price(cost,isCash)+'</button>';

function openShop(tab){if(mode!=='home'){toast('A loja abre quando você voltar para casa.');return;}
  openSheet('Loja da Vila',[['sementes','Sementes'],['animais','Animais'],['abrigos','Abrigos'],['terreno','Decoração'],['cachorro','Cachorro'],['cash','Loja de Cash']],tab,renderShop);}
function renderShop(tab){const b=$('sh-b');
  if(tab==='sementes'){const ks=Object.keys(CROPS).filter(k=>!CROPS[k].cash).sort((a,c)=>CROPS[a].lvl-CROPS[c].lvl);
    b.innerHTML='<p class="note">Cada semente tem seu tempo. Ela passa por semente, broto (50%), flor (75%) e fruto (100%). A rega libera em 50% e corta 10% do tempo, uma vez por plantio.</p><div class="grid">'+ks.map(k=>{const c=CROPS[k],lock=c.lvl>S.level;
      return card('data-seed="'+k+'"',k,c.n,lock?ln('Libera no nível '+c.lvl):ln(fmtT(c.t))+ln('rende '+c.y,'+'+c.xp+' XP')+ln('vende '+c.sell+'/un'),c.cost,lock,k===S.seed?' sel':'');}).join('')+'</div>';}
  else if(tab==='animais'){b.innerHTML='<p class="note">Cada animal mora no seu abrigo, com até '+PEN_CAP+' por abrigo. A quantidade de cada animal libera aos poucos, +1 a cada nível.</p><div class="grid">'+Object.entries(ANIMALS).filter(([,a])=>!a.cash).map(([k,a])=>{const lock=a.lvl>S.level,P=PRODUCTS[a.prod];
      return card('data-animal="'+k+'"',k+'_a',a.n,lock?ln('Libera no nível '+a.lvl):ln('<b>Você tem '+S.home.animals.filter(x=>x.type===k).length+'/'+maxAnimals(k,S.level)+'</b>')+ln(a.qty+' '+P.pl,'a cada '+fmtT(a.t))+ln('+'+a.pxp+' XP','vende '+P.sell+'/'+P.u),a.cost,lock);}).join('')+'</div>';}
  else if(tab==='abrigos'){b.innerHTML='<p class="note">Compre o abrigo e escolha onde colocar na fazenda. Cada um guarda '+PEN_CAP+' animais.</p><div class="grid">'+Object.entries(PEN_TYPES).map(([k,p])=>{const lock=p.lvl>S.level;
      return card('data-pen="'+k+'"','pen_'+k,p.n,lock?ln('Libera no nível '+p.lvl):ln('<b>Você tem '+S.home.pens.filter(x=>x.type===k).length+'/'+maxPens(k,S.level)+'</b>')+ln('para '+PEN_CAP+' '+plural(ANIMALS[p.animal].n.toLowerCase()))+ln(p.w+'×'+p.h+' casas','+'+p.xp+' XP'),p.cost,lock);}).join('')+'</div>';}
  else if(tab==='terreno'){b.innerHTML='<p class="note">Aqui ficam os canteiros e os enfeites. Canteiros são onde você planta. O preço sobe um pouco a cada novo canteiro. Cercas se ligam sozinhas quando ficam lado a lado.</p><div class="grid">'+
      card('data-plot="1"','canteiro','Canteiro',ln('<b>Você tem '+S.home.plots.length+'/'+maxPlots(S.level)+'</b>')+ln('+2 a cada nível')+ln('+1 XP'),plotCost(S.home.plots.length),false)+
      Object.entries(DECO).filter(([,d])=>!d.cash).map(([k,d])=>{const lock=d.lvl>S.level;return card('data-deco="'+k+'"','d_'+k,d.n,lock?ln('Libera no nível '+d.lvl):ln('Decoração')+ln('+'+d.xp+' XP'),d.cost,lock);}).join('')+'</div>';}
  else if(tab==='cash'){renderCash();}
  else if(tab==='cachorro'){const f=S.home;const has=!!f.dog;const left=has?Math.max(0,(f.dogFood-Date.now())/1000):0;
    b.innerHTML='<p class="note">O cachorro vigia sua plantação. Quando um vizinho tenta roubar, ele corre, morde e o ladrão foge deixando moedas para você. Mas ele só vigia de barriga cheia: sem ração, dorme na casinha.</p><div class="grid">'+
    card('data-buy="dog"','cachorro_a','Cachorro',has?ln('Você já tem um'):ln('Guarda a fazenda')+ln('+10 XP'),DOG_COST,has)+
    card('data-buy="food"','racao','Ração',has?ln(left>0?'Acordado por '+fmtT(left):'Cachorro dormindo')+ln('+15 min de vigia'):ln('Precisa de cachorro'),FOOD_COST,!has)+'</div>';}
}
function openBarn(){if(mode!=='home')return;openSheet('Celeiro',[],null,renderBarn);}
function renderBarn(){const b=$('sh-b');const used=barnUsed(),cap=S.barnCap;const items=Object.entries(S.barn).filter(([,n])=>n>0);const total=items.reduce((s,[k,n])=>s+n*itemSell(k),0);
  const up=BARN_UP.find(u=>u.cap>cap);
  let h='<div class="cap"><div class="cap-row"><b>'+used+' / '+cap+' espaços</b><span>'+Math.round(used/cap*100)+'% cheio</span></div><span class="bar big"><i style="width:'+Math.min(100,used/cap*100)+'%;background:'+(used/cap>.9?'#d9483d':'#3f8a35')+'"></i></span>'+
    (up?'<div class="cap-row"><span>Ampliar para '+up.cap+' espaços'+(up.lvl>S.level?' (nível '+up.lvl+')':'')+'</span><button class="btn small" data-up="1"'+(up.lvl>S.level?' disabled':'')+'>'+price(up.cost)+'</button></div>':'<div class="cap-row"><span>Celeiro no tamanho máximo</span></div>')+'</div>';
  if(items.length){h+='<div class="sellall"><span>Total no celeiro: '+price(total)+'</span><button class="btn" data-sellall="1">Vender tudo</button></div>'+
    items.map(([k,n])=>{const pr=itemSell(k),u=PRODUCTS[k]?PRODUCTS[k].u:'un';return '<div class="row"><img class="ri" alt="" src="'+ICON[k].url+'"><div class="grow"><div class="t1">'+itemName(k)+' ×'+n+'</div><div class="t2">'+pr+' moedas por '+u+' · total '+(pr*n).toLocaleString('pt-BR')+'</div></div><button class="btn small alt" data-sell="'+k+'">Vender 1</button><button class="btn small" data-sellk="'+k+'">Todos</button></div>';}).join('');}
  else h+='<p class="note"><b>O celeiro está vazio.</b> Colha plantações maduras ou toque nos ovos e nos balões dos animais.</p>';
  h+='<h3>Tabela de preços</h3><div class="ptable">'+[...Object.keys(CROPS),...Object.keys(PRODUCTS)].map(k=>'<div><img alt="" src="'+ICON[k].url+'"><span>'+itemName(k)+'</span><b>'+itemSell(k)+'</b></div>').join('')+'</div>';
  b.innerHTML=h;}
$('sh-b').addEventListener('click',e=>{
  const t=e.target.closest('[data-seed],[data-animal],[data-pen],[data-plot],[data-deco],[data-pack],[data-pixok],[data-pixback],[data-pixcopy],[data-buy],[data-sell],[data-sellk],[data-sellall],[data-up],[data-visit],[data-addn],[data-copy],[data-insta]');if(!t)return;
  const d=t.dataset;
  if(d.seed){const c=CROPS[d.seed];if(c.lvl>S.level){toast('Libera no nível '+c.lvl+'.');return;}S.seed=d.seed;tool='plantar';buildTools();closeSheet();toast('Semente de '+c.n.toLowerCase()+' escolhida. Toque nos canteiros vazios para plantar ('+(c.cash?c.cash+' cash':c.cost+' moedas')+' cada).');return;}
  if(d.animal){const k=d.animal,a=ANIMALS[k];if(a.lvl>S.level){toast('Libera no nível '+a.lvl+'.');return;}
    const have=S.home.animals.filter(x=>x.type===k).length,lim=maxAnimals(k,S.level);if(have>=lim){toast('No nível '+S.level+' você pode ter até '+lim+' '+(lim>1?plural(a.n.toLowerCase()):a.n.toLowerCase())+'. Suba de nível para liberar mais.');return;}
    const pt=penFor(k);const pens=S.home.pens.filter(p=>p.type===pt);
    if(!pens.length){toast('Primeiro compre: '+PEN_TYPES[pt].n+' (aba Abrigos).');sheetTab='abrigos';[...$('sh-tabs').children].forEach(x=>x.classList.toggle('on',x.dataset.t==='abrigos'));renderShop('abrigos');return;}
    const pen=pens.find(p=>penCount(S.home,p)<PEN_CAP);if(!pen){toast('Abrigos cheios ('+PEN_CAP+' animais em cada '+PEN_TYPES[pt].n.toLowerCase()+'). Compre outro abrigo.');return;}
    if(a.cash){if((S.cash||0)<a.cash){toast('Falta cash. Compre um pacote na Loja de Cash.');return;}S.cash-=a.cash;}else{if(S.coins<a.cost){toast('Faltam moedas.');return;}S.coins-=a.cost;}const an=makeAnimal(k,pen);an.prod=0;S.home.animals.push(an);addXP(a.xp);puff(an.x,an.y-10);save();hud();closeSheet();
    const G=penGeo(pen);centerOn(G.x+G.w/2,G.y+G.h/2);toast(a.n+' chegou! ('+penCount(S.home,pen)+'/'+PEN_CAP+')');return;}
  if(d.pen){const P=PEN_TYPES[d.pen];if(P.lvl>S.level){toast('Libera no nível '+P.lvl+'.');return;}{const h=S.home.pens.filter(p=>p.type===d.pen).length,l=maxPens(d.pen,S.level);if(h>=l){toast('Limite de '+l+' '+P.n.toLowerCase()+' no nível '+S.level+'. Mais um libera em alguns níveis.');return;}}if(S.coins<P.cost){toast('Faltam moedas.');return;}startPlacing({kind:'pen',type:d.pen,w:P.w,h:P.h,cost:P.cost,name:P.n});return;}
  if(d.plot){if(S.home.plots.length>=maxPlots(S.level)){toast('Limite de '+maxPlots(S.level)+' canteiros no nível '+S.level+'. Suba de nível para liberar mais.');return;}if(S.coins<plotCost(S.home.plots.length)){toast('Faltam moedas.');return;}startPlacing({kind:'plot',type:'canteiro',w:1,h:1,name:'Canteiro',multi:true});return;}
  if(d.deco){const D=DECO[d.deco];if(D.lvl>S.level){toast('Libera no nível '+D.lvl+'.');return;}if(D.cash?(S.cash||0)<D.cash:S.coins<D.cost){toast(D.cash?'Falta cash.':'Faltam moedas.');return;}startPlacing({kind:'deco',type:d.deco,w:1,h:1,cost:D.cost,cashCost:D.cash,name:D.n,multi:!D.cash});return;}
  if(d.pack){showPix(+d.pack);return;}
  if(d.pixok){const P=CASH_PACKS[+d.pixok];S.cash=(S.cash||0)+P.cash;hud();save();burstS(view.w/2,view.h/2);toast('Pagamento de teste aprovado: +'+P.cash+' cash!');renderCash();return;}
  if(d.pixback){renderCash();return;}
  if(d.pixcopy){const v=$('pixcode').value;try{navigator.clipboard.writeText(v).then(()=>toast('Código Pix copiado.'),()=>{$('pixcode').select();});}catch(err){$('pixcode').select();}return;}
  if(d.buy==='dog'){if(S.home.dog)return;if(S.coins<DOG_COST){toast('Faltam moedas.');return;}S.coins-=DOG_COST;S.home.dog=makeDog();S.home.dogFood=Date.now()+FOOD_SECS*1000;S.home.dog.say='AU AU!';S.home.dog.sayT=2;addXP(10);save();closeSheet();centerOn(DOGHOUSE.x,DOGHOUSE.y);toast('Seu cachorro chegou com ração para 15 minutos.');return;}
  if(d.buy==='food'){if(!S.home.dog){toast('Compre um cachorro primeiro.');return;}if(S.coins<FOOD_COST){toast('Faltam moedas.');return;}S.coins-=FOOD_COST;S.home.dogFood=Math.max(Date.now(),S.home.dogFood)+FOOD_SECS*1000;S.home.dog.say='au au!';S.home.dog.sayT=1.5;hud();save();renderShop('cachorro');toast('Mais 15 minutos de vigia!');return;}
  if(d.sell){const k=d.sell;if(!S.barn[k])return;S.barn[k]--;addCoins(itemSell(k));save();renderBarn();return;}
  if(d.sellk){const k=d.sellk,n=S.barn[k]||0;const v=n*itemSell(k);delete S.barn[k];addCoins(v);save();renderBarn();toast(n+' '+itemName(k)+' vendidos por '+v+' moedas.');return;}
  if(d.sellall){let tot=0;for(const k in S.barn)tot+=S.barn[k]*itemSell(k);S.barn={};addCoins(tot);save();renderBarn();toast('Vendido por '+tot.toLocaleString('pt-BR')+' moedas!');return;}
  if(d.up){const up=BARN_UP.find(u=>u.cap>S.barnCap);if(!up)return;if(up.lvl>S.level){toast('Libera no nível '+up.lvl+'.');return;}if(S.coins<up.cost){toast('Faltam '+(up.cost-S.coins)+' moedas.');return;}S.coins-=up.cost;S.barnCap=up.cap;addXP(10);save();renderBarn();toast('Celeiro ampliado para '+up.cap+' espaços!');return;}
  if(d.visit){const n=S.neighbors.find(x=>x.handle===d.visit);if(n)visit(n);return;}
  if(d.addn){addNeighbor();return;}
  if(d.copy){const link=$('invite').value;const done=()=>toast('Link de convite copiado!');
    try{navigator.clipboard.writeText(link).then(done,()=>{$('invite').select();toast('Selecione e copie o link.');});}catch(err){$('invite').select();}return;}
  if(d.insta){const v=$('myinsta').value.trim().replace(/^@/,'').replace(/[^a-z0-9._]/gi,'').slice(0,30);if(!v){toast('Digite seu @ do Instagram.');return;}S.insta=v;save();hud();renderNeighbors(sheetTab);toast('Perfil ligado ao @'+v+'.');return;}
});
function openNeighbors(){if(mode!=='home'){toast('Volte para casa para ver seus vizinhos.');return;}openSheet('Vizinhos',[['lista','Vizinhos'],['mural','Mural']],'lista',renderNeighbors);}
function renderNeighbors(tab){const b=$('sh-b');
  if(tab==='mural'){b.innerHTML='<p class="note">Quem passou pela sua fazenda e o que fez.</p><ul class="feed">'+S.log.map(l=>'<li><time>'+hhmm(l.t)+'</time>'+esc(l.m)+'</li>').join('')+'</ul>';return;}
  const link=location.href.split('#')[0]+'#convite-'+(S.insta||'amigo').replace(/[^a-z0-9-]/gi,'');
  b.innerHTML=(S.insta?'':'<h3>Seu perfil</h3><p class="note">Coloque seu @ do Instagram para seus amigos te acharem.</p><div class="add"><input id="myinsta" placeholder="@seu.instagram" autocomplete="off" autocapitalize="none"><button class="btn" data-insta="1">Salvar</button></div>')+
  '<h3>Adicionar vizinho</h3><p class="note">Digite o @ do Instagram de um amigo. Neste protótipo, a fazenda dele é simulada.</p><div class="add"><input id="newn" placeholder="@amigo.do.insta" autocomplete="off" autocapitalize="none"><button class="btn" data-addn="1">Adicionar</button></div>'+
  '<div class="add"><input id="invite" readonly value="'+esc(link)+'"><button class="btn alt" data-copy="1">Copiar convite</button></div>'+
  '<h3>Seus vizinhos</h3>'+S.neighbors.map(n=>{if(n.day!==today()){n.day=today();n.used=0;}const ready=n.farm.plots.filter(p=>p.crop&&p.prog>=1).length;const help=n.farm.plots.filter(p=>p.weed||p.bug||canWater(p)).length;
    return '<div class="row"><div class="avatar" style="background:'+n.color+'">'+esc(n.handle[0].toUpperCase())+'</div><div class="grow"><div class="t1">@'+esc(n.handle)+(n.farm.dog?'<span class="badge dog">tem cachorro</span>':'')+'</div><div class="t2">Nível '+n.lvl+' · '+ready+' maduros · '+help+' precisam de ajuda · '+(5-n.used)+'/5 ações</div></div><button class="btn small" data-visit="'+esc(n.handle)+'"'+(n.used>=5?' disabled':'')+'>Visitar</button></div>';}).join('');}
function addNeighbor(){const v=$('newn').value.trim().replace(/^@/,'').replace(/[^a-z0-9._]/gi,'').slice(0,30);if(!v){toast('Digite um @ válido.');return;}
  if(S.neighbors.some(n=>n.handle.toLowerCase()===v.toLowerCase())){toast('@'+v+' já é seu vizinho.');return;}
  S.neighbors.unshift(makeNeighbor(v));save();renderNeighbors('lista');toast('@'+v+' agora é seu vizinho!');}
$('who').onclick=()=>openNeighbors();
$('cashbtn').onclick=()=>openShop('cash');
const brl=v=>'R$ '+v.toFixed(2).replace('.',',');
function renderCash(){const b=$('sh-b');const lk=o=>'';
  b.innerHTML='<div class="cashtop"><img alt="" src="'+ICON.cash.url+'"><div><b>'+(S.cash||0)+' cash</b><span>Você ganha 10 cash a cada nível que sobe.</span></div></div>'+
  '<h3>Comprar cash com Pix</h3><div class="grid packs">'+CASH_PACKS.map((p,i)=>'<button class="item rare" data-pack="'+i+'">'+(p.tag?'<span class="ribbon">'+p.tag+'</span>':'')+'<img alt="" src="'+ICON.cash.url+'"><span class="nm">'+p.cash+' cash</span><span class="price brl">'+brl(p.brl)+'</span></button>').join('')+'</div>'+
  '<h3>Sementes raras</h3><div class="grid">'+Object.entries(CROPS).filter(([,c])=>c.cash).map(([k,c])=>card('data-seed="'+k+'"',k,c.n,ln(fmtT(c.t))+ln('rende '+c.y,'+'+c.xp+' XP')+ln('vende '+c.sell+'/un'),c.cash,false,k===S.seed?' sel':'',true)).join('')+'</div>'+
  '<h3>Animais exóticos</h3><div class="grid">'+Object.entries(ANIMALS).filter(([,a])=>a.cash).map(([k,a])=>{const P=PRODUCTS[a.prod];return card('data-animal="'+k+'"',k+'_a',a.n,ln('Mora no '+PEN_TYPES[penFor(k)].n.toLowerCase())+ln(a.qty+' '+P.pl,'a cada '+fmtT(a.t))+ln('vende '+P.sell+'/'+P.u),a.cash,false,'',true);}).join('')+'</div>'+
  '<h3>Decoração rara</h3><div class="grid">'+Object.entries(DECO).filter(([,d])=>d.cash).map(([k,d])=>card('data-deco="'+k+'"','d_'+k,d.n,ln('Animada')+ln('+'+d.xp+' XP'),d.cash,false,'',true)).join('')+'</div>';}
function pixCode(p){const id='FZD'+Date.now().toString(36).toUpperCase();return '00020126580014BR.GOV.BCB.PIX0136TESTE-FAZENDINHA-NAO-PAGAR520400005303986540'+p.brl.toFixed(2).length+p.brl.toFixed(2)+'5802BR5911FAZENDINHA6009SAO PAULO62'+String(id.length+4).padStart(2,'0')+'05'+String(id.length).padStart(2,'0')+id+'6304TEST';}
function showPix(i){const p=CASH_PACKS[i],b=$('sh-b');const code=pixCode(p);
  b.innerHTML='<div class="pix"><p class="testnote"><b>Modo de teste.</b> Nenhum valor é cobrado. Para receber de verdade, o jogo precisa ser ligado a um provedor de Pix num servidor.</p>'+
  '<div class="pixhead"><img alt="" src="'+ICON.cash.url+'"><div><b>'+p.cash+' cash</b><span>'+brl(p.brl)+'</span></div></div>'+
  '<canvas id="qr" width="180" height="180" aria-label="QR Code Pix de exemplo"></canvas>'+
  '<label class="t2" for="pixcode">Pix copia e cola</label><div class="add"><input id="pixcode" readonly value="'+esc(code)+'"><button class="btn alt" data-pixcopy="1">Copiar</button></div>'+
  '<button class="btn wide" data-pixok="'+i+'">Simular pagamento aprovado</button><button class="btn alt wide" data-pixback="1">Voltar aos pacotes</button></div>';
  const c=$('qr'),x=c.getContext('2d'),n=29,s=c.width/n;x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);const R=seeded(hashStr(code));x.fillStyle='#1d140c';
  for(let r=0;r<n;r++)for(let q=0;q<n;q++){const fz=(r<8&&q<8)||(r<8&&q>=n-8)||(r>=n-8&&q<8);if(!fz&&R()<.5)x.fillRect(q*s,r*s,s,s);}
  for(const [r,q] of [[0,0],[0,n-7],[n-7,0]]){x.fillRect(q*s,r*s,7*s,7*s);x.fillStyle='#fff';x.fillRect((q+1)*s,(r+1)*s,5*s,5*s);x.fillStyle='#1d140c';x.fillRect((q+2)*s,(r+2)*s,3*s,3*s);}
  $('sh-b').scrollTop=0;}

// ====================== BOOT ======================
function start(data){
  load(data);
  $('coinimg').src=ICON.coin.url;$('cashimg').src=ICON.cash.url;
  resize();centerOn(5.7*T,7.1*T);
  buildTools();hud();
  if(!S.seenHelp){S.seenHelp=true;setTimeout(()=>toast('Arraste para andar pela fazenda. Toque nas plantas maduras para colher!',4000),600);}
  addEventListener('resize',()=>{resize();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else{lastT=performance.now();catchUp();S.last=Date.now();}});
  requestAnimationFrame(t=>{lastT=t;frame(t);});
}
window.claude?.hot?.snapshot?.(()=>({S}));
// ---- tela de abertura ----
// vitrine 3D da tela de abertura: uma ilhinha com os modelos do Farm Pack e alguns bichos
function spVitrine(cv){try{
  const rd=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});rd.setClearColor(0,0);rd.shadowMap.enabled=true;rd.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,100);
  sc.add(new THREE.HemisphereLight('#ffffff','#6fae4a',.66));const sun=new THREE.DirectionalLight('#fff1d0',.8);sun.position.set(-6,14,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:40});sun.shadow.bias=-.001;sc.add(sun);
  const isl=new THREE.Group();sc.add(isl);const put=(m,px,pz,ry)=>{m.position.set(px,0,pz);if(ry)m.rotation.y=ry;isl.add(m);return m;};
  const top=sh(new THREE.Mesh(new THREE.CylinderGeometry(5.3,5.3,.25,40),M('#79c457')));top.position.y=-.125;isl.add(top);
  const side=new THREE.Mesh(new THREE.CylinderGeometry(5.3,4.3,1.1,40),M('#9a6a3a'));side.position.y=-.8;isl.add(side);
  put(fp('celeiro',.52),-2.3,-1.7);put(fp('silo',.36),-.4,-3.1);put(fp('casa',.62),1.7,-2.1);
  const ms=1.5/fpSize('moinho').x,mo=put(grp(fp('moinho',ms)),4.0,-.7,-.7),pv=new THREE.Group(),pp=FP_META.moinho_pas.piv;pv.position.set(pp[0]*ms,pp[1]*ms,pp[2]*ms);pv.add(fp('moinho_pas',ms));mo.add(pv);
  put(fpH('macieira',1.9),-4.1,.8,1);put(fpH('pinheiro',2),-3.4,-3.2);put(fpH('laranjeira',2),3.8,-2.9);put(fpH('betula',2),.9,-4.1);
  put(fp('feno',.45),-3.9,2.5,.5);put(fp('barril',.5),-.9,-1.6);put(fp('poste',.55),.8,3.3);
  ['c_milho','c_girassol','c_abobora','c_tomate','c_alface','c_cenoura'].forEach((k,n)=>{const px=-1.6+(n%3)*1.05,pz=.4+Math.floor(n/3)*1.05;
    put(at(box(.96,.1,.96,'#a8692f'),0,.05,0),px,pz);const z=fpSize(k),c=fp(k,.92/Math.max(z.x,z.z));c.position.set(px,.1,pz);isl.add(c);});
  fpFence(isl,-3.2,3.9,.2,3.9,'cerca');fpFence(isl,1.4,3.9,3.6,3.9,'cerca');
  const bichos=[[{type:'vaca'},2.3,1.9,-.6],[{type:'ovelha'},3.3,2.7,-1.2],[{type:'galinha',v:0},1.2,2.7,-.3],[{type:'galinha',v:1},-2.6,2.9,1]].map(([a,px,pz,ry])=>{const m=put(mkAnimal3(a),px,pz,ry);m.scale.setScalar(1.25);return m;});
  const dog=put(mkDog3(),-2.4,1.6,-.4);dog.scale.setScalar(1.3);
  let on=true;
  const fit=()=>{const r=Math.min(2,devicePixelRatio||1),w=cv.clientWidth,h=cv.clientHeight;rd.setPixelRatio(r);rd.setSize(w,h,false);const a=w/h,fh=Math.max(11.8/a,16);
    cam.left=-fh*a/2;cam.right=fh*a/2;cam.top=fh/2;cam.bottom=-fh/2;cam.position.set(12,10,12);cam.lookAt(0,.6,0);
    // empurra a ilha um pouco para baixo, entre o título e a barra
    cam.position.y+=fh*.03;cam.updateProjectionMatrix();};fit();addEventListener('resize',fit);
  return{draw(t){if(!on)return;isl.rotation.y=Math.sin(t*.25)*.22;pv.rotation.z=t*1.6;
      bichos.forEach((m,n)=>{const P=m.userData.P;if(P.head&&P.h0){const d=n>1?Math.max(0,Math.sin(t*3+n*2)):0;P.head.position.y=P.h0.y-d*.18+Math.sin(t*2+n)*.01;}if(P.tail)P.tail.rotation.x=Math.sin(t*3+n)*.3;});
      const P=dog.userData.P;if(P.tail)P.tail.rotation.x=Math.sin(t*14)*.6;rd.render(sc,cam);},
    stop(){on=false;removeEventListener('resize',fit);rd.dispose();try{rd.forceContextLoss();}catch(e){}}};
}catch(e){console.warn('vitrine 3D',e);return null;}}
function splash(){
  const el=$('splash'),sc=$('splashcv'),x=sc.getContext('2d'),bar=$('sp-bar'),lab=$('sp-lab');let t0=performance.now(),run=true,prog=0,shown=0,ready=false,v3=null;
  const fit=()=>{const r=Math.min(2,devicePixelRatio||1);sc.width=sc.clientWidth*r;sc.height=sc.clientHeight*r;};fit();addEventListener('resize',fit);
  const hen={type:'galinha',x:0,y:0,dir:1,state:'walk',phase:0,v:0},hen2={type:'galinha',x:0,y:0,dir:-1,state:'peck',phase:0,v:1},cow={type:'vaca',x:0,y:0,dir:1,state:'graze',phase:0},dog={x:0,y:0,dir:-1,state:'walk',phase:0};
  function draw(now){if(!run)return;const t=(now-t0)/1000,r=sc.width/sc.clientWidth,w=sc.clientWidth,h=sc.clientHeight;x.setTransform(r,0,0,r,0,0);
    const sky=x.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#8fd3f0');sky.addColorStop(.55,'#d6f0e0');sky.addColorStop(1,'#f6e7b8');x.fillStyle=sky;x.fillRect(0,0,w,h);
    const sy=h*.34;x.save();x.globalAlpha=.25;circ(x,w*.8,sy,70+Math.sin(t*2)*4,'#fff6a8');x.restore();circ(x,w*.8,sy,42,'#f6c445');
    for(let i=0;i<3;i++){const cx=((t*12*(i+1)+i*260)%(w+200))-100,cy=h*(.1+i*.08);for(const [dx,dy,rr2] of [[0,0,18],[18,-6,22],[38,0,17]])circ(x,cx+dx,cy+dy,rr2,'rgba(255,255,255,.9)');}
    const hill=(yb,amp,col,off)=>{x.beginPath();x.moveTo(0,h);for(let i=0;i<=w+8;i+=8)x.lineTo(i,yb+Math.sin(i/120+off)*amp);x.lineTo(w,h);x.closePath();x.fillStyle=col;x.fill();};
    hill(h*.58,16,'#9ccf6a',1);hill(h*.66,12,'#7cbf56',3);
    if(v3){hill(h*.74,8,'#5f9e43',5);v3.draw(t);}else{
    x.save();x.translate(w*.04-BARN.x*.5,h*.63-(BARN.y+BARN.h)*.5);x.scale(.5,.5);drawBarn(x);x.restore();
    for(let i=0;i<6;i++){x.save();x.translate(w*.56+i*20,h*.68);drawCrop(x,0,0,['girassol','milho','girassol','tomate','girassol','milho'][i],1,t,0);x.restore();}
    hill(h*.74,8,'#5f9e43',5);
    x.save();x.translate(0,0);hen.x=((t*40)%(w+80))-40;hen.y=h*.8;hen.phase=t;hen2.x=w*.72;hen2.y=h*.84;cow.x=w*.34;cow.y=h*.83;dog.x=w-((t*55)%(w+80))+40;dog.y=h*.9;dog.phase=t;
    for(const a of [cow,hen2,hen]){x.save();x.translate(a.x,a.y);x.scale(1.4,1.4);x.translate(-a.x,-a.y);drawAnimal(x,a,t);x.restore();}
    x.save();x.translate(dog.x,dog.y);x.scale(1.4,1.4);x.translate(-dog.x,-dog.y);drawDog(x,dog,t);x.restore();x.restore();}
    // a barra acompanha o carregamento de verdade e só mostra "Jogar" quando chega no fim
    const dt=Math.min(.25,t-(draw.lt||t));draw.lt=t;shown+=(prog-shown)*Math.min(1,dt*9);if(prog>=1&&shown>.985&&!ready){shown=1;ready=true;$('sp-go').hidden=false;}
    bar.style.width=(shown*100).toFixed(1)+'%';
    requestAnimationFrame(draw);}
  requestAnimationFrame(draw);
  const steps=[['Afiando as enxadas…',()=>makeIcons()],['Preparando a terra…',()=>buildBG()],['Abrindo o pacote de modelos…',()=>typeof fpLoad==='function'?fpLoad():0],
    ['Montando a fazenda em 3D…',()=>initThree()],['Acordando os bichos…',()=>{if(typeof FP!=='undefined'&&FP.ok)v3=spVitrine($('sp3d'));}],['Chamando os vizinhos…',()=>{}]];
  let i=0;const next=async()=>{if(i>=steps.length){prog=1;lab.textContent='Tudo pronto!';return;}
    lab.textContent=steps[i][0];await new Promise(r=>setTimeout(r,60));
    try{await steps[i][1]();}catch(e){console.warn(e);}
    i++;prog=i/steps.length*.96;setTimeout(next,120+Math.random()*100);};
  setTimeout(next,200);
  $('sp-go').onclick=()=>{el.classList.add('out');setTimeout(()=>{run=false;el.hidden=true;if(v3)v3.stop();},600);};
}
const boot=d=>{const go=()=>{splash();const wait=()=>{if(ICON.coin&&bgCanvas&&(R3||typeof THREE==='undefined'))start(d);else setTimeout(wait,50);};wait();};if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1200))]).then(go);}else go();};
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
})();
</script>
