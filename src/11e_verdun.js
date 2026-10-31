/* =========================================================
   VERDUN, NOVEMBRE 2026 — champs, chasseurs, bois, terrain miné,
   tranchée d'époque et monument aux enfants de Verdun
   ---------------------------------------------------------
   1 chasseur caché dans un buisson   2 petit panneau DANGER (on s'y pose)
   3 pied d'arbre (tronc jusqu'à sa plus haute branche « = »)
   4 rat                              6 monument aux enfants de Verdun
   7 panneau d'entrée de commune      8 panneau CHASSE EN COURS
   Segments : {z:'field'|'wood'|'mines'|'trench'|'monument', s:`…`}
   ========================================================= */
function zoneOfL(Lv,c){for(const z of Lv.zones||[])if(c>=z.c0&&c<=z.c1)return z.z;return null}
function thAtCol(Lv,c){const zt=Lv.def.zoneTh;if(!zt)return Lv.th;const z=zoneOfL(Lv,c);if(!z||!zt[z])return Lv.th;Lv._thz=Lv._thz||{};return Lv._thz[z]||(Lv._thz[z]=Object.assign({},Lv.th,zt[z]))}
function verdunParse(Lv,ch,c,r,x,y,cx,cy){
  let fr=r+1;while(fr<Lv.g.length&&!'#XW'.includes(Lv.g[fr][c]))fr++;
  switch(ch){
    case'1':Lv.hunters.push({x:cx,y:y+T,state:'hid',t:c*.37,aimT:0,cool:0,peek:0,ang:-Math.PI/2,flash:0,tgt:null,rust:0});Lv.avoid.push(cx-80,cx-40,cx,cx+40,cx+80);return true;
    case'2':Lv.decor.push({t:'danger',x:cx,y,floor:fr*T});Lv.g[r][c]='t';Lv.avoid.push(cx);return false;
    case'3':Lv.decor.push({t:'tree',x:cx,c,r,floor:y+T});Lv.avoid.push(cx);return true;
    case'4':Lv.rats.push({kind:'rat',x:cx-15,y:y+T-16,w:30,h:16,vx:95,vy:0,onGround:false,t:(c*.37)%9,sq:1+(c%3)});if(Lv.g[r][c-1]==='f'||Lv.g[r][c+1]==='f'){Lv.g[r][c]='f';return false}return true;
    case'6':Lv.decor.push({t:'monument',x:cx,y:y+T});for(let k=-6;k<=6;k++)Lv.avoid.push(cx+k*50);return true;
    case'7':Lv.decor.push({t:'commune',x:cx,y:y+T,name:Lv.def.communeName||'VERDUN'});Lv.avoid.push(cx-60,cx,cx+60);return true;
    case'8':Lv.decor.push({t:'chasse',x:cx,y:y+T});Lv.avoid.push(cx);return true;
  }
  return true;
}
function verdunPost(Lv){
  for(const [c,r] of Lv.def.marks||[])Lv.mark.add(c+','+r);
  for(const [c,r] of Lv.def.frontLeaves||[])Lv.decorFront.push({t:'leaves',x:c*T+T/2,y:r*T+T/2+6});
  Lv.fallen=[];
}
/* ---------- les chasseurs ---------- */
const HUNT_RANGE=380,HUNT_AIM=.45,HUNT_COOL=1.3;
function hunterFlying(){return !P.dead&&!P.onGround&&(P.flaps>0||P.gliding)}
function inHuntCone(h,x,y){const gx=h.x,gy=h.y-80,dx=x-gx,dy=y-gy;return dy<-8&&Math.abs(dx)<=-dy&&Math.hypot(dx,dy)<HUNT_RANGE}
function hunterStep(dt){
  if(!L.hunters||!L.hunters.length)return;
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  for(const h of L.hunters){
    h.t+=dt;h.flash=Math.max(0,h.flash-dt*5);
    const pIn=!G.cut&&hunterFlying()&&inHuntCone(h,pcx,pcy);
    // il entend Raymond approcher : le buisson frémit (avertissement honnête)
    h.rust=Math.max(0,h.rust-dt);if(Math.abs(pcx-h.x)<220&&!P.dead&&!P.onGround&&h.state==='hid')h.rust=.4;
    if(h.state==='hid'){
      h.peek=Math.max(0,h.peek-dt*3);
      if(pIn){h.state='aim';h.aimT=0;h.tgt='P';if(!G.sim){tone(1300,.04,'square',.04);tone(900,.05,'square',.03,null,.07)}}
      else{for(const m of L.moths)if(m.kind==='crow'&&!m.gone&&inHuntCone(h,m.x,m.y)){h.state='aim';h.aimT=0;h.tgt=m;break}}
    }else if(h.state==='aim'){
      h.peek=Math.min(1,h.peek+dt*6);h.aimT+=dt;
      const tx=h.tgt==='P'?pcx:h.tgt.x,ty=h.tgt==='P'?pcy:h.tgt.y;const want=Math.atan2(ty-(h.y-80),tx-h.x);h.ang+=(want-h.ang)*Math.min(1,dt*12);
      const still=h.tgt==='P'?pIn:(!h.tgt.gone&&inHuntCone(h,h.tgt.x,h.tgt.y));
      if(!still&&h.aimT>.15){h.state='cool';h.aimT=0;h.cool=.5}
      else if(h.aimT>=HUNT_AIM){
        h.state='cool';h.cool=HUNT_COOL;h.flash=1;h.shotTo={x:tx,y:ty};
        if(!G.sim){noise(.16,2200,.7,'lowpass');noise(.6,380,.45,'lowpass',.02);G.shake=Math.max(G.shake||0,4)}
        if(h.tgt==='P'){if(pIn)G.hunterHit=true}
        else{const m=h.tgt;m.gone=true;L.fallen.push({x:m.x,y:m.y,vy:-60,vx:(m.x-h.x)*.4,rot:0,t:0});if(!G.sim){for(let k=0;k<8;k++)parts.push({type:'dust',x:m.x,y:m.y,vx:(rnd()-.5)*160,vy:(rnd()-.5)*160,life:0,max:.6})}
          if(!G.sim&&!G.huntSaid){G.huntSaid=true;say("Abattu en plein vol. Lui, il volait. Moi, je marcherai.",3)}}
      }
    }else{
      h.cool-=dt;h.peek=Math.max(0,h.peek-dt*1.2);if(h.cool<=0)h.state='hid';
    }
  }
  if(L.moths.some(m=>m.gone))L.moths=L.moths.filter(m=>!m.gone);
  for(const f of L.fallen){f.t+=dt;f.vy+=GRAV*.6*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.rot+=dt*5}
  L.fallen=L.fallen.filter(f=>f.t<2.5&&f.y<ROWS*T+60);
}
function verdunRespawn(){for(const h of L.hunters||[]){h.state='hid';h.peek=0;h.cool=0;h.flash=0}G.hunterHit=false}
/* buissons (devant le décor, derrière Raymond) */
function drawBush(g,x,b,s,seed,rust){
  const sh=rust?Math.sin(G.lt*40)*2:0;
  const cols=['#3f6a26','#4f7a2e','#5f8f36','#47722a','#6a9a3c'];
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x,b-2,46*s,7,0,0,7);g.fill();
  for(let k=0;k<11;k++){const a=k/11*Math.PI,rx=Math.cos(a)*36*s,ry=-Math.sin(a)*30*s;g.fillStyle=cols[(k+seed)%5];g.beginPath();g.arc(x+rx+(k%2?sh:-sh),b-14*s+ry,(16+((k*7+seed)%6))*s,0,7);g.fill()}
  g.fillStyle='#5a8a32';g.beginPath();g.arc(x+sh,b-34*s,20*s,0,7);g.fill();
  // quelques feuilles qui jaunissent
  for(let k=0;k<6;k++){g.fillStyle=k%2?'#c9a83a':'#b88a2a';g.beginPath();g.arc(x-30*s+((k*23+seed*7)%60)*s,b-40*s+((k*13+seed)%34)*s,3.2,0,7);g.fill()}
  g.fillStyle='rgba(255,250,210,.16)';g.beginPath();g.arc(x-12*s,b-44*s,14*s,0,7);g.fill();
}
function inHiddenDugout(c){const dg=L.def.dugout;if(!dg||(L.dugA||0)>.5)return false;const x=c.x+c.w/2,y=c.y+c.h/2;return x>dg[0]*T&&x<(dg[1]+1)*T&&y>13*T&&y<15*T}
function drawDugout(t){
  const dg=L.def.dugout;if(!dg)return;const x0=dg[0]*T,x1=(dg[1]+1)*T,y0=13*T,y1=15*T,pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  const inside=pcx>x0&&pcx<x1-T*.6&&pcy>y0&&pcy<y1;L.dugA=clamp((L.dugA||0)+(inside?3:-3)*(1/60),0,1);if(L.dugA<=0)return;
  ctx.save();ctx.globalAlpha=L.dugA;
  ctx.fillStyle='#2a1e14';ctx.fillRect(x0,y0,x1-x0,y1-y0);
  ctx.fillStyle='#5a4228';ctx.fillRect(x0,y0,x1-x0,7);for(let x=x0+4;x<x1-10;x+=76)ctx.fillRect(x,y0,7,y1-y0);
  ctx.fillStyle='#4a3420';ctx.fillRect(x0,y1-5,x1-x0,5);
  // couchette, caisse, bougie
  ctx.fillStyle='#6a4a2c';ctx.fillRect(x0+60,y1-26,96,6);ctx.fillRect(x0+62,y1-26,5,26);ctx.fillRect(x0+148,y1-26,5,26);
  ctx.fillStyle='#5a6448';ctx.fillRect(x0+66,y1-34,82,8);
  ctx.fillStyle='#7a5a36';ctx.fillRect(x0+230,y1-24,30,24);ctx.fillStyle='#e8dcc0';ctx.fillRect(x0+243,y1-34,5,10);
  const fl=.8+Math.sin(t*11)*.1+Math.sin(t*27)*.06;ctx.fillStyle='rgba(255,200,110,'+fl+')';ctx.beginPath();ctx.ellipse(x0+245.5,y1-38,2.6,4.5,0,0,7);ctx.fill();
  const gl=ctx.createRadialGradient(x0+245,y1-38,2,x0+245,y1-38,150);gl.addColorStop(0,'rgba(255,190,100,'+(.32*fl)+')');gl.addColorStop(1,'rgba(255,190,100,0)');ctx.fillStyle=gl;ctx.fillRect(x0,y0,x1-x0,y1-y0);
  ctx.fillStyle='#4a4a3a';ctx.beginPath();ctx.ellipse(x0+330,y0+22,13,5,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(x0+330,y0+22,10,Math.PI,0);ctx.fill();
  ctx.restore();
}
function drawVerdunBack(t){
  drawDugout(t);
  for(const h of L.hunters||[]){if(h.x<cam.x-160||h.x>cam.x+W+160)continue;
    // le chasseur, accroupi derrière les feuilles ; il se relève pour viser
    const up=h.peek*58,hx=h.x+6,hy=h.y-62-up;
    ctx.save();ctx.translate(hx,hy);ctx.scale(1.5,1.5);
    ctx.fillStyle='#4a5a30';ctx.fillRect(-11,10,22,30);
    ctx.fillStyle='#f06a1a';ctx.fillRect(-11,12,22,9);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-11,17,22,1.5);
    ctx.fillStyle='#d9b08a';ctx.beginPath();ctx.arc(0,3,7,0,7);ctx.fill();ctx.fillStyle='#2a2018';ctx.fillRect(1,1,2,2);
    ctx.fillStyle='#f06a1a';ctx.beginPath();ctx.arc(0,-1,7.5,Math.PI,0);ctx.fill();ctx.fillRect(-1,-3,12,3);
    ctx.restore();
    drawBush(ctx,h.x,h.y,1.7,Math.floor(h.x/40)%5,h.rust>0||h.state==='aim');
    // un bout de casquette orange reste visible : on devine qu'il y a quelqu'un
    if(h.peek<.3){ctx.fillStyle='rgba(240,106,26,.9)';ctx.beginPath();ctx.arc(h.x+8,h.y-92,5,Math.PI,0);ctx.fill()}
  }
}
function drawVerdunFront(t){
  for(const h of L.hunters||[]){if(h.x<cam.x-400||h.x>cam.x+W+400)continue;
    if(h.peek>.05){const gx=h.x+8,gy=h.y-66-h.peek*30;ctx.save();ctx.translate(gx,gy);ctx.rotate(h.ang);
      ctx.fillStyle='#3a2a1a';ctx.fillRect(-20,-4,24,8);ctx.fillStyle='#2a2a2e';ctx.fillRect(4,-3,46*h.peek,2.6);ctx.fillRect(4,.6,46*h.peek,2.6);ctx.restore();
      if(h.state==='aim'&&Math.sin(t*30)>0){ctx.fillStyle='rgba(255,80,40,.7)';ctx.beginPath();ctx.arc(gx+Math.cos(h.ang)*52,gy+Math.sin(h.ang)*52,2.6,0,7);ctx.fill()}}
    if(h.flash>0&&h.shotTo){const gx=h.x+8+Math.cos(h.ang)*52,gy=h.y-96+Math.sin(h.ang)*52;ctx.save();ctx.globalAlpha=h.flash;
      ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(gx,gy,9*h.flash+3,0,7);ctx.fill();
      ctx.strokeStyle='rgba(255,230,170,.5)';ctx.lineWidth=1;for(let k=0;k<5;k++){const a=h.ang+(k-2)*.04;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+Math.cos(a)*HUNT_RANGE,gy+Math.sin(a)*HUNT_RANGE);ctx.stroke()}
      ctx.fillStyle='rgba(230,230,225,.5)';ctx.beginPath();ctx.arc(gx+Math.cos(h.ang)*10,gy+Math.sin(h.ang)*10-6*(1-h.flash),10*(1.4-h.flash),0,7);ctx.fill();ctx.restore()}
  }
  for(const f of L.fallen||[]){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rot);ctx.fillStyle='#1c1c22';ctx.beginPath();ctx.ellipse(0,0,11,6,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(-16,-8);ctx.lineTo(-6,4);ctx.fill();ctx.restore()}
  for(const d of L.decorFront||[]){if(d.x<cam.x-200||d.x>cam.x+W+200)continue;if(d.t==='leaves')drawLeafMass(ctx,d.x,d.y,1,7)}
}
function drawLeafMass(g,x,y,s,seed){
  const cols=['#3f6a26','#4f7a2e','#5f8f36','#6a9a3c','#c9a83a','#4a7a2c','#d8b04a','#5a8a32'];
  for(let k=0;k<18;k++){const a=k*2.4,rr0=(k%6)*9*s;g.fillStyle=cols[(k*3+seed)%8];g.beginPath();g.arc(x+Math.cos(a)*rr0,y+Math.sin(a)*rr0*.7,(20-(k%4)*2)*s,0,7);g.fill()}
  g.fillStyle='rgba(255,250,210,.12)';g.beginPath();g.arc(x-14*s,y-16*s,22*s,0,7);g.fill();
}
/* ---------- décors ---------- */
const SIGN_STYLES={
  wood:{bg:'#6a4a2e',fg:'#efe2c4',bd:'#4a3220',posts:'wood'},
  commune:{bg:'#f4f1ea',fg:'#1a1a1a',bd:'#c0281e',posts:'metal'},
  brown:{bg:'#7a4b2a',fg:'#f4ede0',bd:'#f4ede0',posts:'metal'},
  street:{bg:'#1f4e9a',fg:'#f4f1ea',bd:'#f4f1ea',posts:'metal1'},
  info:{bg:'#f4f1ea',fg:'#1e2a44',bd:'#1e2a44',posts:'metal'},
  road:{bg:'#1e4ea0',fg:'#f4f1ea',bd:'#f4f1ea',posts:'metal'},
  works:{bg:'#f2c12e',fg:'#1a1a1a',bd:'#1a1a1a',posts:'metal'}
};
function drawStyledSign(g,x,b,main,sub,st,lift){
  g.font='bold 13px '+F_DISP;const w1=g.measureText(main).width;g.font='italic 10px '+F_BODY;const w2=sub?g.measureText(sub).width:0;
  const w=Math.max(w1,w2)+28,h=sub?36:26,top=b-(lift||58)-h;
  if(st.posts==='wood'){g.fillStyle='#4a3424';g.fillRect(x-w/2+10,top+4,5,b-top-4);g.fillRect(x+w/2-15,top+4,5,b-top-4)}
  else if(st.posts==='metal1'){g.fillStyle='#5a5e64';g.fillRect(x-2,top+h-2,4,b-top-h+2)}
  else{g.fillStyle='#6a6e74';g.fillRect(x-w/2+12,top+h-2,4,b-top-h+2);g.fillRect(x+w/2-16,top+h-2,4,b-top-h+2)}
  g.fillStyle=st.bg;rr(g,x-w/2,top,w,h,st.posts==='wood'?2:4);g.fill();
  if(st.posts==='wood'){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x-w/2,top+h/2,w,1.5)}
  g.strokeStyle=st.bd;g.lineWidth=st===SIGN_STYLES.commune?3.5:1.6;rr(g,x-w/2+3,top+3,w-6,h-6,3);g.stroke();
  g.fillStyle=st.fg;g.textAlign='center';g.font='bold 13px '+F_DISP;g.fillText(main,x,top+(sub?16:17));
  if(sub){g.font='italic 10px '+F_BODY;g.fillText(sub,x,top+29)}
}
function drawVerdunDecor(g,d,t){
  if((d.t==='board'||d.t==='sign')&&d.text){const m=/^(wood|commune|brown|street|info|road|works):(.*)$/.exec(d.text);if(!m)return false;
    const [main,sub]=m[2].split('|');if(d.gy==null){const c=Math.floor(d.x/T);let r=Math.floor(d.y/T);while(r<L.g.length&&!'#XW='.includes(L.g[r][c]))r++;d.gy=r*T}
    drawStyledSign(g,d.x,d.gy,main,sub,SIGN_STYLES[m[1]]);return true}
  if(d.t==='commune'){drawStyledSign(g,d.x,d.y,d.name,null,SIGN_STYLES.commune,62);return true}
  if(d.t==='chasse'){const x=d.x,b=d.y;g.fillStyle='#5a4230';g.fillRect(x-3,b-74,6,74);
    g.fillStyle='#f07a1a';poly(g,[x-40,b-108,x+40,b-108,x+40,b-72,x-40,b-72]);g.fill();g.strokeStyle='#1a1a1a';g.lineWidth=2;g.strokeRect(x-37,b-105,74,30);
    g.fillStyle='#1a1a1a';g.textAlign='center';g.font='bold 12px '+F_DISP;g.fillText('CHASSE',x,b-92);g.font='bold 10px '+F_DISP;g.fillText('EN COURS',x,b-80);return true}
  if(d.t==='danger'){const x=d.x,top=d.y;
    g.fillStyle='#55585c';g.fillRect(x-2,top+18,4,d.floor-top-18);
    g.fillStyle='#f4f1ea';rr(g,x-19,top,38,20,2);g.fill();g.strokeStyle='#c0281e';g.lineWidth=2.5;rr(g,x-17,top+2,34,16,2);g.stroke();
    g.fillStyle='#c0281e';g.textAlign='center';g.font='bold 8px '+F_DISP;g.fillText('DANGER',x,top+13);
    g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x-19,top+18,38,2);return true}
  if(d.t==='tree'){drawTree(g,d,t);return true}
  if(d.t==='monument'){drawMonumentVerdun(g,d.x,d.y);return true}
  return false;
}
function treeTop(d){
  if(d.top!=null)return d.top;let top=d.r-3;d.runs=[];
  for(let r=d.r-1;r>=0;r--){const row=L.g[r];if(!row)continue;
    let c0=d.c-1,hit=false;for(let c=d.c-1;c<=d.c+1;c++)if(row[c]==='=')hit=true;if(!hit)continue;top=Math.min(top,r);
    let a=d.c,b=d.c;while(row[a-1]==='='||(a>d.c-1&&row[a]!=='='))a--;while(row[b+1]==='=')b++;
    a=d.c+1;while(a>0&&row[a-1]==='=')a--;if(row[a]!=='=')a=d.c;let e=a;while(row[e+1]==='=')e++;d.runs.push({r,a,b:e})}
  return d.top=top;
}
function drawTree(g,d,t){
  const top=treeTop(d),x=d.x,b=d.floor,ty=top*T-30,hgt=b-ty;
  // feuillage derrière chaque branche, au bout opposé au tronc
  for(const rn of d.runs){const tip=Math.abs(rn.a-d.c)>Math.abs(rn.b-d.c)?rn.a*T+10:rn.b*T+T-10;if(Math.abs(tip-x)<50)continue;drawLeafMass(g,tip,rn.r*T-6,.9,rn.r+d.c)}
  // tronc
  const gr=g.createLinearGradient(x-18,0,x+18,0);gr.addColorStop(0,'#76604a');gr.addColorStop(.4,'#5e4834');gr.addColorStop(1,'#3a2c1e');
  g.fillStyle=gr;g.beginPath();g.moveTo(x-20,b);g.quadraticCurveTo(x-12,b-14,x-12,b-30);g.quadraticCurveTo(x-9,b-hgt*.6,x-6,ty);g.lineTo(x+6,ty);g.quadraticCurveTo(x+9,b-hgt*.6,x+12,b-30);g.quadraticCurveTo(x+12,b-14,x+20,b);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=1;for(let k=0;k<Math.floor(hgt/26);k++){const yy=b-24-k*26,o=((k*7+d.c)%5)-2;g.beginPath();g.moveTo(x-5+o,yy);g.quadraticCurveTo(x-3+o,yy-10,x-4+o,yy-20);g.stroke()}
  g.fillStyle='rgba(255,240,200,.12)';g.fillRect(x-8,ty,3,hgt-30);
  // départ des branches
  g.fillStyle='#5a4432';for(const rn of d.runs){g.beginPath();g.ellipse(x,rn.r*T+6,11,8,0,0,7);g.fill()}
  // couronne
  drawLeafMass(g,x,ty-14,1.7,d.c%8);
}
/* le monument aux enfants de Verdun (1928) : cinq soldats debout devant un mur.
   De gauche à droite : cavalier, sapeur du génie, fantassin, artilleur, territorial. */
