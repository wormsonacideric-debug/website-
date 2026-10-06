const recipes=[
 {a:'toaster',b:'wheel',name:'THE TOASTERMOBILE',points:100,reply:'Banging. It actually moves.'},
 {a:'kettle',b:'chair',name:'THE KETTLE THRONE',points:75,reply:'Not useful. But comfortable.'},
 {a:'tv',b:'pipe',name:'THE SCRAPCASTER',points:125,reply:'That should not work. It does.'},
 {a:'tyre',b:'traffic-cone',name:'THE SAFETY MACHINE',points:90,reply:'Finally. Something responsible.'},
 {a:'bucket',b:'fan',name:'THE BUCKET FAN',points:60,reply:'It makes wind. Congratulations.'},
 {a:'lamp',b:'car-part',name:'THE SUN MACHINE',points:150,reply:"I wouldn't stand underneath it."}
];
const junk=[
 ['toaster','🍞','TOASTER'],['wheel','🛞','WHEEL'],['kettle','🫖','KETTLE'],['chair','🪑','CHAIR'],
 ['tv','📺','TV'],['pipe','🔩','PIPE'],['tyre','⭕','TYRE'],['traffic-cone','🚧','CONE'],
 ['bucket','🪣','BUCKET'],['fan','🌀','FAN'],['lamp','💡','LAMP'],['car-part','⚙️','CAR PART']
];
let activeRecipe=null,selected=[];
function shuffle(a){return a.sort(()=>Math.random()-.5)}
function newScrapPile(){
 selected=[];$('#scrap-result').textContent='';$('#target-label').textContent='BUILD SOMETHING';$('#scrap-target').querySelectorAll('.target-piece').forEach(x=>x.remove());
 const recipe=recipes[Math.floor(Math.random()*recipes.length)];activeRecipe=recipe;
 const decoys=shuffle(junk.filter(x=>x[0]!==recipe.a&&x[0]!==recipe.b)).slice(0,4);
 const pile=shuffle([junk.find(x=>x[0]===recipe.a),junk.find(x=>x[0]===recipe.b),...decoys]);
 const box=$('#scrap-items');box.innerHTML='';
 pile.forEach((item,i)=>{const b=document.createElement('button');b.className='scrap-item';b.type='button';b.dataset.id=item[0];b.innerHTML=`<span>${item[1]}</span><b>${item[2]}</b>`;
   b.addEventListener('click',()=>selectScrap(item[0],b));box.appendChild(b)});
 $('#recipe-hint').textContent='Nigel isn’t telling you the recipe.';
}
function selectScrap(id,el){
 if(selected.includes(id))return;selected.push(id);el.classList.add('selected');
 const slot=document.createElement('span');slot.className='target-piece';slot.textContent=junk.find(x=>x[0]===id)?.[1]||'🔧';$('#scrap-target').appendChild(slot);
 if(selected.length===2)judgeBuild();
}
function judgeBuild(){
 const good=(selected.includes(activeRecipe.a)&&selected.includes(activeRecipe.b));
 const result=$('#scrap-result');
 if(good){
   const points=activeRecipe.points;const total=Number($('#scrap-score').textContent)+points;$('#scrap-score').textContent=total;
   $('#scrap-builds').textContent=Number($('#scrap-builds').textContent)+1;$('#target-label').textContent=activeRecipe.name;
   $('#nigel-says').textContent=activeRecipe.reply;result.textContent='✓ '+activeRecipe.name+'  +'+points;
   result.className='scrap-result good';
 }else{
   $('#target-label').textContent='NOPE';$('#nigel-says').textContent='You made... something.';result.textContent='✕ Nigel is unconvinced.';
   result.className='scrap-result bad';
 }
 setTimeout(newScrapPile,900);
}
$('#scrap-reset')?.addEventListener('click',newScrapPile);
if(location.hash==='#scrap-challenge')newScrapPile();
window.addEventListener('hashchange',()=>{if(location.hash==='#scrap-challenge')newScrapPile();if(location.hash!=='#game'&&running){running=false;clearTimeout(spawnTimer);clearInterval(clockTimer)}});


