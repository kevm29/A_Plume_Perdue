/* =========================================================
   4-3 · L'ORAGE — le vol du 3 juin 1916, du fort de Vaux vers l'ouest (vers la gauche)
   ---------------------------------------------------------
   Raymond est vivant : on ne fait que monter, descendre, accélérer (←) et ralentir (→) ; on ne se pose jamais.
   Le moindre choc, et le souvenir reprend au lancer, dans les mains de Lucien. Pas de paille : il faut tout éviter.
     1 · la friche : personne, des obus qui tombent du ciel (parfois deux ou trois ensemble), qui labourent le sol ;
     2 · les tranchées allemandes : des hommes qui tirent vers le fort ; l'un d'eux voit le pigeon, le montre,
         et les mitrailleuses le prennent pour cible : rafale, petite pause, rafale… (E au-dessus d'un Allemand : fiente) ;
     3 · le champ de canons : les obus partent vers le fort, en travers de la route de Raymond ;
     4 · les tranchées françaises : « un pigeon, avec un message ! »… « il ne se pose pas… »… « un leurre boche ! Feu ! »
         La troisième balle touche, forcément. Raymond tombe dans un buisson.
   ========================================================= */
const VF={BX:640,X0:300,END:-12300,STEP:8,XMIN:-13400,XMAX:1100,G:428,
  A:[-3500,-420],B:[-6900,-3700],C:[-9950,-7050],D:[-12300,-10050],bush:-11930,hitX:-11620};
const VF_TR=[// tranchées : [x0,x1,profondeur,camp]
  [-4330,-4010,66,'de'],[-5330,-5060,66,'de'],[-6440,-6160,66,'de'],[-10690,-10370,66,'fr'],[-11420,-11170,64,'fr']];
const VF_GUNS=[[-7360,'fk',.52],[-7760,'fk',.62],[-8220,'sfh',.86],[-8660,'fk',.47],[-9120,'sfh',.8],[-9560,'fk',.58]];
function vfIdx(X){return clamp(Math.round((X-VF.XMIN)/VF.STEP),0,VF.n-1)}
function vfGround(X){const f=(X-VF.XMIN)/VF.STEP,i=Math.floor(f),k=f-i,h=VF.hm;if(i<0)return h[0];if(i>=VF.n-1)return h[VF.n-1];return h[i]*(1-k)+h[i+1]*k}
function vfSurface(X){return VF.G+Math.sin(X*.0041)*7+Math.sin(X*.0133+1)*4+Math.sin(X*.041)*1.5}
function vfBuildTerrain(){
  VF.n=Math.ceil((VF.XMAX-VF.XMIN)/VF.STEP)+1;const h=new Float32Array(VF.n);
  for(let i=0;i<VF.n;i++){const X=VF.XMIN+i*VF.STEP;h[i]=vfSurface(X);
    // le fort : la carapace bétonnée, couverte de terre, à droite du départ
    if(X>40&&X<100)h[i]=470;else if(X>=100)h[i]=440}
  const R=mulberry(613);
  const crater=(cx,r,d)=>{for(let X=cx-r*1.3;X<=cx+r*1.3;X+=VF.STEP){const i=vfIdx(X),u=(X-cx)/r;if(Math.abs(u)<1)h[i]+=d*(1-u*u);else h[i]-=d*.18*(1-(Math.abs(u)-1)/.3)}};
  // la friche : une terre retournée cent fois
  for(let k=0;k<70;k++){const cx=-200-R()*12000;if(VF_TR.some(([a,b])=>cx>a-80&&cx<b+80))continue;if(VF_GUNS.some(([x])=>Math.abs(cx-x)<120))continue;crater(cx,24+R()*46,10+R()*20)}
  // les tranchées : plancher, banquette de tir du côté de l'ennemi, parapet et parados
  for(const[a,b,d,side]of VF_TR){const s0=vfSurface((a+b)/2);for(let X=a;X<=b;X+=VF.STEP){const i=vfIdx(X);h[i]=s0+d;
      const front=side==='de'?b-X:X-a;if(front<34&&front>6)h[i]=s0+d-26}
    const pf=side==='de'?[b,b+34]:[a-34,a],pd=side==='de'?[a-26,a]:[b,b+26];
    for(let X=pf[0];X<=pf[1];X+=VF.STEP)h[vfIdx(X)]=s0-14;for(let X=pd[0];X<=pd[1];X+=VF.STEP)h[vfIdx(X)]=s0-8}
  // les fosses des canons
  for(const[x]of VF_GUNS){const s0=vfSurface(x);for(let X=x-90;X<=x+80;X+=VF.STEP)h[vfIdx(X)]=s0+14;for(const e of[x-100,x+90])for(let X=e;X<=e+14;X+=VF.STEP)h[vfIdx(X)]=s0-10}
  VF.hm0=h;
}
/* ---------- les gens du champ de bataille ---------- */
function vfPeople(){
  const P2=[],R=mulberry(1606),sk=()=>VX_SKIN[(R()*VX_SKIN.length)|0],hr=()=>VX_HAIR[(R()*VX_HAIR.length)|0];
  const add=(o)=>{o.seed=R()*100;o.face=Object.assign({skin:sk(),hair:hr(),stubble:R()*.8,helmet:o.side==='fr'?'adrian':(R()<.75?'stahl':'pickel'),side:o.side==='fr'?'fr':'de'},o.face||{});
    if(o.side!=='fr'&&R()<.45)o.face.stache=R()<.5?'up':'walrus';if(o.side==='fr'){if(R()<.35)o.face.beard=1;else if(R()<.6)o.face.stache='walrus'}P2.push(o);return o};
  for(const[a,b,d,side]of VF_TR){const s0=vfSurface((a+b)/2),step=s0+d-26,floor=s0+d,de=side==='de';
    const n=Math.floor((b-a)/38);
    for(let k=0;k<n;k++){const X=a+20+k*((b-a-40)/(n-1||1));const nearFront=de?b-X<44:X-a<44;
      if(nearFront&&R()<.9){add({X:de?b-22:a+22,y:step,side,f:de?1:-1,role:de?'rifle':'lookout'})}}
    // sur la banquette : une rangée de tireurs ; au fond : ceux qui passent, mangent, dorment, écrivent
    const fireN=Math.floor((b-a)/60);
    for(let k=0;k<fireN;k++){const X=lerp(a+40,b-40,k/(fireN-1||1));
      if(de)add({X,y:floor,side,f:1,role:k===1?'spot':k===fireN-1?'officer':(R()<.5?'rifleFloor':'carry'),walk:[a+30,b-30]});
      else add({X,y:floor,side,f:-1,role:['sit','cook','write','look','sarge','rifleFR','sleep','look'][k%8],walk:[a+30,b-30]})}
  }
  // les mitrailleuses (dans une sape, derrière la première et la deuxième ligne)
  VF.mgs=[{X:-4560,y:vfSurface(-4560)-2,ang:0,want:0,state:'idle',n:0,tm:.6,on:false},{X:-5920,y:vfSurface(-5920)-2,ang:0,want:0,state:'idle',n:0,tm:1.1,on:false}];
  for(const m of VF.mgs){add({X:m.X-22,y:m.y+10,side:'de',f:1,role:'mgun',mg:m});add({X:m.X-44,y:m.y+12,side:'de',f:1,role:'mfeed',mg:m})}
  // les servants des canons
  for(const g of VF.guns){const y=vfSurface(g.X)+14;add({X:g.X-70,y,side:'art',f:1,role:'lanyard',gun:g});add({X:g.X-30,y,side:'art',f:1,role:'ram',gun:g});
    add({X:g.X+40,y,side:'art',f:-1,role:'chief',gun:g});add({X:g.X-120,y:vfSurface(g.X-120),side:'art',f:1,role:'shell',gun:g,walk:[g.X-170,g.X-90]})}
  add({X:-8440,y:vfSurface(-8440),side:'art',f:1,role:'phone'});add({X:-9300,y:vfSurface(-9300),side:'art',f:1,role:'binoc'});
  for(const p of P2){p.t=R()*9;p.wipe=0;p.splat=false;p.fire=R()*3;p.wx=p.X}
  VF.people=P2;
}
function vfInit(first){
  if(!VF.hm0){vfBuildTerrain()}
  VF.guns=VF_GUNS.map(([X,k,el],i)=>({X,k,el,y:vfSurface(X)+14,per:k==='sfh'?4.6:3.4,tm:1.2+i*.55,recoil:0,flash:0,warn:0}));
  VF.hm=new Float32Array(VF.hm0);vfPeople();
  const s=V.s;Object.assign(s,{x:VF.X0,y:330,sp:200,vy:-260,fph:0,dead:0,grace:1.1,shells:[],booms:[],bullets:[],gshells:[],poops:[],splats:[],shellT:1.2,said:{},trig:{},fr:{shots:0,t:-1},fall:null,wound:0,heart:0,cosT:.4});
  V.sc='flight';V.t=0;V.parts=[];V.bub=[];
  if(first){say("Libre ! L'ouest, c'est par là. Le pigeonnier Vasseur, c'est par là.",3.6)}
}
function vfCrash(why){const s=V.s;if(s.dead>0||s.fall||VF.god)return;s.why=why;s.dead=1.25;s.dvy=-120;s.drot=0;G.levelDeaths++;gotOf(G.li).d++;save();
  if(!G.sim){noise(.4,900,.5,'bandpass');tone(700,.3,'sine',.08,200)}V.shake=Math.max(V.shake,8);
  for(let k=0;k<16;k++)V.parts.push({k:'feather',x:VF.BX,y:s.y,vx:(rnd()-.5)*260,vy:-rnd()*220,g:160,drag:2.2,life:0,max:1.8,rot:rnd()*6,vr:(rnd()-.5)*10})}
