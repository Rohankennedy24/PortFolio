const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
const menu=document.querySelector('.menu'),links=document.querySelector('.navlinks');
if(menu)menu.onclick=()=>links.classList.toggle('open');

const cursor=document.querySelector('.cursor');
if(cursor && matchMedia('(pointer:fine)').matches) addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
else if(cursor)cursor.remove();

/* ---------- PAGE-WIDE UNIVERSE ENGINE ---------- */
function universeCanvas(){
 const c=document.getElementById('universeCanvas'); if(!c)return;
 const ctx=c.getContext('2d');
 const page=document.body.dataset.page || 'home';
 const palettes={
  home:['#c9ff3d','#6fd3ff','#ffffff'],about:['#8dffbd','#6fd3ff','#ffffff'],projects:['#c9ff3d','#8dffbd','#6fd3ff'],
  'aiml-projects':['#c9ff3d','#6fd3ff','#8dffbd'],'fullstack-projects':['#6fd3ff','#c9ff3d','#ffffff'],
  internships:['#6fd3ff','#8dffbd','#ffffff'],'aiml-internship':['#8dffbd','#c9ff3d','#6fd3ff'],
  'fullstack-internship':['#6fd3ff','#ffffff','#c9ff3d'],simulations:['#c9ff3d','#6fd3ff','#ffffff'],
  certificates:['#c9ff3d','#8dffbd','#ffffff'],skills:['#6fd3ff','#c9ff3d','#8dffbd'],contact:['#c9ff3d','#6fd3ff','#ffffff']
 };
 const colors=palettes[page]||palettes.home;
 let W=0,H=0,dpr=1,mx=.5,my=.5,time=0;
 const stars=Array.from({length:Math.min(170,Math.max(95,innerWidth*.12))},()=>({x:Math.random(),y:Math.random(),z:Math.random(),r:Math.random()*1.8+.25,s:Math.random()*.35+.08,tw:Math.random()*Math.PI*2}));
 const nodes=Array.from({length:page.includes('project')?42:34},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00023,vy:(Math.random()-.5)*.00023,r:Math.random()*1.7+.7,c:Math.floor(Math.random()*colors.length)}));
 const planets=Array.from({length:4},(_,i)=>({a:Math.random()*Math.PI*2,rad:.16+i*.075,spd:(.0006+i*.00025)*(i%2?1:-1),size:3+i*2,c:i%colors.length}));
 function resize(){dpr=Math.min(devicePixelRatio||1,2);W=c.clientWidth=innerWidth;H=c.clientHeight=innerHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
 resize();addEventListener('resize',resize);addEventListener('pointermove',e=>{mx=e.clientX/W;my=e.clientY/H},{passive:true});
 function bg(){ctx.clearRect(0,0,W,H);const g=ctx.createRadialGradient(W*.5,H*.45,0,W*.5,H*.45,Math.max(W,H)*.75);g.addColorStop(0,'rgba(7,14,18,.10)');g.addColorStop(1,'rgba(0,0,0,.18)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 function drawStars(){
  for(const s of stars){const px=s.x*W+(mx-.5)*s.z*28,py=s.y*H+(my-.5)*s.z*20;const alpha=.18+s.z*.7*(.72+.28*Math.sin(time*.0015+s.tw));ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.beginPath();ctx.arc(px,py,s.r*(.45+s.z),0,Math.PI*2);ctx.fill();}
 }
 function drawGalaxy(){
  const cx=W*.5+(mx-.5)*30,cy=H*.48+(my-.5)*25;
  for(let arm=0;arm<4;arm++)for(let i=0;i<170;i++){const p=i/170,ang=p*8+arm*Math.PI/2+time*.00008,rad=p*Math.min(W,H)*.35;const x=cx+Math.cos(ang)*rad*(.72+Math.random()*.28),y=cy+Math.sin(ang)*rad*.48;ctx.fillStyle=`rgba(111,211,255,${.05+(1-p)*.16})`;ctx.fillRect(x,y,1,1)}
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,110);g.addColorStop(0,'rgba(201,255,61,.24)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,110,0,Math.PI*2);ctx.fill();
 }
 function drawNeural(){
  for(const n of nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>1)n.vx*=-1;if(n.y<0||n.y>1)n.vy*=-1}
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],dx=(a.x-b.x)*W,dy=(a.y-b.y)*H,d=Math.hypot(dx,dy);if(d<150){ctx.strokeStyle=`rgba(201,255,61,${(1-d/150)*.12})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x*W,a.y*H);ctx.lineTo(b.x*W,b.y*H);ctx.stroke()}}
  nodes.forEach(n=>{ctx.fillStyle=colors[n.c];ctx.shadowBlur=9;ctx.shadowColor=colors[n.c];ctx.beginPath();ctx.arc(n.x*W,n.y*H,n.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});
 }
 function drawOrbits(){
  const cx=W*.72,cy=H*.48;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.3);for(let i=0;i<4;i++){ctx.strokeStyle=`rgba(111,211,255,${.07+i*.025})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,Math.min(W,H)*(.12+i*.075),Math.min(W,H)*(.045+i*.025),0,0,Math.PI*2);ctx.stroke()}planets.forEach(p=>{p.a+=p.spd;const rx=Math.min(W,H)*p.rad,ry=rx*.34;const x=Math.cos(p.a)*rx,y=Math.sin(p.a)*ry;ctx.fillStyle=colors[p.c];ctx.shadowBlur=18;ctx.shadowColor=colors[p.c];ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0});ctx.restore()}
 function drawConstellation(){
  for(let i=0;i<nodes.length;i++){const n=nodes[i];for(let j=i+1;j<nodes.length;j++){const b=nodes[j],d=Math.hypot((n.x-b.x)*W,(n.y-b.y)*H);if(d<105){ctx.strokeStyle=`rgba(111,211,255,${(1-d/105)*.1})`;ctx.beginPath();ctx.moveTo(n.x*W,n.y*H);ctx.lineTo(b.x*W,b.y*H);ctx.stroke()}}ctx.fillStyle=colors[n.c];ctx.beginPath();ctx.arc(n.x*W,n.y*H,n.r,0,Math.PI*2);ctx.fill()}
 }
 function frame(){time=performance.now();bg();drawStars();
   if(page==='home'||page==='aiml-projects'||page==='skills')drawNeural();
   else if(page==='about'||page==='contact')drawGalaxy();
   else if(page.includes('internship')||page==='internships')drawOrbits();
   else if(page==='projects'||page==='fullstack-projects'||page==='simulations'||page==='certificates')drawConstellation();
   else drawNeural();
   requestAnimationFrame(frame)
 }
 frame();
 const hud=document.getElementById('universeHud');if(hud){const names={home:'NEURAL CORE',about:'PERSONAL GALAXY',projects:'PROJECT CONSTELLATION', 'aiml-projects':'AI NEURAL FIELD','fullstack-projects':'WEB CONSTELLATION',internships:'EXPERIENCE ORBITS','aiml-internship':'ML ORBIT','fullstack-internship':'WEB ORBIT',simulations:'CASEWORK CONSTELLATION',certificates:'CREDENTIAL GALAXY',skills:'SKILL NETWORK',contact:'CONTACT GALAXY'};hud.innerHTML=`UNIVERSE // <b>${names[page]||'ONLINE'}</b>`}
}
universeCanvas();

