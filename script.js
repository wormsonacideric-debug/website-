const $=s=>document.querySelector(s);
const gameBoard=$('#board'),birds=$('#birds'),overlay=$('#game-overlay'),start=$('#start-game');
const scoreEl=$('#score'),timeEl=$('#time'),comboEl=$('#combo'),bestEl=$('#best'),statusEl=$('#status');
let score=0,startTime=0,running=false,spawnTimer,clockTimer,combo=1,birdsMissed=0;
let best=Number(localStorage.getItem('woaEarlyBirdsBest')||0); if(bestEl) bestEl.textContent='BEST '+best;
function fmt(ms){let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function setStatus(t){if(statusEl)statusEl.textContent=t}
function spawnBird(){
 if(!running)return;
 const b=document.createElement('button'); b.className='bird'; b.type='button';
 const eagle=Math.random()<Math.min(.25,.08+score/180);
 b.textContent=eagle?'🦅':'🐦'; b.dataset.value=eagle?'5':'1';
 b.style.left=(3+Math.random()*89)+'%'; b.style.top='-65px';
 const dur=Math.max(1.25,3.4-score*.018-Math.random()*.65); b.style.animationDuration=dur+'s';
 b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!running)return;
   const value=Number(b.dataset.value);score+=value*combo;scoreEl.textContent=score;combo=Math.min(8,combo+1);comboEl.textContent='COMBO ×'+combo;
   b.classList.add('caught');b.textContent='💥';gameBoard.classList.add('rufus-lunge');setStatus(value===5?'RUFUS GOT THE BIG ONE':'RUFUS GOT IT');
   setTimeout(()=>{b.remove();gameBoard.classList.remove('rufus-lunge')},160);
 });
 b.addEventListener('animationend',()=>{if(!running)return;birdsMissed++;combo=1;comboEl.textContent='COMBO ×1';endGame()});
 birds.appendChild(b);spawnTimer=setTimeout(spawnBird,Math.max(300,1050-score*7));
}
function startGame(){
 running=true;score=0;combo=1;birdsMissed=0;scoreEl.textContent='0';comboEl.textContent='COMBO ×1';startTime=Date.now();
 overlay.style.display='none';birds.innerHTML='';clearTimeout(spawnTimer);clearInterval(clockTimer);setStatus('RUfUS IS WATCHING');spawnBird();
 clockTimer=setInterval(()=>timeEl.textContent=fmt(Date.now()-startTime),100);
}
function endGame(){
 if(!running)return;running=false;clearTimeout(spawnTimer);clearInterval(clockTimer);
 timeEl.textContent=fmt(Date.now()-startTime);const newBest=score>best;if(newBest){best=score;localStorage.setItem('woaEarlyBirdsBest',best);bestEl.textContent='BEST '+best}
 overlay.style.display='grid';overlay.querySelector('h3').textContent='ERIC SURVIVED';overlay.querySelector('p').innerHTML=`Score: <b>${score}</b><br>${newBest?'New best.':'Rufus remains convinced this was a team effort.'}`;
 start.textContent='PLAY AGAIN →';setStatus('SAFE... FOR NOW');
}
start?.addEventListener('click',startGame);

const recipes=[
 {a:'toaster',b:'wheel',name:'THE TOASTERMOBILE',points:100,reply:'Banging. It actually moves.'},
 {a:'kettle',b:'chair',name:'THE KETTLE THRONE',points:75,reply:'Not useful. But comfortable.'},
 {a:'tv',b:'pipe',name:'THE SCRAPCASTER',points:125,reply:'That should not work. It does.'},
 {a:'tyre',b:'traffic-cone',name:'THE SAFETY MACHINE',points:90,reply:'Finally. Something responsible.'},
 {a:'bucket',b:'fan',name:'THE BUCKET FAN',points:60,reply:'It makes wind. Congratulations.'},
 {a:'lamp',b:'car-part',name:'THE SUN MACHINE',points:150,reply:'I wouldn't stand underneath it.'}
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