function vfExplode(X,big){const s=V.s,gy=vfGround(X),r=big?66:52,d=big?30:24;
  s.booms.push({X,y:gy,t:0,h:220+rnd()*60,big});
  for(let x=X-r*1.3;x<=X+r*1.3;x+=VF.STEP){const i=vfIdx(x),u=(x-X)/r;if(Math.abs(u)<1)VF.hm[i]=Math.min(VF.G+90,VF.hm[i]+d*(1-u*u));else VF.hm[i]-=d*.25*(1-(Math.abs(u)-1)/.3)}
  for(let k=0;k<26;k++){const a=-Math.PI*(.15+rnd()*.7),sp=180+rnd()*420;V.parts.push({k:'clod',wx:1,x:X,y:gy-8,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:900,life:0,max:1.4+rnd()*.6,r:2+rnd()*4,rot:rnd()*6,vr:(rnd()-.5)*12,col:rnd()<.3?'#8a8270':'#3e3024'})}
  for(let k=0;k<10;k++)V.parts.push({k:'smoke',wx:1,x:X+(rnd()-.5)*50,y:gy-20-rnd()*60,vx:(rnd()-.5)*30,vy:-30-rnd()*30,g:-10,life:0,max:2.6,r:14,grow:30,col:'#4a4440',a:.5});
  V.shake=Math.max(V.shake,big?14:10);V.flash=Math.max(V.flash,.22);
  if(!G.sim){noise(1.1,200,.9,'lowpass');noise(.25,1600,.4,'bandpass');tone(48,.8,'triangle',.3,30)}}
