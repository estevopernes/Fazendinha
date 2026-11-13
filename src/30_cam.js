// ====================== CÂMERA 3D (Three.js) + camada 2D por cima ======================
const cv=$('cv'), g=cv.getContext('2d');
let DPR=1, view={w:0,h:0,sw:0,sh:0}, cam={x:0,y:0,z:1,tx:6*T,ty:9*T}, shx=0, shy=0, ZS=1;
const U=1/T, BASEH=13.5;
let R3=null;
function initThree(){
  if(R3||typeof THREE==='undefined')return;
  const gl=$('gl');
  const renderer=new THREE.WebGLRenderer({canvas:gl,antialias:true,powerPreference:'high-performance'});
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#8fd6f2');scene.fog=new THREE.Fog('#bfe6c0',38,70);
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0.1,200);
  scene.add(new THREE.HemisphereLight('#ffffff','#6fae4a',0.62));
  const sun=new THREE.DirectionalLight('#fff1d0',0.78);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  const sc=sun.shadow.camera;sc.left=-17;sc.right=17;sc.top=17;sc.bottom=-17;sc.near=1;sc.far=80;sun.shadow.bias=-0.0008;sun.shadow.radius=3;
  scene.add(sun);scene.add(sun.target);
  R3={renderer,scene,camera,sun,ray:new THREE.Raycaster(),v:new THREE.Vector3(),plane:new THREE.Plane(new THREE.Vector3(0,1,0),0)};
  build3DStatic();
}
function updCamera(){if(!R3)return;const c=R3.camera,a=view.sw/view.sh,h=BASEH/cam.z;c.left=-h*a/2;c.right=h*a/2;c.top=h/2;c.bottom=-h/2;
  const tx=cam.tx*U,tz=cam.ty*U;c.position.set(tx+16+shx*.02,18.5,tz+16+shy*.02);c.lookAt(tx,0,tz);c.updateProjectionMatrix();c.updateMatrixWorld();
  R3.sun.position.set(tx-9,22,tz-4);R3.sun.target.position.set(tx+2,0,tz+3);R3.sun.target.updateMatrixWorld();
  ZS=view.sh/h*U;}
function iso(x,y,hpx){if(!R3)return{x:0,y:0};const v=R3.v.set(x*U,(hpx||0)*U,y*U).project(R3.camera);return{x:(v.x+1)/2*view.sw,y:(1-v.y)/2*view.sh};}
function inv(px,py){if(!R3)return{x:0,y:0};const ndc=new THREE.Vector2(px/view.sw*2-1,-(py/view.sh)*2+1);R3.ray.setFromCamera(ndc,R3.camera);const p=new THREE.Vector3();R3.ray.ray.intersectPlane(R3.plane,p);return{x:p.x*T,y:p.z*T};}
function resize(){DPR=Math.min(window.devicePixelRatio||1,2.5);const w=innerWidth,h=innerHeight;cv.width=w*DPR;cv.height=h*DPR;
  const first=!view.sw;view.sw=w;view.sh=h;view.w=w;view.h=h;
  if(first)cam.z=clamp(w/h*1.25+0.35,.75,1.6);
  if(R3){R3.renderer.setPixelRatio(Math.min(DPR,2));R3.renderer.setSize(w,h,false);}
  clampCam();}
function setZoom(z,sx,sy){const a=inv(sx,sy);cam.z=clamp(z,.55,2.6);updCamera();const b=inv(sx,sy);cam.tx+=a.x-b.x;cam.ty+=a.y-b.y;clampCam();}
function clampCam(){cam.tx=clamp(cam.tx,1*T,(COLS-1)*T);cam.ty=clamp(cam.ty,3*T,(ROWS-1)*T);cam.x=0;cam.y=0;updCamera();}
function centerOn(wx,wy){cam.tx=wx;cam.ty=wy;clampCam();}
function panTo(drag,px,py){cam.tx=drag.cx;cam.ty=drag.cy;updCamera();const a=inv(drag.sx,drag.sy),b=inv(px,py);cam.tx=drag.cx+(a.x-b.x);cam.ty=drag.cy+(a.y-b.y);clampCam();}