/* Eric's Festival Escape */
const festivalGame=$('#festival-game'),festivalStart=$('#festival-start'),festivalEric=$('#festival-eric'),festivalSecurity=$('#festival-security');
let festivalRunning=false,festivalStage=1,festivalLane=1,festivalGuard=1;
const festivalTips=['Eric recommends confidence.','Walk like you know the band.','Act like you are supposed to be here.','Nobody checks the man with the hat.','Eric has absolutely no ticket.'];
function festivalRound(){
 if(!festivalRunning)return;
 festivalLane=Math.floor(Math.random()*3);festivalGuard=Math.floor(Math.random()*3);
 $('#festival-stage').textContent=festivalStage;$('#festival-status').textContent='OUTSIDE';
 festivalSecurity.style.left=(16+festivalGuard*34)+'%';festivalSecurity.textContent=festivalStage>3?'🚨':'👮';
 festivalEric.style.left=(18+festivalLane*34)+'%';
 $('#festival-message h3').textContent='PICK A GAP';$('#festival-message p').textContent='Security is watching. Probably.';
 festivalGame.classList.remove('festival-win','festival-fail');
}
function startFestival(){
 festivalRunning=true;festivalStage=1;$('#festival-message').style.display='none';festivalRound();
}
function chooseFestivalLane(lane){
 if(!festivalRunning)return;
 if(lane===festivalGuard){
   festivalRunning=false;festivalGame.classList.add('festival-fail');$('#festival-status').textContent='SPOTTED';
   $('#festival-message').style.display='grid';$('#festival-message h3').textContent='NICE TRY';$('#festival-message p').textContent='Security noticed Eric. Eric acted like this was deliberate.';
   $('#festival-start').textContent='TRY AGAIN →';$('#festival-tip').textContent=''+festivalTips[Math.min(festivalStage,festivalTips.length-1)];
 }else{
   festivalGame.classList.add('festival-win');festivalStage++;
   $('#festival-status').textContent='IN!';
   $('#festival-message').style.display='grid';$('#festival-message h3').textContent=festivalStage>6?'ERIC IS IN':'BANGING';
   $('#festival-message p').textContent=festivalStage>6?'He made it. Nobody asked for a ticket.':'Through the fence. Next one is worse.';
   $('#festival-start').textContent=festivalStage>6?'PLAY AGAIN →':'NEXT FENCE →';
   $('#festival-tip').textContent=festivalTips[Math.min(festivalStage-1,festivalTips.length-1)];
   if(festivalStage>6)festivalRunning=false;
 }
}
festivalStart?.addEventListener('click',()=>{if(!festivalRunning||festivalStage===1&&$('#festival-start').textContent!=='NEXT FENCE →')startFestival();else {$('#festival-message').style.display='none';festivalRound()}});
festivalGame?.querySelectorAll('.festival-gates button').forEach(b=>b.addEventListener('click',()=>chooseFestivalLane(Number(b.dataset.lane))));
if(location.hash==='#festival-escape')startFestival();