function vfUpdate(dt){
  const s=V.s;
  if(V.sc==='wound'){s.wound+=dt;s.heart-=dt;if(s.heart<=0&&s.wound<4.2){s.heart=.95+s.wound*.18;if(!G.sim){tone(52,.18,'sine',.5,40);tone(48,.16,'sine',.35,38,.16)}}
    if(s.wound>5.4&&!V.out)vxFadeTo(()=>vxCardGo('van2',()=>vxGo('van2')),1.4);return}
  vfWorld(dt);
  if(s.fall){const f=s.fall;f.t+=dt;const u=Math.min(1,f.t/f.T);s.x=lerp(f.x0,f.x1,u);s.y=lerp(f.y0,f.y1,u)-Math.sin(u*Math.PI)*60*(1-u*.5);f.rot+=dt*(9-u*7);
    if(rnd()<dt*30)V.parts.push({k:'drop',wx:1,x:s.x,y:s.y,vx:(rnd()-.5)*40,vy:-20,g:700,life:0,max:.8,r:1.6,col:'#9a1418'});
    if(u>=1&&!f.landed){f.landed=1;V.sc='wound';s.wound=0;s.heart=.4;if(!G.sim){noise(.5,1800,.3,'highpass');SFX.land()}for(let k=0;k<12;k++)V.parts.push({k:'feather',wx:1,x:s.x,y:s.y,vx:(rnd()-.5)*160,vy:-rnd()*140,g:120,drag:2.4,life:0,max:2.2,rot:rnd()*6,vr:(rnd()-.5)*8})}
    return}
  if(s.dead>0){s.dead-=dt;s.dvy+=900*dt;s.y=Math.min(vfGround(s.x)-6,s.y+s.dvy*dt);s.drot+=dt*12;
    if(s.dead<=0&&!V.out){vxFadeTo(()=>{vfInit(false);setSong('vx-vol');say(pick(["Non. Ce n'est pas comme ça que ça s'est passé. Encore.","Je me souviens mal. Lucien me relance. On recommence.","Ce n'est pas là que je suis tombé. Pas encore.","Reprendre depuis les mains de Lucien. Le souvenir insiste."]),3.6)},.6)}return}
  if(pressed.has('restart')&&!V.out){vfCrash('r');return}
  // les commandes : ← plus vite (vers l'ouest), → plus lent ; haut et bas
  const L2=keys.has('left'),Rt=keys.has('right'),up=keys.has('up')||keys.has('jump'),dn=keys.has('down');
  const tsp=L2?330:Rt?135:225;s.sp+=(tsp-s.sp)*Math.min(1,dt*3.2);
  const tvy=up?-270:dn?310:26;s.vy+=(tvy-s.vy)*Math.min(1,dt*(up||dn?7:3));
  s.x-=s.sp*dt;s.y+=s.vy*dt;s.fph+=dt*(up?22:dn?6:14);if(s.grace>0)s.grace-=dt;
  if(s.y<58){s.y=58;if(s.vy<0)s.vy=0}
  if(Math.floor(s.fph/6.28)!==Math.floor((s.fph-dt*(up?22:14))/6.28)&&!G.sim&&rnd()<.35)SFX.flutter();
  if(s.grace<=0&&s.y+8>vfGround(s.x))return vfCrash('sol');
  // la fiente
  if(pressed.has('act')&&(s.poopT||0)<=0){s.poopT=.45;s.poops.push({x:s.x+4,y:s.y+6,vx:-s.sp*.55,vy:60});if(!G.sim)noise(.06,900,.08,'lowpass')}
  s.poopT=(s.poopT||0)-dt;
  for(const p of s.poops){p.vy+=1100*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    for(const m of VF.people){if(m.side==='fr'||m.splat)continue;const hx=m.hx,hy=m.hy;if(hx==null)continue;if(Math.abs(p.x-hx)<9&&Math.abs(p.y-hy)<8){m.splat=true;m.wipe=1.8;p.dead=1;
      vxBubble(hx,hy-30,pick(['Scheiße!','Igitt!','Verdammte Taube!','Mein Helm!','Pfui Teufel!']),'#3a3a2a',1.8);if(!G.sim)noise(.08,600,.15,'lowpass');
      if(!s.said.poop){s.said.poop=1;say("Un vrai, celui-là. Et en plein sur le casque. Le règlement appelle ça de l'artillerie d'appoint.",4)}break}}
    if(!p.dead&&p.y>vfGround(p.x)){p.dead=1;s.splats.push({x:p.x,y:vfGround(p.x),t:0})}}
  s.poops=s.poops.filter(p=>!p.dead);for(const q of s.splats)q.t+=dt;s.splats=s.splats.filter(q=>q.t<8);
  vfHazards(dt);
  vfStory(dt);
}
/* ---------- le monde qui vit : obus, mitrailleuses, canons, soldats ---------- */
function vfWorld(dt){
  const s=V.s,X=s.x,cam=X-VF.BX;
  for(const p of V.parts)if(p.wx&&p.k==='clod'&&p.vy>0&&p.y>vfGround(p.x)){p.y=vfGround(p.x);p.vy*=-.2;p.vx*=.4}
  // la friche : les obus tombent du ciel, devant Raymond
  if(s.x<VF.A[1]&&s.x>VF.A[0]&&!s.dead){s.shellT-=dt;if(s.shellT<=0){const prog=clamp((VF.A[1]-s.x)/(VF.A[1]-VF.A[0]),0,1),r=rnd();
      const n=r<.1+prog*.28?3:r<.36+prog*.2?2:1;s.shellT=(.95+rnd()*.45)*(n>1?1.25:1);
      // la moitié des obus visent l'endroit où Raymond passera, à sa hauteur : il faut changer d'allure ou d'altitude
      const T=1.25,aim=rnd()<.5,tc=T*Math.pow(clamp((s.y+40)/(VF.G+40),.05,1),1/1.6),xt=aim?s.x-s.sp*tc+(rnd()-.5)*30:s.x-s.sp*T-(40+rnd()*300),sp=78+rnd()*40;
      for(let k=0;k<n;k++){const xx=xt+(k-(n-1)/2)*sp+(rnd()-.5)*20;s.shells.push({X:xx,t:-k*.06,T,big:n>1})}
      if(!G.sim){tone(1900,1.15,'sine',.05,380);if(n>1)tone(1700,1.1,'sine',.04,330,.05)}
      if(!s.said.obus){s.said.obus=1;say("Des obus ! Ils tombent de partout. Ne jamais rester sous un sifflement.",3.8)}}}
  for(const sh of s.shells){sh.t+=dt;if(sh.t>=sh.T&&!sh.done){sh.done=1;vfExplode(sh.X,sh.big)}}
  s.shells=s.shells.filter(sh=>!sh.done);
  for(const b of s.booms)b.t+=dt;s.booms=s.booms.filter(b=>b.t<1.1);
  // un obus lointain, de temps en temps, pour la vie (sans danger)
  s.cosT-=dt;if(s.cosT<=0){s.cosT=.8+rnd()*1.6;s.far=s.far||[];s.far.push({x:rnd()*W,y:300+rnd()*60,t:0,p:.2+rnd()*.25});if(!G.sim)noise(1.4,90+rnd()*50,.25,'lowpass')}
  if(s.far){for(const f of s.far)f.t+=dt;s.far=s.far.filter(f=>f.t<1.6)}
  // les mitrailleuses : elles tirent vers le fort… puis sur le pigeon, quand il est à portée
  for(const m of VF.mgs){const dx=s.x-m.X,inR=!s.dead&&!s.fall&&dx<600&&dx>-380;m.on=inR;
    let want=0;if(inR){const tof=Math.hypot(dx,s.y-m.y)/820;const px=s.x-s.sp*tof*.55,py=s.y+s.vy*tof*.3;want=Math.atan2(py-m.y,px-m.X)}
    else want=-.06;
    let d=want-m.ang;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;m.ang+=clamp(d,-1.1*dt,1.1*dt);
    m.tm-=dt;if(m.state==='burst'){if(m.tm<=0){m.tm=.09;m.n--;const a=m.ang+(rnd()-.5)*.09,mx=m.X+Math.cos(m.ang)*30,my=m.y-8+Math.sin(m.ang)*30;
        s.bullets.push({x:mx,y:my,vx:Math.cos(a)*820,vy:Math.sin(a)*820,life:0,live:inR});m.flash=.06;if(!G.sim&&Math.abs(m.X-s.x)<1200)noise(.05,2200,.22,'bandpass',0,2);if(m.n<=0){m.state='pause';m.tm=inR?.75:1.6}}}
    else if(m.tm<=0&&(!inR||Math.abs(d)<.3)){m.state='burst';m.n=5;m.tm=0}
    m.flash=Math.max(0,(m.flash||0)-dt)}
  for(const b of s.bullets){b.life+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt}
  s.bullets=s.bullets.filter(b=>b.life<1.4&&b.y>-40&&b.y<H+40);
  // les canons : ils tirent vers le fort (vers la droite), et leurs obus traversent la route de Raymond
  for(const g of VF.guns){const vis=g.X>cam-260&&g.X<cam+W+520;g.recoil=Math.max(0,g.recoil-dt*2.4);g.flash=Math.max(0,g.flash-dt*5);
    if(!vis)continue;g.tm-=dt;g.warn=g.tm<.7?1:0;
    if(g.tm<=0){g.tm=g.per*(.85+rnd()*.3);g.recoil=1;g.flash=1;const L2=g.k==='sfh'?46:58,mx=g.X+18+Math.cos(-g.el)*L2,my=g.y-30+Math.sin(-g.el)*L2,v=g.k==='sfh'?560:660;
      s.gshells.push({x:mx,y:my,vx:Math.cos(-g.el)*v,vy:Math.sin(-g.el)*v,life:0});g.blast={x:mx+12,y:my-6,t:0};
      for(let k=0;k<12;k++)V.parts.push({k:'smoke',wx:1,x:mx+rnd()*30,y:my+(rnd()-.5)*20,vx:60+rnd()*80,vy:-20-rnd()*30,g:-8,drag:1.4,life:0,max:2.2,r:8,grow:26,col:'#9a948a',a:.45});
      for(let k=0;k<8;k++)V.parts.push({k:'dust',wx:1,x:g.X+(rnd()-.5)*80,y:g.y-2,vx:(rnd()-.5)*160,vy:-30-rnd()*40,g:60,life:0,max:1,r:4,grow:14,col:'#8a7a62',a:.5});
      V.shake=Math.max(V.shake,Math.abs(g.X-s.x)<700?7:3);if(!G.sim){noise(.9,170,.8,'lowpass');noise(.12,900,.35,'bandpass');tone(60,.4,'triangle',.25,35)}
      if(rnd()<.45){const ch=VF.people.find(p=>p.gun===g&&p.role==='chief');if(ch)vxBubble(ch.X,ch.y-80,pick(['Feuer!','Feuer!','Los!']),'#3a3a2a',1)}}
    if(g.blast){g.blast.t+=dt;if(g.blast.t>.22)g.blast=null}}
  for(const q of s.gshells){q.life+=dt;q.vy+=110*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}
  s.gshells=s.gshells.filter(q=>q.life<3&&q.y>-60);
  // les soldats
  for(const p of VF.people){p.t+=dt;p.wipe=Math.max(0,p.wipe-dt);p.fire-=dt;
    if(p.walk&&(p.role==='carry'||p.role==='shell')){p.dir=p.dir||1;p.wx+=p.dir*28*dt;if(p.wx>p.walk[1])p.dir=-1;if(p.wx<p.walk[0])p.dir=1}
    if((p.role==='rifle'||p.role==='rifleFloor')&&p.fire<=0&&Math.abs(p.X-s.x)<1100){p.fire=1.2+rnd()*2.4;p.flash=.08;if(!G.sim&&Math.abs(p.X-s.x)<700)noise(.06,1600,.12,'bandpass',0,2)}
    p.flash=Math.max(0,(p.flash||0)-dt)}
}
function vfHazards(dt){
  const s=V.s;if(s.dead>0||s.fall)return;const bx=s.x,by=s.y;
  for(const sh of s.shells){const u=Math.max(0,sh.t/sh.T),gy=vfGround(sh.X),y=-40+(gy+40)*Math.pow(u,1.6);if(sh.t>0&&Math.abs(bx-sh.X)<11&&Math.abs(by-y)<22)return vfCrash('obus')}
  for(const b of s.booms){if(b.t>.6)continue;const h=b.h*Math.min(1,b.t/.12)*(1-Math.max(0,(b.t-.32)/.3)),w=40+b.t*50+(b.big?10:0),cy=b.y-h/2;
    if(h>10&&((bx-b.X)/w)**2+((by-cy)/(h/2+6))**2<1)return vfCrash('boom');if(b.t<.2&&Math.hypot(bx-b.X,by-b.y)<64)return vfCrash('boom')}
  for(const b of s.bullets)if(b.live&&Math.abs(b.x-bx)<12&&Math.abs(b.y-by)<9)return vfCrash('balle');
  for(const q of s.gshells)if(Math.abs(q.x-bx)<14&&Math.abs(q.y-by)<12)return vfCrash('obus');
  for(const g of VF.guns)if(g.blast&&Math.hypot(bx-g.blast.x,by-g.blast.y)<48)return vfCrash('canon');
}
/* ---------- l'histoire : ce que Raymond voit, ce que les hommes disent ---------- */
function vfStory(dt){
  const s=V.s,X=s.x,once=(k,c,fn)=>{if(!s.trig[k]&&c){s.trig[k]=1;fn()}};
  once('de',X<-3780,()=>say("Des tranchées. Des casques en pot de charbon : les Allemands. Ils tirent tous vers le fort.",4));
  once('spot',X<-3930,()=>{const sp=VF.people.find(p=>p.role==='spot');if(sp){sp.pointT=4;vxBubble(sp.X,sp.y-86,'Da! Eine Taube!','#3a3a2a',2.2)}
    setTimeout(()=>{if(V&&V.sc==='flight')say("Ils m'ont vu ! Une mitrailleuse se tourne vers moi. Passer entre deux rafales.",4)},700)});
  once('spot2',X<-5500,()=>{const sp=VF.people.find(p=>p.role==='officer'&&p.X<-5000);if(sp)vxBubble(sp.X,sp.y-86,'Die Taube! Schießt sie ab!','#3a3a2a',2.4)});
  once('art',X<-7000,()=>say("Leurs canons. Tous tournés vers le fort. Vers Lucien.",3.6));
  once('fr',X<-10080,()=>say("Des casques bleus. Les nôtres ! Enfin.",3));
  // les Français : ils voient le message, s'étonnent, puis tirent
  const F=VF.people.filter(p=>p.side==='fr');
  once('f1',X<-10280,()=>{const p=F.find(q=>q.role==='look');if(p){p.pointT=3;vxBubble(p.X,p.y-90,'Un pigeon ! Il a un message à la patte !','#2a3a5a',2.8)}});
  once('f2',X<-10560,()=>{const p=F.find(q=>q.role==='sarge');if(p)vxBubble(p.X,p.y-90,"Il ne descend pas… Pourquoi il ne se pose pas ?",'#2a3a5a',2.8)});
  once('f3',X<-10900,()=>{const p=F.filter(q=>q.role==='look')[1]||F[3];if(p)vxBubble(p.X,p.y-90,"C'est pas normal ! Il devrait livrer son message !",'#2a3a5a',2.8)});
  once('f4',X<-11180,()=>{const p=F.find(q=>q.role==='sarge'&&q.X<-11100)||F.find(q=>q.role==='sarge');if(p){vxBubble(p.X,p.y-90,"C'est un leurre boche ! Feu !",'#a8322d',2.4)}s.fr.t=0;say("Non ! Je suis des vôtres ! Matricule 7413 !",2.6)});
  if(s.fr.t>=0&&!s.fall){s.fr.t+=dt;const shooters=F.filter(q=>q.role==='rifleFR'||q.role==='sarge'||q.role==='look');
    for(const[k,tt,miss]of[[1,.45,-38],[2,1.05,34],[3,1.6,0]]){if(s.fr.shots<k&&s.fr.t>tt){s.fr.shots=k;const sh=shooters[(k*2)%shooters.length]||F[0];sh.aimT=1.6;sh.flash=.1;
      const mx=sh.X-12,my=sh.y-62,tx=X-s.sp*.12,ty=s.y+miss;s.bullets.push({x:mx,y:my,vx:(tx-mx)/.12*.12/.12,vy:(ty-my)/.12*.12/.12,life:0,live:false,fr:1,kill:k===3});
      const bb=s.bullets[s.bullets.length-1],dd=Math.hypot(tx-mx,ty-my)||1;bb.vx=(tx-mx)/dd*1500;bb.vy=(ty-my)/dd*1500;bb.tt=dd/1500;
      if(!G.sim){noise(.12,1500,.5,'bandpass',0,2);tone(900,.06,'square',.05)}}}
    for(const b of s.bullets)if(b.kill&&b.life>=b.tt&&!s.fall){vfShot();break}
    if(s.fr.t>2.6&&!s.fall)vfShot()}
}
function vfShot(){const s=V.s;if(s.fall)return;V.sc='shot';vxSongOff();G.quip=null;G.quipQ=[];V.shake=10;V.flash=.4;
  if(!G.sim){noise(.3,700,.6,'bandpass');tone(400,.4,'sine',.1,120)}
  s.fall={t:0,T:1.2,x0:s.x,y0:s.y,x1:VF.bush,y1:vfGround(VF.bush)-22,rot:0};
  for(let k=0;k<22;k++)V.parts.push({k:'feather',wx:1,x:s.x,y:s.y,vx:(rnd()-.5)*300,vy:-rnd()*240,g:150,drag:2,life:0,max:2.2,rot:rnd()*6,vr:(rnd()-.5)*10});
  for(let k=0;k<8;k++)V.parts.push({k:'drop',wx:1,x:s.x,y:s.y,vx:(rnd()-.5)*120,vy:-rnd()*120,g:700,life:0,max:1,r:1.8,col:'#9a1418'});
  say("…",1.4)}

