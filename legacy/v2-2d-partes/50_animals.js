// ====================== DRAWING: ANIMALS ======================
function legs4(g,xs,top,len,walk,ph,color,w){xs.forEach((lx,i)=>{const sw=walk?Math.sin(ph*9+(i%2?Math.PI:0))*4:0;line(g,lx,top,lx+sw,top+len,OUT,w+1.6);line(g,lx,top,lx+sw,top+len,color,w);circ(g,lx+sw,top+len,w*.55,'#3b2a1a');});}
function drawAnimal(g,a,t){
  const walk=a.state==='walk', head=a.state==='eat'||a.state==='drink'||a.state==='graze'||a.state==='peck';
  const ph=a.phase;const TY=bt(a),SK=(ANIMALS[a.type]||{}).skin;
  const PB=SK==='white'?'#f4f1ea':'#2a6fc9',PB2=SK==='white'?'#ffffff':'#3e86d8',PT1=SK==='white'?'#e6dfd0':'#2f8f6a',PT2=SK==='white'?'#f7f3ea':'#3aa57a';
  g.save();g.translate(a.x,a.y);
  ell(g,0,1,TY==='galinha'?9:TY==='pavao'?12:18,TY==='galinha'?3:5,'rgba(30,50,15,.22)');
  g.scale(a.dir,1);
  const bob=walk?Math.abs(Math.sin(ph*9))*1.2:0;
  if(TY==='galinha'){
    const body=SK==='gold'?'#f2c94c':a.v?'#c87a3a':'#fffdf6',wing=SK==='gold'?'#d9a520':a.v?'#a85f28':'#efe5cf';
    line(g,-3,-5,-3+(walk?Math.sin(ph*14)*3:0),0,'#e08a2a',1.8);line(g,2,-5,2-(walk?Math.sin(ph*14)*3:0),0,'#e08a2a',1.8);
    g.translate(0,-bob);
    g.beginPath();g.moveTo(-7,-11);g.lineTo(-13,-19);g.lineTo(-11,-9);g.closePath();g.fillStyle=a.v?'#5a3a1a':'#f2ede0';g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();
    ell(g,0,-10,8.5,6.5,body,OUT,1.2);ell(g,-1.5,-10,4.5,3,wing,OUT,.6);
    let hx=6,hy=-16;if(head){const b=Math.sin(t*16+a.phase)>0;hx=9;hy=b?-4:-8;}
    line(g,4,-13,hx-1,hy+2,body,5);
    circ(g,hx,hy,4,body,OUT,1);
    circ(g,hx-1.5,hy-4,2,'#d9483d');circ(g,hx+1.2,hy-4.6,1.8,'#d9483d');ell(g,hx+2.2,hy+3,1.3,2,'#d9483d');
    g.beginPath();g.moveTo(hx+3.3,hy-1.3);g.lineTo(hx+7.2,hy);g.lineTo(hx+3.3,hy+1.3);g.closePath();g.fillStyle='#f0a030';g.fill();
    circ(g,hx+1.4,hy-1,1,'#1d140c');
  }else if(TY==='vaca'){
    legs4(g,[-12,-6,8,13],-13,13,walk,ph,'#fbf7ee',3.4);
    g.translate(0,-bob);
    g.beginPath();g.moveTo(-17,-26);g.quadraticCurveTo(-23,-18,-20,-11);g.strokeStyle=OUT;g.lineWidth=1.6;g.stroke();circ(g,-20,-11,2.2,'#3b2a1a');
    rr(g,-18,-31,34,20,9);g.fillStyle='#fbf7ee';g.fill();g.strokeStyle=OUT;g.lineWidth=1.4;g.stroke();
    g.save();rr(g,-18,-31,34,20,9);g.clip();ell(g,-8,-25,7,5,'#3b2a1a');ell(g,7,-17,6,4,'#3b2a1a');ell(g,-13,-14,4,3,'#3b2a1a');g.restore();
    ell(g,3,-11,5,2.6,'#f3a7a7',OUT,.8);
    const hx=head?21:19,hy=head?-9:-30;
    g.beginPath();g.moveTo(11,-30);g.lineTo(hx-3,hy-5);g.lineTo(hx-3,hy+5);g.lineTo(13,-16);g.closePath();g.fillStyle='#fbf7ee';g.fill();
    rr(g,hx-6,hy-7,13,14,5);g.fillStyle='#fbf7ee';g.fill();g.strokeStyle=OUT;g.lineWidth=1.3;g.stroke();
    const chew=head?Math.sin(t*10)*1:0;
    ell(g,hx+3,hy+5+chew,6,4.3,'#f3b8a8',OUT,1);circ(g,hx+1.5,hy+5+chew,.9,'#7a3a2a');circ(g,hx+5,hy+5+chew,.9,'#7a3a2a');
    circ(g,hx+3,hy-2,1.3,'#1d140c');
    ell(g,hx-7,hy-4,4,2,'#8a5a33',OUT,.8);
    line(g,hx-2,hy-7,hx-4,hy-12,'#efe0b8',2.4);line(g,hx+3,hy-7,hx+5,hy-12,'#efe0b8',2.4);
    if(!head){circ(g,hx-5,hy+9,2.6,'#f6c445',OUT,.8);}
  }else if(TY==='ovelha'){
    legs4(g,[-9,-4,6,10],-11,11,walk,ph,'#4a3b33',2.6);
    g.translate(0,-bob);
    const f=1+(a.ready?.12:a.prod*.08);
    const puffs=[[-11,-18],[-5,-23],[3,-23],[9,-19],[-8,-13],[1,-12],[8,-13],[-1,-18]];
    for(const[dx,dy]of puffs)circ(g,dx*f,dy*f+ (f-1)*6,7*f,(SK==='black'?'#4a4242':'#f7f1e1'),OUT,1.1);
    for(const[dx,dy]of puffs)circ(g,dx*f,dy*f+(f-1)*6,6*f,SK==='black'?'#4a4242':'#f7f1e1');
    const hx=head?16:14,hy=head?-7:-20;
    ell(g,hx,hy,6,5,'#4a3b33',OUT,1);ell(g,hx-4,hy-1,3.5,1.6,'#3a2d26');circ(g,hx-1,hy-5,3.2,'#f7f1e1');circ(g,hx+2,hy-1,1,'#fff');
  }else if(TY==='cabra'){
    legs4(g,[-9,-4,6,10],-14,14,walk,ph,'#cdbb9a',2.4);
    g.translate(0,-bob);
    line(g,-13,-22,-16,-29,OUT,3);line(g,-13,-22,-16,-29,'#bfa883',2);
    ell(g,0,-20,14,8,'#d8c7aa',OUT,1.3);ell(g,2,-17,8,3,'#c9b590');
    const hx=head?17:16,hy=head?-8:-30;
    g.beginPath();g.moveTo(9,-24);g.lineTo(hx-3,hy-3);g.lineTo(hx-1,hy+4);g.lineTo(11,-15);g.closePath();g.fillStyle='#d8c7aa';g.fill();
    ell(g,hx,hy,6.5,5,'#d8c7aa',OUT,1.2);
    g.beginPath();g.moveTo(hx+2,hy+3);g.lineTo(hx+5,hy+3);g.lineTo(hx+3,hy+10);g.closePath();g.fillStyle='#f4efe4';g.fill();
    g.beginPath();g.moveTo(hx-1,hy-4);g.quadraticCurveTo(hx-8,hy-12,hx-11,hy-5);g.strokeStyle='#6b5a44';g.lineWidth=2.4;g.stroke();
    ell(g,hx-5,hy,4,1.8,'#c9b590',OUT,.7);circ(g,hx+2,hy-1,1.1,'#1d140c');
  }else if(TY==='pavao'){
    const disp=a.state==='display';
    line(g,-2,-8,-2+(walk?Math.sin(ph*12)*2.5:0),0,'#8a7a5a',1.6);line(g,3,-8,3-(walk?Math.sin(ph*12)*2.5:0),0,'#8a7a5a',1.6);
    g.translate(0,-bob);
    if(disp){const open=Math.min(1,(a.dispT||0)/0.6);const R=30*open;g.save();g.translate(-4,-14);
      for(let i=0;i<13;i++){const an=Math.PI+i/12*Math.PI;g.beginPath();g.moveTo(0,0);g.arc(0,0,R,an-.14,an+.14);g.closePath();g.fillStyle=i%2?PT1:PT2;g.fill();}
      for(let i=0;i<13;i++){const an=Math.PI+i/12*Math.PI;const ex=Math.cos(an)*R*.82,ey=Math.sin(an)*R*.82;ell(g,ex,ey,3.6*open,4.4*open,'#e2b43a');ell(g,ex,ey,2.4*open,3*open,PB);circ(g,ex,ey,1.2*open,'#173a6a');}
      for(let i=0;i<9;i++){const an=Math.PI+(i+.5)/9*Math.PI;circ(g,Math.cos(an)*R*.5,Math.sin(an)*R*.5,1.8*open,'#e2b43a');}
      g.restore();}
    else{g.beginPath();g.moveTo(-5,-12);g.quadraticCurveTo(-22,-12,-32,-4);g.lineTo(-30,-1);g.quadraticCurveTo(-18,-6,-5,-6);g.closePath();g.fillStyle=PT1;g.fill();g.strokeStyle=OUT;g.lineWidth=1;g.stroke();for(let i=0;i<3;i++){circ(g,-14-i*6,-8+i*1.5,2,'#e2b43a');circ(g,-14-i*6,-8+i*1.5,1.1,PB);}}
    ell(g,0,-12,7,8,PB,OUT,1.2);ell(g,-2,-11,4,5,PB2);
    let hx=5,hy=-27;if(head){hx=9;hy=Math.sin(t*14)>0?-6:-10;}
    g.beginPath();g.moveTo(2,-17);g.quadraticCurveTo(hx-2,(hy-17)/2,hx-1,hy+2);g.strokeStyle=PB;g.lineWidth=4.4;g.stroke();
    circ(g,hx,hy,3.6,PB,OUT,1);ell(g,hx+.6,hy-.5,1.6,1,'#fff');circ(g,hx+1,hy-.6,.7,'#1d140c');
    g.beginPath();g.moveTo(hx+3,hy-.8);g.lineTo(hx+6,hy+.2);g.lineTo(hx+3,hy+1.2);g.closePath();g.fillStyle='#d9c27a';g.fill();
    for(let i=-1;i<=1;i++){line(g,hx,hy-3,hx+i*2.4,hy-8,PB,.8);circ(g,hx+i*2.4,hy-8.5,1.1,PT1);}
  }
  g.restore();
}
function drawDog(g,d,t,icon){
  const walk=d.state==='walk'||d.state==='chase'||d.state==='return', sit=d.state==='sleep';
  const ph=d.phase;
  g.save();g.translate(d.x,d.y);
  if(!icon)ell(g,0,1,15,4.5,'rgba(30,50,15,.22)');
  g.scale(d.dir,1);
  if(sit){ // sleeping curled
    ell(g,0,-7,15,8,'#b8743a',OUT,1.3);circ(g,11,-8,6,'#b8743a',OUT,1.2);ell(g,13,-12,3.2,5,'#7a4a22');line(g,8,-9,12,-9,OUT,1);
    g.fillStyle='#3b2a1a';g.font='bold 11px Fredoka, sans-serif';const zz=(t*1.2)%1;g.globalAlpha=1-zz;g.fillText('z',14+zz*6,-18-zz*10);g.globalAlpha=1;g.restore();return;}
  legs4(g,[-9,-5,6,10],-10,10,walk,ph*(d.state==='chase'?1.6:1),'#a8662f',3);
  const bob=walk?Math.abs(Math.sin(ph*9))*1.4:0;g.translate(0,-bob);
  const wag=Math.sin(t*(d.state==='chase'?26:16))*.6;
  g.save();g.translate(-13,-15);g.rotate(-.8+wag);line(g,0,0,0,-11,OUT,4.6);line(g,0,0,0,-11,'#b8743a',3);g.restore();
  ell(g,0,-14,14,7.5,'#b8743a',OUT,1.3);ell(g,4,-11,6,3.6,'#e9c08e');
  const angry=d.state==='chase'||d.state==='bite';
  const hx=14,hy=angry?-17:-21;
  circ(g,hx,hy,7,'#b8743a',OUT,1.2);
  ell(g,hx+6,hy+2,4.6,3.4,'#e9c08e',OUT,1);circ(g,hx+10,hy+.6,1.7,'#1d140c');
  if(angry){g.beginPath();g.moveTo(hx+3,hy+4);g.lineTo(hx+10,hy+5);g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();line(g,hx-1,hy-5,hx+4,hy-3,OUT,1.4);}
  circ(g,hx+2,hy-2,1.3,'#1d140c');
  g.beginPath();g.ellipse(hx-4,hy+1,3,6.4,angry?-.9:.25,0,Math.PI*2);g.fillStyle='#7a4a22';g.fill();g.strokeStyle=OUT;g.lineWidth=.8;g.stroke();
  rr(g,hx-6,hy+5,7,3,1.5);g.fillStyle='#d9483d';g.fill();circ(g,hx-2.5,hy+9,1.7,'#f6c445');
  g.restore();
}
function drawPerson(g,v,t){
  const walk=v.state==='walk'||v.state==='flee'||v.state==='enter'||v.state==='leave';
  g.save();g.translate(v.x,v.y);ell(g,0,1,10,3.5,'rgba(30,50,15,.25)');
  if(v.dir<0)g.scale(-1,1);
  const sp=v.state==='flee'?22:12, sw=walk?Math.sin(t*sp)*4:0;
  line(g,-3,-10,-3+sw,0,'#2f4d7a',3.2);line(g,3,-10,3-sw,0,'#2f4d7a',3.2);
  rr(g,-7,-24,14,15,5);g.fillStyle=v.color;g.fill();g.strokeStyle=OUT;g.lineWidth=1.2;g.stroke();
  const arm=v.state==='act'?Math.sin(t*14)*5:(walk?-sw:0);
  line(g,6,-21,10,-14+arm,'#f2c79a',3);line(g,-6,-21,-10,-14-arm,'#f2c79a',3);
  if(v.sack){ell(g,-11,-14,6,7,'#b9824a',OUT,1);}
  circ(g,0,-30,6.4,v.skin||'#e8b48a',OUT,1.1);circ(g,2.6,-30.5,.9,'#1d140c');
  if(v.state==='flee'){ell(g,2,-26,2,1.6,'#7a2a2a');}
  ell(g,0,-35,10,2.6,'#e8c46a',OUT,1);rr(g,-5,-41,10,6,3);g.fillStyle='#e8c46a';g.fill();g.stroke();
  g.restore();
  // name tag
  g.save();g.font='800 11px Nunito, sans-serif';const tw=g.measureText('@'+v.handle).width+10;rr(g,v.x-tw/2,v.y-60,tw,16,8);g.fillStyle='rgba(255,247,227,.95)';g.fill();g.strokeStyle=v.color;g.lineWidth=1.5;g.stroke();g.fillStyle='#3b2a1a';g.textAlign='center';g.fillText('@'+v.handle,v.x,v.y-48);g.restore();
}