/* Rufus the Dog */
const fetchThings=[['🦴','BONE'],['🛞','TYRE'],['🍞','DOUGHNUT'],['🪑','CHAIR'],['📺','TV'],['🐟','FISH'],['🍩','DOUGHNUT'],['🪣','BUCKET']];
let fetchTarget=null,fetchRunning=false;
function newFetchRound(){
 fetchRunning=true;$('#fetch-message').style.display='none';
 const choices=shuffle(fetchThings.slice()).slice(0,4);fetchTarget=choices[Math.floor(Math.random()*choices.length)];
 $('#throw-item').textContent=fetchTarget[0];
 const box=$('#fetch-options');box.innerHTML='';
 shuffle(choices.slice()).forEach(x=>{const b=document.createElement('button');b.className='fetch-option';b.innerHTML='<span>'+x[0]+'</span><b>'+x[1]+'</b>';b.addEventListener('click',()=>chooseFetch(x,b));box.appendChild(b)});
 $('#fetch-tip').textContent='Rufus is watching.';
}
function chooseFetch(item,button){
 if(!fetchRunning)return;fetchRunning=false;
 const score=$('#fetch-score'),streak=$('#fetch-streak'),msg=$('#fetch-message'),tip=$('#fetch-tip');
 if(item[1]===fetchTarget[1]){
   const newScore=Number(score.textContent)+1;const newStreak=Number(streak.textContent)+1;score.textContent=newScore;streak.textContent=newStreak;
   button.classList.add('correct');$('#rufus-game').classList.add('fetch-success');
   msg.querySelector('h3').textContent=newStreak>3?'VERY GOOD BOY':'GOOD BOY';
   msg.querySelector('p').textContent=newStreak>3?'Rufus has become suspiciously competent.':'He brought back the correct thing. Eventually.';
   tip.textContent='Rufus says: Woof.';
 }else{
   streak.textContent='0';button.classList.add('wrong');$('#rufus-game').classList.add('fetch-chaos');
   const chaos=['Rufus has fetched the wrong thing.','Rufus has eaten the evidence.','Rufus has found something else.','Rufus is now chasing a bird.'];
   msg.querySelector('h3').textContent='RUfUS';
   msg.querySelector('p').textContent=chaos[Math.floor(Math.random()*chaos.length)];
   tip.textContent='Nigel: “That is not what I threw.”';
 }
 msg.style.display='grid';setTimeout(()=>{$('#rufus-game').classList.remove('fetch-success','fetch-chaos')},400);
}
$('#fetch-start')?.addEventListener('click',newFetchRound);
if(location.hash==='#rufus-dog')newFetchRound();
window.addEventListener('hashchange',()=>{if(location.hash==='#festival-escape')startFestival();if(location.hash==='#rufus-dog')newFetchRound()});

