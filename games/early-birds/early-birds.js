/* Early Birds — player-triggered Rufus defence and Eric's donut snack. */
(()=>{
 const host=document.getElementById("early-birds-canvas"),overlay=document.getElementById("game-overlay"),start=document.getElementById("start-game");
 const scoreEl=document.getElementById("score"),timeEl=document.getElementById("time"),comboEl=document.getElementById("combo"),bestEl=document.getElementById("best"),statusEl=document.getElementById("status");
 if(!host||!overlay||!start)return;
 const setStatus=t=>{if(statusEl)statusEl.textContent=t};
 const fmt=ms=>{let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")};
 const msg=(title,body)=>{overlay.querySelector("h2").textContent=title;overlay.querySelector("p:not(.eyebrow)").textContent=body;overlay.style.display="grid"};
 let best=0;try{best=Number(localStorage.getItem("woaEarlyBirdsBest")||0)}catch(e){}if(bestEl)bestEl.textContent="BEST "+best;
 const canvas=document.createElement("canvas");canvas.width=960;canvas.height=540;canvas.setAttribute("aria-label","Tap a bird or donut to send Rufus after it. Eric eats donuts that reach the ground.");canvas.style.cssText="display:block;width:100%;height:100%;touch-action:manipulation";
 host.replaceChildren(canvas);const ctx=canvas.getContext("2d");if(!ctx){msg("CANVAS NOT AVAILABLE","Try refreshing or another browser.");return}
 const sources={yard:"../../assets/high-scraparral-canonical.jpg",eric:"../../assets/eric.webp",peterWatch:"./peter-watching.png",peterLaunch:"./peter-launching.png",peterSwoop:"./peter-swooping.png",peterBank:"./peter-banking.png",rufusIdle:"./rufus-ground-idle.png",rufusLeap:"./rufus-leaping.png",rufusAttack:"./rufus-midair-attack.png",rufusDonut:"./rufus-donut-bite.png",rufusClogged:"./rufus-icing-clogged.png",donut:"./donut-game.png"};
 const assets={};let running=false;
 Object.entries(sources).forEach(([k,src])=>{const im=new Image();im.onload=()=>{if(!running)paintIdle()};im.onerror=()=>setStatus("ARTWORK FAILED TO LOAD: "+k.toUpperCase());im.src=src;assets[k]=im});
 let score=0,combo=1,started=0,last=0,nextSpawn=0,difficulty=0,targets=[],raf=0,nextId=1;
 let rufus={state:"idle",until:0,started:0,fromX:760,targetX:760,targetY:300,targetId:null,kind:null};
 let eric={x:315,y:400,snack:null,snackUntil:0};
 const clogDuration=2000;
 function drawFit(im,x,y,maxW,maxH){if(!im||!im.complete||!im.naturalWidth)return;const s=Math.min(maxW/im.naturalWidth,maxH/im.naturalHeight);ctx.drawImage(im,x-im.naturalWidth*s/2,y-im.naturalHeight*s/2,im.naturalWidth*s,im.naturalHeight*s)}
 function drawBackground(){ctx.clearRect(0,0,960,540);if(assets.yard?.complete&&assets.yard.naturalWidth)ctx.drawImage(assets.yard,0,0,960,540);else{ctx.fillStyle="#20241a";ctx.fillRect(0,0,960,540)}drawFit(assets.eric,eric.x,eric.y,230,250)}
 function paintIdle(){drawBackground();drawFit(assets.rufusIdle,760,455,165,76)}
 function rufusPose(){return ({idle:assets.rufusIdle,leap:assets.rufusLeap,attack:assets.rufusAttack,donut:assets.rufusDonut,clogged:assets.rufusClogged})[rufus.state]||assets.rufusIdle}
 function poseFor(b){const p=Math.max(0,Math.min(1,(b.y+55)/490));if(p<.18)return assets.peterWatch;if(p<.36)return assets.peterLaunch;if(p<.76)return assets.peterSwoop;return assets.peterBank}
 function drawTarget(b,now){
  if(b.kind==="donut"){drawFit(assets.donut,b.x,b.y,88,70);b.hitRadius=45;return}
  const im=poseFor(b);if(!im?.complete||!im.naturalWidth)return;
  const p=Math.max(0,Math.min(1,(b.y+55)/490)),swoop=im===assets.peterSwoop,w=swoop?205:(im===assets.peterLaunch?190:155),h=swoop?155:(im===assets.peterLaunch?150:145);
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(now/260+b.seed)*.055+(swoop?.05:0));ctx.shadowColor="rgba(0,0,0,.42)";ctx.shadowBlur=12;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();b.hitRadius=swoop?78:65;
 }
 function spawn(first=false){const donut=!first&&Math.random()<.22;targets.push({id:nextId++,kind:donut?"donut":"bird",x:donut?180+Math.random()*600:100+Math.random()*760,y:first?125:-95,speed:(donut?72:86)+difficulty*40+Math.random()*14,seed:Math.random()*9999,hitRadius:70,clicked:false})}
 function beginRufusAttack(target,now){
  if(rufus.state!=="idle")return false;
  target.clicked=true;rufus.kind=target.kind;rufus.state="leap";rufus.started=now;rufus.fromX=760;rufus.targetX=target.x;rufus.targetY=target.y;rufus.targetId=target.id;
  setStatus(target.kind==="donut"?"RUFUS GOES FOR THE DONUT!":"RUFUS LEAPS TO ATTACK!");
  return true;
 }
 function finishRufus(now){
  const idx=targets.findIndex(t=>t.id===rufus.targetId);if(idx>=0)targets.splice(idx,1);
  if(rufus.kind==="donut"){rufus.state="clogged";rufus.until=now+clogDuration;setStatus("DONUT MOUTH! RUFUS IS OUT FOR 2 SECONDS")}
  else{score+=combo;combo=Math.min(6,combo+1);if(scoreEl)scoreEl.textContent=score;if(comboEl)comboEl.textContent="COMBO ×"+combo;rufus.state="idle";setStatus("RUFUS LANDS — READY FOR YOUR NEXT CLICK")}
  rufus.targetId=null;rufus.kind=null;
 }
 function drawRufus(now){
  if(rufus.state==="clogged"&&now>=rufus.until){rufus.state="idle";setStatus("RUFUS IS READY TO ATTACK AGAIN")}
  if(rufus.state==="leap"||rufus.state==="attack"||rufus.state==="donut"){
   const elapsed=now-rufus.started,total=rufus.kind==="donut"?760:680,t=Math.min(1,elapsed/total);
   const x=rufus.fromX+(rufus.targetX-rufus.fromX)*Math.min(1,t*1.45),y=435-Math.sin(Math.PI*t)*155;
   if(elapsed>300&&rufus.state==="leap")rufus.state=rufus.kind==="donut"?"donut":"attack";
   if(elapsed>=total){finishRufus(now);drawFit(rufusPose(),760,455,165,76);return}
   const pose=elapsed<300?assets.rufusLeap:(rufus.kind==="donut"?assets.rufusDonut:assets.rufusAttack);drawFit(pose,x,y,205,155);return;
  }
  drawFit(rufusPose(),760,455,rufus.state==="clogged"?190:165,rufus.state==="clogged"?120:76);
 }
 function moveEricToDonut(donut,now){eric.snack=donut.id;eric.snackUntil=now+1100;eric.targetX=donut.x;setStatus("ERIC SPOTS A DONUT AND GOES FOR A BITE!")}
 function render(){
  const now=performance.now();drawBackground();
  for(const b of targets)drawTarget(b,now);
  drawRufus(now);
  if(eric.snack!==null){
   const snack=targets.find(t=>t.id===eric.snack);
   if(snack){eric.x+=(Math.max(0,Math.min(1,(now-(eric.snackUntil-1100))/650))*(eric.targetX-315)+315-eric.x)*0.12;eric.y=400;drawFit(assets.eric,eric.x,eric.y,230,250)}
   if(now>=eric.snackUntil){if(snack){targets=targets.filter(t=>t.id!==eric.snack)}eric.x=315;eric.snack=null;setStatus("ERIC FINISHED THE DONUT")}
  }
  if(!running)return;
  const elapsed=now-started;difficulty=Math.min(1,elapsed/90000);if(timeEl)timeEl.textContent=fmt(elapsed);
  if(now>=nextSpawn){spawn();nextSpawn=now+Math.max(1050,1900-difficulty*500)}
  const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;
  for(const b of targets)if(!b.clicked)b.y+=b.speed*dt;
  // Donuts are harmless if ignored: Eric walks over and eats them on the ground.
  for(const b of [...targets])if(b.kind==="donut"&&b.y>=475&&eric.snack===null&&rufus.targetId!==b.id)moveEricToDonut(b,now);
  const missed=targets.find(b=>b.kind==="bird"&&b.y>530&&!b.clicked);
  if(missed){endRound();return}
  targets=targets.filter(b=>b.y<590||b.clicked);
  raf=requestAnimationFrame(render);
 }
 function startRound(){cancelAnimationFrame(raf);running=true;score=0;combo=1;started=performance.now();last=started;nextSpawn=0;difficulty=0;targets=[];nextId=1;rufus={state:"idle",until:0,started:0,fromX:760,targetX:760,targetY:300,targetId:null,kind:null};eric={x:315,y:400,snack:null,snackUntil:0};if(scoreEl)scoreEl.textContent="0";if(timeEl)timeEl.textContent="00:00";if(comboEl)comboEl.textContent="COMBO ×1";overlay.style.display="none";start.textContent="START GAME →";setStatus("TAP A BIRD OR DONUT TO SEND RUFUS");render()}
 function endRound(){running=false;cancelAnimationFrame(raf);if(timeEl)timeEl.textContent=fmt(performance.now()-started);const isBest=score>best;if(isBest){best=score;try{localStorage.setItem("woaEarlyBirdsBest",String(best))}catch(e){}if(bestEl)bestEl.textContent="BEST "+best}targets=[];paintIdle();msg("A BIRD GOT THROUGH","Score: "+score+". "+(isBest?"New best!":"Eric lives to panic another day."));start.textContent="PLAY AGAIN →";setStatus("RUFUS IS BACK ON THE GROUND")}
 function hit(ev){
  if(!running)return;ev.preventDefault();const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*960/r.width,y=(ev.clientY-r.top)*540/r.height;
  let index=-1,dist=Infinity;targets.forEach((b,i)=>{if(b.clicked)return;const d=Math.hypot(x-b.x,y-b.y);if(d<(b.hitRadius||70)&&d<dist){index=i;dist=d}});
  if(index<0)return;const target=targets[index];const now=performance.now();
  if(rufus.state!=="idle"){
   setStatus(rufus.state==="clogged"?"RUFUS HAS A MOUTH FULL OF DONUT — WAIT 2 SECONDS":"RUFUS IS ALREADY ATTACKING!");
   return;
  }
  if(target.kind==="bird"){
   // Keep bird in place during Rufus's jump; remove it only when attack completes.
   beginRufusAttack(target,now);
   return;
  }
  beginRufusAttack(target,now);
 }
 window.startEarlyBirdsGame=()=>{startRound();return false};
 start.onclick=ev=>{if(ev){ev.preventDefault();ev.stopPropagation()}startRound();return false};
 start.addEventListener("pointerup",ev=>{if(ev.pointerType==="touch"){ev.preventDefault();startRound()}},{passive:false});
 canvas.addEventListener("pointerdown",hit,{passive:false});paintIdle();setStatus("RUFUS IS WAITING ON THE GROUND");
})();
