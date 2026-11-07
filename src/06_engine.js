/* =========================================================
   ANALYSE DES NIVEAUX ET COLLISIONS
   ========================================================= */
function parseLevel(i,ov){
  const def=ov||LEVELS[i],th=THEMES[def.theme];
  ROWS=def.rows||15;
  const rows=Array.from({length:ROWS},()=>'');
  const zones=[];
  for(const sg of def.segs){
    const seg=typeof sg==='string'?sg:sg.s;const c0=rows[0].length;
    const lines=seg.split('\n').map(s=>s.trim()).filter(s=>s.length);
    const w=Math.max(...lines.map(l=>l.length));
    const pad=ROWS-lines.length;
    for(let r=0;r<ROWS;r++){const l=r<pad?'':lines[r-pad];rows[r]+=l.padEnd(w,'.')}
    if(sg.z)zones.push({z:sg.z,c0,c1:c0+w-1});
  }
  // sol plus épais sous le niveau : la caméra peut se centrer sur Raymond même près du sol
  if(def.deep){for(let k=0;k<def.deep;k++)rows.push(def.deepFill?def.deepFill.repeat(rows[0].length):rows[rows.length-1]);ROWS+=def.deep}
  const wT=rows[0].length;
  const g=rows.map(r=>r.split(''));
  for(let r=0;r<ROWS;r++){g[r][0]='W';g[r][wT-1]='W'}
  // trous creusés dans le sol (cachettes) et paille cachée
  for(const[c,r]of def.holes||[])g[r][c]='.';
  for(const[c,r]of def.stashCells||[])g[r][c]='s';
  for(const[c,r]of def.fakes||[])g[r][c]='f';
  const L={def,i,w:wT,wpx:wT*T,g,th,corn:[],medal:null,cps:[],exit:null,rats:[],moths:[],movers:[],hints:[],quips:[],decor:[],lights:[],mark:new Set(),
    chaser:null,triggerX:Infinity,spawn:null,dome:null,avoid:[],updrafts:[],bolts:[],bells:[],zones,decorFront:[],hunters:[]};
  mechInit(L);
  let hi=0,qi=0,si=0,mi=0;
  const movers=[];
  for(let c=0;c<wT;c++)for(let r=0;r<ROWS;r++){
    const ch=g[r][c],x=c*T,y=r*T,cx=x+T/2,cy=y+T/2;
    let clear=true;
    switch(ch){
      case'S':L.spawn={x:cx,y:y+T};L.avoid.push(cx);break;
      case'o':L.corn.push({x:cx,y:cy,taken:false,ph:c*.7+r});break;
      case'*':if(def.medalOn)L.medal={x:cx,y:cy,taken:false};break;
      case'C':L.cps.push({x:cx,y:y+T,on:false});L.avoid.push(cx);break;
      case'E':L.exit={x:x-6,y:y-T,w:T+12,h:2*T};L.avoid.push(cx,cx+60,cx-60);break;
      case'k':if(th.walker!=='none')L.rats.push({kind:th.walker,x:cx-15,y:y+T-16,w:30,h:16,vx:th.walker==='goose'?110:th.walker==='hedgehog'?60:95,vy:0,onGround:false,t:(c*.37)%9,sq:1+(c%3)});break;
      case'r':if(th.walker!=='none'){const pk=th.walker==='boar'?'piglet':th.walker;L.rats.push({kind:pk,x:cx-11,y:y+T-12,w:22,h:12,vx:th.walker==='boar'?95:th.walker==='goose'?110:95,vy:0,onGround:false,t:(c*.53)%9,sq:2.5})}break;
      case'm':L.moths.push({kind:th.flyer,cx,cy,axis:'h',amp:95,sp:2.3+(mi%3)*.25,t:mi*1.3,x:cx,y:cy,fl:0});mi++;break;
      case'n':L.moths.push({kind:th.flyer,cx,cy,axis:'v',amp:72,sp:2.1+(mi%3)*.25,t:mi*1.3,x:cx,y:cy,fl:0});mi++;break;
      case'M':movers.push({c,r,axis:'h',w:2,kind:'dolly'});break;
      case'N':movers.push({c,r,axis:'h',w:5,kind:'truck'});break;
      case'V':movers.push({c,r,axis:'v',w:2,kind:'lift'});break;
      case'U':L.updrafts.push({x:x,w:2*T,top:0,bottom:y+T});break;
      case'!':L.bolts.push({x:cx,ph:L.bolts.length*.95,flash:0});break;
      case'T':L.triggerX=x;break;
      case'K':L.chaser={type:'cat',home:{x:cx-22,y:y+T-26},x:cx-22,y:y+T-26,w:44,h:26,vx:0,vy:0,state:'sleep',wakeT:0,onGround:true,t:0,f:1,meowT:2,rrT:0};L.avoid.push(cx);break;
      case'Q':L.chaser={type:'drone',home:{x:cx-18,y:cy-9},x:cx-18,y:cy-9,w:36,h:18,vx:0,vy:0,state:'sleep',t:0,f:1,meowT:2};break;
      case'Z':L.chaser={type:'buse',home:{x:cx-24,y:cy-14},x:cx-24,y:cy-14,w:48,h:26,vx:0,vy:0,state:'sleep',t:0,f:1,meowT:2,swoop:0,phase:'hover',pt:0};break;
      case'h':L.hints.push({x:cx,y:y+T,i:hi++});L.avoid.push(cx);break;
      case'q':L.quips.push({x:cx,i:qi++,fired:false});break;
      case'l':L.decor.push({t:th.outdoor?'lantern':'lamp',x:cx,y:cy});L.lights.push({x:cx,y:cy+14,r:250,i:.95,warm:1});break;
      case'g':L.decor.push({t:th.outdoor?'board':'sign',x:cx,y:cy,text:def.signs[si++]||''});break;
      case'u':L.dome={x:cx,floor:y+2*T};L.avoid.push(cx,cx-60,cx+60,cx-120);break;
      case'w':{let fr=r+1;while(fr<ROWS&&g[fr][c]!=='#')fr++;L.decor.push({t:'mammoth',x:cx,y:cy,floor:fr*T})}L.avoid.push(cx,cx-200,cx-100,cx+100,cx+200);break;
      case'c':L.decor.push({t:'clock',x:cx,y:cy});break;
      case'y':L.decor.push({t:'stove',x:cx,y:y+2*T});L.lights.push({x:cx,y:y+2*T-40,r:170,i:.8,warm:2});L.avoid.push(cx);break;
      case'b':L.decor.push({t:'bowl',x:cx,y:y+T});L.avoid.push(cx);break;
      case'j':{const b={t:'bell',x:cx,y:cy,ring:0,ph:0};L.decor.push(b);L.bells.push(b);L.lights.push({x:cx,y:cy+40,r:160,i:.5});break}
      case'i':L.decor.push({t:'statue',x:cx,y:y+T});break;
      case'|':L.mark.add(c+','+r);break;
      default:clear=mechParse(L,ch,c,r,x,y,cx,cy,movers);
    }
    if(clear)g[r][c]='.';
  }
  for(const m of movers){
    const pw=m.w*T;
    if(m.axis==='h'){
      let a=m.c-3,b=m.c+3;
      for(let c=m.c-1;c>=0;c--)if(L.mark.has(c+','+m.r)){a=c+1;break}
      for(let c=m.c+1;c<wT;c++)if(L.mark.has(c+','+m.r)){b=c-m.w;break}
      L.movers.push({axis:'h',kind:m.kind,x:m.c*T,y:m.r*T,w:pw,h:14,a0:a*T,a1:b*T,t:0,dx:0,dy:0,speed:m.kind==='truck'?115:m.kind==='tram'?95:72});
    }else if(m.axis==='s'||m.axis==='p'){
      const mm={axis:m.axis,kind:m.kind,c:m.c,r:m.r,x:m.c*T,y:m.r*T,w:T,h:12,t:0,dx:0,dy:0};mechMoverInit(L,mm);L.movers.push(mm);
    }else{
      let a=m.r-3,b=m.r;
      for(let r=m.r-1;r>=0;r--)if(L.mark.has(m.c+','+r)){a=r+1;break}
      for(let r=m.r+1;r<ROWS;r++)if(L.mark.has(m.c+','+r)){b=r-1;break}
      L.movers.push({axis:'v',kind:m.kind,x:m.c*T,y:m.r*T,w:pw,h:14,a0:b*T,a1:a*T,t:0,dx:0,dy:0,speed:60});
    }
  }
  mechPostParse(L);
  for(const m of L.movers){if(m.axis==='s'||m.axis==='p')continue;const span=Math.abs(m.a1-m.a0);const u=(m.axis==='h'?m.x-m.a0:m.a0-m.y)/Math.max(1,span);m.t=clamp(u,0,1)*span/m.speed}
  if(def.garlands)for(let x=200;x<L.wpx-200;x+=520){L.decor.push({t:'garland',x,y:130,w:400});for(let k=1;k<8;k+=2)L.lights.push({x:x+k*50,y:150+Math.sin(k/8*Math.PI)*40,r:110,i:.55,warm:1})}
  if(def.flyers)def.flyers.forEach((o,i)=>{const m=L.moths[i];if(!m||!o)return;if(o.kind)m.kind=o.kind;if(o.dy){m.cy+=o.dy;m.y=m.cy}if(o.amp)m.amp=o.amp;if(o.sp)m.sp=o.sp});
  for(const c of L.rats)c.base=Math.abs(c.vx);
  verdunPost(L);meusePost(L);zrPost(L);museePost(L);trainPost(L);garePost(L);langletPost(L);facadePost(L);a4Post(L);airePost(L);fertePost(L);crecyPost(L);
  return L;
}

