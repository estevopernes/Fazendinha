// ====================== DRAWING: WORLD ======================
let bgCanvas=null;
function buildBG(){
  bgCanvas=document.createElement('canvas');bgCanvas.width=W;bgCanvas.height=H;const x=bgCanvas.getContext('2d');
  x.fillStyle='#62c04a';x.fillRect(0,0,W,H);
  const R=seeded(7);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if((r+c)%2){x.fillStyle='rgba(255,255,160,.05)';x.fillRect(c*T,r*T,T,T);}}
  for(let i=0;i<1000;i++){const gx=R()*W,gy=R()*H;x.strokeStyle=R()<.5?'rgba(40,130,30,.35)':'rgba(190,240,120,.45)';x.lineWidth=1.3;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+R()*3-1.5,gy-4-R()*3);x.stroke();}
  for(let i=0;i<70;i++){circ(x,R()*W,R()*H,1.8,R()<.5?'#fff7e3':'#f6c445');}
  x.fillStyle='#e9c983';rr(x,-10,4.2*T,W+20,0.66*T,14);x.fill();rr(x,11.08*T,4.3*T,0.84*T,H,14);x.fill();
  for(let i=0;i<260;i++){const onH=R()<.4;const px=onH?R()*W:11.1*T+R()*0.8*T,py=onH?4.25*T+R()*.6*T:4.3*T+R()*(H-4.3*T);circ(x,px,py,1+R()*1.6,'rgba(150,110,60,.35)');}
  // pond
  ell(x,POND.x,POND.y+4,POND.rx+6,POND.ry+6,'#b89a62');ell(x,POND.x,POND.y,POND.rx,POND.ry,'#3fb4e8',OUT,2);ell(x,POND.x,POND.y,POND.rx*.8,POND.ry*.75,'#5cc6f2');ell(x,POND.x-20,POND.y-12,POND.rx*.5,POND.ry*.3,'rgba(255,255,255,.25)');
  for(const [dx,dy] of [[-55,18],[45,-18],[60,26]])ell(x,POND.x+dx,POND.y+dy,11,7,'#5aa83c',OUT,1);
  circ(x,POND.x+47,POND.y-22,3.2,'#f2a7c4');
  for(const [rx,ry,rs] of ROCKS){ell(x,rx,ry+2,rs+2,rs*.8,'rgba(30,60,15,.25)');ell(x,rx,ry,rs,rs*.75,'#c9c4b8',OUT,1.2);ell(x,rx-rs*.3,ry-rs*.25,rs*.4,rs*.25,'#e8e4da');}
  for(let i=0;i<40;i++){const fx2=R()*W,fy=5*T+R()*(H-6*T);if(blockedTile(Math.floor(fx2/T),Math.floor(fy/T))&&Math.floor(fx2/T)!==11){const col=['#fff7e3','#f6c445','#f28ab2'][i%3];for(let k=0;k<5;k++){const a=k/5*Math.PI*2;circ(x,fx2+Math.cos(a)*2.4,fy+Math.sin(a)*2.4,1.7,col);}}}
}
const groundCache=new Map();
function penGround(p){let c=groundCache.get(p.id);if(c)return c;const G=penGeo(p),P=PEN_TYPES[p.type];
  c=document.createElement('canvas');c.width=Math.ceil(G.w);c.height=Math.ceil(G.h);const x=c.getContext('2d');const R=seeded(hashStr(p.id));
  rr(x,0,0,G.w,G.h,8);x.fillStyle=P.ground;x.fill();
  if(p.type==='galinheiro'||p.type==='cabril'){for(let i=0;i<140;i++)circ(x,R()*G.w,R()*G.h,1.3,'rgba(120,85,40,.4)');for(let i=0;i<20;i++){x.strokeStyle='rgba(230,200,120,.8)';x.lineWidth=1;x.beginPath();const sx=R()*G.w,sy=R()*G.h;x.moveTo(sx,sy);x.lineTo(sx+6,sy-2);x.stroke();}}
  else{for(let i=0;i<180;i++){const gx=R()*G.w,gy=R()*G.h;x.strokeStyle='rgba(60,130,40,.5)';x.lineWidth=1.3;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+R()*4-2,gy-5);x.stroke();}}
  if(p.type==='viveiro')for(let i=0;i<18;i++){const fx2=10+R()*(G.w-20),fy=10+R()*(G.h-20);const col=['#e2483d','#f6c445','#c94f8a','#fff7e3'][i%4];for(let k=0;k<5;k++){const a=k/5*Math.PI*2;circ(x,fx2+Math.cos(a)*2.6,fy+Math.sin(a)*2.6,1.8,col);}circ(x,fx2,fy,1.4,'#7a4f2a');}
  groundCache.set(p.id,c);return c;}