/* WORM ON ACID — mini Snake-style game */
(()=>{
const canvas=$('#worm-canvas'),wrap=$('#worm-game'),overlay=$('#worm-overlay'),start=$('#worm-start');
if(!canvas||!wrap||!overlay||!start)return;
const ctx=canvas.getContext('2d'),scoreEl=$('#worm-score'),sizeEl=$('#worm-size'),effectEl=$('#worm-effect'),bestEl=$('#worm-best');
const W=24,H=16; let cell=20,player=[],dir={x:1,y:0},nextDir={x:1,y:0},foods=[],enemies=[],running=false,score=0,last=0,timer=0,speed=135,effectTimer=0,effectText='NORMAL',touchStart=null;
let best=Number(localStorage.getItem('woaWormBest')||0);bestEl.textContent='BEST '+best;
function resize(){const r=wrap.getBoundingClientRect();cell=Math.max(10,Math.floor(Math.min(r.width/W,(r.height-48)/H)));canvas.width=W*cell;canvas.height=H*cell;draw()} resize();window.addEventListener('resize',resize);
function rnd(){return {x:Math.floor(Math.random()*W),y:Math.floor(Math.random()*H)}}
function occupied(p){return player.some(s=>s.x===p.x&&s.y===p.y)||enemies.some(e=>e.body.some(s=>s.x===p.x&&s.y===p.y))}
function spot(){let p;do{p=rnd()}while(occupied(p)||foods.some(f=>f.x===p.x&&f.y===p.y));return p}
function makeFood(kind){const p=spot();foods.push({...p,kind})}
function reset(){
 player=[{x:5,y:8},{x:4,y:8},{x:3,y:8}];dir={x:1,y:0};nextDir={x:1,y:0};score=0;speed=135;effectTimer=0;effectText='NORMAL';
 foods=[];enemies=[];
 makeFood('acid');makeFood('goo');makeFood('mystery');
 for(let i=0;i<3;i++){let p=spot(),len=3+i*2,b=[];for(let j=0;j<len;j++)b.push({x:(p.x-j+W)%W,y:p.y});enemies.push({body:b,dir:{x:Math.random()<.5?1:-1,y:0},big:len>=5})}
 updateHud();draw()
}
function updateHud(){scoreEl.textContent=score;sizeEl.textContent=player.length;effectEl.textContent=effectTimer>0?effectText:'NORMAL'}
function setDir(x,y){if(x===-dir.x&&y===-dir.y)return;nextDir={x,y}}
function eatFood(f){
 foods=foods.filter(x=>x!==f);
 if(f.kind==='acid'){score+=10;player.push({...player[player.length-1]});effectText='GROW';effectTimer=900;speed=Math.max(75,speed-3)}
 if(f.kind==='goo'){score+=5;player.splice(Math.max(1,player.length-3),3);effectText='SHRINK';effectTimer=900}
 if(f.kind==='mystery'){
   const n=Math.floor(Math.random()*4);
   if(n===0){for(let i=0;i<4;i++)player.push({...player[player.length-1]});effectText='MYSTERY: GROW';}
   if(n===1){player.splice(Math.max(1,player.length-5),5);effectText='MYSTERY: SHRINK';}
   if(n===2){speed=75;effectText='MYSTERY: FAST';}
   if(n===3){score+=30;effectText='MYSTERY: +30';}
   effectTimer=1800;
 }
 if(!foods.some(x=>x.kind==='acid'))makeFood('acid');
 if(!foods.some(x=>x.kind==='goo'))makeFood('goo');
 if(!foods.some(x=>x.kind==='mystery'))makeFood('mystery');
 updateHud()
}
function moveEnemy(e){
 const head=e.body[0], opts=[];
 if(Math.random()<.65){
   if(Math.abs(player[0].x-head.x)>Math.abs(player[0].y-head.y)) e.dir={x:Math.sign(player[0].x-head.x)||e.dir.x,y:0};
   else e.dir={x:0,y:Math.sign(player[0].y-head.y)||e.dir.y};
 }
 const nh={x:(head.x+e.dir.x+W)%W,y:(head.y+e.dir.y+H)%H};
 e.body.unshift(nh);e.body.pop()
}
function fail(msg){running=false;cancelAnimationFrame(timer);overlay.style.display='grid';overlay.querySelector('h3').textContent='WORMED OUT';overlay.querySelector('p').innerHTML=msg+'<br>Score: <b>'+score+'</b>';start.textContent='PLAY AGAIN →';if(score>best){best=score;localStorage.setItem('woaWormBest',best);bestEl.textContent='BEST '+best}draw()}
function tick(now){
 if(!running)return;
 if(now-last<speed){timer=requestAnimationFrame(tick);return} last=now;
 dir=nextDir;const head={x:(player[0].x+dir.x+W)%W,y:(player[0].y+dir.y+H)%H};
 if(player.some((s,i)=>i>0&&s.x===head.x&&s.y===head.y)){fail('You ate yourself. Very on-brand.');return}
 player.unshift(head);
 let ate=false;
 const fi=foods.find(f=>f.x===head.x&&f.y===head.y);if(fi){eatFood(fi);ate=true}
 if(!ate)player.pop();
 for(const e of enemies)moveEnemy(e);
 for(const e of enemies){
   const hit=e.body.findIndex(s=>s.x===head.x&&s.y===head.y);
   if(hit>=0){
     if(player.length>e.body.length){score+=25;effectText='LUNCH';effectTimer=900;enemies=enemies.filter(x=>x!==e);makeFood('mystery');updateHud()}
     else{fail(player.length===e.body.length?'TWO WORMS ENTER. ONE WORM LEAVES.':'THAT WORM WAS MUCH BIGGER.');return}
   }
 }
 if(effectTimer>0){effectTimer-=speed;if(effectTimer<=0){effectTimer=0;effectText='NORMAL';speed=135}}
 updateHud();draw();timer=requestAnimationFrame(tick)
}
function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
 ctx.fillStyle='#11160e';ctx.fillRect(0,0,canvas.width,canvas.height);
 for(let x=0;x<W;x++)for(let y=0;y<H;y++){ctx.fillStyle=(x+y)%2?'rgba(181,255,33,.018)':'rgba(255,255,255,.012)';ctx.fillRect(x*cell,y*cell,cell,cell)}
 foods.forEach(f=>{ctx.beginPath();ctx.arc((f.x+.5)*cell,(f.y+.5)*cell,cell*.32,0,Math.PI*2);ctx.fillStyle=f.kind==='acid'?'#b5ff21':f.kind==='goo'?'#4db7ff':'#b45cff';ctx.fill();ctx.strokeStyle='#171510';ctx.lineWidth=2;ctx.stroke()});
 enemies.forEach(e=>e.body.forEach((s,i)=>{ctx.fillStyle=e.body.length>4?'#ff5945':'#ffad22';ctx.fillRect(s.x*cell+2,s.y*cell+2,cell-4,cell-4);if(i===0){ctx.fillStyle='#171510';ctx.fillRect(s.x*cell+cell*.25,s.y*cell+cell*.25,cell*.16,cell*.16);ctx.fillRect(s.x*cell+cell*.59,s.y*cell+cell*.25,cell*.16,cell*.16)}}));
 player.forEach((s,i)=>{ctx.fillStyle=i===0?'#f4eee0':'#8bd61d';ctx.beginPath();ctx.arc((s.x+.5)*cell,(s.y+.5)*cell,cell*(i===0?.42:.36),0,Math.PI*2);ctx.fill();if(i===0){ctx.fillStyle='#171510';ctx.beginPath();ctx.arc((s.x+.34)*cell,(s.y+.35)*cell,cell*.07,0,Math.PI*2);ctx.arc((s.x+.66)*cell,(s.y+.35)*cell,cell*.07,0,Math.PI*2);ctx.fill()}})}
function startGame(){reset();overlay.style.display='none';running=true;last=performance.now();timer=requestAnimationFrame(tick)}
start.addEventListener('click',startGame);
document.addEventListener('keydown',e=>{if(location.hash!=='#worm-on-acid')return;const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(m){e.preventDefault();setDir(m[0],m[1])}});
canvas.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY}},{passive:true});
canvas.addEventListener('touchend',e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))setDir(dx>0?1:-1,0);else setDir(0,dy>0?1:-1)},{passive:true});
window.addEventListener('hashchange',()=>{if(location.hash==='#worm-on-acid'){reset();overlay.style.display='grid';running=false}else if(running){running=false;cancelAnimationFrame(timer)}});
reset();
})();


