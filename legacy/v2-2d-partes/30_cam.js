// ====================== CANVAS / CAMERA ======================
const cv=$('cv'), g=cv.getContext('2d');
let DPR=1, view={w:0,h:0}, cam={x:0,y:0,z:1};
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);const w=innerWidth,h=innerHeight;cv.width=w*DPR;cv.height=h*DPR;
  const firstZ=!view.w;view.sw=w;view.sh=h;
  if(firstZ){cam.z=clamp(w/(8.2*T),.62,1.25);}
  view.w=w/cam.z;view.h=h/cam.z;clampCam();}
function setZoom(z,sx,sy){const wx=cam.x+sx/cam.z,wy=cam.y+sy/cam.z;cam.z=clamp(z,.5,1.8);view.w=view.sw/cam.z;view.h=view.sh/cam.z;cam.x=wx-sx/cam.z;cam.y=wy-sy/cam.z;clampCam();}
function clampCam(){const m=60;cam.x=view.w>W+2*m?(W-view.w)/2:clamp(cam.x,-m,W-view.w+m);cam.y=view.h>H+2*m?(H-view.h)/2:clamp(cam.y,-m-70,H-view.h+m+70);}