/* ---------- grille et collisions ---------- */
let L=null;
const SOLID='#XWD%R',SOLID_ART='#XWD';
function tile(c,r){if(c<0||c>=L.w)return'W';if(r<0||r>=ROWS)return'.';return L.g[r][c]}
function isSolid(c,r){return SOLID.includes(tile(c,r))}
function owTop(ch,c,r){if(ch==='f')return r!=null&&tile(c,r-1)!=='f'&&!(L.def.openTop&&L.def.openTop.some(([a,b])=>a===c&&b===r))?0:-1;return(ch==='='||ch==='B'||ch==='A'||ch==='t')?0:(ch==='p'||ch==='~')?14:ch==='J'?(shutterOpen(c)?0:-1):-1}
function groundAt(c,r){const ch=tile(c,r);return SOLID.includes(ch)||owTop(ch,c,r)>=0}
function moveX(e,dx){
  if(!dx)return false;e.x+=dx;
  const r0=Math.floor(e.y/T),r1=Math.floor((e.y+e.h-.01)/T);
  if(dx>0){const c=Math.floor((e.x+e.w-.001)/T);for(let r=r0;r<=r1;r++)if(isSolid(c,r)){e.x=c*T-e.w;e.vx=0;return true}}
  else{const c=Math.floor(e.x/T);for(let r=r0;r<=r1;r++)if(isSolid(c,r)){e.x=(c+1)*T;e.vx=0;return true}}
  return false;
}
function moveY(e,dy){
  const prevB=e.y+e.h;e.y+=dy;
  const c0=Math.floor(e.x/T),c1=Math.floor((e.x+e.w-.01)/T);
  if(dy>0){
    const b=e.y+e.h,r=Math.floor(b/T);
    for(let c=c0;c<=c1;c++){
      const ch=tile(c,r);
      if(SOLID.includes(ch)){e.y=r*T-e.h;e.vy=0;e.onGround=true;return true}
      const o=owTop(ch,c,r);
      if(o>=0){const top=r*T+o;if(prevB<=top+.5&&b>=top){e.y=top-e.h;e.vy=0;e.onGround=true;return true}}
    }
  }else if(dy<0){
    const r=Math.floor(e.y/T);
    for(let c=c0;c<=c1;c++)if(isSolid(c,r)){e.y=(r+1)*T;e.vy=0;return true}
  }
  return false;
}