function fenceRail(g,x1,y1,x2,y2,dark,light){line(g,x1,y1-10,x2,y2-10,dark,3.2);line(g,x1,y1-4,x2,y2-4,dark,3.2);line(g,x1,y1-10,x2,y2-10,light,1.6);line(g,x1,y1-4,x2,y2-4,light,1.6);}
function fencePost(g,x,y,col){rr(g,x-3,y-14,6,16,2);g.fillStyle=col||'#b9824a';g.fill();g.lineWidth=1;g.strokeStyle=OUT;g.stroke();}
function isoFence(g,x1,y1,x2,y2,dark,light,postc,skipEnd){const A=iso(x1,y1),B=iso(x2,y2);
  fenceRail(g,A.x,A.y,B.x,B.y,dark,light);const n=Math.max(1,Math.round(Math.hypot(x2-x1,y2-y1)/24));
  for(let i=0;i<=n-(skipEnd?1:0);i++){const P=iso(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n);fencePost(g,P.x,P.y,postc);}}
function drawPenBack(g,p){const G=penGeo(p);
  isoFence(g,G.x,G.y+G.h,G.x,G.y,'#7a4f2a','#d9a86a');isoFence(g,G.x,G.y,G.x+G.w,G.y,'#7a4f2a','#d9a86a');}
