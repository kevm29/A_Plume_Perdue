/* =========================================================
   AUDIO — musiques synthétisées, bruitages, ambiances
   ========================================================= */
let MUS_OLD=false,AC=null,master,mGain,sGain,noiseBuf,tick=0,nextTick=0,loopN=0,CUR=null,curName='';
const NOTE={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function midi(n){const m=/([A-G])([#b]?)(\d)/.exec(n);return 12*(+m[3]+1)+NOTE[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0)}
const mtof=m=>440*Math.pow(2,(m-69)/12);
const CHORDS={Cm:[48,51,55],Am:[57,60,64],Dm:[50,53,57],E:[52,56,59],F:[53,57,60],C:[48,52,55],G:[55,59,62],A:[57,61,64],Gm:[55,58,62],Bb:[58,62,65],Ab:[56,60,63],Eb:[51,55,58],Fm:[53,56,60],Em:[52,55,59],B:[59,63,66],D:[50,54,57]};
const SONGS={
  title:{tempo:78,bpb:3,lead:['box'],bass:'soft',gap:3,
    prog:'Am Dm E Am Am C G C Dm Am E E Am E Am Am',
    mel:'A4:1 C5:1 E5:1 D5:2 C5:1 B4:1 G#4:1 B4:1 A4:3 C5:1 E5:1 A5:1 G5:2 F5:1 E5:1 D5:1 B4:1 C5:3 F5:1 E5:1 D5:1 C5:1 B4:1 A4:1 G#4:1 B4:1 E5:1 D5:2 r:1 C5:1 B4:1 A4:1 B4:1 G#4:1 E4:1 A4:3 r:3'},
  valse:{tempo:124,bpb:3,lead:['box','accord'],bass:'waltz',gap:2,
    prog:'Am Am Dm E Am F E Am C G Am E F Dm E Am',
    mel:'E5:1.5 D5:.5 C5:1 B4:1 C5:1 A4:1 F5:1.5 E5:.5 D5:1 B4:2 G#4:1 A4:1 C5:1 E5:1 F5:1 E5:1 C5:1 D5:1.5 B4:.5 G#4:1 A4:3 G5:1.5 E5:.5 C5:1 D5:1 B4:1 G4:1 C5:1.5 B4:.5 A4:1 G#4:1 B4:1 E5:1 A5:1.5 G5:.5 F5:1 E5:1 D5:1 F5:1 E5:1 D5:1 B4:1 A4:3'},
  menuet:{tempo:100,bpb:3,lead:['harpsi','box'],bass:'alberti',gap:2,
    prog:'Dm A Dm A Gm Dm A Dm F C Dm A Bb Gm A Dm',
    mel:'D5:1 F5:.5 E5:.5 D5:1 C#5:1 E5:1 A4:1 F5:1 A5:.5 G5:.5 F5:1 E5:2 r:1 Bb4:1 D5:1 G5:1 F5:1 E5:.5 D5:.5 A4:1 E5:1 C#5:1 A4:1 D5:2 r:1 A5:1 G5:.5 F5:.5 C5:1 E5:1 G5:1 C5:1 F5:.5 E5:.5 D5:1 A4:1 C#5:2 E5:1 D5:1 F5:1 Bb5:1 G5:1 F5:.5 E5:.5 D5:1 C#5:1 E5:1 C#5:1 D5:3'},
  marche:{tempo:92,bpb:4,lead:['clar','box'],bass:'oompah',gap:2,
    prog:'C G C G F C G C Ab Eb Fm G C F G C',
    mel:'C5:1.5 G4:.5 C5:1 E5:1 D5:2 B4:2 E5:1.5 D5:.5 C5:1 G5:1 G5:3 r:1 A5:1.5 G5:.5 F5:1 C5:1 E5:1.5 D5:.5 C5:1 G4:1 B4:1 D5:1 G5:1 F5:1 E5:2 C5:2 Eb5:1.5 C5:.5 Ab4:2 G5:1.5 Eb5:.5 Bb4:2 Ab5:1 G5:1 F5:1 Eb5:1 D5:2 G4:2 C5:1 E5:1 G5:1 C6:1 A5:2 F5:2 G5:1 F5:1 D5:1 B4:1 C5:3 r:1'},
  pizz:{tempo:108,bpb:4,lead:['pizz','harpsi'],bass:'walk',gap:2,
    prog:'Em Em Am B Em C Am Em Em Am D B Em Am B Em',
    mel:'E4:.5 r:.5 G4:.5 r:.5 A4:.5 r:.5 B4:1 r:.5 C5:.5 B4:.5 r:.5 A4:1 r:1 A4:.5 r:.5 C5:.5 r:.5 D5:.5 r:.5 E5:1 D#5:.5 E5:.5 F#5:.5 r:.5 B4:2 E5:.5 r:.5 D5:.5 r:.5 B4:.5 r:.5 G4:1 r:.5 E4:.5 G4:.5 C5:.5 B4:2 A4:.5 C5:.5 r:.5 A4:.5 B4:.5 D#5:.5 r:.5 F#4:.5 E4:2 r:2 E5:.5 r:.5 G5:.5 r:.5 A5:.5 r:.5 B5:1 r:.5 C6:.5 B5:.5 r:.5 A5:1 r:1 F#5:.5 r:.5 A5:.5 r:.5 G5:.5 F#5:.5 E5:1 D#5:.5 r:.5 B4:.5 r:.5 D#5:1 r:1 E5:.5 G5:.5 B5:.5 G5:.5 E5:.5 r:.5 B4:1 C5:.5 r:.5 A4:.5 r:.5 F#4:.5 r:.5 D#4:1 E4:.5 r:.5 B3:.5 r:.5 E4:1 r:1 r:4'},
  galop:{tempo:172,bpb:4,lead:['box','harpsi'],bass:'gallop',gap:0,
    prog:'Em B Em B Am Em B Em',
    mel:'E5:.5 B4:.5 E5:.5 G5:.5 B5:1 G5:1 F#5:.5 D#5:.5 F#5:.5 A5:.5 B5:1 F#5:1 G5:.5 F#5:.5 E5:.5 D5:.5 E5:.5 G5:.5 B5:1 A5:.5 G5:.5 F#5:.5 E5:.5 D#5:2 C6:.5 B5:.5 A5:.5 E5:.5 C5:1 E5:1 B5:.5 A5:.5 G5:.5 E5:.5 B4:1 E5:1 F#5:.5 G5:.5 A5:.5 F#5:.5 D#5:.5 F#5:.5 B4:1 E5:2 r:2'},
  // complainte du front
  complainte:{tempo:84,bpb:4,lead:['clar','box'],bass:'march',gap:2,
    prog:'Dm Dm Gm Dm Dm Gm A Dm F Bb Gm F Dm A Dm Dm',
    mel:'D5:2 F5:1 E5:1 D5:3 A4:1 Bb4:2 A4:1 G4:1 A4:4 D5:2 F5:1 A5:1 G5:3 F5:1 E5:2 D5:1 C#5:1 D5:4 F5:2 G5:1 A5:1 Bb5:3 A5:1 G5:2 F5:1 E5:1 F5:4 A4:2 D5:1 F5:1 E5:2 D5:1 C#5:1 D5:3 r:1 r:4'},
  // tango des toits de Reims
  tango:{tempo:112,bpb:4,lead:['accord','harpsi'],bass:'tango',gap:2,
    prog:'Am E E Am Dm Dm Am Am Am Dm C E Am Dm E Am',
    mel:'A4:1.5 B4:.5 C5:1 E5:1 D5:1.5 C5:.5 B4:2 G#4:1.5 A4:.5 B4:1 D5:1 C5:3 r:1 A5:1.5 G5:.5 F5:1 E5:1 D5:1.5 E5:.5 F5:2 E5:1 D5:1 C5:1 B4:1 A4:3 r:1 C5:1.5 D5:.5 E5:1 A5:1 G5:1.5 F5:.5 E5:2 F5:1 E5:1 D5:1 C5:1 B4:3 r:1 A4:1.5 B4:.5 C5:1 E5:1 F5:1.5 E5:.5 D5:2 B4:1 G#4:1 B4:1 E5:1 A4:3 r:1'},
  // ostinato d'orage
  orage:{tempo:116,bpb:4,lead:['pizz','harpsi'],bass:'pulse',gap:1,
    prog:'Em Em C B B C G G Em B B Em',
    mel:'E5:1 r:1 E5:.5 F5:.5 E5:1 B4:2 C5:1 B4:1 r:1 E5:.5 F5:.5 G5:2 F#5:1 E5:1 r:1 B4:.5 C5:.5 D#5:2 E5:2 r:2 G5:1 r:1 G5:.5 A5:.5 G5:1 D5:2 E5:1 D5:1 r:1 G5:.5 A5:.5 B5:2 A5:1 G5:1 F#5:1 E5:1 D#5:2 B4:2 r:2 E5:4'},
  // mission 2 — le sentier : une marche de randonnée en ré mineur, boîte à musique et pizzicati sur une basse qui avance pas à pas
  sentier:{tempo:92,bpb:4,lead:['box','pizz'],bass:'walk',gap:2,
    prog:'Dm Dm C Dm Bb F C A Dm Dm C F Bb Gm A Dm',
    mel:'D5:1 E5:1 F5:1 D5:1 A5:2 F5:1 D5:1 E5:1 G5:1 E5:1 C5:1 D5:3 r:1 F5:1 D5:1 Bb4:1 D5:1 C5:1 A4:1 F4:1 A4:1 G4:1 C5:1 E5:1 G5:1 E5:2 C#5:2 F5:1.5 E5:.5 D5:1 A4:1 D5:1 F5:1 A5:2 G5:1.5 F5:.5 E5:1 C5:1 F5:2 A5:2 Bb5:1 A5:1 G5:1 F5:1 G5:1 D5:1 Bb4:1 G4:1 A4:1 C#5:1 E5:1 G5:1 F5:1 E5:1 D5:2'},
  // mission 2 — les éoliennes : rapide et entraînant, arpèges qui tournent sans arrêt, basse qui pousse, caisse claire à contretemps
  eoliennes:{tempo:136,bpb:4,lead:['harpsi','clar'],bass:'turbine',gap:1,
    prog:'Am F C G Am F E E Am F C G F G Am Am',
    mel:'A5:1 E5:.5 A5:.5 C6:1 B5:1 A5:1 F5:.5 A5:.5 C6:2 G5:1 E5:.5 G5:.5 C6:1 G5:1 B5:1 G5:.5 D5:.5 G5:2 A5:.5 B5:.5 C6:1 B5:.5 A5:.5 E5:1 F5:.5 G5:.5 A5:1 C6:2 B5:1 G#5:1 E5:1 B4:1 E5:2 G#5:2 C6:1 B5:.5 A5:.5 E5:1 A5:1 F5:1 A5:1 C6:1 A5:1 E5:.5 G5:.5 C6:1 G5:1 E5:1 D5:.5 G5:.5 B5:1 D6:2 C6:1 A5:1 F5:1 A5:1 B5:1 G5:1 D5:1 G5:1 A5:1 E5:1 C5:1 E5:1 A5:3 r:1'},
  // mission 2 — la zone rouge : mode phrygien, battement de cœur sourd, clarinette inquiète
  zonerouge:{tempo:88,bpb:4,lead:['clar','pizz'],bass:'heart',gap:2,
    prog:'Em Em F Em Am Em B B Em Em F Em C B Em Em',
    mel:'E5:2 r:1 G5:1 F#5:1 E5:1 r:2 F5:3 E5:1 E5:4 A4:1 C5:1 E5:1 D5:1 B4:3 r:1 D#5:2 F#5:2 B4:4 G5:1.5 F#5:.5 E5:2 B4:2 r:2 C5:1 A4:1 F4:2 G4:1 B4:1 E5:2 E5:1.5 D5:.5 C5:2 D#5:2 B4:2 E5:4 r:4'},
  // mission 3 — le train : la locomotive qui halète sous un air d'accordéon
  train:{tempo:150,bpb:4,lead:['accord','harpsi'],bass:'train',gap:1,
    prog:'G G C G D D G G C C G Em A D G G',
    mel:'B4:.5 D5:.5 G5:1 B5:1 G5:1 A5:.5 G5:.5 F#5:1 G5:2 E5:.5 F#5:.5 G5:1 E5:1 C5:1 D5:1 B4:1 G4:2 A4:.5 B4:.5 C5:1 D5:1 F#5:1 A5:2 F#5:1 D5:1 G5:1 B5:1 D6:1 B5:1 G5:3 r:1 E5:1 G5:1 C6:1 G5:1 E5:2 C5:2 D5:1 G5:1 B5:1 G5:1 E5:2 B4:2 C#5:1 E5:1 A5:1 G5:1 F#5:2 A5:1 F#5:1 G5:1 D5:1 B4:1 D5:1 G5:2 r:2'},
  // mission 3 — la gare : piano bastringue et pas pressés, un ragtime de hall de gare
  gare:{tempo:116,bpb:4,lead:['harpsi','box'],bass:'stride',gap:1,
    prog:'C A Dm G C A Dm G F F C A D G C C',
    mel:'E5:.5 G5:1 E5:.5 C5:1 D5:1 C#5:.5 E5:1 A5:.5 G5:2 F5:.5 E5:.5 D5:1 A4:1 D5:1 B4:1 D5:1 G5:2 E5:.5 G5:1 E5:.5 C6:1 G5:1 A5:.5 G5:.5 E5:1 C#5:2 D5:1 F5:1 A5:1 F5:1 G5:2 F5:1 D5:1 A5:1 C6:1 A5:1 F5:1 G5:.5 F5:.5 E5:1 D5:2 C5:1 E5:1 G5:1 E5:1 A5:2 C#5:2 D5:1 F#5:1 A5:1 F#5:1 G5:1 F5:1 D5:1 B4:1 C5:1 G4:1 E5:1 G5:1 C6:2 r:2'},
  // cantique de la cathédrale : mode de ré, flûte d'orgue sur un plein-jeu tenu
  cantique:{tempo:66,bpb:4,lead:['pipe','pipe','box'],bass:'chorale',gap:2,
    prog:'Dm Dm C Dm F C Dm Am Dm Gm Dm C F C Dm Dm',
    mel:'D5:2 E5:1 F5:1 G5:2 F5:1 E5:1 E5:2 D5:1 C5:1 D5:4 F5:2 G5:1 A5:1 G5:2 F5:1 E5:1 F5:2 E5:1 D5:1 E5:4 A5:2 G5:1 F5:1 G5:2 F5:1 D5:1 F5:2 E5:1 D5:1 E5:2 D5:1 C5:1 F5:2 G5:1 A5:1 G5:2 E5:1 C5:1 D5:3 C5:1 D5:4'},
  // 4-3 — la nuit sur l'A4 : ut mineur, clarinette seule au-dessus des essuie-glaces
  nuitA4:{tempo:80,bpb:4,lead:['clar','box'],bass:'wipers',gap:2,
    prog:'Cm Cm Ab G Cm Cm Fm G Ab Eb Fm Cm Ab Fm G G',
    mel:'G4:2 C5:1 D5:1 Eb5:3 D5:1 C5:2 Ab4:2 B4:4 r:2 G4:1 C5:1 Eb5:2 G5:2 F5:3 Eb5:1 D5:4 r:4 Eb5:1 F5:1 G5:2 Ab5:2 G5:2 Eb5:2 F5:3 Eb5:1 C5:4 r:2 Ab4:1 C5:1 F5:2 Eb5:1 D5:1 B4:4 r:4'},
  // 4-3 — la route du fort (1916) : complainte de marche en ré mineur sur le trot des chevaux
  route1916:{tempo:100,bpb:4,lead:['clar','box'],bass:'trot',gap:2,
    prog:'Dm Dm A Dm Gm Dm A A F C Dm A Gm Dm A Dm',
    mel:'A4:1 D5:1 F5:1 E5:1 D5:2 A4:2 C#5:1 E5:1 G5:1 F5:1 E5:4 F5:1 E5:1 D5:1 F5:1 A5:2 G5:1 F5:1 E5:1 D5:1 C#5:1 E5:1 A4:4 C5:1 F5:1 A5:1 G5:1 F5:2 E5:2 F5:1 E5:1 D5:1 C5:1 E5:2 C#5:2 D5:1 Bb4:1 G4:1 Bb4:1 A4:2 r:2 F5:1.5 E5:.5 D5:1 C#5:1 E5:1 A5:1 G5:1 E5:1 D5:4'},
  // 4-3 — la chambrée : berceuse pour Marguerite, boîte à musique très douce (on doit entendre le crayon)
  chambree:{tempo:60,bpb:3,lead:['box'],bass:'soft',gap:3,lv:.26,
    prog:'F C Dm Bb F C Bb C F Am Dm Bb Gm C F F',
    mel:'C5:1 F5:1 A5:1 G5:2 E5:1 F5:1 D5:1 A4:1 Bb4:2 D5:1 C5:3 A4:1 C5:1 F5:1 E5:2 G5:1 F5:3 r:3 A5:1 G5:1 F5:1 E5:2 C5:1 D5:1 F5:1 A5:1 Bb5:2 G5:1 G5:1 E5:1 C5:1 F5:3 r:3'},
  // 4-3 — l'aube au fort : le même thème, lent et grave, comme un chant au clairon sur un orgue tenu
  aube:{tempo:58,bpb:4,lead:['clar','pipe'],bass:'chorale',gap:2,lv:.13,
    prog:'F F Bb F Dm Gm C C F Am Bb F Gm C F F',
    mel:'C5:2 F5:2 A5:3 G5:1 F5:2 D5:2 C5:4 A4:2 C5:1 D5:1 F5:3 E5:1 G5:4 r:4 A5:2 G5:1 F5:1 E5:2 C5:2 D5:2 F5:2 A5:4 G5:2 F5:1 E5:1 D5:2 E5:2 F5:4 r:4'},
  // 4-3 — le vol au-dessus des lignes : mi phrygien, galop de caisse claire, le thème de la chambrée qui revient à la fin
  vol1916:{tempo:150,bpb:4,lead:['clar','pizz','harpsi'],bass:'barrage',gap:1,
    prog:'Em Em F Em Em Am B B Em Em F Em C Am B Em',
    mel:'E5:.5 F5:.5 E5:1 B4:1 E5:.5 G5:.5 F5:1 E5:1 r:1 F5:.5 G5:.5 A5:1 G5:.5 F5:.5 E5:2 r:1 B4:.5 C5:.5 D#5:1 E5:1 F#5:1 B4:1 G5:.5 F#5:.5 E5:.5 D#5:.5 E5:2 B5:1 A5:.5 G5:.5 F5:1 E5:1 C5:1 E5:1 A5:2 G5:1 F#5:1 D#5:1 B4:1 E5:.5 G5:.5 B5:1 A5:.5 G5:.5 F#5:2 E5:4 r:2 E5:1 G5:1 B5:2 A5:1 G5:1 F5:2 E5:2 C5:1 E5:1 A5:3 G5:1 F#5:2 D#5:2 E5:4'},
  // polka de la fête
  polka:{tempo:128,bpb:4,lead:['accord','box'],bass:'polka',gap:1,
    prog:'C G C G C F G C',
    mel:'C5:.5 E5:.5 G5:.5 E5:.5 C6:1 G5:1 F5:.5 D5:.5 B4:.5 D5:.5 G5:2 E5:.5 G5:.5 C6:.5 G5:.5 E5:1 C5:1 D5:.5 F5:.5 A5:.5 F5:.5 D5:2 C5:.5 E5:.5 G5:.5 E5:.5 A5:1 G5:1 F5:.5 E5:.5 D5:.5 C5:.5 B4:1 G4:1 C5:.5 D5:.5 E5:.5 F5:.5 G5:1 E5:1 D5:1 G4:1 C5:2'}
};
/* chaque niveau a sa propre interprétation : transposition, tempo, instruments */
const LEVEL_SONGS={
  's1-1':{base:'valse'},'s1-2':{base:'menuet'},'s1-3':{base:'marche'},'s1-4':{base:'pizz'},
  's2-1':{base:'sentier'},'s2-2':{base:'eoliennes'},
  's2-3':{base:'zonerouge'},'s2-4':{base:'complainte',tr:-2,tempo:70,lead:['box'],bass:'soft'},
  's3-1':{base:'train'},'s3-2':{base:'gare'},'s3-3':{base:'tango'},'s3-4':{base:'cantique'},
  's4-1':{base:'orage',tempo:100,lead:['box','pizz']},'s4-2':{base:'orage',tempo:136,bass:'gallop'},'s4-3':{base:'orage',tr:-2,lead:['clar','pizz']},'s4-4':{base:'orage',tr:3,lead:['harpsi','box']},
  's5-1':{base:'polka'},'s5-2':{base:'cantique',tr:-3,tempo:74,lead:['pipe','harpsi'],bass:'chorale'},'bal':{base:'valse',tempo:132,lead:['accord','box'],bass:'waltz'},'s5-3':{base:'galop',tr:2},'s5-4':{base:'title',tempo:64},
  'vx-nuit':{base:'nuitA4'},'vx-route':{base:'route1916'},'vx-chambree':{base:'chambree'},'vx-aube':{base:'aube'},'vx-vol':{base:'vol1916'},'vx-reveil':{base:'nuitA4',tempo:66,tr:-3,lead:['box'],bass:'soft'},
  'chase':{base:'galop'},'title':{base:'title'}
};
const COMPILED={};
function compileSong(key){
  if(COMPILED[key])return COMPILED[key];
  const v=LEVEL_SONGS[key]||{base:key};const s=Object.assign({},SONGS[v.base],v);
  const prog=s.prog.split(' '),melT={};let tk=0;
  for(const tok of s.mel.trim().split(/\s+/)){const[n,b]=tok.split(':');if(n!=='r')melT[tk]={m:midi(n),d:+b};tk+=Math.round(+b*2)}
  return COMPILED[key]=Object.assign(s,{prog,melT,melLen:tk,tr:s.tr||0,len:(prog.length+s.gap)*s.bpb*2});
}
function voice(ch){return ch.map(m=>{while(m<55)m+=12;while(m>67)m-=12;return m}).sort((a,b)=>a-b)}
function setSong(name){if(curName===name)return;curName=name;CUR=compileSong(name);tick=0;loopN=0;if(AC)nextTick=AC.currentTime+.08}
function ensureAudio(){
  try{
    if(!AC){
      AC=new(window.AudioContext||window.webkitAudioContext)();
      master=AC.createGain();master.gain.value=S.muted?0:.9;master.connect(AC.destination);
      mGain=AC.createGain();mGain.gain.value=.1;mGain.connect(master);
      sGain=AC.createGain();sGain.gain.value=.5;sGain.connect(master);
      noiseBuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);
      const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      nextTick=AC.currentTime+.1;setInterval(sched,50);
    }
    if(AC.state==='suspended')AC.resume();
  }catch(e){}
}
function env(g,t,v,a,hold,rel){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);if(hold)g.gain.setValueAtTime(v,t+a+hold);g.gain.exponentialRampToValueAtTime(.0008,t+a+(hold||0)+rel)}
function osc(type,f,t,stop,dest,gain){const o=AC.createOscillator();o.type=type;o.frequency.value=f;if(gain!=null){const g=AC.createGain();g.gain.value=gain;o.connect(g);g.connect(dest)}else o.connect(dest);o.start(t);o.stop(stop);return o}
function accordion(t,ms,dur,vol){
  const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1000;g.connect(lp);lp.connect(mGain);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.03);g.gain.setValueAtTime(vol,t+dur*.6);g.gain.linearRampToValueAtTime(.0001,t+dur*.95);
  for(const m of ms)for(const det of[-7,7]){const o=osc('sawtooth',mtof(m),t,t+dur,g);o.detune.value=det}
}
function musette(t,m,dur){const g=AC.createGain(),lp=AC.createBiquadFilter(),bp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;bp.type='peaking';bp.frequency.value=900;bp.gain.value=5;g.connect(bp);bp.connect(lp);lp.connect(mGain);
  const v=.07,d=Math.max(.12,dur*.92);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.025);g.gain.setValueAtTime(v,t+d*.8);g.gain.linearRampToValueAtTime(.0001,t+d);
  for(const det of[-14,0,14]){const o=osc('sawtooth',mtof(m),t,t+d+.05,g,det?.7:1);o.detune.value=det}
  const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=5.5;lg.gain.value=.012;lf.connect(lg);lg.connect(g.gain);lf.start(t);lf.stop(t+d)}