function drawMonumentVerdun(g,x,b){
  const st='#ddd8cb',st2='#c8c2b3',st3='#b3ad9e',hi='#eeebe3';
  g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x-300,b-4,600,6);
  // mur en gradins
  g.fillStyle=st2;g.fillRect(x-300,b-70,600,70);
  g.fillStyle=st;g.fillRect(x-250,b-150,500,150);g.fillRect(x-170,b-180,340,40);
  g.fillStyle=hi;g.fillRect(x-250,b-150,500,3);g.fillRect(x-170,b-180,340,3);g.fillRect(x-300,b-70,50,3);g.fillRect(x+250,b-70,50,3);
  g.fillStyle='rgba(0,0,0,.08)';for(let k=-4;k<=4;k++)g.fillRect(x+k*56,b-150,1,120);for(let r=1;r<5;r++)g.fillRect(x-250,b-150+r*30,500,1);
  // socle et marches
  g.fillStyle=st3;g.fillRect(x-200,b-26,400,26);g.fillStyle=st;g.fillRect(x-190,b-34,380,10);g.fillStyle=hi;g.fillRect(x-200,b-26,400,2);
  g.fillStyle='rgba(60,50,40,.28)';for(let r=0;r<3;r++)for(let k=0;k<14;k++)g.fillRect(x-180+k*26,b-20+r*6,18,1.4);
  // les cinq
  const xs=[-128,-64,0,64,128];
  xs.forEach((dx,i)=>drawPoilu(g,x+dx,b-34,i,st,st2,st3,hi));
}
function drawPoilu(g,x,b,kind,st,st2,st3,hi){
  const h=128;
  // capote longue
  g.fillStyle=st;g.beginPath();g.moveTo(x-17,b);g.lineTo(x-14,b-h+40);g.quadraticCurveTo(x,b-h+30,x+14,b-h+40);g.lineTo(x+18,b);g.closePath();g.fill();
  g.fillStyle=st2;g.beginPath();g.moveTo(x+4,b);g.lineTo(x+6,b-h+42);g.lineTo(x+14,b-h+40);g.lineTo(x+18,b);g.closePath();g.fill();
  g.fillStyle=st3;g.fillRect(x-17,b-8,35,8);g.fillRect(x-1,b-60,2,52);
  g.fillStyle=hi;g.fillRect(x-14,b-h+42,2,h-60);
  // bras croisés / mains sur l'arme selon le corps
  g.fillStyle=st2;g.fillRect(x-14,b-h+56,28,6);
  if(kind===2){g.fillStyle=st3;g.fillRect(x+12,b-h+20,3,h-24)}            // fantassin : fusil
  if(kind===0){g.fillStyle=st2;g.beginPath();g.moveTo(x-16,b-h+40);g.quadraticCurveTo(x-24,b-50,x-20,b-10);g.lineTo(x-14,b-20);g.closePath();g.fill()} // cavalier : manteau
  if(kind===4){g.fillStyle=st3;g.fillRect(x-14,b-h+70,28,3)}              // territorial : ceinturon
  if(kind===3){g.fillStyle=st3;g.fillRect(x-14,b-h+64,28,3);g.fillRect(x-10,b-h+64,3,30)} // artilleur : baudrier
  // tête et coiffure
  g.fillStyle=st;g.beginPath();g.arc(x,b-h+28,8,0,7);g.fill();g.fillStyle=st2;g.fillRect(x+2,b-h+24,6,10);
  if(kind===1){g.fillStyle=st;g.beginPath();g.arc(x,b-h+24,11,Math.PI,0);g.lineTo(x+12,b-h+38);g.lineTo(x-12,b-h+38);g.closePath();g.fill();g.fillStyle=st2;g.beginPath();g.arc(x,b-h+28,6,0,7);g.fill()} // sapeur : passe-montagne
  else{g.fillStyle=st;g.beginPath();g.ellipse(x,b-h+20,13,4,0,0,7);g.fill();g.beginPath();g.arc(x,b-h+19,9,Math.PI,0);g.fill();g.fillStyle=hi;g.fillRect(x-8,b-h+17,5,1.5);
    if(kind===0){g.fillStyle=st2;g.beginPath();g.moveTo(x-6,b-h+11);g.quadraticCurveTo(x+2,b-h+2,x+10,b-h+12);g.lineTo(x+8,b-h+13);g.quadraticCurveTo(x+2,b-h+6,x-4,b-h+12);g.fill()} // cimier
    else{g.fillStyle=st2;g.fillRect(x-1,b-h+8,2,4)}}
}
/* ---------- tuiles propres au thème ---------- */
function drawBranchTile(g,x,y,cc,r,mc){
  const L0=tile(cc-1,r)!=='=',R0=tile(cc+1,r)!=='=';
  const tr=L.decor.find(d=>d.t==='tree'&&Math.abs(d.c-cc)<=8&&(()=>{for(let c=Math.min(d.c,cc);c<=Math.max(d.c,cc);c++)if(tile(c,r)!=='='&&c!==d.c)return false;return true})());
  const dist=tr?Math.abs(tr.c-cc):3,th=Math.max(6,15-dist*2.2),th2=Math.max(5,15-(dist+1)*2.2);
  const away=tr?(cc>=tr.c?1:-1):1,tip=(away>0&&R0)||(away<0&&L0);
  const xa=away>0?x:x+T,xb=away>0?x+T:x;
  g.fillStyle=mc[0];g.beginPath();g.moveTo(xa,y+1);
  if(tip){g.quadraticCurveTo((xa+xb)/2,y,xb-away*2,y+4);g.lineTo(xb-away*2,y+6);g.quadraticCurveTo((xa+xb)/2,y+th*.7,xa,y+th)}
  else{g.lineTo(xb,y+1);g.lineTo(xb,y+th2);g.lineTo(xa,y+th)}
  g.closePath();g.fill();
  g.fillStyle=mc[1];g.fillRect(Math.min(xa,xb),y+1,T,2);
  g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=1;g.beginPath();g.moveTo(x+6,y+5+(cc%2));g.lineTo(x+T-8,y+6);g.stroke();
  const cols=['#4f7a2e','#5f8f36','#c9a83a','#3f6a26','#d8b04a','#6a9a3c'];
  if(tip){g.strokeStyle=mc[0];g.lineWidth=1.6;g.beginPath();g.moveTo(xb-away*6,y+4);g.lineTo(xb+away*8,y-8);g.moveTo(xb-away*10,y+6);g.lineTo(xb+away*4,y+16);g.stroke();
    for(let k=0;k<9;k++){g.fillStyle=cols[(cc*3+k+r)%6];g.beginPath();g.arc(xb+away*(k%3*7-2),y-6+Math.floor(k/3)*9,6.5,0,7);g.fill()}}
  else if((cc+r)%2===0){for(let k=0;k<4;k++){g.fillStyle=cols[(cc*3+k+r)%6];g.beginPath();g.arc(x+8+k*8,y+th+3+(k%2)*3,5,0,7);g.fill()}}
}
function drawBramble(g,x,y,cc,r,up){
  const by=up?y+T:y;
  for(let k=0;k<4;k++){const sx=x+4+k*10+h01(cc,k)*6,hh=18+h01(k,cc+r)*14;g.strokeStyle=k%2?'#5a3a2a':'#4a5a2a';g.lineWidth=2;g.beginPath();g.moveTo(sx,by);g.quadraticCurveTo(sx+10,by-hh*1.2,sx+18,by-hh*.4);g.stroke();
    g.strokeStyle='#2a2018';g.lineWidth=1;for(let j=1;j<4;j++){const tx=sx+j*5,tyy=by-hh*(.5+j*.15);g.beginPath();g.moveTo(tx,tyy);g.lineTo(tx+3,tyy-3);g.stroke()}}
  for(let k=0;k<3;k++){g.fillStyle=k%2?'#8a3a2a':'#6a7a2a';g.beginPath();g.ellipse(x+8+k*12,by-14-k*3,5,3,k,0,7);g.fill()}
  g.fillStyle='#2a1a2a';g.beginPath();g.arc(x+22,by-12,2.4,0,7);g.arc(x+12,by-20,2,0,7);g.fill();
}
/* tranchée : clayonnage des parois, caillebotis au fond, sacs de terre et piquets sur le parapet, échelle */
function verdunTiles(g,Lv){
  // trous d'obus : bords arrondis et herbeux (dans le terrain miné)
  for(const z of Lv.zones||[]){if(z.z!=='mines')continue;
    for(let c=z.c0;c<=z.c1;c++){if(!(Lv.g[13][c]==='.'&&Lv.g[14][c]==='#'&&Lv.g[13][c-1]==='#'))continue;let e=c;while(Lv.g[13][e+1]==='.')e++;
      const x0=c*T,x1=(e+1)*T,y0=13*T,y1=14*T,top=Lv.th.floorTop;
      g.fillStyle=Lv.th.floor;g.beginPath();g.moveTo(x0-2,y0);g.quadraticCurveTo(x0+18,y0+4,x0+26,y1);g.lineTo(x0,y1);g.closePath();g.fill();
      g.beginPath();g.moveTo(x1+2,y0);g.quadraticCurveTo(x1-18,y0+4,x1-26,y1);g.lineTo(x1,y1);g.closePath();g.fill();
      g.strokeStyle=top;g.lineWidth=6;g.beginPath();g.moveTo(x0-4,y0+2);g.quadraticCurveTo(x0+18,y0+5,x0+26,y1);g.quadraticCurveTo((x0+x1)/2,y1+6,x1-26,y1);g.quadraticCurveTo(x1-18,y0+5,x1+4,y0+2);g.stroke();
      g.strokeStyle=top;g.lineWidth=1.3;for(let k=0;k<(x1-x0)/6;k++){const gx=x0+4+k*6,gy=gx<x0+26?y0+2+(gx-x0)*1.4:gx>x1-26?y0+2+(x1-gx)*1.4:y1+2;g.beginPath();g.moveTo(gx,gy);g.lineTo(gx+1,gy-6-(k%3)*2);g.stroke()}
      c=e}}
  for(const z of Lv.zones||[]){if(z.z!=='trench')continue;
    let lo=null,hi=null;
    for(let c=z.c0;c<=z.c1;c++)for(let r=0;r<Lv.g.length-1;r++){const ch=Lv.g[r][c];if(ch!=='#'&&!(ch==='f'&&(Lv.g[r][c+1]==='.'||Lv.g[r][c-1]==='.')))continue;
      const ol=Lv.g[r][c-1]==='.'&&r>=13,orr=Lv.g[r][c+1]==='.'&&r>=13;
      if(ol||orr){const x=c*T,y=r*T,ex=orr?x+T-14:x;g.fillStyle='#6a5034';g.fillRect(ex,y,14,T);g.strokeStyle='#4a3622';g.lineWidth=1.4;
        for(let k=0;k<6;k++){g.beginPath();g.moveTo(ex,y+k*7+3);g.quadraticCurveTo(ex+7,y+k*7+(k%2?7:-1),ex+14,y+k*7+3);g.stroke()}
        g.fillStyle='#4a3622';g.fillRect(ex+(orr?0:10),y,4,T)}
      if(r>=14&&Lv.g[r-1][c]==='.'&&Lv.g[r-1][c-1]!==undefined){const x=c*T,y=r*T;g.fillStyle='#7a6046';for(let k=0;k<5;k++)g.fillRect(x+k*8+1,y-3,6,5);g.fillStyle='#5a4430';g.fillRect(x,y+1,T,2)}
      if(r===13&&(Lv.g[13][c+1]==='.'||Lv.g[13][c-1]==='.')&&Lv.g[12][c]==='.'){if(lo==null)lo=c;hi=c}
    }
    // sacs de terre, en arrière-plan, le long des bords
    for(const c of [lo,hi]){if(c==null)continue;const x=c*T,y=13*T;for(let k=0;k<3;k++){g.fillStyle=k%2?'#8a7a5a':'#9a8a66';rr(g,x+2+k*12+DX*.6,y-9+DY*.6,14,8,3);g.fill()}}
    // échelle contre la paroi de sortie
    if(hi!=null){const x=hi*T-16,y0=13*T,y1=15*T;g.fillStyle='#7a5a3a';g.fillRect(x,y0-10,3,y1-y0+10);g.fillRect(x+12,y0-10,3,y1-y0+10);for(let yy=y0;yy<y1;yy+=12)g.fillRect(x,yy,15,2.5)}
    // piquets « queue de cochon » et barbelé rouillé, au loin derrière le parapet
    g.strokeStyle='rgba(90,60,40,.7)';g.lineWidth=1;
    for(let c=z.c0;c<=z.c1;c+=4){const x=c*T+DX,y=13*T+DY;g.fillStyle='#5a4432';g.fillRect(x,y-30,3,30);g.beginPath();g.moveTo(x,y-24);g.quadraticCurveTo(x+80,y-14,x+160,y-24);g.moveTo(x,y-12);g.quadraticCurveTo(x+80,y-4,x+160,y-12);g.stroke()}
  }
}
/* ---------- plans de fond : champs de la Meuse en novembre ---------- */
function autumnTree(g,x,b,h,R,dim){
  const cols=['#4a7a2c','#5a8a34','#3f6a26','#6a9a3c','#557f30','#c9a83a','#d8a83a','#b8782a'];
  const tr=mix('#4a3828','#9ab8c4',dim);g.fillStyle=tr;g.fillRect(x-h*.035,b-h*.5,h*.07,h*.5);
  g.strokeStyle=tr;g.lineWidth=Math.max(1,h*.02);g.beginPath();g.moveTo(x,b-h*.4);g.lineTo(x-h*.14,b-h*.62);g.moveTo(x,b-h*.48);g.lineTo(x+h*.15,b-h*.66);g.stroke();
  const cy=b-h*.66,rw=h*.3,rh=h*.28,n=12+Math.floor(h/20),yellow=R()<.35?.35:.12;
  for(let k=0;k<n;k++){const a=R()*Math.PI*2,d=Math.sqrt(R());const px=x+Math.cos(a)*rw*d,py=cy+Math.sin(a)*rh*d;
    const c=R()<yellow?cols[5+Math.floor(R()*3)]:cols[Math.floor(R()*5)];g.fillStyle=mix(py>cy?mix(c,'#000000',.14):c,'#9ab8c4',dim);g.beginPath();g.arc(px,py,h*(.07+R()*.05),0,7);g.fill()}
  g.fillStyle=mix('#f4f0c8','#9ab8c4',dim);g.globalAlpha=.16;g.beginPath();g.arc(x-rw*.35,cy-rh*.4,rw*.35,0,7);g.fill();g.globalAlpha=1;
}
function fieldsFar(L,g,wpx,R){
  for(let k=0;k<wpx/320;k++){const x=R()*wpx,y=70+R()*120,s=.7+R()*.8;g.fillStyle='rgba(255,255,255,.7)';for(let j=0;j<6;j++){g.beginPath();g.arc(x+j*22*s,y-Math.sin(j/5*Math.PI)*18*s,(18+R()*14)*s,0,7);g.fill()}g.fillStyle='rgba(160,180,200,.25)';g.fillRect(x-14*s,y+6*s,130*s,8*s)}
  const ridge=(base,amp,f,ph)=>x=>base-Math.sin(x*f+ph)*amp-Math.sin(x*f*2.7+ph*1.3)*amp*.35;
  const band=(fn,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,600);for(let x=0;x<=wpx+20;x+=20)g.lineTo(x,fn(x));g.lineTo(wpx+20,600);g.closePath();g.fill()};
  const r1=ridge(392,24,.004,R()*9),r2=ridge(430,16,.006,R()*9),r3=ridge(468,10,.009,R()*9);
  band(r1,'#a3bcbc');
  for(let x=0;x<wpx;x+=14+R()*30)if(R()<.5)autumnTree(g,x,r1(x)+4,22+R()*16,R,.55);
  band(r2,'#a4b874');
  // parcelles : chaume, labour, blé d'hiver
  const pc=['#b9b46a','#8f7454','#93ad5e','#a9b870','#7f6a4c'];
  for(let x=0;x<wpx;){const w=120+R()*220,c=pc[Math.floor(R()*pc.length)];g.fillStyle=mix(c,'#a8c0c4',.32);g.beginPath();g.moveTo(x,r2(x)+3);for(let xx=x;xx<=x+w;xx+=20)g.lineTo(xx,r2(xx)+3);g.lineTo(x+w,600);g.lineTo(x,600);g.closePath();g.fill();
    g.strokeStyle='rgba(60,50,30,.12)';g.lineWidth=1;for(let yy=8;yy<60;yy+=7){g.beginPath();g.moveTo(x,r2(x)+yy);g.lineTo(x+w,r2(x+w)+yy+4);g.stroke()}
    g.fillStyle=mix('#4a7a2c','#a8c0c4',.35);for(let xx=x;xx<x+w;xx+=9)g.fillRect(xx,r2(xx)-4,7,6);x+=w}
  for(let x=0;x<wpx;x+=60+R()*140)autumnTree(g,x,r2(x)+2,34+R()*20,R,.35);
  // un clocher de village au loin
  {const cx=wpx*.7,cb=r2(wpx*.7)+4;g.fillStyle='#9aa8a8';g.fillRect(cx-6,cb-46,12,46);poly(g,[cx-8,cb-46,cx,cb-70,cx+8,cb-46]);g.fill();g.fillStyle='#b8b0a0';for(let k=-3;k<=3;k++)if(k)g.fillRect(cx+k*14-6,cb-14,12,14)}
  band(r3,'#8fa860');
}
function fieldsMid(L,g,wpx,R){
  const toWorld=mx=>(mx-W*.35)/PF_MID+W*.35;
  const zoneAtMid=mx=>zoneOfL(L,Math.floor(toWorld(mx)/T))||'field';
  let x=20;
  while(x<wpx){const z=zoneAtMid(x);
    if(z==='wood'){autumnTree(g,x,526,200+R()*110,R,.12);x+=34+R()*40;continue}
    if(z==='mines'){if(R()<.5){g.fillStyle='#e8e4dc';g.fillRect(x,380,4,146);for(let k=0;k<5;k++){g.fillStyle=R()<.6?'#c9a83a':'#8aa04a';g.beginPath();g.arc(x+(R()-.5)*30,380+R()*50,12,0,7);g.fill()}x+=90+R()*80}
      else{g.fillStyle='#6a5442';g.fillRect(x,486,3,40);g.strokeStyle='rgba(90,70,50,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x,494);g.quadraticCurveTo(x+40,502,x+80,494);g.stroke();x+=60+R()*60}continue}
    if(z==='trench'){autumnTree(g,x,526,230+R()*110,R,.18);x+=30+R()*34;continue}
    if(z==='monument'){if(z==='monument'&&R()<.45){const w=70+R()*60,h=70+R()*40;g.fillStyle=mix('#d8cfbc','#a8c0c4',.2);g.fillRect(x,526-h,w,h);g.fillStyle=mix('#5a6470','#a8c0c4',.2);poly(g,[x-6,526-h,x+w/2,526-h-34,x+w+6,526-h]);g.fill();
        g.fillStyle='rgba(60,70,80,.45)';for(let i=0;i<Math.floor(w/22);i++)for(let j=0;j<2;j++)g.fillRect(x+8+i*22,526-h+12+j*30,10,16);x+=w+10}
      else{autumnTree(g,x,526,150+R()*90,R,.15);x+=70+R()*70}continue}
    // champ : haies, grands arbres isolés, piquets de clôture
    const k=R();
    if(k<.45){const w=120+R()*200;for(let xx=x;xx<x+w;xx+=16){g.fillStyle=R()<.85?['#4a7a2c','#5a8a34','#3f6a26'][Math.floor(R()*3)]:'#c9a83a';g.beginPath();g.arc(xx,512-R()*8,16+R()*8,0,7);g.fill()}x+=w+40+R()*80}
    else if(k<.75){autumnTree(g,x,526,170+R()*80,R,.15);x+=120+R()*120}
    else{g.fillStyle='#6a5440';for(let i=0;i<5;i++)g.fillRect(x+i*30,494,4,32);g.strokeStyle='rgba(80,70,60,.5)';g.lineWidth=1;g.beginPath();g.moveTo(x,500);g.lineTo(x+124,500);g.moveTo(x,510);g.lineTo(x+124,510);g.stroke();x+=180+R()*120}
  }
}
/* météo : feuilles qui tombent */
function drawLeavesWeather(t,cx){
  ctx.save();for(let k=0;k<16;k++){const x=((k*163-t*(30+k%5*6)-cx*.25)%(W+80)+W+80)%(W+80)-40,y=((k*97+t*(40+k%4*9))%(H+40))-20+Math.sin(t*1.7+k)*14;
    ctx.fillStyle=['#c9a83a','#d8a83a','#b8782a','#6a9a3c','#d8b04a'][k%5];ctx.save();ctx.translate(x,y);ctx.rotate(t*2+k);ctx.beginPath();ctx.ellipse(0,0,4.5,2.2,0,0,7);ctx.fill();ctx.restore()}
  ctx.restore();
}
/* accessoires ajoutés */
PROPS.molehill={w:34,d(g,x,b){g.fillStyle='#5c4630';g.beginPath();g.ellipse(x+17,b,17,9,0,Math.PI,0);g.fill();g.fillStyle='rgba(0,0,0,.18)';for(let k=0;k<5;k++)g.fillRect(x+6+k*5,b-5+(k%2)*2,2,2)}};
PROPS.fern={w:40,d(g,x,b){g.strokeStyle='#4f7a2e';g.lineWidth=1.4;for(let k=0;k<5;k++){const a=-Math.PI/2+(k-2)*.45;g.beginPath();g.moveTo(x+20,b);g.quadraticCurveTo(x+20+Math.cos(a)*14,b+Math.sin(a)*22,x+20+Math.cos(a)*24,b+Math.sin(a)*18);g.stroke()}g.fillStyle='#b8782a';g.beginPath();g.arc(x+30,b-14,2,0,7);g.fill()}};
