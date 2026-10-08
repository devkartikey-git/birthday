const PASSCODE = '090919';
const scenes = [...document.querySelectorAll('.scene')];
const validPages = new Set(scenes.map(s => s.id));
const labels = {cake:'01 · Make a wish',wish:'02 · Happy birthday',accept:'03 · A little surprise',retry:'Try once more ♡',gifts:'04 · Choose your gift',letter:'05 · A letter for you',flowers:'06 · Flowers for you',scrapbook:'07 · Your scrapbook',album:'All our little moments'};
const next = {wish:'accept',letter:'gifts',flowers:'gifts',scrapbook:'gifts',album:'gifts'};
const lock = document.querySelector('#lockScreen');
const experience = document.querySelector('#experience');
const digits = [...document.querySelectorAll('.passcode input')];
const error = document.querySelector('#lockError');
const reader = document.querySelector('#reader');
let current = 'cake', unlocked = false, trail = [];
function sizeStage(){
 document.documentElement.style.setProperty('--lock-scale', Math.min(innerWidth / 1366, innerHeight / 768));
 const portrait = matchMedia('(max-width:700px) and (orientation:portrait)').matches;
 document.documentElement.style.setProperty('--scale', portrait ? 1 : Math.min(innerWidth / 1366, (innerHeight - 48) / 768));
}
addEventListener('resize',sizeStage); sizeStage();
function showPage(name, record = true){
 if(!unlocked || !validPages.has(name)) return;
 if(record && name !== current) trail.push(current);
 scenes.forEach(s=>{s.hidden = s.id !== name;s.classList.remove('entering');});
 current = name;
 const active = document.getElementById(name);
 active.scrollTop = 0;
 void active.offsetWidth;
 active.classList.add('entering');
 document.querySelector('#pageLabel').textContent = labels[name];
 document.querySelector('#backButton').disabled = !trail.length;
 document.querySelector('#nextButton').hidden = !next[name];
 document.querySelector('#homeButton').hidden = ['cake','wish','accept','retry'].includes(name);
 document.querySelector('#albumButton').hidden = !['scrapbook','album'].includes(name);
 history.replaceState({page:name},'',`#${name}`);
 const heading = active.querySelector('h1');
 if(heading) heading.focus({preventScroll:true});
}
function unlock(){
 if(digits.map(d=>d.value).join('') !== PASSCODE){error.textContent='Not quite! Try that special date again.';digits.forEach(d=>d.value='');digits[0].focus();return;}
 unlocked = true; experience.hidden = false;lock.classList.add('is-open');
 showPage('cake',false);sizeStage();
 setTimeout(()=>{lock.hidden=true;lock.setAttribute('aria-hidden','true');},350);
}
digits.forEach((input,index)=>{
 input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(-1);error.textContent='';if(input.value && digits[index+1])digits[index+1].focus();});
 input.addEventListener('keydown',event=>{if(event.key==='Enter')unlock();if(event.key==='Backspace'&&!input.value&&index)digits[index-1].focus();});
 input.addEventListener('paste',event=>{event.preventDefault();const value=event.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);digits.forEach((d,i)=>d.value=value[i]||'');digits[Math.min(value.length,5)].focus();});
});
document.querySelectorAll('[data-key]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.key;error.textContent='';
 if(key==='clear'){digits.forEach(d=>d.value='');return;}
 if(key==='backspace'){const d=[...digits].reverse().find(d=>d.value);if(d)d.value='';return;}
 const d=digits.find(d=>!d.value);if(d)d.value=key;
}));
document.querySelector('#unlockButton').addEventListener('click',unlock);
document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>showPage(button.dataset.go)));
document.querySelector('#backButton').addEventListener('click',()=>{const previous=trail.pop();if(previous)showPage(previous,false);});
document.querySelector('#homeButton').addEventListener('click',()=>showPage('gifts'));
document.querySelector('#albumButton').addEventListener('click',()=>showPage('album'));
document.querySelector('#nextButton').addEventListener('click',()=>{if(next[current])showPage(next[current]);});
addEventListener('hashchange',()=>{const name=location.hash.slice(1);if(unlocked&&validPages.has(name))showPage(name);});
document.querySelectorAll('[data-read]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#readerContent').innerHTML=button.innerHTML;reader.showModal();}));
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const image=new Image();image.src=button.dataset.photo;image.alt=button.getAttribute('aria-label');document.querySelector('#readerContent').replaceChildren(image);reader.showModal();}));
document.querySelector('#closeReader').addEventListener('click',()=>reader.close());
reader.addEventListener('click',event=>{if(event.target===reader)reader.close();});

document.querySelectorAll("[data-read-target]").forEach(button => button.addEventListener("click", () => { document.querySelector("#readerContent").innerHTML = document.getElementById(button.dataset.readTarget).innerHTML; reader.showModal(); }));
