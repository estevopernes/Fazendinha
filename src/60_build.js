function drawTrough(g,o,kind){
  g.save();g.translate(o.x,o.y);ell(g,0,4,26,5,'rgba(30,50,15,.22)');
  rr(g,-24,-12,48,14,4);g.fillStyle='#a8723f';g.fill();g.strokeStyle=OUT;g.lineWidth=1.3;g.stroke();
  rr(g,-21,-12,42,6,3);
  if(kind==='water'){g.fillStyle='#4fa7d8';g.fill();ell(g,-8+Math.sin(T0*2)*3,-9,5,1.2,'rgba(255,255,255,.6)');}
  else{g.fillStyle='#e8c46a';g.fill();for(let i=0;i<9;i++)circ(g,-17+i*4.2,-11+(i%2),1.6,'#c9a033');}
  line(g,-18,2,-18,-2,OUT,1);line(g,18,2,18,-2,OUT,1);g.restore();
}
function drawTree(g,x,y,t){g.save();g.translate(x,y);ell(g,0,2,22,6,'rgba(30,50,15,.25)');rr(g,-5,-26,10,28,3);g.fillStyle='#8a5a33';g.fill();g.strokeStyle=OUT;g.lineWidth=1.2;g.stroke();
  const s=Math.sin(t*.8+x)*1.2;circ(g,-11+s,-36,15,'#3f8a35',OUT,1.3);circ(g,11+s,-36,15,'#3f8a35',OUT,1.3);circ(g,s,-48,17,'#4f9a3a',OUT,1.3);circ(g,-4+s,-40,13,'#4f9a3a');circ(g,6+s,-44,5,'rgba(255,255,255,.18)');
  for(const[dx,dy] of [[-10,-34],[8,-46],[12,-30]])circ(g,dx+s,dy,3,'#e2483d',OUT,.6);g.restore();}
function drawHouse(g){const h=HOUSE;g.save();ell(g,h.x+h.w/2,h.y+h.h+4,h.w/2+8,8,'rgba(30,50,15,.25)');
  rr(g,h.x+8,h.y+h.h*.42,h.w-16,h.h*.58,4);g.fillStyle='#f7ecd2';g.fill();g.strokeStyle=OUT;g.lineWidth=1.6;g.stroke();
  for(let i=0;i<5;i++)line(g,h.x+10,h.y+h.h*.42+8+i*8,h.x+h.w-10,h.y+h.h*.42+8+i*8,'rgba(150,120,80,.25)',1);
  g.beginPath();g.moveTo(h.x-4,h.y+h.h*.46);g.lineTo(h.x+h.w/2,h.y+4);g.lineTo(h.x+h.w+4,h.y+h.h*.46);g.closePath();g.fillStyle='#c4573a';g.fill();g.stroke();
  for(let i=1;i<5;i++){const yy=h.y+4+i*(h.h*.42/5);const half=(yy-h.y-4)/(h.h*.42)*(h.w/2+4);line(g,h.x+h.w/2-half,yy,h.x+h.w/2+half,yy,'rgba(90,30,15,.35)',1.4);}
  rr(g,h.x+h.w/2-12,h.y+h.h-36,24,36,3);g.fillStyle='#3d7fb8';g.fill();g.stroke();circ(g,h.x+h.w/2+7,h.y+h.h-18,2,'#f6c445');
  for(const wx of[h.x+30,h.x+h.w-56]){rr(g,wx,h.y+h.h*.56,26,22,3);g.fillStyle='#bfe3f2';g.fill();g.stroke();line(g,wx+13,h.y+h.h*.56,wx+13,h.y+h.h*.56+22,OUT,1);rr(g,wx-3,h.y+h.h*.56+20,32,5,2);g.fillStyle='#c4573a';g.fill();for(let k=0;k<4;k++)circ(g,wx+3+k*7,h.y+h.h*.56+19,2.6,k%2?'#f6c445':'#e2483d');}
  rr(g,h.x+h.w-44,h.y+6,14,26,2);g.fillStyle='#9a5b3a';g.fill();g.stroke();
  const sm=(T0*.6)%1;g.globalAlpha=.6*(1-sm);circ(g,h.x+h.w-37+sm*8,h.y-sm*30,6+sm*6,'#fff');g.globalAlpha=1;
  g.restore();}
function drawBarn(g){const b=BARN;g.save();ell(g,b.x+b.w/2,b.y+b.h+4,b.w/2+8,8,'rgba(30,50,15,.25)');
  g.beginPath();g.moveTo(b.x,b.y+b.h*.38);g.lineTo(b.x+b.w*.2,b.y+b.h*.12);g.lineTo(b.x+b.w/2,b.y);g.lineTo(b.x+b.w*.8,b.y+b.h*.12);g.lineTo(b.x+b.w,b.y+b.h*.38);g.lineTo(b.x+b.w,b.y+b.h);g.lineTo(b.x,b.y+b.h);g.closePath();
  g.fillStyle='#d98a3a';g.fill();g.strokeStyle=OUT;g.lineWidth=1.8;g.stroke();
  for(let i=1;i<9;i++)line(g,b.x+i*b.w/9,b.y+b.h*.3,b.x+i*b.w/9,b.y+b.h,'rgba(122,79,42,.35)',1.4);
  g.beginPath();g.moveTo(b.x-6,b.y+b.h*.4);g.lineTo(b.x+b.w*.2,b.y+b.h*.12);g.lineTo(b.x+b.w/2,b.y-4);g.lineTo(b.x+b.w*.8,b.y+b.h*.12);g.lineTo(b.x+b.w+6,b.y+b.h*.4);g.strokeStyle='#5a3a1f';g.lineWidth=7;g.lineJoin='round';g.stroke();
  const dx=b.x+b.w/2-34,dy=b.y+b.h-68;rr(g,dx,dy,68,68,2);g.fillStyle='#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1.6;g.stroke();rr(g,dx+5,dy+5,58,58,1);g.fillStyle='#c4573a';g.fill();
  line(g,dx+5,dy+5,dx+63,dy+63,'#fff7e3',5);line(g,dx+63,dy+5,dx+5,dy+63,'#fff7e3',5);
  circ(g,b.x+b.w/2,b.y+b.h*.27,13,'#fff7e3',OUT,1.4);circ(g,b.x+b.w/2,b.y+b.h*.27,9,'#5a3a1f');
  // sign
  rr(g,b.x+12,b.y+b.h-30,58,20,4);g.fillStyle='#fff7e3';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();g.fillStyle='#3b2a1a';g.font='700 12px Fredoka, sans-serif';g.textAlign='center';g.fillText('CELEIRO',b.x+41,b.y+b.h-16);
  // hay
  ell(g,b.x+b.w-22,b.y+b.h-6,18,10,'#e8c46a',OUT,1.2);line(g,b.x+b.w-34,b.y+b.h-8,b.x+b.w-10,b.y+b.h-8,'#c9a033',1);
  g.restore();}
