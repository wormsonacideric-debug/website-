/* Early Birds: standalone canvas game. Peter artwork is canonical WOA sprite art. */
(()=> {
 const host=document.getElementById("early-birds-canvas"),overlay=document.getElementById("game-overlay"),start=document.getElementById("start-game");
 const scoreEl=document.getElementById("score"),timeEl=document.getElementById("time"),comboEl=document.getElementById("combo"),bestEl=document.getElementById("best"),statusEl=document.getElementById("status");
 if(!host||!overlay||!start)return;
 const setStatus=t=>{if(statusEl)statusEl.textContent=t};
 const fmt=ms=>{let s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")};
 const msg=(title,body)=>{overlay.querySelector("h2").textContent=title;overlay.querySelector("p:not(.eyebrow)").textContent=body;overlay.style.display="grid"};
 let best=0;try{best=Number(localStorage.getItem("woaEarlyBirdsBest")||0)}catch(e){} if(bestEl)bestEl.textContent="BEST "+best;
 const canvas=document.createElement("canvas");canvas.width=960;canvas.height=540;canvas.setAttribute("aria-label","Tap Peter before he reaches Eric");canvas.style.cssText="display:block;width:100%;height:100%;touch-action:manipulation";
 host.replaceChildren(canvas);const ctx=canvas.getContext("2d");
 if(!ctx){msg("CANVAS NOT AVAILABLE","This browser cannot start the game. Try refreshing or another browser.");return}
 const sources={yard:"../../assets/Highscrapparal.png",eric:"../../assets/eric.webp",rufus:"https://raw.githubusercontent.com/wormsonacideric-debug/website-/main/assets/rufus.webp",attack:"../../assets/rufus-attack.svg",watch:"./peter-watching.png",launch:"./peter-launching.png",swoop:"./peter-swooping.png",bank:"./peter-banking.png"};
 const assets={};let running=false;
 Object.entries(sources).forEach(([k,src])=>{const im=new Image();im.onload=()=>{if(!running)drawScene()};im.onerror=()=>{if(k.startsWith("peter")||["watch","launch","swoop","bank"].includes(k))setStatus("PETER ARTWORK FAILED TO LOAD")};im.src=src;assets[k]=im});
 let score=0,combo=1,started=0,last=0,nextSpawn=0,difficulty=0,birds=[],raf=0;
 function drawImageFit(im,x,y,w,h){if(im&&im.complete&&im.naturalWidth){ctx.drawImage(im,x-w/2,y-h/2,w,h)}}
 function drawScene(){ctx.clearRect(0,0,960,540);drawImageFit(assets.yard,480,270,960,540);drawImageFit(assets.eric,315,390,230,250);drawImageFit(assets.rufus,760,430,150,150)}
 function poseFor(b){const p=Math.max(0,Math.min(1,(b.y+55)/490));if(p<.18)return assets.watch;if(p<.36)return assets.launch;if(p<.76)return assets.swoop;return assets.bank}
 function drawPeter(b,now){const im=poseFor(b);if(!im||!im.complete||!im.naturalWidth)return;const p=Math.max(0,Math.min(1,(b.y+55)/490));const swooping=im===assets.swoop;const w=swooping?205:(im===assets.launch?190:155),h=swooping?155:(im===assets.launch?150:145);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.sin(now/260+b.seed)*.055+(swooping?.05:0));ctx.shadowColor="rgba(0,0,0,.42)";ctx.shadowBlur=12;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();b.hitRadius=swooping?78:65}
 function render(){drawScene();const now=performance.now();birds.forEach(b=>drawPeter(b,now));if(!running)return;const elapsed=now-started;difficulty=Math.min(1,elapsed/90000);if(timeEl)timeEl.textContent=fmt(elapsed);if(now>=nextSpawn){spawn();nextSpawn=now+Math.max(1150,2050-difficulty*650)}for(const b of birds)b.y+=b.speed*Math.max(0,now-last)/1000;last=now;const missed=birds.find(b=>b.y>555);if(missed){endRound();return}raf=requestAnimationFrame(render)}
 function spawn(first=false){birds.push({x:100+Math.random()*760,y:first?125:-105,speed:86+difficulty*40+Math.random()*14,seed:Math.random()*9999,value:1,hitRadius:70})}
 function startRound(){cancelAnimationFrame(raf);running=true;score=0;combo=1;started=performance.now();last=started;nextSpawn=0;difficulty=0;birds=[];spawn(true);if(scoreEl)scoreEl.textContent="0";if(timeEl)timeEl.textContent="00:00";if(comboEl)comboEl.textContent="COMBO ×1";overlay.style.display="none";start.textContent="START GAME →";setStatus("PETER IS WATCHING ERIC");render()}
 function endRound(){running=false;cancelAnimationFrame(raf);if(timeEl)timeEl.textContent=fmt(performance.now()-started);const isBest=score>best;if(isBest){best=score;try{localStorage.setItem("woaEarlyBirdsBest",String(best))}catch(e){}if(bestEl)bestEl.textContent="BEST "+best}birds=[];drawScene();msg("PETER GOT TOO CLOSE","Score: "+score+". "+(isBest?"New best!":"Eric lives to panic another day."));start.textContent="PLAY AGAIN →";setStatus("PETER IS CIRCLING BACK")}
 function hit(ev){if(!running)return;ev.preventDefault();const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*960/r.width,y=(ev.clientY-r.top)*540/r.height;let index=-1,bestDist=Infinity;birds.forEach((b,i)=>{const d=Math.hypot(x-b.x,y-b.y);if(d<(b.hitRadius||70)&&d<bestDist){index=i;bestDist=d}});if(index<0)return;birds.splice(index,1);score+=combo;combo=Math.min(6,combo+1);if(scoreEl)scoreEl.textContent=score;if(comboEl)comboEl.textContent="COMBO ×"+combo;setStatus(combo>=4?"PETER'S BEEN SENT CIRCLING!":"NICE SHOT — KEEP PETER OFF ERIC")}
 window.startEarlyBirdsGame=()=>{startRound();return false};
 start.onclick=ev=>{if(ev){ev.preventDefault();ev.stopPropagation()}startRound();return false};
 start.addEventListener("pointerup",ev=>{if(ev.pointerType==="touch"){ev.preventDefault();startRound()}},{passive:false});
 canvas.addEventListener("pointerdown",hit,{passive:false});
 drawScene();setStatus("PETER IS WATCHING ERIC");
})();