(function(){
var XP=0,achs={};
function addXP(n){XP+=n;var el=document.getElementById('xpN');if(el)el.textContent=XP;}
function unlock(id){if(achs[id])return;achs[id]=1;var el=document.querySelector('[data-a="'+id+'"]');if(el)el.classList.add('got');toast('Achievement: '+id);addXP(15);}

var toolLinks={"Hatch":"https://hatch-primeora.vercel.app","Aether":"/aether/","Primora":"#contact"};
document.querySelectorAll('.tp').forEach(function(tp){
  tp.addEventListener('click',function(){
    document.querySelectorAll('.tp').forEach(function(x){x.classList.remove('on');});
    tp.classList.add('on');
    document.getElementById('tdIcon').textContent=tp.getAttribute('data-i');
    document.getElementById('tdName').textContent=tp.getAttribute('data-t');
    document.getElementById('tdProj').textContent='Used in '+tp.getAttribute('data-proj');
    document.getElementById('tdUse').textContent=tp.getAttribute('data-use');
    var link=document.getElementById('tdLink');
    var proj=tp.getAttribute('data-proj');
    link.href=toolLinks[proj]||'#';
    link.textContent=proj==='Primora'?'Contact →':'Open '+proj+' →';
  });
});

var stepData=[
  {t:'Discover',b:'Before code: what problem is real? For Hatch it was campus teams stuck without one place to find teammates and ship together. For Aether it was “I want real systems depth, not another CRUD app.”',e:'Hatch started from a clear campus pain, not a random feature list.'},
  {t:'Design',b:'Shape the system before typing. Hatch: teams, clubs, collab flows. Aether: nodes, leader election, majority commit, failure modes.',e:'Aether’s design is Raft-first: consensus is the product, not a side feature.'},
  {t:'Build',b:'Ship working software. Hatch is Next.js + Supabase + TypeScript on Vercel. Aether is Go + Raft + Docker with a live simulator.',e:'Both projects have live demos you can open above, not just GitHub repos.'},
  {t:'Ship',b:'Get it in front of people. Hatch is live for campus use. Aether’s demo lets you poke consensus. Then harden what works.',e:'Live links on this site are the proof, not screenshots in a deck.'}
];
document.querySelectorAll('.step').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.step').forEach(function(x){x.classList.remove('on');});
    btn.classList.add('on');
    var d=stepData[+btn.getAttribute('data-s')];
    document.getElementById('spTitle').textContent=d.t;
    document.getElementById('spBody').textContent=d.b;
    document.getElementById('spEx').innerHTML='<b>Example</b> — '+d.e;
  });
});

