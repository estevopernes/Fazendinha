// ====================== DRAWING: PLANTS ======================
// Fases: 0 semente (<50%) · 1 broto (50%) · 2 flores (75%) · 3 fruto (100%)
const G1='#3f8a35',G2='#5aa83c',G3='#7cc85a';
function flower(g,x,y,r,petal,center){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;circ(g,x+Math.cos(a)*r*.75,y+Math.sin(a)*r*.75,r*.55,petal);}circ(g,x,y,r*.45,center||'#f6c445');}
function stake(g,x,top){rr(g,x-1.6,top,3.2,-top,1.2);g.fillStyle='#b9824a';g.fill();g.strokeStyle=OUT;g.lineWidth=.6;g.stroke();}
function drawSeedStage(g,k,prog,t){
  ell(g,0,-2,15,5,'#7a4a26');ell(g,0,-3,13,3.5,'#8c5a30');
  const seeds={tomate:'#efe0b0',pepino:'#f4ecd0',milho:'#f4d23c',morango:'#e8c870',abobora:'#f3e3b0',melancia:'#3b2a1a',girassol:'#4a3b33',uva:'#7a5a3a',abacaxi:'#c9a46a',batata:'#c9a46a'}[k]||'#d9b77e';
  const big=k==='batata'||k==='abacaxi';
  for(const [dx,dy] of [[-6,-4],[0,-3],[6,-4]])ell(g,dx,dy,big?3:1.8,big?2.4:1.3,seeds,OUT,.5);
  if(prog>.25){const s=(prog-.25)/.25;line(g,-2,-4,0,-4-s*3,'#9ccf5a',1.4);}
  // umidade
  ell(g,-9,-1,2,1,'rgba(255,255,255,.18)');
}
function drawSprout(g,k,s){ // s: 0..1 dentro da fase
  const h=6+s*12;
  if(k==='milho'||k==='abacaxi'){for(const a of [-.4,0,.4])leaf(g,0,-1,h,1.8,-Math.PI/2+a,G2);return;}
  if(k==='cenoura'){for(const a of [-.5,-.15,.2,.5]){line(g,0,-1,Math.sin(a)*h*.8,-h,G2,1.2);}return;}
  line(g,0,0,0,-h,G1,1.8);leaf(g,0,-h,5+s*4,2.6,-Math.PI*.85,G3);leaf(g,0,-h,5+s*4,2.6,-Math.PI*.15,G3);
  if(s>.5)leaf(g,0,-h*.55,4+s*2,2,-Math.PI*.3,G2);
}
function drawGrown(g,k,ph,s,t){ // ph 2 = flor, 3 = fruto ; s escala
  const fl=ph===2, fr=ph===3;const C0=CROPS[k]||{};const TINT=C0.tint;if(C0.base)k=C0.base;
  g.save();g.scale(s,s);if(TINT==='giant'&&fr)g.scale(1.35,1.35);
  switch(k){
    case 'alface':{const R=fr?1:.75;for(let i=0;i<9;i++){const a=i/9*Math.PI*2;ell(g,Math.cos(a)*11*R,-7+Math.sin(a)*4*R,9*R,6*R,i%2?'#6fbf4a':'#8fd56a',OUT,.6);}circ(g,0,-10,7*R,'#bfe88a',OUT,.6);ell(g,-2,-12,3*R,2*R,'#dff5b0');break;}
    case 'cenoura':{for(const dx of [-12,0,12]){for(const a of [-.5,-.2,.15,.45]){const ex=dx+Math.sin(a)*12,ey=-22-(fl?4:0);line(g,dx,-1,ex,ey,G2,1.3);for(let j=1;j<4;j++)leaf(g,dx+(ex-dx)*j/4,-1+(ey+1)*j/4,4,1.4,-Math.PI/2+a+(j%2?.6:-.6),G3);}
        if(fl){line(g,dx,-1,dx,-30,G1,1);for(let j=0;j<7;j++)circ(g,dx+Math.cos(j)*4,-31+Math.sin(j)*1.6,1.4,'#fffdf2');}
        if(fr){g.beginPath();g.moveTo(dx-4.5,-2);g.lineTo(dx+4.5,-2);g.lineTo(dx,5);g.closePath();g.fillStyle='#f08a2c';g.fill();g.strokeStyle=OUT;g.lineWidth=.8;g.stroke();line(g,dx-2,0,dx+1,0,'rgba(140,60,10,.5)',.6);}}break;}
    case 'batata':{for(const [x,y,r] of [[-10,-12,9],[9,-13,9],[0,-20,10],[-4,-9,8],[6,-8,8]])circ(g,x,y,r,fr?'#6a9a3a':G2,OUT,.7);for(const [x,y] of [[-8,-16],[6,-19],[0,-11]])leaf(g,x,y,7,3,-1+x*.05,G3);
      if(fl)for(const [x,y] of [[-8,-22],[5,-27],[10,-17],[-12,-12]])flower(g,x,y,3,'#efe6ff','#f6c445');
      if(fr)for(const [x,y] of [[-13,0],[1,2],[13,0]]){ell(g,x,y,6,4.2,'#c9a46a',OUT,.8);circ(g,x-2,y-1,.7,'#8a6b3a');circ(g,x+2,y+1,.7,'#8a6b3a');}break;}
    case 'tomate':{stake(g,0,-46);g.beginPath();g.moveTo(0,0);for(let i=1;i<=5;i++)g.lineTo((i%2?4:-4),-i*8);g.strokeStyle=G1;g.lineWidth=2;g.stroke();
      for(let i=1;i<=5;i++){leaf(g,i%2?4:-4,-i*8,10,4,i%2?-.4:Math.PI+.4,i%2?G2:G3);leaf(g,i%2?4:-4,-i*8,8,3,i%2?Math.PI+.7:-.7,G2);}
      if(fl)for(const [x,y] of [[8,-14],[-9,-22],[9,-31],[-6,-38]]){for(let i=0;i<5;i++){const a=i/5*Math.PI*2;line(g,x,y,x+Math.cos(a)*3,y+Math.sin(a)*3,'#f6d02c',1.6);}}
      if(fr)for(const [x,y,r] of [[9,-12,5],[-9,-17,5.5],[10,-24,4.6],[-10,-29,5],[7,-36,4.2],[-4,-8,4.4],[2,-42,3.6]]){circ(g,x,y,r,'#e2483d',OUT,.8);ell(g,x-r*.35,y-r*.35,r*.3,r*.2,'rgba(255,255,255,.55)');star(g,x,y-r+.6,2.2,'#3f8a35');}
      break;}
    case 'pepino':{stake(g,-14,-44);stake(g,14,-44);for(let y=-40;y<=-10;y+=10)line(g,-14,y,14,y,'rgba(185,130,74,.8)',1);line(g,-14,-40,14,-10,'rgba(185,130,74,.6)',.8);line(g,14,-40,-14,-10,'rgba(185,130,74,.6)',.8);
      g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-14,-12,14,-24,-4,-42);g.strokeStyle=G1;g.lineWidth=1.8;g.stroke();
      for(const [x,y,a] of [[-8,-10,-2.4],[8,-18,-.5],[-6,-28,-2.6],[6,-36,-.4],[-2,-42,-1.6],[10,-6,-.2]]){g.save();g.translate(x,y);g.rotate(a);ell(g,6,0,6.5,5.5,G2,OUT,.7);g.restore();}
      if(fl)for(const [x,y] of [[11,-26],[-11,-20],[2,-34],[-9,-38]])flower(g,x,y,3,'#f6d02c','#e0a020');
      if(fr)for(const [x,y,a] of [[10,-20,.2],[-10,-24,-.25],[3,-14,.1],[-4,-34,-.1]]){g.save();g.translate(x,y);g.rotate(a);rr(g,-2.6,0,5.2,13,2.6);g.fillStyle='#4f8a2a';g.fill();g.strokeStyle=OUT;g.lineWidth=.7;g.stroke();for(let i=0;i<3;i++)circ(g,0,3+i*3.5,.7,'#c9e08a');circ(g,0,13,1.4,'#f6d02c');g.restore();}
      break;}
    case 'milho':{line(g,0,0,0,-52,'#5f9a3a',3);for(const [y,d] of [[-10,1],[-18,-1],[-27,1],[-35,-1],[-43,1]]){g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(d*14,y-10,d*20,y+2);g.strokeStyle=G2;g.lineWidth=3;g.stroke();}
      if(fl||fr)for(let i=-2;i<=2;i++)line(g,0,-52,i*3,-60+Math.abs(i),'#d9b24a',1.4);
      if(fr)for(const [x,y,d] of [[3,-24,1],[-3,-33,-1]]){g.save();g.translate(x,y);g.rotate(d*.35);ell(g,d*3,-5,4,9,'#f4d23c',OUT,.8);for(let i=0;i<4;i++)line(g,d*3-3,-11+i*4,d*3+3,-11+i*4,'rgba(200,150,20,.6)',.6);g.beginPath();g.moveTo(d*3-5,3);g.quadraticCurveTo(d*3-7,-8,d*3-2,-14);g.lineTo(d*3,-2);g.closePath();g.fillStyle=G2;g.fill();line(g,d*3,-14,d*3+d*3,-19,'#c9883a',1);g.restore();}
      break;}
    case 'morango':{for(const dx of [-10,10]){for(const a of [-2.4,-1.57,-.7]){g.save();g.translate(dx,-6);g.rotate(a);for(const b of [-.5,0,.5]){g.save();g.rotate(b);ell(g,8,0,4.5,3.2,G2,OUT,.6);g.restore();}g.restore();}
        if(fl)for(const [x,y] of [[dx-6,-6],[dx+5,-10]])flower(g,x,y,3,'#fffdf2','#f6c445');
        if(fr)for(const [x,y] of [[dx-6,0],[dx+5,-1],[dx,3]]){g.beginPath();g.moveTo(x-3.4,y-3);g.quadraticCurveTo(x,y-5,x+3.4,y-3);g.quadraticCurveTo(x+3,y+3,x,y+5);g.quadraticCurveTo(x-3,y+3,x-3.4,y-3);g.fillStyle='#d93a4a';g.fill();g.strokeStyle=OUT;g.lineWidth=.6;g.stroke();for(let i=0;i<4;i++)circ(g,x-1.5+(i%2)*3,y-1+Math.floor(i/2)*2.6,.5,'#f6e08a');star(g,x,y-3.6,2,G1);}}
      break;}
    case 'abobora':case 'melancia':{g.beginPath();g.moveTo(-22,-2);g.bezierCurveTo(-10,-10,10,6,22,-3);g.strokeStyle=G1;g.lineWidth=1.8;g.stroke();
      for(const [x,y,r] of [[-18,-8,7],[-6,-12,8],[10,-11,8],[20,-8,6]]){ell(g,x,y,r,r*.75,k==='abobora'?G2:'#4f8a3a',OUT,.6);line(g,x,y,x,y-r*.6,'rgba(30,70,20,.35)',.6);}
      if(fl)for(const [x,y] of [[-12,-16],[4,-18]])k==='abobora'?(ell(g,x,y,4,5,'#f6c445',OUT,.6),circ(g,x,y-1,1.6,'#e08a2a')):flower(g,x,y,3,'#f6d02c','#e0a020');
      if(fr){if(k==='abobora'){const x=0,y=-8;for(const [dx,rx] of [[-7,7],[7,7],[0,8]])ell(g,x+dx,y,rx,9,'#e9862b',OUT,.9);line(g,x-3,y-8,x-3,y+8,'rgba(122,60,20,.35)',1);line(g,x+3,y-8,x+3,y+8,'rgba(122,60,20,.35)',1);rr(g,x-1.5,y-13,3,5,1);g.fillStyle='#5b7a2a';g.fill();ell(g,x-6,y-4,2,3,'rgba(255,255,255,.3)');}
        else{const x=0,y=-7;ell(g,x,y,14,9,'#3f8a35',OUT,1);g.save();ell(g,x,y,14,9);g.clip();for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(x+i*4.5,y-10);g.quadraticCurveTo(x+i*5.6,y,x+i*4.5,y+10);g.strokeStyle='#1f5a2a';g.lineWidth=2;g.stroke();}g.restore();ell(g,x-5,y-4,3,1.6,'rgba(255,255,255,.3)');}}
      break;}
    case 'girassol':{line(g,0,0,1,-48,'#4f8a35',2.6);for(const [y,d] of [[-12,1],[-22,-1],[-32,1]])leaf(g,0,y,12,5,d>0?-.3:Math.PI+.3,G2);
      if(fl){ell(g,1,-50,5,6,'#5aa83c',OUT,.7);for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.35;ell(g,1+Math.cos(a)*5,-50+Math.sin(a)*6,1.4,2.4,'#f7c623');}}
      if(fr){const fx2=2,fy=-50;for(let i=0;i<14;i++){const a=i/14*Math.PI*2+Math.sin(t*.6)*.05;g.save();g.translate(fx2,fy);g.rotate(a);ell(g,10,0,6,2.6,TINT==='rainbow'?['#e2483d','#f08a2c','#f7c623','#5aa83c','#3d9bd1','#9a5bc4','#c94f8a'][i%7]:'#f7c623',OUT,.5);g.restore();}circ(g,fx2,fy,7,'#6a3f1a',OUT,.8);for(let i=0;i<10;i++)circ(g,fx2+Math.cos(i*2.4)*i*.55,fy+Math.sin(i*2.4)*i*.55,.7,'#3b2410');}
      break;}
    case 'berinjela':{stake(g,0,-40);for(const [x,y,r] of [[-9,-14,9],[9,-16,9],[0,-26,10],[-6,-34,7],[7,-36,7]])circ(g,x,y,r,G2,OUT,.7);for(const [x,y] of [[-7,-20],[6,-28],[0,-14]])leaf(g,x,y,8,3,-1.2+x*.08,G3);
      if(fl)for(const [x,y] of [[-12,-10],[11,-22],[-4,-38],[6,-12]])flower(g,x,y,3,'#a77ad6','#f6c445');
      if(fr)for(const [x,y,a] of [[-10,-6,.3],[10,-10,-.25],[1,-16,0]]){g.save();g.translate(x,y);g.rotate(a);ell(g,0,6,4.6,8,'#5b2a7a',OUT,.8);ell(g,-1.6,3,1.2,3,'rgba(255,255,255,.35)');star(g,0,-2,3.4,G1);g.restore();}
      break;}
    case 'uva':{stake(g,-18,-46);stake(g,18,-46);rr(g,-21,-48,42,4,2);g.fillStyle='#b9824a';g.fill();g.strokeStyle=OUT;g.lineWidth=.6;g.stroke();
      g.beginPath();g.moveTo(-18,0);g.bezierCurveTo(-24,-20,-10,-36,-16,-46);g.moveTo(18,0);g.bezierCurveTo(24,-20,10,-36,16,-46);g.strokeStyle='#7a5a2a';g.lineWidth=1.8;g.stroke();
      for(let i=0;i<7;i++){const x=-18+i*6;g.save();g.translate(x,-48);g.rotate(i%2?.4:-.4);ell(g,0,4,6,5,i%2?G2:G1,OUT,.6);g.restore();}
      if(fl)for(const x of [-10,2,12]){for(let j=0;j<5;j++)circ(g,x+(j%2)*2-1,-40+j*2,1.3,'#c9e08a');}
      if(fr)for(const x of [-10,2,12]){for(let row=0;row<4;row++)for(let j=0;j<4-row;j++)circ(g,x+(j-(3-row)/2)*3.6,-40+row*3.4,2.1,TINT==='gold'?'#f2c94c':'#6a2a7a',OUT,.4);line(g,x,-44,x,-41,'#7a5a2a',1);}
      break;}
    case 'abacaxi':{for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.3;g.beginPath();g.moveTo(-2,-2);g.lineTo(Math.cos(a)*22,-2+Math.sin(a)*20);g.lineTo(2,-2);g.closePath();g.fillStyle=i%2?'#5f8f5a':'#4f7f4a';g.fill();g.strokeStyle=OUT;g.lineWidth=.5;g.stroke();}
      if(fl){ell(g,0,-16,4,6,'#c94f8a',OUT,.7);for(let i=0;i<4;i++)circ(g,-1.5+(i%2)*3,-19+i*2.4,1,'#7a5ad8');}
      if(fr){ell(g,0,-17,7.5,10,'#e8a43a',OUT,.9);g.save();ell(g,0,-17,7.5,10);g.clip();for(let i=-3;i<=3;i++){line(g,i*4-8,-28,i*4+8,-6,'rgba(140,90,20,.6)',.8);line(g,i*4+8,-28,i*4-8,-6,'rgba(140,90,20,.6)',.8);}g.restore();for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.35;g.beginPath();g.moveTo(-1.5,-26);g.lineTo(Math.cos(a)*9,-26+Math.sin(a)*10);g.lineTo(1.5,-26);g.closePath();g.fillStyle='#3f7a45';g.fill();}}
      break;}
  }
  g.restore();
}
function star(g,x,y,r,c){g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr2=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}g.closePath();g.fillStyle=c;g.fill();}
function drawCrop(g,x,y,k,prog,t,pop){
  g.save();g.translate(x,y);
  const ph=stageOf(prog);g.scale(1.2,1.2);
  const sway=Math.sin(t*1.5+x*.07)*.035;
  const bounce=pop>0?1+Math.sin((1-pop)*Math.PI*3)*pop*.22:1;
  g.scale(1/bounce*(bounce>1?1:1),bounce);g.rotate(sway);
  if(ph===0)drawSeedStage(g,(CROPS[k]&&CROPS[k].base)||k,prog,t);
  else if(ph===1){ell(g,0,-2,13,4,'#7a4a26');drawSprout(g,(CROPS[k]&&CROPS[k].base)||k,(prog-.5)/.25);}
  else drawGrown(g,k,ph,ph===2?.72+(prog-.75)/.25*.2:1,t);
  g.restore();
}
function drawPlotSoil(g,p){
  const px=p.c*T,py=p.r*T;
  rr(g,px+3,py+5,T-6,T-8,8);g.fillStyle='#7a4320';g.fill();
  rr(g,px+3,py+3,T-6,T-8,8);g.fillStyle=p.water?'#6a3a18':'#a8692f';g.fill();g.strokeStyle='rgba(59,42,26,.55)';g.lineWidth=1.5;g.stroke();
  for(let i=1;i<4;i++)line(g,px+9,py+3+i*(T-8)/4,px+T-9,py+3+i*(T-8)/4,p.water?'rgba(30,18,8,.35)':'rgba(90,55,25,.5)',2);
  if(p.water&&p.crop&&p.prog<1){for(const [dx,dy] of [[10,12],[T-14,T-14]])ell(g,px+dx,py+dy,3,1.6,'rgba(160,210,240,.45)');}
}
function drawPlotOverlay(g,p,t,home){
  const px=p.c*T,py=p.r*T;
  if(p.weed){for(let i=-2;i<=2;i++){g.beginPath();const bx=px+T/2+i*6+8,by=py+T*.9;g.moveTo(bx-4,by);g.lineTo(bx+i*2+Math.sin(t*2+i)*1.5,by-18+Math.abs(i)*4);g.lineTo(bx+4,by);g.closePath();g.fillStyle=i%2?'#4d6b22':'#5f7f2a';g.fill();g.strokeStyle=OUT;g.lineWidth=.8;g.stroke();}circ(g,px+T/2+14,py+T*.62,3,'#b36ad6',OUT,.7);}
  if(p.bug){for(let i=0;i<2;i++){const bx=px+T*(.3+i*.38)+Math.sin(t*3+i*2)*5,by=py+T*(.42+i*.2)+Math.cos(t*2.6+i)*3;ell(g,bx,by,4.5,3.5,'#d9483d',OUT,.8);line(g,bx,by-3.5,bx,by+3.5,OUT,.8);circ(g,bx+4,by,2,'#3b2a1a');circ(g,bx-1.5,by-1,1,'#3b2a1a');}}
  if(p.crop&&p.prog<1){rr(g,px+8,py+T-9,T-16,5,2.5);g.fillStyle='rgba(59,42,26,.55)';g.fill();rr(g,px+8,py+T-9,(T-16)*p.prog,5,2.5);g.fillStyle=p.weed||p.bug?'#d9483d':'#9ad66a';g.fill();}
  if(p.crop&&p.prog>=.5&&p.prog<1&&!p.water){const by=py-6+Math.sin(t*3+p.c)*2;circ(g,px+T-10,by,9,'#fff7e3',OUT,1.2);g.beginPath();g.moveTo(px+T-10,by-6);g.quadraticCurveTo(px+T-4,by+2,px+T-10,by+4);g.quadraticCurveTo(px+T-16,by+2,px+T-10,by-6);g.fillStyle='#3d9bd1';g.fill();}
  if(p.crop&&p.prog>=1){const s=(Math.sin(t*4+p.c+p.r)+1)/2;g.save();g.globalAlpha=.5+s*.5;star(g,px+T-9,py+6,4+s*2.5,'#fff6a8');g.restore();}
}