function crackle(t){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=2500;s.connect(f);f.connect(g);g.connect(mGain);g.gain.setValueAtTime(.05*rnd(),t);g.gain.exponentialRampToValueAtTime(.0001,t+.012);s.start(t,rnd());s.stop(t+.02)}
const INST={
  box(t,m,dur,v){const g=AC.createGain();g.connect(mGain);env(g,t,v||.55,.006,0,Math.max(.7,dur*1.4));osc('sine',mtof(m),t,t+2.4,g);osc('sine',mtof(m)*4.007,t,t+2.4,g,.1)},
  accord(t,m,dur){accordion(t,[m-12],dur*.95,.11)},
  harpsi(t,m,dur,v){const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;g.connect(lp);lp.connect(mGain);env(g,t,v||.28,.003,0,.45+dur*.25);osc('triangle',mtof(m),t,t+1.4,g);osc('square',mtof(m)*2,t,t+1.4,g,.1)},
  clar(t,m,dur,v){const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;g.connect(lp);lp.connect(mGain);env(g,t,v||.16,.04,Math.max(.01,dur*.8),.08);const o=osc('square',mtof(m),t,t+dur+.2,g);const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=5;lg.gain.value=4;lf.connect(lg);lg.connect(o.frequency);lf.start(t);lf.stop(t+dur+.2)},
  pizz(t,m,dur,v){const g=AC.createGain();g.connect(mGain);env(g,t,v||.42,.003,0,.22);const o=osc('triangle',mtof(m),t,t+.4,g);o.frequency.setValueAtTime(mtof(m)*1.01,t);o.frequency.exponentialRampToValueAtTime(mtof(m),t+.05)},
  tuba(t,m,dur,v){const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;g.connect(lp);lp.connect(mGain);env(g,t,v||.32,.02,dur*.5,.1);osc('square',mtof(m),t,t+dur+.2,g)},
  pipe(t,m,dur,v){const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;g.connect(lp);lp.connect(mGain);env(g,t,v||.2,.07,Math.max(.05,dur*.85),.35);
    osc('sine',mtof(m),t,t+dur+.6,g);osc('sine',mtof(m)*2,t,t+dur+.6,g,.22);osc('triangle',mtof(m)*.5,t,t+dur+.6,g,.18);
    const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=4.2;lg.gain.value=1.6;lf.connect(lg);const o=osc('sine',mtof(m)*1.003,t,t+dur+.6,g,.3);lg.connect(o.frequency);lf.start(t);lf.stop(t+dur+.6)},
  organ(t,ms,dur,v){const g=AC.createGain();g.connect(mGain);env(g,t,v||.05,.02,dur*.6,.1);for(const m of ms){osc('sine',mtof(m),t,t+dur+.2,g);osc('sine',mtof(m)*2,t,t+dur+.2,g,.35)}},
  snare(t,v){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf;f.type='bandpass';f.frequency.value=1800;f.Q.value=.8;s.connect(f);f.connect(g);g.connect(mGain);env(g,t,v||.25,.002,0,.12);s.start(t,rnd());s.stop(t+.2)}
};
function playTick(s,tk,t,spb){
  const tpb=s.bpb*2,bar=Math.floor(tk/tpb),bt=tk%tpb;
  if(bar>=s.prog.length)return;
  const lead=s.lead[loopN%s.lead.length],tr=s.tr;
  const ch=CHORDS[s.prog[bar]].map(m=>m+tr),v=voice(ch),root=ch[0];
  if(MUS_OLD){
    // le souvenir : même air, même mesure, mais à l'accordéon musette, basses et accords en boutons, et le grésillement du phonographe
    const e=s.melT[tk];if(e)musette(t,e.m+tr,e.d*spb);
    if(bt===0)accordion(t,[root-24,root-12],spb*.8,.1);else if(bt===4&&s.bpb>=4)accordion(t,[ch[2]-24,ch[2]-12],spb*.8,.08);else if(bt%2===0)accordion(t,v,spb*.45,.045);
    if(noiseBuf&&rnd()<.6)crackle(t+rnd()*spb*.5);
    return}
  const e=s.melT[tk];if(e)INST[lead](t,e.m+tr,e.d*spb,s.lv);
  switch(s.bass){
    case'soft':if(bt===0)INST.box(t,root-12,spb*3,.22);break;
    case'waltz':if(bt===0)accordion(t,[root-12],spb*.9,.14);else if(bt%2===0)accordion(t,v,spb*.55,.04);break;
    case'alberti':{const p=[v[0],v[2],v[1],v[2]];INST.harpsi(t,p[bt%4]-12,spb*.5,.12);break}
    case'oompah':if(bt===0)INST.tuba(t,root-12,spb*.7);else if(bt===4)INST.tuba(t,ch[2]-12,spb*.7);else if(bt===2||bt===6)INST.organ(t,v,spb*.4,.045);break;
    case'march':if(bt===0)INST.tuba(t,root-12,spb*.8,.28);else if(bt===4)INST.tuba(t,ch[2]-12,spb*.8,.24);if(bt===2||bt===6)INST.snare(t,.18);if(bt===7&&bar%2)INST.snare(t,.1);break;
    case'walk':if(bt%2===0){const p=[root-12,ch[2]-12,root,ch[2]-12];INST.pizz(t,p[(bt/2)%4],spb*.4,.3)}break;
    case'gallop':INST.tuba(t,bt%2===0?root-12:root,spb*.25,.2);if(bt===2||bt===6)INST.organ(t,v,spb*.3,.04);break;
    case'tango':if(bt===0||bt===3||bt===4||bt===6)INST.tuba(t,bt===3?ch[2]-12:root-12,spb*.4,.26);if(bt===2||bt===6)accordion(t,v,spb*.3,.035);break;
    case'pulse':INST.pizz(t,(bt%4===2?ch[2]:root)-12,spb*.3,.16);if(bt===0)INST.organ(t,v,spb*1.6,.03);break;
    case'arpwind':{const p=[v[0],v[1],v[2],v[0]+12,v[2],v[1]];INST.harpsi(t,p[bt%6],spb*.5,.07);if(bt===0)INST.box(t,root-12,spb*3,.18);break}
    case'turbine':{const p=[v[0],v[1],v[2],v[0]+12];INST.harpsi(t,p[bt%4]+12,spb*.4,.06);if(bt===0||bt===4)INST.tuba(t,root-12,spb*.4,.28);if(bt===3||bt===7)INST.tuba(t,ch[2]-12,spb*.25,.18);if(bt===2||bt===6)INST.snare(t,.16);break}
    case'heart':if(bt===0)INST.tuba(t,root-12,spb*.3,.32);if(bt===1)INST.tuba(t,root-12,spb*.25,.2);if(bar%4===3&&bt>=5)INST.snare(t,.05);if(bt===4&&bar%2)INST.organ(t,v,spb*1.6,.025);break;
    case'train':if(bt===0||bt===4)INST.tuba(t,root-12,spb*.35,.26);if(bt===2||bt===6)INST.tuba(t,ch[2]-12,spb*.3,.2);INST.snare(t,bt%2?.09:.04);break;
    case'stride':if(bt===0)INST.harpsi(t,root-24,spb*.4,.22);if(bt===4)INST.harpsi(t,ch[2]-24,spb*.4,.2);if(bt===2||bt===6)for(const m of v)INST.harpsi(t,m,spb*.3,.07);break;
    case'chorale':if(bt===0){INST.organ(t,v,spb*s.bpb*2*.48,.04);INST.organ(t,[root-12,root-24],spb*s.bpb*2*.48,.035)}break;
    case'wipers':if(bt===0)INST.organ(t,v,spb*3.6,.028);if(bt===0||bt===4)INST.tuba(t,root-12,spb*.5,.18);if(bt===2||bt===6)INST.pizz(t,ch[2]-12,spb*.3,.14);break;
    case'trot':INST.pizz(t,(bt%4===2?ch[2]:root)-12,spb*.3,bt%2?.12:.26);if(bt%2)INST.snare(t,.035);if(bt===0&&bar%2===0)INST.box(t,root-12,spb*3,.16);break;
    case'barrage':if(bt%2===0)INST.tuba(t,(bt===4?ch[2]:root)-12,spb*.3,.24);INST.snare(t,bt%2?.07:.03);if(bt===3||bt===7)INST.snare(t,.14);if(bt===0&&bar%2===0)INST.organ(t,v,spb*3,.025);break;
    case'polka':if(bt===0||bt===4)INST.tuba(t,bt===0?root-12:ch[2]-12,spb*.45,.3);else if(bt===2||bt===6)accordion(t,v,spb*.35,.05);break;
  }
}
function sched(){
  if(!AC||!CUR)return;
  const spb=60/CUR.tempo;
  while(nextTick<AC.currentTime+.2){
    if(!S.muted)playTick(CUR,tick,nextTick,spb);
    nextTick+=spb/2;tick++;if(tick>=CUR.len){tick=0;loopN++}
  }
}
function tone(f,d,type,v,f2,delay){
  if(!AC||S.muted)return;const t=AC.currentTime+(delay||0);
  const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(sGain);o.start(t);o.stop(t+d+.03);
}
function noise(d,freq,v,type,delay,q){
  if(!AC||S.muted)return;const t=AC.currentTime+(delay||0);
  const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();
  s.buffer=noiseBuf;f.type=type||'bandpass';f.frequency.value=freq;f.Q.value=q||1;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  s.connect(f);f.connect(g);g.connect(sGain);s.start(t,rnd()*1.5);s.stop(t+d+.05);
}
/* voix par formants (miaulement, cri de buse, cri d'oie…) */
function formantCry(o){
  if(!AC||S.muted)return;const t=AC.currentTime+(o.delay||0),d=o.d;
  const src=AC.createOscillator();src.type=o.wave||'sawtooth';
  o.f.forEach(([tt,f],i)=>i===0?src.frequency.setValueAtTime(f,t):src.frequency.linearRampToValueAtTime(f,t+tt*d));
  if(o.vib){const vb=AC.createOscillator(),vg=AC.createGain();vb.frequency.value=o.vib[0];vg.gain.value=o.vib[1];vb.connect(vg);vg.connect(src.frequency);vb.start(t);vb.stop(t+d+.1)}
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v,t+.04);g.gain.setValueAtTime(o.v,t+d*.7);g.gain.exponentialRampToValueAtTime(.001,t+d+.05);g.connect(sGain);
  for(const[fs,q,gain]of o.formants){const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=q;fs.forEach(([tt,fq],i)=>i===0?f.frequency.setValueAtTime(fq,t):f.frequency.linearRampToValueAtTime(fq,t+tt*d));const fg=AC.createGain();fg.gain.value=gain;src.connect(f);f.connect(fg);fg.connect(g)}
  src.start(t);src.stop(t+d+.12);
}
function meow(v,low){const f0=(low?300:430)+rnd()*90;formantCry({d:.62+rnd()*.25,v:.9*(v||1),f:[[0,f0],[.28,f0*1.55],[.6,f0*1.3],[1,f0*.78]],vib:[6.5,14],formants:[[[[0,650],[.3,1700],[1,800]],5,1],[[[0,2500],[.3,2900],[1,1100]],7,.45]]})}
const LOOPS={};
function makeLoop(name){
  if(name==='drone'){const g=AC.createGain();g.gain.value=0;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1100;g.connect(sGain);lp.connect(g);
    const o=AC.createOscillator(),o2=AC.createOscillator();o.type=o2.type='sawtooth';o.frequency.value=150;o2.frequency.value=157;const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=9;lg.gain.value=6;lf.connect(lg);lg.connect(o.frequency);o.connect(lp);o2.connect(lp);o.start();o2.start();lf.start();return{g}}
  const s=AC.createBufferSource();if(name!=='rain')s.buffer=noiseBuf;s.loop=true;const f=AC.createBiquadFilter(),g=AC.createGain();g.gain.value=0;
  if(name==='rain'){
    // pluie : nappe de bruit rose douce + gouttes, bouclée sur 6 s
    const sr=AC.sampleRate,n=sr*6,b=AC.createBuffer(2,n,sr);
    for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for(let i=0;i<n;i++){const w=Math.random()*2-1;b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;
        d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.045;b6=w*.115926}
      const drops=n/sr*55;for(let k=0;k<drops;k++){const at=(Math.random()*(n-sr*.03))|0,f=1800+Math.random()*3200,a=.04+Math.random()*.1,dec=.004+Math.random()*.01;
        for(let j=0;j<sr*.03;j++){const tt=j/sr;d[at+j]+=Math.sin(2*Math.PI*f*tt*(1-tt*8))*a*Math.exp(-tt/dec)}}
      const fade=sr*.05;for(let i=0;i<fade;i++){const m=i/fade;d[i]*=m;d[n-1-i]*=m}}
    s.buffer=b;f.type='lowpass';f.frequency.value=3800;f.Q.value=.3}
  else if(name==='wind'){f.type='bandpass';f.frequency.value=420;f.Q.value=.8;const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=.13;lg.gain.value=260;lf.connect(lg);lg.connect(f.frequency);lf.start()}
  else if(name==='purr'){f.type='lowpass';f.frequency.value=170;const am=AC.createGain();am.gain.value=.55;const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=24;lg.gain.value=.5;lf.connect(lg);lg.connect(am.gain);lf.start();s.connect(f);f.connect(am);am.connect(g);g.connect(sGain);s.start();return{g}}
  else if(name==='crowd'){f.type='bandpass';f.frequency.value=700;f.Q.value=.6}
  s.connect(f);f.connect(g);g.connect(sGain);s.start();return{g};
}
/* volume d'une boucle : appelé à chaque image, on n'écrit dans la chronologie audio que si le volume change vraiment
   (sinon Chrome empile des milliers d'automations setTargetAtTime et le jeu rame) */