/* ---------- le dessin ---------- */
function vfRender(t){
  const s=V.s,camX=s.x-VF.BX;
  let z=1,fx=0,fy=0;
  if(V.sc==='wound'){const u=Math.min(1,s.wound/1.8),e=u*u*(3-2*u);z=1+e*3.4;fx=lerp(VF.BX,VF.bush-camX-12,e);fy=lerp(H/2,vfGround(VF.bush)-44,e)}
  // le ciel du 3 juin, à l'aube : l'est (à droite, derrière) s'éclaire
  const sk=ctx.createLinearGradient(0,0,0,H);sk.addColorStop(0,'#1a2038');sk.addColorStop(.45,'#4a4660');sk.addColorStop(.75,'#9a7a7a');sk.addColorStop(1,'#d09a74');ctx.fillStyle=sk;ctx.fillRect(0,0,W,H);
  const east=ctx.createRadialGradient(W+120,430,20,W+120,430,700);east.addColorStop(0,'rgba(255,200,140,.55)');east.addColorStop(1,'rgba(255,200,140,0)');ctx.fillStyle=east;ctx.fillRect(0,0,W,H);
  ctx.save();if(z!==1){ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-fx,-fy)}
  vfFar(t,camX);
  ctx.save();ctx.translate(-camX,0);
  vfGroundDraw(t,camX);
  vfThings(t,camX);
  // Raymond
  if(V.sc==='wound'){const b=vfGround(VF.bush);vfBush(VF.bush,b,t,true);vxPigeon(ctx,VF.bush+2,b-40,.95,-1,t,{rot:-.28,flap:2.6,fold:.7,closed:s.wound>3.6,blood:Math.min(1.6,.4+s.wound*.45)});
    // les gouttes qui tombent de la tête, une à une
    const n=Math.floor(s.wound*1.6);for(let k=0;k<n;k++){const ph=(s.wound*1.6-k)%1.6,u=Math.min(1,ph/.6);ctx.fillStyle='rgba(150,16,20,'+(1-Math.max(0,ph-1.2)*2.5)+')';ctx.beginPath();ctx.ellipse(VF.bush-12-(k%3),b-38+u*30,1.3,1.8+u,0,0,7);ctx.fill()}
    ctx.fillStyle='rgba(130,14,18,.8)';ctx.beginPath();ctx.ellipse(VF.bush-12,b-8,2+Math.min(6,s.wound*1.5),1.2+Math.min(2,s.wound*.4),0,0,7);ctx.fill();vfBush(VF.bush,b,t,false,true)}
  else if(s.fall)vxPigeon(ctx,s.x,s.y,.9,-1,t,{rot:s.fall.rot,flap:2,blood:.5});
  else if(s.dead>0)vxPigeon(ctx,s.x,s.y,.9,-1,t,{rot:s.drot,flap:1.6,fold:.4,closed:true});
  else vxPigeon(ctx,s.x,s.y,.9,-1,t,{flap:s.fph,rot:clamp(-s.vy/900,-.35,.35)});
  // les projectiles (par-dessus tout)
  for(const b of s.bullets){ctx.strokeStyle=b.live||b.fr?'rgba(255,236,160,.95)':'rgba(255,236,160,.5)';ctx.lineWidth=b.live||b.fr?2.2:1.4;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.028,b.y-b.vy*.028);ctx.stroke()}
  for(const q of s.gshells){const a=Math.atan2(q.vy,q.vx);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(a);ctx.fillStyle='rgba(255,220,150,.25)';ctx.fillRect(-46,-2,46,4);ctx.fillStyle='#3a3a36';rr(ctx,-9,-3.5,18,7,3.5);ctx.fill();ctx.fillStyle='#b8902a';ctx.fillRect(-9,-3.5,4,7);ctx.restore()}
  for(const sh of s.shells){if(sh.t<0)continue;const u=sh.t/sh.T,gy=vfGround(sh.X),y=-40+(gy+40)*Math.pow(u,1.6);
    ctx.strokeStyle='rgba(220,220,230,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sh.X,y-50);ctx.lineTo(sh.X,y);ctx.stroke();
    ctx.fillStyle='#2a2a28';ctx.beginPath();ctx.moveTo(sh.X-5,y-16);ctx.lineTo(sh.X+5,y-16);ctx.lineTo(sh.X+5,y-2);ctx.quadraticCurveTo(sh.X,y+8,sh.X-5,y-2);ctx.closePath();ctx.fill();ctx.fillStyle='#b8902a';ctx.fillRect(sh.X-5,y-10,10,3);
    // l'ombre qui grandit au sol
    ctx.fillStyle='rgba(0,0,0,'+(.15+u*.35)+')';ctx.beginPath();ctx.ellipse(sh.X,gy-1,10+u*30,3+u*4,0,0,7);ctx.fill()}
  for(const b of s.booms)vfBoom(b,t);
  for(const p of s.poops){ctx.fillStyle='#f4f2ea';ctx.beginPath();ctx.ellipse(p.x,p.y,3,4,0,0,7);ctx.fill()}
  vxParts(ctx);vxDrawBubbles(ctx);
  ctx.restore();
  vfFore(t,camX);
  ctx.restore();
  // la brume de l'aube au ras du sol, les fumées lointaines
  const mg=ctx.createLinearGradient(0,380,0,H);mg.addColorStop(0,'rgba(200,180,170,0)');mg.addColorStop(1,'rgba(200,180,170,.18)');ctx.fillStyle=mg;ctx.fillRect(0,380,W,H-380);
  if(V.sc==='wound'){ctx.fillStyle='rgba(60,0,0,'+Math.min(.35,s.wound*.08)+')';ctx.fillRect(0,0,W,H);const vg=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,'+Math.min(.85,s.wound*.2)+')');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
}
function vfFar(t,camX){
  const s=V.s;
  // la crête lointaine, les chicots des bois, les colonnes de fumée
  const ridge=(p,col,base,amp,seed,trees)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=16){const u=x+camX*p;ctx.lineTo(x,base+Math.sin(u*.003+seed)*amp+Math.sin(u*.011+seed*2)*amp*.4)}ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    if(trees){ctx.strokeStyle=col;for(let i=-2;i<W/26+2;i++){const cell=Math.floor(camX*p/26)+i,R=mulberry(cell*7+seed*100),x=cell*26-camX*p;if(R()<.45)continue;const u=x+camX*p,by=base+Math.sin(u*.003+seed)*amp+Math.sin(u*.011+seed*2)*amp*.4,h=8+R()*trees;ctx.lineWidth=1+R()*2;ctx.beginPath();ctx.moveTo(x,by+2);ctx.lineTo(x+(R()-.5)*5,by-h);ctx.stroke();if(R()<.4){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,by-h*.6);ctx.lineTo(x+(R()-.5)*14,by-h*.85);ctx.stroke()}}}};
  // les colonnes de fumée
  for(let i=-1;i<6;i++){const cell=Math.floor(camX*.08/240)+i,R=mulberry(cell*13+5),x=cell*240-camX*.08+R()*120;const h=160+R()*120;
    for(let k=0;k<8;k++){const u=k/8,ph=(t*.05+u)%1;ctx.fillStyle='rgba(70,62,72,'+(.16*(1-u))+')';ctx.beginPath();ctx.ellipse(x+Math.sin(t*.3+k+cell)*8+u*40,330-u*h,18+u*40,14+u*20,0,0,7);ctx.fill()}}
  ridge(.1,'#4a4258',340,10,1,0);
  // le ballon d'observation allemand (Drachen), au loin, au-dessus des batteries
  {const bx=-8700*.2-camX*.2+VF.BX*.2+W*.3,by=150+Math.sin(t*.4)*4;if(bx>-120&&bx<W+120){ctx.strokeStyle='rgba(40,36,44,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx,by+12);ctx.lineTo(bx+30,360);ctx.stroke();
    ctx.fillStyle='#6a6458';ctx.save();ctx.translate(bx,by);ctx.rotate(-.18);ctx.beginPath();ctx.ellipse(0,0,34,11,0,0,7);ctx.fill();ctx.fillStyle='#5a5448';ctx.beginPath();ctx.ellipse(-26,6,10,5,.4,0,7);ctx.fill();ctx.restore();ctx.fillStyle='#3a3630';ctx.fillRect(bx-3,by+14,6,5)}}
  ridge(.22,'#3a3346',360,14,2,18);
  // les lueurs des obus lointains
  for(const f of s.far||[]){const a=1-f.t/1.6;ctx.fillStyle='rgba(255,170,100,'+a*.35+')';ctx.beginPath();ctx.ellipse(f.x,f.y+40,30+f.t*30,8+f.t*6,0,0,7);ctx.fill();ctx.fillStyle='rgba(60,54,60,'+a*.4+')';ctx.beginPath();ctx.arc(f.x,f.y+20-f.t*30,8+f.t*22,0,7);ctx.fill()}
  ridge(.4,'#2e2836',384,12,3,30);
  // la couche du milieu : arbres déchiquetés, murs d'une ferme en ruine, piquets
  for(let i=-2;i<W/90+3;i++){const cell=Math.floor(camX*.6/90)+i,R=mulberry(cell*31+77),x=cell*90-camX*.6+R()*60,by=404+R()*10,k=R();
    if(k<.35){ctx.strokeStyle='#28222c';ctx.lineWidth=3+R()*4;const h=40+R()*70;ctx.beginPath();ctx.moveTo(x,by);ctx.lineTo(x+(R()-.5)*10,by-h);ctx.stroke();ctx.lineWidth=2;for(let j=0;j<3;j++){const yy=by-h*(.4+R()*.5);ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+(R()-.5)*40,yy-10-R()*14);ctx.stroke()}}
    else if(k<.45){ctx.fillStyle='#2a2430';ctx.beginPath();ctx.moveTo(x,by);ctx.lineTo(x,by-36-R()*30);ctx.lineTo(x+12,by-50-R()*20);ctx.lineTo(x+30,by-20);ctx.lineTo(x+46,by-34);ctx.lineTo(x+60,by);ctx.closePath();ctx.fill();ctx.fillStyle='#1a1620';ctx.fillRect(x+14,by-24,8,10)}
    else if(k<.6){ctx.strokeStyle='#2a2430';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,by);ctx.lineTo(x,by-16);ctx.moveTo(x+24,by);ctx.lineTo(x+24,by-14);ctx.stroke();ctx.lineWidth=.8;ctx.beginPath();for(let j=0;j<=6;j++)ctx.lineTo(x+j*4,by-12+Math.sin(j*2)*3);ctx.stroke()}}
}
function vfGroundDraw(t,camX){
  const x0=Math.floor((camX-60)/VF.STEP)*VF.STEP,x1=camX+W+60;
  const gg=ctx.createLinearGradient(0,390,0,H);gg.addColorStop(0,'#5a4838');gg.addColorStop(.25,'#46382a');gg.addColorStop(1,'#241c14');
  ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(x0,H+20);for(let X=x0;X<=x1;X+=VF.STEP)ctx.lineTo(X,vfGround(X));ctx.lineTo(x1,H+20);ctx.closePath();ctx.fill();
  // la lèvre du sol éclairée par l'aube, les plaques de marne
  ctx.strokeStyle='rgba(200,170,140,.35)';ctx.lineWidth=2;ctx.beginPath();for(let X=x0;X<=x1;X+=VF.STEP){const y=vfGround(X);X===x0?ctx.moveTo(X,y):ctx.lineTo(X,y)}ctx.stroke();
  for(let X=Math.floor(x0/37)*37;X<x1;X+=37){const R=mulberry(X|0),y=vfGround(X)+6+R()*40;ctx.fillStyle=R()<.3?'rgba(150,140,118,.35)':'rgba(30,22,14,.3)';ctx.beginPath();ctx.ellipse(X+R()*20,y,4+R()*12,2+R()*3,R()*3,0,7);ctx.fill()}
  // l'eau croupie au fond des entonnoirs
  for(let X=Math.floor(x0/24)*24;X<x1;X+=24){const y=vfGround(X),yl=vfGround(X-40),yr=vfGround(X+40);if(y>yl+14&&y>yr+14&&y>vfGround(X-16)+2&&y>vfGround(X+16)+2){const wg=ctx.createLinearGradient(0,y-6,0,y+2);wg.addColorStop(0,'#b08a7a');wg.addColorStop(1,'#4a3c48');ctx.fillStyle=wg;ctx.beginPath();ctx.ellipse(X,y-3,20,4,0,0,7);ctx.fill()}}
  // les tranchées : clayonnage, rondins, caillebotis, sacs du parapet
  for(const[a,b,d,side]of VF_TR){if(b<camX-80||a>camX+W+80)continue;const s0=vfSurface((a+b)/2),de=side==='de';
    ctx.fillStyle='#2a2018';ctx.fillRect(a,s0,b-a,d);
    ctx.fillStyle=de?'#4a3a28':'#5a4630';for(let x=a;x<b;x+=8){ctx.fillRect(x,s0+2,6,d-24)}
    ctx.strokeStyle=de?'#3a2c1c':'#6a5236';ctx.lineWidth=1.4;for(let y=s0+6;y<s0+d-20;y+=6){ctx.beginPath();ctx.moveTo(a,y);for(let x=a;x<=b;x+=16)ctx.lineTo(x,y+((x/16|0)%2?2:-2));ctx.stroke()}
    ctx.fillStyle='#5a4630';for(let x=a+4;x<b-4;x+=26){ctx.fillRect(x,s0+d-6,22,4);ctx.fillStyle='#3a2a1a';ctx.fillRect(x,s0+d-3,22,2);ctx.fillStyle='#5a4630'}
    const pf=de?b:a-34,pd=de?a-26:b;
    for(let r=0;r<2;r++)for(let k=0;k<3;k++){ctx.fillStyle=mix('#8a7a5a','#5a4a34',(k*3+r)%4/4);rr(ctx,pf+k*11-(r%2)*5,s0-14+r*7-7,13,8,3);ctx.fill()}
    for(let k=0;k<2;k++){ctx.fillStyle='#6a5a40';rr(ctx,pd+k*12,s0-14,13,7,3);ctx.fill()}
    // les barbelés devant la tranchée
    const wx=de?b+60:a-150;ctx.strokeStyle='#2a2420';ctx.lineWidth=1.5;for(let k=0;k<5;k++){const x=wx+k*24;ctx.beginPath();ctx.moveTo(x,vfGround(x));ctx.lineTo(x+3,vfGround(x)-22);ctx.stroke()}
    ctx.lineWidth=.8;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(wx,vfGround(wx)-18+k*4);for(let x=wx;x<=wx+96;x+=6)ctx.lineTo(x,vfGround(x)-18+k*4+Math.sin(x*.7+k)*2);ctx.stroke()}}
  // le fort, au départ : la carapace de béton, la terre retournée, la tourelle
  if(camX<1100){const R=mulberry(5);// le fort : fossé, façade de la caserne, carapace de béton, terre retournée, tourelle, cloche
    ctx.fillStyle='#2a221a';ctx.fillRect(40,410,60,60);
    ctx.fillStyle='#6e6656';ctx.fillRect(100,330,900,110);for(let y=330;y<440;y+=11){let x=100+((y/11|0)%2?0:12);while(x<1000){const w=18+R()*14;ctx.fillStyle=mix('#7e7464','#5a5242',R());ctx.fillRect(x+1,y+1,w-2,9);x+=w}}
    for(const x of[180,300,420,540,660,780]){ctx.fillStyle='#bab09c';ctx.beginPath();ctx.moveTo(x-28,440);ctx.lineTo(x-28,384);ctx.arc(x,384,28,Math.PI,0);ctx.lineTo(x+28,440);ctx.fill();ctx.fillStyle='#0c0a0a';ctx.beginPath();ctx.moveTo(x-22,440);ctx.lineTo(x-22,384);ctx.arc(x,384,22,Math.PI,0);ctx.lineTo(x+22,440);ctx.fill();
      for(let r=0;r<4;r++)for(let j=0;j<2;j++){ctx.fillStyle=mix('#8a7a5a','#6a5a40',R());rr(ctx,x-20+j*20+(r%2)*6,428-r*11,18,10,4);ctx.fill()}}
    ctx.fillStyle='#8a8478';ctx.fillRect(90,300,920,32);ctx.strokeStyle='rgba(30,26,22,.5)';ctx.lineWidth=1.2;for(let k=0;k<14;k++){const x=100+R()*880;ctx.beginPath();ctx.moveTo(x,300);ctx.lineTo(x+(R()-.5)*20,320);ctx.lineTo(x+(R()-.5)*30,332);ctx.stroke()}
    ctx.fillStyle='#5a5042';ctx.beginPath();ctx.moveTo(80,302);for(let X=80;X<=1020;X+=16)ctx.lineTo(X,286-Math.sin(X*.05)*6-((X*7)%11));ctx.lineTo(1020,302);ctx.fill();
    ctx.fillStyle='#3a3c40';ctx.beginPath();ctx.ellipse(620,288,44,13,0,Math.PI,0);ctx.fill();ctx.fillStyle='#4a4e54';ctx.beginPath();ctx.ellipse(620,286,32,9,0,Math.PI,0);ctx.fill();
    ctx.fillStyle='#34363a';ctx.beginPath();ctx.ellipse(380,288,14,12,0,Math.PI,0);ctx.fill();ctx.fillStyle='#0a0a0c';ctx.fillRect(373,282,14,3)}
  // les fosses des canons : sacs de terre, filet de camouflage
  for(const g of VF.guns){if(g.X<camX-200||g.X>camX+W+200)continue;const s0=vfSurface(g.X);
    for(const e of[g.X-100,g.X+90])for(let r=0;r<2;r++)for(let k=0;k<2;k++){ctx.fillStyle=mix('#8a7a5a','#5a4a34',(k+r)%2*.5);rr(ctx,e+k*8-(r%2)*4,s0-10-r*7,12,7,3);ctx.fill()}}
  // les fientes au sol
  for(const q of V.s.splats){ctx.fillStyle='rgba(244,242,234,'+Math.min(1,(8-q.t))+')';ctx.beginPath();ctx.ellipse(q.x,q.y-1,4,1.6,0,0,7);ctx.fill()}
}
function vfThings(t,camX){
  const s=V.s,vis=X=>X>camX-160&&X<camX+W+160;
  // les canons (et leur filet)
  for(const g of VF.guns)if(vis(g.X))vfGun(g,t);
  // les caisses d'obus, les paniers, le téléphone, les chevaux de l'avant-train
  if(vis(-8440)){const y=vfSurface(-8440);ctx.fillStyle='#5a4028';ctx.fillRect(-8420,y-22,30,22);ctx.fillStyle='#3a3a30';ctx.fillRect(-8414,y-30,18,8)}
  for(const X of[-7460,-7860,-8340,-8760,-9220,-9660]){if(!vis(X))continue;const y=vfSurface(X)+14;for(let k=0;k<3;k++)for(let j=0;j<2;j++){ctx.fillStyle='#8a6a3a';rr(ctx,X+k*12,y-12-j*12,11,12,3);ctx.fill();ctx.fillStyle='#b8902a';ctx.fillRect(X+k*12+3,y-15-j*12,5,4)}}
  if(vis(-9780)){const y=vfSurface(-9780);vxHorse(ctx,-9780,y,.42,1,t*.1,{col:'#5a3a26',rate:.4,traceTo:-60});vxHorse(ctx,-9840,y-3,.4,1,t*.1+3,{col:'#3a2a20',far:true,rate:.4,traceTo:-60});
    ctx.fillStyle='#4a5040';ctx.fillRect(-9900,y-34,50,22);for(const wx of[-9890,-9858]){ctx.strokeStyle='#2a2420';ctx.lineWidth=2;ctx.beginPath();ctx.arc(wx,y-12,12,0,7);ctx.stroke()}}
  // les mitrailleuses
  for(const m of VF.mgs)if(vis(m.X))vfMG(m,t);
  // les hommes
  for(const p of VF.people){const X=p.walk&&(p.role==='carry'||p.role==='shell')?p.wx:p.X;if(!vis(X))continue;vfMan(p,X,t)}
  // le buisson où Raymond tombera
  if(vis(VF.bush)&&V.sc!=='wound'){const b=vfGround(VF.bush);vfBush(VF.bush,b,t,true);vfBush(VF.bush,b,t,false)}
}
function vfMan(p,X,t){
  const s=V.s,sc=4.8,dxB=s.x-X,near=Math.abs(dxB)<420&&!s.fall;let pose=Object.assign({},VX_P.stand),face=Object.assign({},p.face),rifle=null,kit={},f=p.f,rot=0;
  face.splat=p.splat;
  const look=(on)=>{if(on){face.look=[clamp(dxB*f/200,-1,1),-1];pose.head=-.5}};
  switch(p.role){
    case'rifle':case'rifleFloor':pose=Object.assign({},VX_P.aim);rifle={from:'far',bayo:1,flash:p.flash>0?1:0};face.ex='angry';break;
    case'spot':if(p.pointT>0){p.pointT-=1/120;pose=Object.assign({},VX_P.point);face.ex='shout';look(true);f=dxB<0?-1:1}else{pose=Object.assign({},VX_P.aim);rifle={from:'far',bayo:1}}break;
    case'officer':pose=near?Object.assign({},VX_P.point):Object.assign({},VX_P.binoc);face.helmet='pickel';face.stache='up';if(near){face.ex='shout';look(true);f=dxB<0?-1:1}break;
    case'carry':pose=vxWalk(p.t*7,.8);pose.na1=.6;pose.na2=1.8;pose.fa1=.5;pose.fa2=1.9;f=p.dir||1;break;
    case'mgun':pose=Object.assign({},VX_P.kneel,{nT:{x:4.2,y:-5.6},fT:{x:3.6,y:-5.2},head:.2});face.ex=p.mg.on?'shout':'angry';break;
    case'mfeed':pose=Object.assign({},VX_P.kneel,{nT:{x:4.6,y:-4.4},fT:{x:4,y:-4.6}});break;
    case'lanyard':{const g=p.gun;pose=Object.assign({},VX_P.stand,{lean:-.15-g.recoil*.1,nT:{x:4.4,y:-6.4+g.recoil},fT:{x:-1,y:-3.4}});face.ex=g.warn?'wince':'neutral';
      if(g.warn||g.recoil>.5)pose.fT={x:.8,y:-9.4};break}
    case'ram':{const g=p.gun,u=Math.sin(p.t*2);pose=Object.assign({},VX_P.stand,{lean:.25,nT:{x:4+u,y:-6.6},fT:{x:3+u,y:-6.4}});if(g.warn||g.recoil>.4){pose=Object.assign({},VX_P.stand,{lean:-.1,nT:{x:.8,y:-9.6},fT:{x:.3,y:-9.4},head:-.2});face.ex='wince'}break}
    case'chief':{const g=p.gun;pose=g.warn?Object.assign({},VX_P.point,{head:-.1}):Object.assign({},VX_P.stand,{nT:{x:2.2,y:-4},fT:{x:1,y:-4}});face.ex=g.warn?'shout':'neutral';face.helmet='mutze';break}
    case'shell':pose=vxWalk(p.t*7,.7);pose.na1=.8;pose.na2=2.2;pose.fa1=.7;pose.fa2=2.3;f=p.dir||1;break;
    case'phone':pose=Object.assign({},VX_P.stand,{nT:{x:1.6,y:-9.6},fT:{x:3,y:-5}});face.ex='shout';break;
    case'binoc':pose=Object.assign({},VX_P.binoc);face.helmet='pickel';break;
    // les Français
    case'lookout':pose=Object.assign({},VX_P.binoc);if(near)look(true);break;
    case'look':if(p.pointT>0){p.pointT-=1/120;pose=Object.assign({},VX_P.point);face.ex='surprise';f=dxB<0?-1:1;look(true)}else{pose=Object.assign({},VX_P.stand);if(near){look(true);face.ex='surprise';f=dxB<0?-1:1}}
      if(p.aimT>0){p.aimT-=1/120;pose=vfAimPose(p,X,f=dxB<0?-1:1);rifle={from:'far',bayo:1,flash:p.flash>0?1:0,a:pose.ra};face.ex='angry'}break;
    case'rifleFR':pose=Object.assign({},VX_P.stand,{nT:{x:1.2,y:-7},fT:{x:.6,y:-4.6}});rifle={from:'near',a:-1.5,back:3};if(near){look(true);f=dxB<0?-1:1}
      if(p.aimT>0||V.s.fr.t>=0){if(p.aimT>0)p.aimT-=1/120;pose=vfAimPose(p,X,f=dxB<0?-1:1);rifle={from:'far',bayo:1,flash:p.flash>0?1:0,a:pose.ra};face.ex='angry'}break;
    case'sarge':pose=near?Object.assign({},VX_P.point):Object.assign({},VX_P.stand,{nT:{x:2.4,y:-5.4},fT:{x:2,y:-5.6}});face.stache='walrus';face.ex=near?'shout':'neutral';if(near)f=dxB<0?-1:1;
      if(p.aimT>0){p.aimT-=1/120;pose=vfAimPose(p,X,f);rifle={from:'far',bayo:1,flash:p.flash>0?1:0,a:pose.ra}}break;
    case'sit':pose=Object.assign({},VX_P.sit);break;
    case'cook':pose=Object.assign({},VX_P.kneel,{nT:{x:4.4,y:-2.6+Math.sin(p.t*3)*.4},fT:{x:3.8,y:-3}});break;
    case'write':pose=Object.assign({},VX_P.sit,{lean:.25,head:.4,nT:{x:4.2,y:-2.6+Math.sin(p.t*12)*.1},fT:{x:3.6,y:-2.8}});face.ex='sad';break;
    case'sleep':pose=Object.assign({},VX_P.sit,{lean:-.3,head:-.8});face.ex='sleep';break;
  }
  if(p.wipe>0){pose.nT={x:.6,y:-10.4+Math.sin(p.t*14)*.4};face.ex='wince'}
  let y=p.y;if(pose===VX_P.sit||p.role==='sit'||p.role==='write'||p.role==='sleep'){/* assis sur la banquette */}
  const seated=p.role==='sit'||p.role==='write'||p.role==='sleep';
  const j=seated?vxSoldier(ctx,{hip:{x:X,y:y-27},s:sc,f,side:p.side==='art'?'de':p.side,t,pose,face,rifle,kit}):vxSoldier(ctx,{x:X,y,s:sc,f,side:p.side==='art'?'de':p.side,t,pose,face,rifle,kit});
  p.hx=j.head.x;p.hy=j.head.y-sc*1.1;
  if(p.role==='cook'){ctx.fillStyle='#2a2420';ctx.fillRect(X+14*f-8,y-10,16,10);ctx.fillStyle='rgba(255,140,60,.8)';ctx.beginPath();ctx.arc(X+14*f,y-10,3,0,7);ctx.fill();if(rnd()<.05)V.parts.push({k:'smoke',wx:1,x:X+14*f,y:y-20,vx:6,vy:-20,g:-4,life:0,max:2,r:2,grow:8,col:'#c8c8c0',a:.3})}
  if(p.role==='carry'){ctx.fillStyle='#5a4028';ctx.fillRect(j.nh.x-8,j.nh.y-6,16,10)}
  if(p.role==='shell'){ctx.save();ctx.translate((j.nh.x+j.fh.x)/2,(j.nh.y+j.fh.y)/2);ctx.rotate(-.2);ctx.fillStyle='#b8902a';rr(ctx,-9,-4,14,8,3);ctx.fill();ctx.fillStyle='#4a4a44';ctx.beginPath();ctx.moveTo(5,-4);ctx.quadraticCurveTo(14,0,5,4);ctx.fill();ctx.restore()}
  if(p.role==='phone'){ctx.strokeStyle='#1a1a1a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(j.nh.x,j.nh.y);ctx.quadraticCurveTo(X+20,y,X+24,y-20);ctx.stroke()}
}
/* un soldat qui épaule vers Raymond (le fusil suit l'oiseau) */
function vfAimPose(p,X,f){const s=V.s,sh={x:X+.6*4.8*f,y:p.y-11.2*4.8};let dx=(s.x-sh.x)*f,dy=s.y-sh.y;if(s.fall){dx=(s.fall.x0-sh.x)*f;dy=s.fall.y0-sh.y}
  const a=Math.atan2(dy,Math.max(4,dx)),c=Math.cos(a),sn=Math.sin(a),ox=.4,oy=-3.6;
  return Object.assign({},VX_P.stand,{lean:-.1,head:a*.5,nT:{x:ox+c*1.2-sn*.4,y:oy+sn*1.2+.3},fT:{x:ox+c*3.6,y:oy+sn*3.6},ra:a})}
function vfMG(m,t){const x=m.X,y=m.y;ctx.save();ctx.translate(x,y);
  // le traîneau, le bouclier, le manchon à eau, la bande de cartouches
  ctx.fillStyle='#3a3c34';ctx.fillRect(-26,-4,40,5);ctx.fillRect(-20,-12,4,9);ctx.fillRect(4,-12,4,9);
  ctx.save();ctx.translate(-4,-14);ctx.rotate(m.ang);ctx.fillStyle='#4a4e44';rr(ctx,-14,-5,22,10,2);ctx.fill();ctx.fillStyle='#5a5e54';ctx.fillRect(6,-4,26,8);ctx.fillStyle='#2a2c28';ctx.fillRect(32,-1.5,6,3);
  for(let k=0;k<6;k++){ctx.fillStyle='#3a3e36';ctx.fillRect(9+k*4,-4,1.2,8)}
  if(m.flash>0){ctx.fillStyle='rgba(255,230,140,.95)';ctx.beginPath();ctx.moveTo(38,0);ctx.lineTo(54,-6);ctx.lineTo(48,0);ctx.lineTo(54,6);ctx.closePath();ctx.fill()}
  ctx.restore();
  ctx.strokeStyle='#b8902a';ctx.lineWidth=2;ctx.setLineDash([2,1.5]);ctx.beginPath();ctx.moveTo(-10,-12);ctx.quadraticCurveTo(-20,-2,-32,-6);ctx.stroke();ctx.setLineDash([]);
  ctx.restore()}
function vfGun(g,t){const x=g.X,y=g.y,rc=g.recoil*(g.k==='sfh'?8:12),big=g.k==='sfh';ctx.save();ctx.translate(x,y);
  // la flèche (l'affût) jusqu'à la bêche
  ctx.fillStyle='#4a4e40';ctx.beginPath();ctx.moveTo(10,-26);ctx.lineTo(-78,-4);ctx.lineTo(-80,0);ctx.lineTo(-70,0);ctx.lineTo(14,-20);ctx.closePath();ctx.fill();ctx.fillStyle='#3a3c32';ctx.fillRect(-84,-6,8,8);
  // le tube, son berceau, la culasse
  ctx.save();ctx.translate(16,-30);ctx.rotate(-g.el);ctx.translate(-rc,0);
  ctx.fillStyle='#545a4a';if(big){rr(ctx,-24,-9,72,18,4);ctx.fill();ctx.fillStyle='#4a4e40';ctx.fillRect(40,-8,10,16)}else{rr(ctx,-20,-5,82,10,3);ctx.fill();ctx.fillStyle='#4a4e40';ctx.fillRect(56,-5.5,8,11)}
  ctx.fillStyle='#3a3e32';ctx.fillRect(-24,-10,10,big?20:14);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(-10,big?-8:-4,50,2);
  if(g.flash>0){const L2=big?50:64;ctx.fillStyle='rgba(255,220,130,'+g.flash+')';ctx.beginPath();ctx.moveTo(L2,0);ctx.lineTo(L2+40,-16);ctx.lineTo(L2+28,0);ctx.lineTo(L2+44,14);ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,255,230,'+g.flash+')';ctx.beginPath();ctx.arc(L2+6,0,9,0,7);ctx.fill()}
  ctx.restore();
  // le bouclier et la roue
  ctx.fillStyle='#5a604e';ctx.beginPath();ctx.moveTo(4,-54);ctx.lineTo(30,-50);ctx.lineTo(32,-16);ctx.lineTo(2,-14);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.stroke();
  const wr=big?22:19;ctx.strokeStyle='#3a2a1a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(10,-wr,wr,0,7);ctx.stroke();ctx.lineWidth=2;for(let k=0;k<12;k++){const a=k*Math.PI/6;ctx.beginPath();ctx.moveTo(10,-wr);ctx.lineTo(10+Math.cos(a)*(wr-2),-wr+Math.sin(a)*(wr-2));ctx.stroke()}
  ctx.fillStyle='#2a2a26';ctx.beginPath();ctx.arc(10,-wr,4,0,7);ctx.fill();
  // le filet de camouflage, tendu sur ses perches
  ctx.strokeStyle='#3a3020';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-96,0);ctx.lineTo(-92,-78);ctx.moveTo(84,0);ctx.lineTo(80,-84);ctx.stroke();
  ctx.strokeStyle='rgba(70,80,50,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-92,-78);ctx.quadraticCurveTo(-6,-64,80,-84);ctx.stroke();
  for(let k=0;k<16;k++){const u=k/15,xx=lerp(-92,80,u),yy=lerp(-78,-84,u)+Math.sin(u*Math.PI)*14;ctx.fillStyle=k%3?'rgba(70,84,50,.8)':'rgba(110,100,60,.8)';ctx.beginPath();ctx.ellipse(xx,yy+Math.sin(t*2+k)*1.2,7,4,k,0,7);ctx.fill()}
  ctx.restore();
  if(g.blast){const a=1-g.blast.t/.22;ctx.fillStyle='rgba(255,200,120,'+a*.35+')';ctx.beginPath();ctx.arc(g.blast.x,g.blast.y,30+g.blast.t*120,0,7);ctx.fill()}
}
function vfBoom(b,t){const h=b.h*Math.min(1,b.t/.12)*(1-Math.max(0,(b.t-.32)/.4)),w=40+b.t*50,a=1-b.t/1.1;
  if(b.t<.25){const gl=ctx.createRadialGradient(b.X,b.y-10,4,b.X,b.y-10,90);gl.addColorStop(0,'rgba(255,230,160,'+(1-b.t*4)+')');gl.addColorStop(.4,'rgba(255,140,60,'+(.8-b.t*3)+')');gl.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=gl;ctx.fillRect(b.X-90,b.y-100,180,110)}
  if(h>4){ctx.fillStyle='rgba(58,46,34,'+Math.min(1,a*1.4)+')';ctx.beginPath();ctx.moveTo(b.X-w*.6,b.y);ctx.quadraticCurveTo(b.X-w,b.y-h*.6,b.X-w*.5,b.y-h);ctx.quadraticCurveTo(b.X,b.y-h-24,b.X+w*.5,b.y-h);ctx.quadraticCurveTo(b.X+w,b.y-h*.6,b.X+w*.6,b.y);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(90,76,60,'+a+')';for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(b.X+(k-2)*w*.3,b.y-h*(.5+.1*Math.sin(k*2)),w*.32,0,7);ctx.fill()}}
}
function vfBush(X,y,t,back,low){const R=mulberry(77);ctx.save();
  for(let k=0;k<(back?26:14);k++){const a=R()*Math.PI,r=back?20+R()*26:24+R()*20,x=X+Math.cos(a)*r*1.3*(R()<.5?-1:1),yy=y-8-Math.sin(a)*r;
    if(low&&yy<y-14)continue;ctx.fillStyle=back?(k%3?'#2e3a22':'#3a4a2a'):(k%2?'#3e5030':'#4a5e36');ctx.beginPath();ctx.ellipse(x,yy+Math.sin(t*1.2+k)*.8,back?16:12,back?11:8,R()*3,0,7);ctx.fill()}
  if(!back){ctx.strokeStyle='#2a2018';ctx.lineWidth=1.4;if(!low)for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(X+(k-3)*10,y);ctx.lineTo(X+(k-3)*16,y-30-k%3*8);ctx.stroke()}
    for(let k=0;k<5;k++){const x=X-40+k*20+R()*8,yy=y-4-R()*10;ctx.strokeStyle='#3a4a2a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,yy);ctx.stroke();ctx.fillStyle='#c8281e';ctx.beginPath();ctx.arc(x,yy,3,0,7);ctx.fill();ctx.fillStyle='#1a1010';ctx.beginPath();ctx.arc(x,yy,.9,0,7);ctx.fill()}}
  ctx.restore()}
function vfFore(t,camX){
  // le premier plan : piquets, barbelés, grosses mottes (plus rapides que le sol)
  ctx.fillStyle='#16110c';ctx.strokeStyle='#16110c';
  for(let i=-1;i<W/180+2;i++){const cell=Math.floor(camX*1.3/180)+i,R=mulberry(cell*17+9),x=cell*180-camX*1.3+R()*100,k=R();
    if(k<.4){ctx.beginPath();ctx.ellipse(x,H+4,60+R()*50,12+R()*8,0,Math.PI,0);ctx.fill()}
    else if(k<.75){ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x+4,H-60-R()*30);ctx.stroke();ctx.lineWidth=1;for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(x,H-20-j*14);for(let xx=0;xx<120;xx+=8)ctx.lineTo(x+xx,H-20-j*14+Math.sin(xx*.6+j)*4+xx*.05);ctx.stroke()}}}
}
