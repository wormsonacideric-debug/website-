/* Early Birds — Peter, Rufus and the donut hazard. */
(()=>{
 const host=document.getElementById("early-birds-canvas"),overlay=document.getElementById("game-overlay"),start=document.getElementById("start-game");
 const scoreEl=document.getElementById("score"),timeEl=document.getElementById("time"),comboEl=document.getElementById("combo"),bestEl=document.getElementById("best"),statusEl=document.getElementById("status");
 if(!host||!overlay||!start)return;
 const setStatus=t=>{if(statusEl)statusEl.textContent=t};
 const fmt=ms=>{let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")};
 const msg=(title,body)=>{overlay.querySelector("h2").textContent=title;overlay.querySelector("p:not(.eyebrow)").textContent=body;overlay.style.display="grid"};
 let best=0;try{best=Number(localStorage.getItem("woaEarlyBirdsBest")||0)}catch(e){} if(bestEl)bestEl.textContent="BEST "+best;
 const canvas=document.createElement("canvas");canvas.width=960;canvas.height=540;canvas.setAttribute("aria-label","Tap the diving birds. Rufus protects Eric, unless the donut clogs his mouth.");canvas.style.cssText="display:block;width:100%;height:100%;touch-action:manipulation";
 host.replaceChildren(canvas);const ctx=canvas.getContext("2d");
 if(!ctx){msg("CANVAS NOT AVAILABLE","This browser cannot start the game. Try refreshing or another browser.");return}
 const sources={
  yard:"../../assets/Highscrapparal.png",eric:"../../assets/eric.webp",
  peterWatch:"./peter-watching.png",peterLaunch:"./peter-launching.png",peterSwoop:"./peter-swooping.png",peterBank:"./peter-banking.png",
  rufusIdle:"./rufus-ground-idle.png",rufusLeap:"./rufus-leaping.png",rufusAttack:"./rufus-midair-attack.png",
  rufusDonut:"./rufus-donut-bite.png",rufusClogged:"./rufus-icing-clogged.png",donut:"./donut-game.png"
 };
 const assets={};let running=false;
 Object.entries(sources).forEach(([k,src])=>{const im=new Image();im.onload=()=>{if(!running)paintIdle()};im.onerror=()=>setStatus("ARTWORK FAILED TO LOAD: "+k.toUpperCase());im.src=src;assets[k]=im});
 let score=0,combo=1,started=0,last=0,nextSpawn=0,difficulty=0,targets=[],raf=0,nextId=1;
 let rufus={state:"idle",until:0,fromX:760,fromY:435,x:760,y:435,targetId:null,kind:null};
 const clogDuration=6500;
 function drawFit(im,x,y,maxW,maxH){if(!im||!im.complete||!im.naturalWidth)return;const scale=Math.min(maxW/im.naturalWidth,maxH/im.naturalHeight);const w=im.naturalWidth*scale,h=im.naturalHeight*scale;ctx.drawImage(im,x-w/2,y-h/2,w,h)}
 function drawBackground(){ctx.clearRect(0,0,960,540);if(assets.yard?.complete&&assets.yard.naturalWidth)ctx.drawImage(assets.yard,0,0,960,540);else{ctx.fillStyle="#20241a";ctx.fillRect(0,0,960,540)}drawFit(assets.eric,315,400,230,250)}
 function rufusImage(){return ({idle:assets.rufusIdle,leap:assets.rufusLeap,attack:assets.rufusAttack,donut:assets.rufusDonut,clogged:assets.rufusClogged})[rufus.state]||assets.rufusIdle}
 function drawRufus(now){
  if(rufus.state==="clogged"&&now>=rufus.until){rufus.state="idle";rufus.targetId=null;setStatus("RUFUS CLEARS THE ICING — BACK ON GUARD")}
  if(rufus.state==="leap"||rufus.state==="attack"||rufus.state==="donut"){
   const elapsed=now-rufus.started;
   const duration=rufus.state==="leap"?360:rufus.state==="attack"?360:520;
   const total=rufus.state==="donut"?880:760;
   const t=Math.min(1,elapsed/total);
   const x=rufus.fromX+(rufus.targetX-rufus.fromX)*Math.min(1,t*1.5);
   const y=435-Math.sin(Math.PI*t)*155;
   if(elapsed>360&&rufus.state==="leap")rufus.state=rufus.kind==="donut"?"donut":"attack";
   if(elapsed>=total){
    if(rufus.targetId!==null){const i=targets.findIndex(o=>o.id===rufus.targetId);if(i>=0)targets.splice(i,1)}
    if(rufus.kind==="donut"){rufus.state="clogged";rufus.until=now+clogDuration;setStatus("RUFUS ATE THE DONUT — ICING-CLOGGED!")}
    else{rufus.state="idle";setStatus("RUFUS INTERCEPTED A BIRD! TAP THE NEXT ONE")}
    rufus.targetId=null;rufus.kind=null;rufus.x=760;rufus.y=435;
    drawFit(rufusImage(),760,455,155,75);return;
   }
   const pose=(rufus.state==="leap"&&elapsed<360)?assets.rufusLeap:(rufus.kind==="donut"?assets.rufusDonut:assets.rufusAttack);
   drawFit(pose,x,y,150,145);return;
  }
  if(rufus.state==="clogged"){drawFit(assets.rufusClogged,760,445,190,120);return}
  drawFit(assets.rufusIdle,760,455,165,76);
 }
 function paintIdle(){drawBackground();drawFit(assets.rufusIdle,760,455,165,76)}
 function poseFor(b){const p=Math.max(0,Math.min(1,(b.y+55)/490));if(p<.18)return assets.peterWatch;if(p<.36)return assets.peterLaunch;if(p<.76)return assets.peterSwoop;return assets.peterBank}
 function drawTarget(b,now){
  if(b.kind==="donut"){drawFit(assets.donut,b.x,b.y,88,70);b.hitRadius=42;return}
  const im=poseFor(b);if(!im||!im.complete||!im.naturalWidth)return;
  const p=Math.max(0,Math.min(1,(b.y+55)/490)),swoop=im===assets.peterSwoop,w=swoop?205:(im===assets.peterLaunch?190:155),h=swoop?155:(im===assets.peterLaunch?150:145);
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(now/260+b.seed)*.055+(swoop?.05:0));ctx.shadowColor="rgba(0,0,0,.42)";ctx.shadowBlur=12;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();b.hitRadius=swoop?78:65;
 }
 function spawn(first=false){
  const donut=!first&&Math.random()<.22;
  targets.push({id:nextId++,kind:donut?"donut":"bird",x:donut?180+Math.random()*600:100+Math.random()*760,y:first?125:-95,speed:(donut?72:86)+difficulty*40+Math.random()*14,seed:Math.random()*9999,value:1,hitRadius:70});
 }
 function beginRufusAttack(target,now){
  if(rufus.state!=="idle")return;
  rufus.kind=target.kind==="donut"?"donut":"bird";rufus.state="leap";rufus.started=now;rufus.fromX=760;rufus.fromY=435;rufus.targetX=target.x;rufus.targetY=target.y;rufus.targetId=target.id;
  setStatus(rufus.kind==="donut"?"RU FUS SPOTS A DONUT… OH NO":"RUFUS LEAPS TO INTERCEPT!");
 }
 function render(){
  const now=performance.now();drawBackground();
  for(const b of targets)drawTarget(b,now);
  drawRufus(now);
  if(!running)return;
  const elapsed=now-started;difficulty=Math.min(1,elapsed/90000);if(timeEl)timeEl.textContent=fmt(elapsed);
  if(now>=nextSpawn){spawn();nextSpawn=now+Math.max(1050,1900-difficulty*500)}
  const dt=Math.max(0,Math.min(0.05,(now-last)/1000));last=now;
  for(const b of targets)b.y+=b.speed*dt;
  if(rufus.state==="idle"){
   const candidate=targets.find(b=>b.y>=350&&Math.abs(b.x-760)<390);
   if(candidate)beginRufusAttack(candidate,now);
  }
  const missed=targets.find(b=>b.kind==="bird"&&b.y>530);
  if(missed){endRound();return}
  targets=targets.filter(b=>b.y<590);
  raf=requestAnimationFrame(render);
 }
 function startRound(){
  cancelAnimationFrame(raf);running=true;score=0;combo=1;started=performance.now();last=started;nextSpawn=0;difficulty=0;targets=[];nextId=1;
  rufus={state:"idle",until:0,fromX:760,fromY:435,x:760,y:435,targetId:null,kind:null};
  if(scoreEl)scoreEl.textContent="0";if(timeEl)timeEl.textContent="00:00";if(comboEl)comboEl.textContent="COMBO ×1";overlay.style.display="none";start.textContent="START GAME →";setStatus("PETER IS WATCHING ERIC");render()
 }
 function endRound(){
  running=false;cancelAnimationFrame(raf);if(timeEl)timeEl.textContent=fmt(performance.now()-started);
  const isBest=score>best;if(isBest){best=score;try{localStorage.setItem("woaEarlyBirdsBest",String(best))}catch(e){}if(bestEl)bestEl.textContent="BEST "+best}
  targets=[];paintIdle();msg("A BIRD GOT THROUGH","Score: "+score+". "+(isBest?"New best!":"Rufus was distracted. Eric lives to panic another day."));start.textContent="PLAY AGAIN →";setStatus("RUFUS IS BACK ON THE GROUND")
 }
 function hit(ev){
  if(!running)return;ev.preventDefault();const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*960/r.width,y=(ev.clientY-r.top)*540/r.height;
  let index=-1,bestDist=Infinity;targets.forEach((b,i)=>{const d=Math.hypot(x-b.x,y-b.y);if(d<(b.hitRadius||70)&&d<bestDist){index=i;bestDist=d}});
  if(index<0)return;const target=targets[index];
  if(target.kind==="donut"){setStatus("DONUT ALERT — RUFUS HAS HIS EYE ON IT");return}
  targets.splice(index,1);score+=combo;combo=Math.min(6,combo+1);if(scoreEl)scoreEl.textContent=score;if(comboEl)comboEl.textContent="COMBO ×"+combo;setStatus(combo>=4?"PETER'S BEEN SENT CIRCLING!":"NICE SHOT — KEEP PETER OFF ERIC")
 }
 window.startEarlyBirdsGame=()=>{startRound();return false};
 start.onclick=ev=>{if(ev){ev.preventDefault();ev.stopPropagation()}startRound();return false};
 start.addEventListener("pointerup",ev=>{if(ev.pointerType==="touch"){ev.preventDefault();startRound()}},{passive:false});
 canvas.addEventListener("pointerdown",hit,{passive:false});
 paintIdle();setStatus("RUFUS IS WAITING ON THE GROUND");
})();
