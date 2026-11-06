/* =========================================================
   OBJETS POSÉS AU FOND (précalculés avec les tuiles)
   ========================================================= */
const PROPS={
  stanchions:{w:84,d(g,x,b){for(const px of[x+4,x+80]){g.fillStyle='#8a6a2a';g.fillRect(px-2,b-46,4,46);g.beginPath();g.ellipse(px,b-1,10,3,0,0,7);g.fill();g.fillStyle='#d9b45a';g.beginPath();g.arc(px,b-48,4.5,0,7);g.fill()}
    g.strokeStyle='#8a1f22';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+4,b-42);g.quadraticCurveTo(x+42,b-20,x+80,b-42);g.stroke();g.strokeStyle='rgba(255,170,160,.3)';g.lineWidth=1.2;g.stroke()}},
  crate:{w:62,d(g,x,b,R){g.fillStyle='#8a6a40';g.fillRect(x,b-42,60,42);g.fillStyle='rgba(0,0,0,.25)';for(let k=1;k<4;k++)g.fillRect(x,b-42+k*10.5,60,1.5);g.fillStyle='#6a4e2c';g.fillRect(x,b-42,6,42);g.fillRect(x+54,b-42,6,42);
    g.lineWidth=1.4;for(let k=0;k<22;k++){const sx=x+4+R()*52,a=-Math.PI/2+(R()-.5)*1.8,l=6+R()*12;g.strokeStyle=k%3?'#d9a441':'#a87a2a';g.beginPath();g.moveTo(sx,b-41);g.lineTo(sx+Math.cos(a)*l,b-41+Math.sin(a)*l);g.stroke()}
    g.fillStyle='rgba(30,20,10,.55)';g.font='8px '+F_DISP;g.textAlign='center';g.fillText(['VITTONCOURT','SALLE 2','INVENTAIRE','ORNITHO.'][Math.floor(R()*4)],x+30,b-14)}},
  owl:{w:48,d(g,x,b){g.strokeStyle='#4a3524';g.lineWidth=3;g.beginPath();g.moveTo(x+8,b);g.lineTo(x+12,b-30);g.moveTo(x+40,b);g.lineTo(x+36,b-30);g.stroke();g.fillStyle='#5a3e28';g.fillRect(x+4,b-34,40,6);
    g.fillStyle='#7a5a3a';g.beginPath();g.ellipse(x+24,b-50,11,15,0,0,7);g.fill();g.fillStyle='#9a7a52';g.beginPath();g.ellipse(x+24,b-46,7,10,0,0,7);g.fill();
    g.fillStyle='#7a5a3a';poly(g,[x+15,b-60,x+17,b-70,x+21,b-62]);g.fill();poly(g,[x+33,b-60,x+31,b-70,x+27,b-62]);g.fill();
    for(const ex of[x+19,x+29]){g.fillStyle='#e8a830';g.beginPath();g.arc(ex,b-58,4,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(ex,b-58,1.8,0,7);g.fill()}
    g.fillStyle='rgba(190,215,230,.1)';g.strokeStyle='rgba(220,235,245,.4)';g.lineWidth=1.5;g.beginPath();g.moveTo(x+6,b-34);g.lineTo(x+6,b-62);g.arc(x+24,b-62,18,Math.PI,0);g.lineTo(x+42,b-34);g.fill();g.stroke()}},
  helmet:{w:40,d(g,x,b){g.fillStyle='#7a6a5a';g.fillRect(x+6,b-50,28,50);g.fillStyle='#8a7a6a';g.fillRect(x+2,b-54,36,6);g.fillRect(x+2,b-4,36,4);
    g.fillStyle='#8a1f22';g.beginPath();g.ellipse(x+20,b-58,16,5,0,0,7);g.fill();
    g.fillStyle='#1a1a1c';g.beginPath();g.ellipse(x+20,b-66,13,10,0,Math.PI,0);g.fill();g.fillRect(x+6,b-66,28,4);
    g.fillStyle='#c9a35a';g.fillRect(x+19,b-86,2,12);g.beginPath();g.arc(x+20,b-75,3,0,7);g.fill();poly(g,[x+16,b-70,x+24,b-70,x+20,b-62]);g.fill()}},
  gramo:{w:60,d(g,x,b){g.fillStyle='#5a3a22';g.fillRect(x+4,b-24,44,24);g.fillStyle='#3a2414';g.fillRect(x+4,b-26,44,3);g.fillStyle='#222';g.beginPath();g.ellipse(x+26,b-27,16,3,0,0,7);g.fill();
    g.strokeStyle='#8a6a2a';g.lineWidth=3;g.beginPath();g.moveTo(x+30,b-28);g.quadraticCurveTo(x+40,b-46,x+44,b-58);g.stroke();
    const gr=g.createLinearGradient(x+30,b-90,x+70,b-50);gr.addColorStop(0,'#e0b85a');gr.addColorStop(1,'#7a5a24');g.fillStyle=gr;g.beginPath();g.moveTo(x+42,b-58);g.lineTo(x+30,b-92);g.quadraticCurveTo(x+52,b-98,x+70,b-76);g.closePath();g.fill()}},
  carpet:{w:34,d(g,x,b){g.save();g.translate(x+16,b);g.rotate(-.12);g.fillStyle='#7a2a26';rr(g,-9,-104,18,104,8);g.fill();g.fillStyle='#c9a35a';for(let y=-96;y<-6;y+=14)g.fillRect(-9,y,18,3);g.fillStyle='#4a1a18';g.beginPath();g.ellipse(0,-104,9,4,0,0,7);g.fill();g.restore()}},
  kraft:{w:82,d(g,x,b){g.fillStyle='#a8865a';poly(g,[x,b,x+10,b-92,x+80,b-90,x+72,b]);g.fill();g.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<6;k++)g.fillRect(x+12+k*10,b-88,1,86);
    g.strokeStyle='#4a3a2a';g.lineWidth=1.6;g.beginPath();g.moveTo(x+5,b-46);g.lineTo(x+76,b-45);g.moveTo(x+43,b-91);g.lineTo(x+38,b);g.stroke();g.fillStyle='#e9dfc7';g.fillRect(x+48,b-30,20,12)}},
  bust:{w:40,d(g,x,b){g.fillStyle='#9a9286';g.fillRect(x+8,b-52,24,52);g.fillStyle='#aaa296';g.fillRect(x+4,b-56,32,6);g.fillRect(x+4,b-4,32,4);
    g.fillStyle='#d6d0c2';g.beginPath();g.moveTo(x+2,b-56);g.quadraticCurveTo(x+20,b-78,x+38,b-56);g.closePath();g.fill();g.fillRect(x+16,b-80,8,10);
    g.beginPath();g.ellipse(x+20,b-90,9,12,0,0,7);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+23,b-88,5,10,0,0,7);g.fill()}},
  ammonite:{w:40,d(g,x,b){g.fillStyle='#4a3524';g.fillRect(x+4,b-30,32,6);g.fillRect(x+18,b-24,4,24);g.fillRect(x+10,b-3,20,3);
    g.fillStyle='#8a7a62';g.beginPath();g.arc(x+20,b-46,15,0,7);g.fill();g.strokeStyle='#5a4a36';g.lineWidth=1.4;g.beginPath();for(let a=0;a<14;a+=.2){const r=15*Math.exp(-a*.16);g.lineTo(x+20+Math.cos(a)*r,b-46+Math.sin(a)*r)}g.stroke()}},
  cabinet:{w:86,d(g,x,b){g.fillStyle='#4a3020';g.fillRect(x,b-116,84,116);g.fillStyle='#5a3a26';g.fillRect(x-3,b-120,90,6);
    for(let c=0;c<2;c++)for(let r=0;r<6;r++){const dx=x+5+c*39,dy=b-110+r*18;g.fillStyle='#6a4a30';g.fillRect(dx,dy,35,15);g.fillStyle='#e9dfc7';g.fillRect(dx+4,dy+4,12,6);g.fillStyle='#c9a35a';g.beginPath();g.arc(dx+26,dy+7.5,2.2,0,7);g.fill()}}},
  jars:{w:66,d(g,x,b){g.strokeStyle='#4a3524';g.lineWidth=3;g.beginPath();g.moveTo(x+6,b);g.lineTo(x+6,b-34);g.moveTo(x+58,b);g.lineTo(x+58,b-34);g.stroke();g.fillStyle='#5a3e28';g.fillRect(x,b-38,64,5);
    [[x+10,22,'#6a8a4a'],[x+28,30,'#8a8a5a'],[x+46,18,'#5a7a6a']].forEach(([jx,h,c])=>{g.fillStyle=rgba(c,.55);g.fillRect(jx,b-38-h,14,h);g.fillStyle='rgba(30,30,20,.6)';g.beginPath();g.ellipse(jx+7,b-38-h*.45,4,h*.25,0,0,7);g.fill();g.fillStyle='#3a3836';g.fillRect(jx-1,b-41-h,16,4);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(jx+2,b-36-h,2,h-6)})}},
  table:{w:112,d(g,x,b){g.fillStyle='#4a3020';g.fillRect(x+8,b-44,6,44);g.fillRect(x+96,b-44,6,44);
    g.fillStyle='#e9dfc7';g.fillRect(x,b-50,110,22);g.fillStyle='#a8322d';for(let i=0;i<11;i++)for(let j=0;j<2;j++)if((i+j)%2===0)g.fillRect(x+i*10,b-50+j*11,10,11);
    g.fillStyle='#d9d0bc';g.beginPath();g.ellipse(x+30,b-52,14,4,0,0,7);g.fill();g.fillStyle='#8a5a2a';g.beginPath();g.ellipse(x+30,b-53,10,2.5,0,0,7);g.fill();
    g.fillStyle='#c8964a';g.save();g.translate(x+62,b-55);g.rotate(-.15);rr(g,-14,-4,28,8,4);g.fill();g.restore();
    g.fillStyle='#2a4a2a';rr(g,x+86,b-82,10,32,3);g.fill();g.fillRect(x+89,b-92,4,12);g.fillStyle='#e9dfc7';g.fillRect(x+87,b-72,8,8)}},
  coat:{w:44,d(g,x,b){g.fillStyle='#3a2414';g.fillRect(x+20,b-124,4,124);g.beginPath();g.ellipse(x+22,b-1,14,4,0,0,7);g.fill();
    g.fillStyle='#22304a';g.beginPath();g.moveTo(x+10,b-112);g.lineTo(x+34,b-112);g.lineTo(x+38,b-40);g.lineTo(x+6,b-40);g.closePath();g.fill();
    g.fillStyle='#c9a35a';for(let k=0;k<4;k++){g.beginPath();g.arc(x+22,b-104+k*16,1.8,0,7);g.fill()}
    g.fillStyle='#22304a';rr(g,x+10,b-134,24,12,3);g.fill();g.fillStyle='#111';g.fillRect(x+6,b-123,22,3);g.fillStyle='#a8322d';g.fillRect(x+10,b-128,24,2)}},
  radio:{w:52,d(g,x,b){g.fillStyle='#4a3524';g.fillRect(x+6,b-30,40,4);g.fillRect(x+8,b-26,4,26);g.fillRect(x+40,b-26,4,26);
    g.fillStyle='#6a4428';g.beginPath();g.moveTo(x+4,b-30);g.lineTo(x+4,b-58);g.quadraticCurveTo(x+26,b-80,x+48,b-58);g.lineTo(x+48,b-30);g.closePath();g.fill();
    g.fillStyle='#b8a078';g.beginPath();g.moveTo(x+10,b-36);g.lineTo(x+10,b-56);g.quadraticCurveTo(x+26,b-70,x+42,b-56);g.lineTo(x+42,b-36);g.closePath();g.fill();
    g.strokeStyle='rgba(60,40,20,.5)';g.lineWidth=1;for(let k=0;k<5;k++){g.beginPath();g.moveTo(x+14+k*6,b-38);g.lineTo(x+14+k*6,b-58);g.stroke()}g.fillStyle='#d9c79a';g.beginPath();g.arc(x+18,b-33,2,0,7);g.arc(x+34,b-33,2,0,7);g.fill()}},
  broom:{w:28,d(g,x,b){g.save();g.translate(x+14,b);g.rotate(.18);g.fillStyle='#8a6a3a';g.fillRect(-1.5,-120,3,100);g.fillStyle='#c9a35a';poly(g,[-10,0,10,0,6,-22,-6,-22]);g.fill();g.fillStyle='#a8322d';g.fillRect(-7,-24,14,3);g.restore()}},
  chair:{w:44,d(g,x,b){g.strokeStyle='#3a2414';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x+6,b);g.lineTo(x+8,b-34);g.moveTo(x+36,b);g.lineTo(x+34,b-34);g.moveTo(x+30,b-34);g.quadraticCurveTo(x+40,b-60,x+34,b-80);g.stroke();
    g.fillStyle='#5a3a22';g.fillRect(x+2,b-38,38,6);g.beginPath();g.ellipse(x+30,b-70,9,13,.2,0,7);g.strokeStyle='#3a2414';g.lineWidth=2.5;g.stroke()}},
  slippers:{w:40,d(g,x,b){for(const sx of[x+2,x+20]){g.fillStyle='#7a2a26';rr(g,sx,b-8,18,8,4);g.fill();g.fillStyle='#3a5a3a';g.fillRect(sx+3,b-8,2,8);g.fillRect(sx+9,b-8,2,8)}}},
  /* --- front de Verdun --- */
  cross:{w:30,d(g,x,b){g.fillStyle='#6a5a44';g.fillRect(x+12,b-70,6,70);g.fillRect(x+2,b-54,26,6);g.fillStyle='rgba(255,240,210,.18)';g.fillRect(x+12,b-70,2,70)}},
  shells:{w:46,d(g,x,b){for(let k=0;k<3;k++){const sx=x+4+k*14,h=26+(k%2)*8;const gr=g.createLinearGradient(sx,0,sx+10,0);gr.addColorStop(0,'#8a6a2a');gr.addColorStop(.5,'#d9b45a');gr.addColorStop(1,'#6a4a1a');g.fillStyle=gr;g.fillRect(sx,b-h,10,h);g.beginPath();g.moveTo(sx,b-h);g.quadraticCurveTo(sx+5,b-h-14,sx+10,b-h);g.fill()}}},
  helmetPost:{w:30,d(g,x,b){drawHelmetPost(g,x+15,b);return;g.fillStyle='#5a4a36';g.fillRect(x+13,b-60,4,60);g.fillStyle='#5a6a6a';g.beginPath();g.ellipse(x+15,b-60,15,10,0,Math.PI,0);g.fill();g.fillRect(x-1,b-61,32,3);g.fillStyle='#4a5858';g.fillRect(x+14,b-74,2,6);g.fillStyle='rgba(140,70,40,.5)';g.fillRect(x+4,b-66,6,3)}},
  stump:{w:40,d(g,x,b){g.fillStyle='#3e3022';poly(g,[x+4,b,x+10,b-34,x+16,b-28,x+22,b-42,x+28,b-30,x+36,b]);g.fill();g.fillStyle='rgba(255,240,210,.1)';g.fillRect(x+10,b-30,3,30)}},
  poppies:{w:56,d(g,x,b,R){for(let k=0;k<9;k++){const px=x+R()*54,h=10+R()*22;g.strokeStyle='#4a6a2a';g.lineWidth=1.2;g.beginPath();g.moveTo(px,b);g.quadraticCurveTo(px+3,b-h/2,px+1,b-h);g.stroke();g.fillStyle='#c8302a';g.beginPath();g.arc(px+1,b-h,3.6,0,7);g.fill();g.fillStyle='#1a1410';g.beginPath();g.arc(px+1,b-h,1,0,7);g.fill()}}},
  fence:{w:110,d(g,x,b){g.fillStyle='#5a4632';for(let i=0;i<4;i++)g.fillRect(x+i*34,b-46,5,46);g.strokeStyle='#6a6a6a';g.lineWidth=1;for(let j=0;j<3;j++){g.beginPath();for(let i=0;i<=22;i++)g.lineTo(x+i*5,b-40+j*12+((i%3)-1)*1.5);g.stroke()}}},
  ammo:{w:54,d(g,x,b){g.fillStyle='#6a5a3a';g.fillRect(x,b-30,52,30);g.fillStyle='#4a3e28';g.fillRect(x,b-30,52,4);g.fillRect(x+4,b-26,3,26);g.fillRect(x+45,b-26,3,26);g.fillStyle='rgba(230,220,190,.6)';g.font='7px '+F_DISP;g.textAlign='center';g.fillText('MUNITIONS',x+26,b-12)}},
  /* --- Reims --- */
  antenna:{w:40,d(g,x,b){g.strokeStyle='#2a2e36';g.lineWidth=2;g.beginPath();g.moveTo(x+20,b);g.lineTo(x+20,b-90);for(let k=0;k<4;k++){g.moveTo(x+8+k*2,b-80+k*10);g.lineTo(x+32-k*2,b-80+k*10)}g.stroke()}},
  chimneyPot:{w:40,d(g,x,b){g.fillStyle='#7a3a2a';g.fillRect(x+6,b-44,28,44);g.fillStyle='#5a2a1e';g.fillRect(x+4,b-48,32,6);g.fillStyle='#a85a3a';g.fillRect(x+10,b-62,8,14);g.fillRect(x+22,b-58,8,10)}},
  dish:{w:40,d(g,x,b){g.fillStyle='#2a2e36';g.fillRect(x+18,b-40,4,40);g.fillStyle='#b8bcc4';g.beginPath();g.ellipse(x+20,b-48,16,18,-.5,0,7);g.fill();g.fillStyle='#8a8e96';g.beginPath();g.ellipse(x+22,b-47,10,12,-.5,0,7);g.fill()}},
  skylight:{w:60,d(g,x,b){g.fillStyle='#2a2e36';poly(g,[x,b,x+8,b-26,x+52,b-26,x+60,b]);g.fill();g.fillStyle='rgba(255,200,120,.45)';poly(g,[x+6,b-3,x+12,b-22,x+48,b-22,x+54,b-3]);g.fill()}},
  bench:{w:80,d(g,x,b){g.fillStyle='#2f4a3a';for(let k=0;k<3;k++)g.fillRect(x,b-30-k*8,80,4);g.fillRect(x,b-56,80,4);g.fillRect(x,b-64,80,4);g.fillStyle='#1e1e22';g.fillRect(x+6,b-30,4,30);g.fillRect(x+70,b-30,4,30)}},
  clockPost:{w:40,d(g,x,b){g.fillStyle='#2a2e36';g.fillRect(x+18,b-120,4,120);g.fillStyle='#efe6d0';g.beginPath();g.arc(x+20,b-130,16,0,7);g.fill();g.strokeStyle='#2a2e36';g.lineWidth=3;g.stroke();g.lineWidth=2;g.beginPath();g.moveTo(x+20,b-130);g.lineTo(x+20,b-142);g.moveTo(x+20,b-130);g.lineTo(x+28,b-128);g.stroke()}},
  luggageCart:{w:80,d(g,x,b){g.fillStyle='#3a3e46';g.fillRect(x,b-16,80,5);g.fillStyle='#222';g.beginPath();g.arc(x+12,b-6,6,0,7);g.arc(x+68,b-6,6,0,7);g.fill();g.fillStyle='#7a3a2a';rr(g,x+6,b-42,34,26,3);g.fill();g.fillStyle='#3a5a6a';rr(g,x+42,b-50,30,34,3);g.fill();g.fillStyle='#c9a35a';rr(g,x+14,b-62,22,20,3);g.fill()}},
  vending:{w:44,d(g,x,b){g.fillStyle='#8a2a22';g.fillRect(x+2,b-92,40,92);g.fillStyle='rgba(255,220,170,.75)';g.fillRect(x+7,b-84,24,52);g.fillStyle='#1e1e22';g.fillRect(x+33,b-80,6,20);g.fillRect(x+8,b-24,28,10)}},
  lampPost:{w:30,d(g,x,b){g.fillStyle='#1e2228';g.fillRect(x+13,b-120,4,120);g.fillRect(x+8,b-8,14,8);g.fillStyle='#2a2e36';poly(g,[x+5,b-120,x+25,b-120,x+21,b-138,x+9,b-138]);g.fill();g.fillStyle='rgba(255,215,140,.85)';g.fillRect(x+10,b-134,10,12);g.fillStyle='rgba(255,210,140,.12)';g.beginPath();g.arc(x+15,b-128,30,0,7);g.fill()}},
  flowerbed:{w:70,d(g,x,b,R){g.fillStyle='#5a4a36';g.fillRect(x,b-10,70,10);for(let k=0;k<14;k++){g.fillStyle=pick(['#c8302a','#e0c040','#8a4aa8','#e9dfc7']);g.beginPath();g.arc(x+4+R()*62,b-12-R()*10,3,0,7);g.fill()}}},
  binPark:{w:26,d(g,x,b){g.fillStyle='#2f4a3a';rr(g,x+2,b-40,22,40,3);g.fill();g.fillStyle='#1e2a24';g.fillRect(x,b-44,26,5)}},
  /* --- A4 --- */
  roadSign:{w:40,d(g,x,b){g.fillStyle='#8a8e96';g.fillRect(x+18,b-90,4,90);g.fillStyle='#e9e9e9';poly(g,[x+20,b-128,x+4,b-98,x+36,b-98]);g.fill();g.fillStyle='#b8302a';poly(g,[x+20,b-122,x+9,b-101,x+31,b-101]);g.fill();g.fillStyle='#e9e9e9';poly(g,[x+20,b-116,x+14,b-104,x+26,b-104]);g.fill();g.fillStyle='#111';g.fillRect(x+19,b-114,2,7)}},
  binRoad:{w:30,d(g,x,b){g.fillStyle='#5a6a3a';rr(g,x+2,b-46,26,46,4);g.fill();g.fillStyle='#3a4628';g.fillRect(x,b-50,30,6)}},
  cone:{w:26,d(g,x,b){g.fillStyle='#e06a2a';poly(g,[x+3,b,x+13,b-34,x+23,b]);g.fill();g.fillStyle='#efe6d0';poly(g,[x+8,b-16,x+13,b-26,x+18,b-16]);g.fill();g.fillStyle='#2a2a2a';g.fillRect(x,b-3,26,3)}},
  lampRoad:{w:50,d(g,x,b){g.fillStyle='#5a5e66';g.fillRect(x+6,b-170,5,170);g.beginPath();g.moveTo(x+8,b-170);g.quadraticCurveTo(x+20,b-186,x+44,b-180);g.lineWidth=4;g.strokeStyle='#5a5e66';g.stroke();g.fillStyle='rgba(255,200,120,.9)';g.fillRect(x+36,b-180,14,5);g.fillStyle='rgba(255,200,120,.08)';poly(g,[x+36,b-176,x+50,b-176,x+80,b,x+6,b]);g.fill()}},
  barrierStripe:{w:90,d(g,x,b){g.fillStyle='#2a2a2a';g.fillRect(x+6,b-30,4,30);g.fillRect(x+80,b-30,4,30);for(let k=0;k<9;k++){g.fillStyle=k%2?'#efe6d0':'#c8302a';g.fillRect(x+k*10,b-32,10,10)}}},
  pylon:{w:60,d(g,x,b){g.strokeStyle='#3a3e46';g.lineWidth=2;g.beginPath();g.moveTo(x+6,b);g.lineTo(x+30,b-200);g.lineTo(x+54,b);g.moveTo(x+12,b-150);g.lineTo(x+48,b-150);g.moveTo(x+18,b-110);g.lineTo(x+42,b-60);g.moveTo(x+42,b-110);g.lineTo(x+18,b-60);g.stroke()}},
  /* --- Saint-Siméon --- */
  barrels:{w:60,d(g,x,b){for(let k=0;k<2;k++){const bx=x+k*30;g.fillStyle='#6a4428';rr(g,bx,b-38,26,38,10);g.fill();g.fillStyle='#2a2a2a';g.fillRect(bx,b-30,26,3);g.fillRect(bx,b-10,26,3)}}},
  flagPole:{w:40,d(g,x,b,R){g.fillStyle='#4a3a2a';g.fillRect(x+4,b-130,3,130);const t=R()*.2;g.fillStyle='#2a4a8a';g.fillRect(x+7,b-128,11,22);g.fillStyle='#efe6d0';g.fillRect(x+18,b-128,11,22);g.fillStyle='#b8302a';g.fillRect(x+29,b-128,11,22)}},
  cart:{w:90,d(g,x,b){g.fillStyle='#6a4a2a';g.fillRect(x+6,b-40,70,8);g.fillRect(x,b-56,6,24);g.fillRect(x+76,b-56,6,24);g.strokeStyle='#3a2a1a';g.lineWidth=3;g.beginPath();g.arc(x+26,b-16,16,0,7);g.stroke();g.beginPath();g.moveTo(x+76,b-36);g.lineTo(x+90,b-8);g.stroke();g.fillStyle='#d9a441';g.beginPath();g.ellipse(x+40,b-48,30,10,0,Math.PI,0);g.fill()}},
  lampVillage:{w:30,d(g,x,b){g.fillStyle='#1e2228';g.fillRect(x+13,b-100,4,100);g.fillStyle='#c8302a';g.beginPath();g.ellipse(x+15,b-104,10,12,0,0,7);g.fill();g.fillStyle='rgba(255,180,120,.25)';g.beginPath();g.arc(x+15,b-104,26,0,7);g.fill()}},
  pump:{w:36,d(g,x,b){g.fillStyle='#3a5a4a';g.fillRect(x+10,b-60,14,60);g.fillRect(x+6,b-64,22,6);g.fillRect(x+24,b-46,10,4);g.fillStyle='#2a3a30';g.fillRect(x+4,b-50,6,3);g.fillRect(x+2,b-52,3,24)}},
  ropeCoil:{w:40,d(g,x,b){g.strokeStyle='#a8865a';g.lineWidth=3;for(let k=0;k<4;k++){g.beginPath();g.ellipse(x+20,b-6-k*5,16-k,5,0,0,7);g.stroke()}g.beginPath();g.moveTo(x+20,b-26);g.lineTo(x+22,-200);g.stroke()}},
  crateWood:{w:46,d(g,x,b){g.fillStyle='#6a4a2a';g.fillRect(x,b-40,44,40);g.strokeStyle='#4a321a';g.lineWidth=3;g.strokeRect(x+2,b-38,40,36);g.beginPath();g.moveTo(x+2,b-38);g.lineTo(x+42,b-2);g.stroke()}},
  cypress:{w:40,d(g,x,b){cypress(g,x+20,b,130,'#1a2a20')}},
  grave:{w:40,d(g,x,b){g.fillStyle='#7a7a74';rr(g,x+6,b-46,28,46,12);g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+14,b-34,12,2);g.fillRect(x+12,b-28,16,2);g.fillStyle='#5a6a3a';g.fillRect(x+2,b-4,36,4)}},
  crossIron:{w:30,d(g,x,b){g.strokeStyle='#2a2a2e';g.lineWidth=3;g.beginPath();g.moveTo(x+15,b);g.lineTo(x+15,b-60);g.moveTo(x+5,b-46);g.lineTo(x+25,b-46);g.stroke();g.beginPath();g.arc(x+15,b-46,6,0,7);g.lineWidth=1.5;g.stroke()}},
  vase:{w:24,d(g,x,b,R){g.fillStyle='#5a5a5e';poly(g,[x+6,b,x+4,b-16,x+20,b-16,x+18,b]);g.fill();for(let k=0;k<5;k++){g.fillStyle=pick(['#c8302a','#e9dfc7','#d9a441']);g.beginPath();g.arc(x+6+R()*12,b-20-R()*8,3,0,7);g.fill()}}}
};
function cobweb(g,x,y,s){
  g.strokeStyle='rgba(220,215,200,.2)';g.lineWidth=.8;
  const ang=k=>Math.PI*.05+k*Math.PI*.18;
  for(let k=0;k<6;k++){const a=ang(k);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*s,y+Math.sin(a)*s);g.stroke()}
  for(let r=s*.25;r<s;r+=s*.22){g.beginPath();for(let k=0;k<5;k++){const a=ang(k),a2=ang(k+1);const x1=x+Math.cos(a)*r,y1=y+Math.sin(a)*r,x2=x+Math.cos(a2)*r,y2=y+Math.sin(a2)*r;if(k===0)g.moveTo(x1,y1);g.quadraticCurveTo((x1+x2)/2-Math.cos((a+a2)/2)*r*.12,(y1+y2)/2-Math.sin((a+a2)/2)*r*.12,x2,y2)}g.stroke()}
}