function drawPenFront(g,p,count){const G=penGeo(p),P=PEN_TYPES[p.type];
  isoFence(g,G.x+G.w,G.y,G.x+G.w,G.y+G.h,'#7a4f2a','#d9a86a');isoFence(g,G.x,G.y+G.h,G.x+G.w,G.y+G.h,'#7a4f2a','#d9a86a');
  const S2=iso(G.x+G.w/2,G.y+G.h);g.save();g.font='700 11px Fredoka, sans-serif';const label=P.n+' '+count+'/'+PEN_CAP;const tw=g.measureText(label).width+12;
  rr(g,S2.x-tw/2,S2.y+2,tw,16,5);g.fillStyle='#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();g.fillStyle='#3b2a1a';g.textAlign='center';g.fillText(label,S2.x,S2.y+14);g.restore();}
function drawBush(g,x,y,s,t){g.save();g.translate(x,y);g.scale(s,s);ell(g,0,2,18,5,'rgba(30,60,15,.25)');const w=Math.sin(t*1.3+x)*.6;
  circ(g,-9+w,-9,10,'#46a83a',OUT,1.1);circ(g,9+w,-9,10,'#46a83a',OUT,1.1);circ(g,w,-16,12,'#5cc447',OUT,1.1);circ(g,-3+w,-19,5,'rgba(255,255,255,.22)');g.restore();}
function drawCoopHouse(g,h){g.save();ell(g,h.x+h.w/2,h.y+h.h+3,h.w/2+4,6,'rgba(30,50,15,.25)');
  rr(g,h.x+6,h.y+h.h*.4,h.w-12,h.h*.6,3);g.fillStyle='#c99a64';g.fill();g.strokeStyle=OUT;g.lineWidth=1.4;g.stroke();
  for(let i=1;i<6;i++)line(g,h.x+6+i*(h.w-12)/6,h.y+h.h*.4,h.x+6+i*(h.w-12)/6,h.y+h.h,'rgba(122,79,42,.35)',1);
  g.beginPath();g.moveTo(h.x-2,h.y+h.h*.44);g.lineTo(h.x+h.w/2,h.y);g.lineTo(h.x+h.w+2,h.y+h.h*.44);g.closePath();g.fillStyle='#3f8a35';g.fill();g.stroke();
  rr(g,h.x+h.w/2-10,h.y+h.h-24,20,24,10);g.fillStyle='#3b2a1a';g.fill();
  line(g,h.x+h.w/2+10,h.y+h.h,h.x+h.w/2+26,h.y+h.h+12,'#a8723f',5);
  ell(g,h.x+14,h.y+h.h+8,10,4,'#e8c46a',OUT,.8);
  g.restore();}
function drawShed(g,s){g.save();ell(g,s.x+s.w/2,s.y+s.h+3,s.w/2,6,'rgba(30,50,15,.25)');
  for(const px of [s.x+6,s.x+s.w-10])rr(g,px,s.y+18,5,s.h-18,1),g.fillStyle='#8a5a33',g.fill();
  g.beginPath();g.moveTo(s.x-4,s.y+24);g.lineTo(s.x+10,s.y);g.lineTo(s.x+s.w-10,s.y);g.lineTo(s.x+s.w+4,s.y+24);g.closePath();g.fillStyle='#c4573a';g.fill();g.strokeStyle=OUT;g.lineWidth=1.4;g.stroke();
  for(let i=1;i<5;i++)line(g,s.x+i*s.w/5,s.y+2,s.x+i*s.w/5,s.y+22,'rgba(90,30,15,.35)',1.2);
  ell(g,s.x+s.w/2,s.y+s.h-6,22,9,'#e8c46a',OUT,1);line(g,s.x+s.w/2-16,s.y+s.h-8,s.x+s.w/2+14,s.y+s.h-9,'#c9a033',1);g.restore();}
function drawPerch(g,p){g.save();line(g,p.x-16,p.y,p.x-16,p.y-26,'#7a4f2a',3);line(g,p.x+16,p.y,p.x+16,p.y-26,'#7a4f2a',3);line(g,p.x-20,p.y-26,p.x+20,p.y-26,'#8a5a33',4);g.restore();}
function drawDeco(g,d,f,t,flat){const x=d.c*T,y=d.r*T,cx=x+T/2;
  if(d.type==='cerca'||d.type==='cercab'){const dark=d.type==='cercab'?'#b8b0a0':'#7a4f2a',light=d.type==='cercab'?'#fffdf6':'#e0aa62',postc=d.type==='cercab'?'#fffdf6':'#c98a4a';
    if(flat){const by=y+T*.62;fenceRail(g,x+4,by,x+T-4,by,dark,light);fencePost(g,x+8,by,postc);fencePost(g,cx,by,postc);fencePost(g,x+T-8,by,postc);return;}
    const has=(dc,dr)=>f.deco.some(o=>(o.type==='cerca'||o.type==='cercab')&&o.c===d.c+dc&&o.r===d.r+dr);
    const cy=y+T/2;const L=has(-1,0),Rt=has(1,0),U=has(0,-1),D=has(0,1),alone=!L&&!Rt&&!U&&!D;
    if(U)isoFence(g,cx,y,cx,cy,dark,light,postc,true);if(L||alone||(!U&&!D&&Rt))isoFence(g,x,cy,cx,cy,dark,light,postc,true);
    if(Rt||alone||(!U&&!D&&L))isoFence(g,cx,cy,x+T,cy,dark,light,postc,true);if(D)isoFence(g,cx,cy,cx,y+T,dark,light,postc,true);
    const P=iso(cx,cy);fencePost(g,P.x,P.y,postc);return;}
  if(d.type==='flores'){rr(g,x+5,y+12,T-10,T-18,10);g.fillStyle='#6b4326';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();
    const cols=['#e2483d','#f6c445','#c94f8a','#fff7e3','#9a5bc4'];for(let i=0;i<7;i++){const fx2=x+12+(i*13)%(T-22),fy=y+20+((i*7)%3)*8;line(g,fx2,fy+6,fx2,fy,'#3f8a35',1.2);flower(g,fx2+Math.sin(t*2+i)*.6,fy,3.2,cols[i%5],'#f6c445');}return;}
  if(d.type==='arvore'){drawTree(g,cx,y+T*.85,t);return;}
  if(d.type==='banco'){const by=y+T*.8;g.save();g.translate(cx,by);ell(g,0,2,22,4,'rgba(30,50,15,.25)');for(const lx of[-16,14])rr(g,lx,-12,3,13,1),g.fillStyle='#6b4326',g.fill();
    rr(g,-21,-15,42,6,2);g.fillStyle='#b9824a';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();for(const yy of[-30,-23]){rr(g,-21,yy,42,5,2);g.fill();g.stroke();}line(g,-17,-30,-17,-15,'#6b4326',2.5);line(g,15,-30,15,-15,'#6b4326',2.5);g.restore();return;}
  if(d.type==='carrinho'){const by=y+T*.8;g.save();g.translate(cx,by);ell(g,0,2,22,4,'rgba(30,50,15,.25)');line(g,-6,-8,-24,-2,'#8a5a33',2.5);line(g,-6,-14,-24,-8,'#8a5a33',2.5);
    g.beginPath();g.moveTo(-10,-20);g.lineTo(18,-20);g.lineTo(12,-6);g.lineTo(-6,-6);g.closePath();g.fillStyle='#3f8a35';g.fill();g.strokeStyle=OUT;g.lineWidth=1.2;g.stroke();
    for(const [dx,c] of [[-2,'#e9862b'],[6,'#e2483d'],[12,'#f4d23c']])circ(g,dx,-22,4,c,OUT,.7);circ(g,10,-3,5,'#3b2a1a');circ(g,10,-3,2,'#9aa4ad');g.restore();return;}
  if(d.type==='poco'){const by=y+T*.85;g.save();g.translate(cx,by);ell(g,0,2,22,5,'rgba(30,50,15,.25)');rr(g,-17,-18,34,18,4);g.fillStyle='#a8a29a';g.fill();g.strokeStyle=OUT;g.lineWidth=1.2;g.stroke();
    for(let i=0;i<3;i++)line(g,-17,-12+i*5,17,-12+i*5,'rgba(59,42,26,.3)',1);ell(g,0,-18,17,4,'#2f5a7a',OUT,1);line(g,-14,-18,-14,-46,'#8a5a33',3);line(g,14,-18,14,-46,'#8a5a33',3);
    g.beginPath();g.moveTo(-22,-42);g.lineTo(0,-56);g.lineTo(22,-42);g.closePath();g.fillStyle='#c4573a';g.fill();g.stroke();line(g,-14,-36,14,-36,'#6b4326',2);line(g,0,-36,0,-26,'#6b4326',1);rr(g,-4,-28,8,7,1);g.fillStyle='#b9824a';g.fill();g.restore();return;}
  if(d.type==='fonte'){const by=y+T*.85;g.save();g.translate(cx,by);ell(g,0,2,24,6,'rgba(30,50,15,.25)');ell(g,0,-6,23,9,'#b8b0a0',OUT,1.2);ell(g,0,-8,18,6,'#4fa7d8');rr(g,-4,-30,8,22,3);g.fillStyle='#c9c2b4';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();ell(g,0,-30,10,4,'#c9c2b4',OUT,1);
    for(let i=0;i<4;i++){const ph2=(t*1.4+i/4)%1;const a=i/4*Math.PI*2;circ(g,Math.cos(a)*ph2*14,-32-Math.sin(ph2*Math.PI)*10+ph2*20,1.8,'#9fd6f2');}g.restore();return;}
  if(d.type==='moinho'){const by=y+T*.9;g.save();g.translate(cx,by);ell(g,0,2,18,5,'rgba(30,50,15,.25)');g.beginPath();g.moveTo(-12,0);g.lineTo(-7,-48);g.lineTo(7,-48);g.lineTo(12,0);g.closePath();g.fillStyle='#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1.2;g.stroke();
    rr(g,-4,-14,8,14,3);g.fillStyle='#8a5a33';g.fill();g.beginPath();g.moveTo(-10,-48);g.lineTo(0,-60);g.lineTo(10,-48);g.closePath();g.fillStyle='#c4573a';g.fill();g.stroke();
    g.translate(0,-50);g.rotate(t*1.6);for(let i=0;i<4;i++){g.rotate(Math.PI/2);rr(g,-2.5,2,5,26,1.5);g.fillStyle='#e8dcc0';g.fill();g.stroke();for(let j=0;j<3;j++)line(g,-2.5,8+j*6,2.5,8+j*6,'rgba(59,42,26,.4)',.7);}circ(g,0,0,3,'#7a4f2a');g.restore();return;}
  if(d.type==='espantalho'){const by=y+T*.85,sw=Math.sin(t*1.2+d.c)*.06;g.save();g.translate(cx,by);g.rotate(sw);ell(g,0,2,10,3,'rgba(30,50,15,.25)');line(g,0,0,0,-44,'#8a5a33',3);line(g,-18,-30,18,-30,'#8a5a33',3);
    rr(g,-9,-36,18,20,4);g.fillStyle='#3d7fb8';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();rr(g,-3,-30,6,6,1);g.fillStyle='#d9483d';g.fill();
    for(const s of[-1,1])line(g,s*18,-30,s*21,-26,'#e8c46a',2);circ(g,0,-43,7,'#f3e3b0',OUT,1);circ(g,-2.5,-44,1,'#3b2a1a');circ(g,2.5,-44,1,'#3b2a1a');line(g,-3,-40,3,-40,'#3b2a1a',.8);
    ell(g,0,-49,13,3,'#c9a033',OUT,1);rr(g,-6,-56,12,7,3);g.fillStyle='#c9a033';g.fill();g.stroke();g.restore();return;}
}
function drawDogHouse(g,has,awake){const d=DOGHOUSE;g.save();g.translate(d.x,d.y);ell(g,0,24,30,6,'rgba(30,50,15,.25)');
  rr(g,-24,-4,48,28,2);g.fillStyle=has?'#3d7fb8':'rgba(255,255,255,.35)';g.fill();g.strokeStyle=has?OUT:'rgba(59,42,26,.4)';g.lineWidth=1.4;if(!has)g.setLineDash([4,4]);g.stroke();
  g.beginPath();g.moveTo(-30,0);g.lineTo(0,-24);g.lineTo(30,0);g.closePath();g.fillStyle=has?'#c4573a':'rgba(255,255,255,.3)';g.fill();g.stroke();g.setLineDash([]);
  if(has){rr(g,-9,4,18,20,9);g.fillStyle='#3b2a1a';g.fill();ell(g,32,22,9,4,'#9aa4ad',OUT,1);if(awake){circ(g,29,20,2,'#8a5a33');circ(g,34,20,2,'#8a5a33');}}
  else{g.fillStyle='rgba(59,42,26,.65)';g.font='700 10px Nunito, sans-serif';g.textAlign='center';g.fillText('casinha',0,15);}
  g.restore();}