/* Robust game-card navigation */
(()=>{
  const gameIds=new Set(['game','scrap-challenge','festival-escape','rufus-dog','worm-on-acid']);
  function showGame(id,scroll=true){
    const target=document.getElementById(id);
    if(!target||!gameIds.has(id))return false;
    document.body.classList.add('game-open');
    document.querySelectorAll('.game-detail').forEach(el=>{
      el.classList.remove('active-game');
      el.style.display='none';
    });
    target.classList.add('active-game');
    target.style.display='block';
    if(scroll) requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
    return true;
  }
  function closeGames(){
    document.body.classList.remove('game-open');
    document.querySelectorAll('.game-detail').forEach(el=>{
      el.classList.remove('active-game');
      el.style.removeProperty('display');
    });
  }
  document.addEventListener('click',e=>{
    const link=e.target.closest('a.card-play');
    if(!link)return;
    const id=(link.getAttribute('href')||'').replace(/^#/,'');
    if(!showGame(id,false))return;
    e.preventDefault();
    if(location.hash!=='#'+id) history.pushState(null,'','#'+id);
    requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  });
  function syncGameRoute(){
    const id=location.hash.replace(/^#/,'');
    if(gameIds.has(id)) showGame(id,true); else closeGames();
  }
  window.addEventListener('hashchange',syncGameRoute);
  window.addEventListener('popstate',syncGameRoute);
  syncGameRoute();
})();
