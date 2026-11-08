/* ------------------------------ MISSION 5 · CRÉCY-LA-CHAPELLE ------------------------------ */
LEVELS.push({w:4,name:"Le pigeonnier",theme:'crecy',exit:'none',exitLabel:"",seed:127,crecy:true,
 start:"Crécy-la-Chapelle. Enfin dans la commune ! Des canaux partout, des lavoirs, des passerelles. Le pigeonnier Vasseur est par là, quelque part.",
 hints:[],quips:[],signs:[],
 catWake:"Un chat. Un vrai, un chasseur. Il m'a vu. Règlement, article 3 : en cas de chat, courir.",chaseEnd:139*T,chaseEndQuip:"Il s'arrête net devant la pancarte « Attention au chien ». Lui aussi sait lire.",
 exitLines:[["RAYMOND","La maison Vasseur. Les volets sont neufs. Il y a une voiture devant.",4.2],["RAYMOND","Mais… où est le pigeonnier ? Un garage. On a mis un garage à la place du pigeonnier !",4.2],["RAYMOND","Bon. Le clocher. De là-haut, je trouverai bien où ils ont mis mes collègues.",4]],
 segs:[]  // construits par 11s_crecy.js
});
LEVELS.push({w:4,name:"Les combles",theme:'combles',exit:'none',exitLabel:"",seed:131,rows:24,camY:.55,combles:true,
 start:"Les combles de l'église. Tout en haut, il y aura bien un trou dans le toit. De là, je verrai toute la commune.",
 hints:[["LES COMBLES","B : septembre 1914. La charpente n'était pas tout à fait la même."],["ARTICLE 23 — LA CLOCHE","Elle se balance toujours au même rythme. À chaque coup, l'onde repousse tout ce qui est trop près."]],
 quips:[],signs:[],
 segs:[]  // construits par 11t_combles.js
});
LEVELS.push({w:4,name:"Elle aimait les fêtes",theme:'place',exit:'none',exitLabel:"",seed:137,place:true,
 start:"La fête ! Toute la commune est sur la place. Marguerite adore les fêtes : elle est forcément là, quelque part.",
 hints:[],quips:[],signs:[],
 segs:[]  // construits par 11v_place.js
});

LEVELS.push({w:4,name:"Le cimetière",theme:'cemetery',exit:'tomb',exitLabel:"",seed:139,cm:true,
 start:"Le cimetière. Je sais l'année, maintenant. Je sais ce que je vais trouver. Il faut quand même que je la voie.",
 hints:[],quips:[],signs:[],
 segs:[]  // construits par 11w_cimetiere.js
});
const SECRETS={3:[116,9],11:[36,19],14:[110,9],15:[260,11],16:[229,11]};
LEVELS.forEach((l,i)=>{if(SECRETS[i])l.secretAt=SECRETS[i]});
/* une seule médaille par mission : au 1-1 (la première vie), puis au deuxième niveau de chaque mission */
LEVELS.forEach((l,i)=>{l.medalOn=i===0||(i>=4&&i%4===1)});
/* chaque niveau reçoit son morceau de lettre (lu à la fin de la mission) */
LEVELS.forEach((l,i)=>{l.letter=LETTERS_SRC[i]});
/* les noms affichés au choix des niveaux suivent ceux des niveaux */
WORLDS.forEach((w,i)=>{w.levels=LEVELS.slice(i*4,i*4+4).map(l=>l.name)});