function loopSet(name,vol){if(!AC)return;let l=LOOPS[name];if(!l){if(!vol)return;l=LOOPS[name]=makeLoop(name)}
  const v=S.muted?0:vol,now=AC.currentTime;if(l.v!=null&&(v===l.v||Math.abs(v-l.v)<.012&&v!==0))return;
  if(l.v!=null&&v!==0&&now-l.at<.06)return;
  l.v=v;l.at=now;const gp=l.g.gain;if(gp.cancelAndHoldAtTime)gp.cancelAndHoldAtTime(now);else{gp.cancelScheduledValues(now);gp.setValueAtTime(gp.value,now)}gp.setTargetAtTime(v,now,.15)}
function loopsOff(){for(const k in LOOPS)loopSet(k,0)}
const SFX={
  jump(){tone(380,.13,'square',.07,700)},
  flap(){noise(.11,1700,.4,'bandpass',0,.7);noise(.09,1300,.3,'bandpass',.07,.7)},
  straw(){noise(.18,2600,.25,'bandpass',0,1.2);tone(880,.12,'triangle',.1,1320)},
  medal(){[784,988,1175,1568].forEach((f,i)=>tone(f,.3,'triangle',.16,null,i*.08))},
  death(){noise(.45,700,.7,'lowpass');tone(880,.55,'sine',.16,160);tone(110,.25,'triangle',.35,50)},
  check(){tone(659,.25,'triangle',.18);tone(988,.4,'triangle',.15,null,.12)},
  land(){noise(.06,380,.25,'lowpass')},
  win(){[392,523,659,784].forEach((f,i)=>tone(f,i===3?.6:.18,'square',.07,null,i*.13))},
  crash(){noise(1.1,260,1,'lowpass');tone(70,.7,'triangle',.5,35);for(let k=0;k<7;k++)tone(2400+rnd()*3000,.25+rnd()*.4,'sine',.05,1800+rnd()*2000,.05+k*.06)},
  thunder(v){v=v||1;noise(2.6,140,.9*v,'lowpass');noise(1.2,420,.5*v,'lowpass',.05);tone(46,1.6,'triangle',.35*v,30,.02)},
  zap(){noise(.25,5000,.6,'highpass');tone(1800,.2,'sawtooth',.12,200)},
  whistle(){tone(1500,.55,'sine',.06,380)},
  hiss(){noise(.75,4200,.4,'highpass',0,.6)},
  squeak(){const n=2+(rnd()*2|0);for(let k=0;k<n;k++)tone(2600+rnd()*900,.06,'sine',.06,3500+rnd()*600,k*.1)},
  grunt(small){
    // grognement de sanglier : deux ou trois « hon » rauques et nasaux
    const n=small?3:2+(rnd()*2|0),f0=small?260:92;
    for(let k=0;k<n;k++){const ff=f0*(1+rnd()*.15);formantCry({delay:k*(small?.13:.2),d:small?.09:.16+rnd()*.05,v:small?.35:.75,wave:'sawtooth',f:[[0,ff*1.25],[.3,ff],[1,ff*.8]],vib:[38,ff*.18],
      formants:[[[[0,small?900:420],[1,small?750:330]],4,1],[[[0,small?2100:1150],[1,small?1800:900]],6,.5]]})}
  },
  caw(){for(let k=0;k<2;k++)formantCry({delay:k*.28,d:.22,v:.5,f:[[0,520],[1,380]],wave:'sawtooth',formants:[[[[0,1300],[1,1000]],3,1]]})},
  honk(){for(let k=0;k<2;k++)formantCry({delay:k*.22,d:.18,v:.55,f:[[0,330],[.5,370],[1,300]],wave:'square',formants:[[[[0,900],[1,1100]],4,1]]})},
  coo(){formantCry({d:.55,v:.35,wave:'sine',f:[[0,320],[.3,360],[.6,300],[1,280]],vib:[11,25],formants:[[[[0,400],[1,380]],2,1]]})},
  screech(){formantCry({d:.75,v:.5,f:[[0,2300],[.2,2600],[1,1300]],vib:[22,40],formants:[[[[0,2600],[1,1600]],4,1]]})},
  buzz(){formantCry({d:.3,v:.18,f:[[0,230],[1,250]],vib:[60,30],formants:[[[[0,900],[1,900]],2,1]]})},
  bag(){noise(.14,3200,.12,'highpass',0,.5)},
  bell(){if(!AC||S.muted)return;const t=AC.currentTime,f=196;[[1,.4],[2.0,.25],[2.76,.18],[5.4,.08],[.5,.2]].forEach(([k,v])=>{const g=AC.createGain();g.connect(sGain);env(g,t,v,.005,0,3.2);osc('sine',f*k,t,t+3.4,g)})},
  flutter(){noise(.1,2400,.05,'bandpass',0,2);noise(.08,2000,.04,'bandpass',.06,2)},
  page(){noise(.25,3200,.18,'highpass')},
  tick(){tone(1200,.04,'square',.03)},
  secret(){tone(1318,.08,'sine',.12);tone(1760,.12,'sine',.1,null,.07)}
};
function toggleMute(){S.muted=!S.muted;save();if(master)master.gain.value=S.muted?0:.9}