var intro=document.getElementById('intro');
function dismiss(){if(intro)intro.classList.add('gone');}
var enter=document.getElementById('enter');if(enter)enter.onclick=dismiss;setTimeout(dismiss,3000);
var words=['ship','scale','work','last','win'],wi=0,cyc=document.getElementById('cyc');
if(cyc){setInterval(function(){cyc.style.opacity='0';setTimeout(function(){wi=(wi+1)%words.length;cyc.textContent=words[wi];cyc.style.opacity='1';},180);},2200);cyc.style.transition='opacity .18s';}
var themes=['','ocean','forest'],ti=0,busy=false;
var blast=document.getElementById('blast'),bctx=blast?blast.getContext('2d'):null,parts=[];
function sizeBlast(){if(!blast)return;blast.width=innerWidth;blast.height=innerHeight;}sizeBlast();window.addEventListener('resize',sizeBlast);
function explode(cx,cy,color){if(!bctx)return;parts=[];var n=innerWidth<700?55:90;for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,sp=4+Math.random()*12;parts.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,r:2+Math.random()*3.5,life:1,decay:.03+Math.random()*.035,color:color});}for(var j=0;j<24;j++){var a2=Math.random()*Math.PI*2,sp2=8+Math.random()*14;parts.push({x:cx,y:cy,vx:Math.cos(a2)*sp2,vy:Math.sin(a2)*sp2,r:1.2,life:1,decay:.045,color:'#fff'});}}
if(bctx){(function loop(){bctx.clearRect(0,0,blast.width,blast.height);for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life-=p.decay;if(p.life<=0){parts.splice(i,1);continue;}bctx.globalAlpha=p.life;bctx.beginPath();bctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);bctx.fillStyle=p.color;bctx.fill();}bctx.globalAlpha=1;requestAnimationFrame(loop);})();}
function applyTheme(i){ti=((i%3)+3)%3;var t=themes[ti];if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');try{localStorage.setItem('affan-theme',String(ti));}catch(e){}}
function setTheme(i){if(busy)return;busy=true;var btn=document.getElementById('themeBtn'),flash=document.getElementById('themeFlash'),r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,next=((i%3)+3)%3,cols=['#ff2d4a','#3b82f6','#22c55e'];if(flash)flash.className='on';explode(cx,cy,cols[next]);applyTheme(i);unlock('theme');setTimeout(function(){if(flash)flash.className='off';busy=false;toast((themes[ti]==='ocean'?'Ocean':themes[ti]==='forest'?'Forest':'Crimson')+' 💥');},250);}
try{var s=localStorage.getItem('affan-theme');if(s!==null){ti=+s;applyTheme(ti);}}catch(e){}
var themeBtn=document.getElementById('themeBtn');if(themeBtn)themeBtn.onclick=function(){setTheme(ti+1);};
document.querySelectorAll('.p-card').forEach(function(card){var glare=document.createElement('div');glare.className='glare';card.insertBefore(glare,card.firstChild);card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform='perspective(900px) rotateX('+((y-0.5)*-14)+'deg) rotateY('+((x-0.5)*16)+'deg) translateY(-6px) scale(1.02)';card.classList.add('tilting');card.style.setProperty('--gx',(x*100)+'%');card.style.setProperty('--gy',(y*100)+'%');});card.addEventListener('mouseleave',function(){card.style.transform='';card.classList.remove('tilting');});});
var nav=document.getElementById('nav'),prog=document.getElementById('prog'),topBtn=document.getElementById('topBtn');
window.addEventListener('scroll',function(){if(nav)nav.classList.toggle('on',scrollY>20);var h=document.documentElement.scrollHeight-innerHeight;if(prog)prog.style.width=(h>0?(scrollY/h)*100:0)+'%';if(topBtn)topBtn.classList.toggle('show',scrollY>450);},{passive:true});
if(topBtn)topBtn.onclick=function(){scrollTo({top:0,behavior:'smooth'});};
var cn=document.querySelector('[data-n]');if(cn){var target=+cn.getAttribute('data-n'),n=0;var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;(function t(){n++;cn.textContent=n;if(n<target)requestAnimationFrame(t);})();io.disconnect();},{threshold:.4});io.observe(cn);}
var radar=document.getElementById('radar');if(radar){var rio=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;radar.querySelectorAll('.radar-fill').forEach(function(f){f.style.width=f.getAttribute('data-w')+'%';});rio.disconnect();},{threshold:.2});rio.observe(radar);}
var c=document.getElementById('bg'),ctx=c?c.getContext('2d'):null,W,H,stars=[];
function resize(){if(!c)return;W=c.width=innerWidth;H=c.height=innerHeight;}function init(){if(!c)return;stars=[];var n=innerWidth<700?28:65;for(var i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.2,s:Math.random()*.25+.04,a:Math.random()*.4+.1});}
function draw(){if(!ctx)return;ctx.clearRect(0,0,W,H);for(var i=0;i<stars.length;i++){var s=stars[i];s.y+=s.s;if(s.y>H)s.y=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+s.a+')';ctx.fill();}requestAnimationFrame(draw);}resize();init();draw();window.addEventListener('resize',function(){resize();init();});
function tick(){var clk=document.getElementById('clk');if(clk)clk.textContent='Bangalore · '+new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'});}tick();setInterval(tick,1000);
function toast(m){var el=document.getElementById('toast');if(!el)return;el.textContent=m;el.classList.add('show');setTimeout(function(){el.classList.remove('show');},1800);}
var copyMail=document.getElementById('copyMail');if(copyMail)copyMail.onclick=function(e){e.preventDefault();if(navigator.clipboard)navigator.clipboard.writeText('affanahmed2302@gmail.com').then(function(){toast('Email copied');});};
var cmd=document.getElementById('cmd');
function openCmd(){if(cmd){cmd.classList.add('open');document.getElementById('cmdIn').focus();}}function closeCmd(){if(cmd)cmd.classList.remove('open');}
document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();cmd&&cmd.classList.contains('open')?closeCmd():openCmd();}if(e.key==='Escape')closeCmd();});
if(cmd)cmd.onclick=function(e){if(e.target===cmd)closeCmd();};
var cmdList=document.getElementById('cmdList');
if(cmdList)cmdList.querySelectorAll('button').forEach(function(b){b.onclick=function(){var g=b.getAttribute('data-go');closeCmd();if(g==='copy'){if(navigator.clipboard)navigator.clipboard.writeText('affanahmed2302@gmail.com').then(function(){toast('Email copied');});}else if(g==='theme')setTheme(ti+1);else if(g.indexOf('http')===0)window.open(g,'_blank');else if(g.indexOf('/')===0||g.indexOf('.html')>=0)location.href=g;else{var el=document.querySelector(g);if(el)el.scrollIntoView({behavior:'smooth'});}};});
var termOut=document.getElementById('termOut');
function tprint(html){if(!termOut)return;var d=document.createElement('div');d.innerHTML=html;termOut.appendChild(d);termOut.scrollTop=termOut.scrollHeight;}
var termIn=document.getElementById('termIn');
if(termIn)termIn.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var v=this.value.trim().toLowerCase();this.value='';tprint('<span class="cmd">$ '+v+'</span>');unlock('term');if(v==='help')tprint('<span class="out">projects · contact · theme · hatch · aether · play · clear</span>');else if(v==='projects')tprint('<span class="out">Hatch (campus) · Aether (Raft KV). Both live.</span>');else if(v==='contact')tprint('<span class="out">WhatsApp +91 9480751817 · affanahmed2302@gmail.com</span>');else if(v==='theme'){setTheme(ti+1);tprint('<span class="out">Theme blasted.</span>');}else if(v==='hatch'){window.open('https://hatch-primeora.vercel.app','_blank');tprint('<span class="out">Opening Hatch…</span>');}else if(v==='aether'){location.href='/aether/';}else if(v==='play'){location.href='play.html';tprint('<span class="out">Opening game…</span>');}else if(v==='clear')termOut.innerHTML='';else tprint('<span class="out">Unknown. Type help.</span>');});
if(window.matchMedia('(min-width:900px)').matches){var cur=document.getElementById('cur');if(cur){document.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});document.querySelectorAll('a,button').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('big');});el.addEventListener('mouseleave',function(){cur.classList.remove('big');});});}}
})();