/* Existing hero neural canvas, kept as a focused local graphic. */
function particleCanvas(id,count=42){
 const c=document.getElementById(id);if(!c)return;const x=c.getContext('2d');let W,H;
 function resize(){W=c.clientWidth;H=c.clientHeight;c.width=W*devicePixelRatio;c.height=H*devicePixelRatio;x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}resize();addEventListener('resize',resize);
 const p=Array.from({length:count},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00035,vy:(Math.random()-.5)*.00035,r:Math.random()*2+1}));
 function draw(){x.clearRect(0,0,W,H);p.forEach(a=>{a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>1)a.vx*=-1;if(a.y<0||a.y>1)a.vy*=-1});for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){let a=p[i],b=p[j],d=Math.hypot((a.x-b.x)*W,(a.y-b.y)*H);if(d<125){x.strokeStyle=`rgba(201,255,61,${(1-d/125)*.16})`;x.beginPath();x.moveTo(a.x*W,a.y*H);x.lineTo(b.x*W,b.y*H);x.stroke()}}p.forEach(a=>{x.fillStyle='rgba(201,255,61,.72)';x.beginPath();x.arc(a.x*W,a.y*H,a.r,0,7);x.fill()});requestAnimationFrame(draw)}draw()
}
particleCanvas('neuralCanvas',46);particleCanvas('contactCanvas',52);

/* Project filters */
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;document.querySelectorAll('.project-card').forEach(c=>c.classList.toggle('hidden',f!=='all'&&!((c.dataset.category||'').includes(f))))});

/* Certificate modal */
const modal=document.querySelector('.modal');
document.querySelectorAll('.cert-card').forEach(card=>card.onclick=()=>{if(!modal)return;modal.querySelector('.big-logo').textContent=card.dataset.logo;modal.querySelector('h2').textContent=card.dataset.title;modal.querySelector('p').textContent=card.dataset.desc;modal.classList.add('open');document.body.style.overflow='hidden'});
if(modal){const close=()=>{modal.classList.remove('open');document.body.style.overflow=''};modal.querySelector('.close').onclick=close;modal.onclick=e=>{if(e.target===modal)close()};addEventListener('keydown',e=>{if(e.key==='Escape')close()})}


/* ---------- CINEMATIC HOME TITLE CARD ---------- */
(function cinematicIntro(){
 const card=document.getElementById('cinemaTitle');
 if(!card)return;
 document.body.classList.add('cinema-active');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const dismiss=()=>{
   if(card.classList.contains('dismissed'))return;
   card.classList.add('dismissed');
   document.body.classList.remove('cinema-active');
   try{sessionStorage.setItem('rkCinemaSeen','1')}catch(e){}
 };
 // First visit: cinematic title. Returning to the home page: a short replay.
 let seen=false;try{seen=sessionStorage.getItem('rkCinemaSeen')==='1'}catch(e){}
 if(reduce){dismiss();return}
 if(seen){
   card.style.transitionDuration='.65s';
   setTimeout(dismiss,900);
 }else{
   setTimeout(dismiss,3900);
 }
 card.addEventListener('click',dismiss,{once:true});
 addEventListener('keydown',e=>{if(e.key==='Escape'||e.key==='Enter')dismiss()},{once:true});
})();
