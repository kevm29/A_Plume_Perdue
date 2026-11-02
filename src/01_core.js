'use strict';
/* =========================================================
   À PLUME PERDUE — noyau : constantes, utilitaires, sauvegarde
   ========================================================= */
const W=960,H=540,T=40,DX=10,DY=-8,PAD=24;
let ROWS=15; // hauteur du niveau en cases (15 par défaut, plus pour les niveaux d'escalade)
const PF_FAR=0.3,PF_MID=0.6;
const F_DISP='"IM Fell English SC", "Iowan Old Style", Georgia, serif';
const F_BODY='"IM Fell English", "Iowan Old Style", Georgia, serif';
const F_HAND='"La Belle Aurore", "Segoe Script", "Bradley Hand", cursive';
const cv=document.getElementById('c');
const ctx=cv.getContext('2d');
let dpr=1,scale=1,offX=0,offY=0,RS=1;

function resize(){
  const w=innerWidth,h=innerHeight;
  // résolution interne plafonnée (≈ 2× la taille logique) : au-delà, le jeu rame sans gain visible
  {const sc=Math.min(w/W,h/H);dpr=Math.min(window.devicePixelRatio||1,2,Math.max(1,1920/(W*sc)))}
  cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
  cv.style.width=w+'px';cv.style.height=h+'px';
  scale=Math.min(w/W,h/H);offX=(w-W*scale)/2;offY=(h-H*scale)/2;
}
addEventListener('resize',resize);resize();

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=Math.random;
function hexRgb(h){const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]}
function shade(h,a){let[r,g,b]=hexRgb(h);if(a<0){r*=1+a;g*=1+a;b*=1+a}else{r+=(255-r)*a;g+=(255-g)*a;b+=(255-b)*a}return`rgb(${r|0},${g|0},${b|0})`}
function rgba(h,a){const[r,g,b]=hexRgb(h);return`rgba(${r},${g},${b},${a})`}
function mix(a,b,t){const A=hexRgb(a),B=hexRgb(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c}
/* grands calques (décor, tuiles) découpés en bandes de 2048 px : au-delà, la carte graphique
   ne sait plus les garder en mémoire et le navigateur repasse en dessin lent.
   Le dessin est envoyé à toutes les bandes à la fois, chacune décalée de sa position. */
const LAYER_CHUNK=2048;
function multiCtx(cs){const one=new Set(['createLinearGradient','createRadialGradient','createPattern','measureText','getImageData','isPointInPath']);
  return new Proxy({},{get(_,k){const v=cs[0][k];if(typeof v!=='function')return v;if(one.has(k))return(...a)=>cs[0][k](...a);return(...a)=>{let r;for(const c of cs)r=c[k](...a);return r}},set(_,k,v){for(const c of cs)c[k]=v;return true}})}
function mkLayer(w,h){w=Math.ceil(w);h=Math.ceil(h);const chunks=[];for(let x=0;x<w;x+=LAYER_CHUNK){const c=mk(Math.min(LAYER_CHUNK+2,w-x),h),g=c.getContext('2d');g.translate(-x,0);chunks.push({x,c,g})}
  return{layer:{width:w,height:h,chunks},g:multiCtx(chunks.map(k=>k.g))}}
/* copie d'une portion d'un calque découpé (coordonnées source en pixels du calque) */
function blitLayer(ctx,L2,sx,sy,sw,sh,dx,dy,dw,dh){const kx=dw/sw,ky=dh/sh;
  for(const ch of L2.chunks){const a=Math.max(sx,ch.x),b=Math.min(sx+sw,ch.x+ch.c.width);if(b<=a)continue;
    ctx.drawImage(ch.c,a-ch.x,sy,b-a,sh,dx+(a-sx)*kx,dy,(b-a)*kx,dh)}}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function poly(g,pts){g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath()}
function wrap(g,text,maxW){const out=[];for(const para of text.split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t}out.push(line)}return out}
function pick(a){return a[Math.floor(rnd()*a.length)]}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}

function makeNoise(size,alpha,seed,fibers){
  const c=mk(size,size),g=c.getContext('2d'),id=g.createImageData(size,size),R=mulberry(seed);
  for(let i=0;i<id.data.length;i+=4){const v=R()*255|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=R()*alpha|0}
  g.putImageData(id,0,0);
  if(fibers){g.lineWidth=.6;for(let i=0;i<fibers;i++){g.strokeStyle=R()<.5?'rgba(0,0,0,.10)':'rgba(255,255,255,.10)';g.beginPath();const x=R()*size,y=R()*size;g.moveTo(x,y);g.quadraticCurveTo(x+(R()-.5)*14,y+(R()-.5)*14,x+(R()-.5)*26,y+(R()-.5)*26);g.stroke()}}
  return c;
}
const grainC=makeNoise(256,30,7,0);
const paperC=makeNoise(160,40,3,50);
let grainPat=null;

/* ---------- sauvegarde ---------- */
const SAVE_KEY='a-plume-perdue-v2';
const START_LIVES=0,MAX_WEAR=4;
let S={unlocked:0,best:{},muted:false,infinite:false,finished:false,run:{lives:START_LIVES,worldLives:[START_LIVES],medals:{}}};
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s){S=Object.assign(S,s);S.run=Object.assign({lives:START_LIVES,worldLives:[START_LIVES],medals:{}},S.run||{})}}catch(e){}
if(S.v!==5){S.v=5;S.run={lives:START_LIVES,worldLives:[START_LIVES],medals:{},wear:0,stats:{},got:{}};try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
S.run.wear=Math.min(MAX_WEAR,S.run.wear||0);if(!S.run.stats)S.run.stats={};
/* points : chaque niveau vaut 1000 points.
   600 pour toute la paille (700 s'il n'y a pas de médaille dans le niveau), 100 la médaille, 100 la cachette,
   200 sans accroc (50 de moins par accroc) */
const LEVEL_MAX=1000;
/* le score d'un niveau, c'est ce qu'on y a trouvé : 10 points par paille, par médaille et par cachette */
function levelPoints(o){return 10*((o.corn||0)+(o.medal?1:0)+(o.secFound||0))}
function levelMax(o){return 10*((o.cornTotal||0)+(o.hasMedal?1:0)+(o.secTotal||0))}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
