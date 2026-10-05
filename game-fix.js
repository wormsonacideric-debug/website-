(function(){
function boot(){
const board=document.getElementById('board'),overlay=document.getElementById('game-overlay'),start=document.getElementById('start-game'),birds=document.getElementById('birds');
if(!board||!overlay||!start||!birds)return;
let running=false,score=0,combo=1,started=0,spawnTimer=null,clockTimer=null;
const scoreEl=document.getElementById('score'),timeEl=document.getElementById('time'),comboEl=document.getElementById('combo'),bestEl=document.getElementById('best');
let best=Number(localStorage.getItem('woaEarlyBirdsBest')||0);if(bestEl)bestEl.textContent='BEST '+best;
function fmt(ms){const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function end(){
running=false;clearTimeout(spawnTimer);clearInterval(clockTimer);birds.innerHTML='';
const elapsed=Date.now()-started;if(timeEl)timeEl.textContent=fmt(elapsed);
const nb=score>best;if(nb){best=score;localStorage.setItem('woaEarlyBirdsBest',best);if(bestEl)bestEl.textContent='BEST '+best}
overlay.style.display='grid';overlay.querySelector('h3').textContent='ERIC SURVIVED';overlay.querySelector('p').innerHTML='Score: <b>'+score+'</b><br>'+(nb?'New best.':'Rufus remains convinced this was a team effort.');start.textContent='PLAY AGAIN →';
}
function spawn(){
if(!running)return;
const b=document.createElement('button');b.type='button';b.className='bird';b.innerHTML='<svg viewBox="0 0 120 80"><path fill="#3c4850" d="M4 48 Q25 18 56 33 Q76 15 116 22 Q94 40 72 43 Q94 52 110 70 Q76 68 54 52 Q32 70 7 69 Q21 56 28 46 Q15 53 4 48Z"/></svg>';
b.style.left=(4+Math.random()*88)+'%';b.style.top='-70px';b.style.animationDuration=Math.max(2.8,4.8-Math.min(1.8,(Date.now()-started)/45000))+'s';
let done=false;
function hit(e){if(e){e.preventDefault();e.stopPropagation()}if(!running||done)return;done=true;score+=combo;combo=Math.min(6,combo+1);if(scoreEl)scoreEl.textContent=score;if(comboEl)comboEl.textContent='COMBO ×'+combo;b.classList.add('caught');setTimeout(()=>b.remove(),260)}
b.addEventListener('pointerdown',hit);b.addEventListener('click',hit);
b.addEventListener('animationend',()=>{if(!running||done)return;done=true;end()});
birds.appendChild(b);spawnTimer=setTimeout(spawn,Math.max(720,1550-(Date.now()-started)/125));
}
start.addEventListener('click',e=>{
if(overlay.style.display==='none')return;
e.preventDefault();e.stopPropagation();running=true;score=0;combo=1;started=Date.now();if(scoreEl)scoreEl.textContent='0';if(timeEl)timeEl.textContent='00:00';if(comboEl)comboEl.textContent='COMBO ×1';birds.innerHTML='';overlay.style.display='none';clearTimeout(spawnTimer);clearInterval(clockTimer);spawn();clockTimer=setInterval(()=>{if(running&&timeEl)timeEl.textContent=fmt(Date.now()-started)},100);
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();