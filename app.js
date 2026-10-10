(function(){
var XP=0,achs={};
function addXP(n){XP+=n;document.getElementById('xpN').textContent=XP;}
function unlock(id){if(achs[id])return;achs[id]=1;var el=document.querySelector('[data-a="'+id+'"]');if(el)el.classList.add('got');toast('Achievement: '+id);addXP(15);}

/* STACK + PIPE + MEMORY */
var loadout=[],maxSlots=6;
function renderSlots(){
  document.querySelectorAll('.slot').forEach(function(sl,i){
    if(loadout[i]){sl.className='slot filled';sl.innerHTML='<span class="ic">'+loadout[i].i+'</span><span>'+loadout[i].t+'</span>';}
    else{sl.className='slot';sl.textContent='empty';}
  });
  document.querySelectorAll('.tp').forEach(function(tp){
    var name=tp.getAttribute('data-t');
    var used=loadout.some(function(x){return x.t===name;});
    tp.classList.toggle('used',used);tp.classList.toggle('on',used);
  });
  var db=document.getElementById('deployBtn');
  if(db)db.disabled=loadout.length===0;
  var sm=document.getElementById('stackMsg');
  if(sm)sm.textContent=loadout.length?loadout.length+'/6 equipped':'Pick tools from the left →';
}
document.querySelectorAll('.tp').forEach(function(tp){
  tp.addEventListener('click',function(){
    if(loadout.length>=maxSlots){toast('Loadout full');return;}
    var t=tp.getAttribute('data-t'),ic=tp.getAttribute('data-i');
    if(loadout.some(function(x){return x.t===t;}))return;
    loadout.push({t:t,i:ic});renderSlots();
  });
});
document.querySelectorAll('.slot').forEach(function(sl){
  sl.addEventListener('click',function(){
    var i=+sl.getAttribute('data-s');
    if(!loadout[i])return;
    loadout.splice(i,1);renderSlots();
  });
});
var deployBtn=document.getElementById('deployBtn');
if(deployBtn)deployBtn.onclick=function(){
  if(!loadout.length)return;
  document.getElementById('stackMsg').textContent='✓ Deployed: '+loadout.map(function(x){return x.t;}).join(' + ');
  toast('Stack deployed 🚀');unlock('tools');addXP(20);
  this.textContent='Deployed ✓';
  var self=this;setTimeout(function(){self.textContent='Deploy stack';},2000);
};

var pipeRunning=false;
var stageLogs=[['Scanning problem space…','Interviewing constraints…','Definition of done locked.'],['Sketching flows…','Choosing architecture…','Design freeze.'],['Scaffolding repo…','Implementing core path…','Tests green. Shipping.'],['Metrics online…','Load check passed…','Pipeline complete.']];
function pipePrint(cls,msg){var log=document.getElementById('pipeLog');if(!log)return;var d=document.createElement('div');d.className=cls;d.textContent=msg;log.appendChild(d);log.scrollTop=log.scrollHeight;}
function resetPipeUI(){document.querySelectorAll('.stage').forEach(function(s){s.className='stage';var f=s.querySelector('.fill');if(f)f.style.width='0';});var log=document.getElementById('pipeLog');if(log)log.innerHTML='<div class="info">$ pipeline idle — press Run</div>';pipeRunning=false;}
var resetPipe=document.getElementById('resetPipe');if(resetPipe)resetPipe.onclick=resetPipeUI;
var runPipe=document.getElementById('runPipe');
if(runPipe)runPipe.onclick=function(){
  if(pipeRunning)return;pipeRunning=true;
  document.getElementById('pipeLog').innerHTML='';
  document.querySelectorAll('.stage').forEach(function(s){s.className='stage';s.querySelector('.fill').style.width='0';});
  pipePrint('run','$ pipeline start');
  var stages=document.querySelectorAll('.stage'),si=0;
  function nextStage(){
    if(si>=stages.length){pipePrint('ok','✓ all stages green — shipped');toast('Pipeline complete');unlock('pipe');addXP(25);pipeRunning=false;return;}
    var st=stages[si];st.classList.add('run');
    pipePrint('run','→ stage 0'+(si+1)+' '+st.querySelector('h3').textContent);
    var fill=st.querySelector('.fill'),logs=stageLogs[si],li=0,prog=0;
    var tick=setInterval(function(){
      prog+=8;fill.style.width=Math.min(prog,100)+'%';
      if(prog>=30&&li===0){pipePrint('info','  '+logs[0]);li++;}
      if(prog>=60&&li===1){pipePrint('info','  '+logs[1]);li++;}
      if(prog>=100){clearInterval(tick);st.classList.remove('run');st.classList.add('done');pipePrint('ok','  '+logs[2]);si++;setTimeout(nextStage,280);}
    },90);
  }
  nextStage();
};

var seq=[],player=[],accept=false,level=0,best=0;
try{best=+localStorage.getItem('affan-mem-best')||0;}catch(e){}
var mb=document.getElementById('memBest');if(mb)mb.textContent=best;
function lit(p){var el=document.querySelector('.pad[data-p="'+p+'"]');if(!el)return;el.classList.add('lit');setTimeout(function(){el.classList.remove('lit');},320);}
function playSeq(){accept=false;document.getElementById('memStatus').textContent='Watch…';var i=0;(function step(){if(i>=seq.length){accept=true;player=[];document.getElementById('memStatus').textContent='Your turn';return;}lit(seq[i]);i++;setTimeout(step,550);})();}
function nextRound(){level++;document.getElementById('memLvl').textContent=level;seq.push(Math.floor(Math.random()*4));setTimeout(playSeq,500);}
var memStart=document.getElementById('memStart');
if(memStart)memStart.onclick=function(){seq=[];level=0;document.getElementById('memLvl').textContent=0;document.getElementById('memStatus').textContent='Get ready…';setTimeout(nextRound,600);};
document.querySelectorAll('.pad').forEach(function(pad){
  pad.addEventListener('click',function(){
    if(!accept)return;
    var p=+pad.getAttribute('data-p');lit(p);player.push(p);
    var idx=player.length-1;
    if(player[idx]!==seq[idx]){
      accept=false;document.getElementById('memStatus').textContent='Missed! Level '+level;
      toast('Game over · level '+level);
      if(level>best){best=level;document.getElementById('memBest').textContent=best;try{localStorage.setItem('affan-mem-best',String(best));}catch(e){}}
      return;
    }
    if(player.length===seq.length){
      accept=false;document.getElementById('memStatus').textContent='Nice! Next…';
      addXP(5+level);if(level===1)unlock('first');if(level>=5)unlock('lvl5');if(level>=8)unlock('lvl8');
      setTimeout(nextRound,700);
    }
  });
});

var intro=document.getElementById('intro');
function dismiss(){intro.classList.add('gone');}
document.getElementById('enter').onclick=dismiss;setTimeout(dismiss,3000);
var words=['ship','scale','work','last','win'],wi=0,cyc=document.getElementById('cyc');
setInterval(function(){cyc.style.opacity='0';setTimeout(function(){wi=(wi+1)%words.length;cyc.textContent=words[wi];cyc.style.opacity='1';},180);},2200);cyc.style.transition='opacity .18s';
var themes=['','ocean','forest'],ti=0,busy=false;
var blast=document.getElementById('blast'),bctx=blast.getContext('2d'),parts=[];
function sizeBlast(){blast.width=innerWidth;blast.height=innerHeight;}sizeBlast();window.addEventListener('resize',sizeBlast);
function explode(cx,cy,color){parts=[];var n=innerWidth<700?55:90;for(var i=0;i<n;i++){var a=Math.random()*Math.PI*2,sp=4+Math.random()*12;parts.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,r:2+Math.random()*3.5,life:1,decay:.03+Math.random()*.035,color:color});}for(var j=0;j<24;j++){var a2=Math.random()*Math.PI*2,sp2=8+Math.random()*14;parts.push({x:cx,y:cy,vx:Math.cos(a2)*sp2,vy:Math.sin(a2)*sp2,r:1.2,life:1,decay:.045,color:'#fff'});}}
(function loop(){bctx.clearRect(0,0,blast.width,blast.height);for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life-=p.decay;if(p.life<=0){parts.splice(i,1);continue;}bctx.globalAlpha=p.life;bctx.beginPath();bctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);bctx.fillStyle=p.color;bctx.fill();}bctx.globalAlpha=1;requestAnimationFrame(loop);})();
function applyTheme(i){ti=((i%3)+3)%3;var t=themes[ti];if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');try{localStorage.setItem('affan-theme',String(ti));}catch(e){}}
function setTheme(i){if(busy)return;busy=true;var btn=document.getElementById('themeBtn'),flash=document.getElementById('themeFlash'),r=btn.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,next=((i%3)+3)%3,cols=['#ff2d4a','#3b82f6','#22c55e'];flash.className='on';explode(cx,cy,cols[next]);applyTheme(i);unlock('theme');setTimeout(function(){flash.className='off';busy=false;toast((themes[ti]==='ocean'?'Ocean':themes[ti]==='forest'?'Forest':'Crimson')+' 💥');},250);}
try{var s=localStorage.getItem('affan-theme');if(s!==null){ti=+s;applyTheme(ti);}}catch(e){}
document.getElementById('themeBtn').onclick=function(){setTheme(ti+1);};
document.querySelectorAll('.p-card').forEach(function(card){var glare=document.createElement('div');glare.className='glare';card.insertBefore(glare,card.firstChild);card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform='perspective(900px) rotateX('+((y-0.5)*-14)+'deg) rotateY('+((x-0.5)*16)+'deg) translateY(-6px) scale(1.02)';card.classList.add('tilting');card.style.setProperty('--gx',(x*100)+'%');card.style.setProperty('--gy',(y*100)+'%');});card.addEventListener('mouseleave',function(){card.style.transform='';card.classList.remove('tilting');});});
var nav=document.getElementById('nav'),prog=document.getElementById('prog'),topBtn=document.getElementById('topBtn');
window.addEventListener('scroll',function(){nav.classList.toggle('on',scrollY>20);var h=document.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?(scrollY/h)*100:0)+'%';topBtn.classList.toggle('show',scrollY>450);var secs=['top','personal','tools','play','contact'],cur='top';for(var i=0;i<secs.length;i++){var el=document.getElementById(secs[i]);if(el&&el.getBoundingClientRect().top<=innerHeight*.35)cur=secs[i];}document.querySelectorAll('.dots a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-s')===cur);});},{passive:true});
topBtn.onclick=function(){scrollTo({top:0,behavior:'smooth'});};
var cn=document.querySelector('[data-n]');if(cn){var target=+cn.getAttribute('data-n'),n=0;var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;(function t(){n++;cn.textContent=n;if(n<target)requestAnimationFrame(t);})();io.disconnect();},{threshold:.4});io.observe(cn);}
var radar=document.getElementById('radar');if(radar){var rio=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;radar.querySelectorAll('.radar-fill').forEach(function(f){f.style.width=f.getAttribute('data-w')+'%';});rio.disconnect();},{threshold:.2});rio.observe(radar);}
var c=document.getElementById('bg'),ctx=c.getContext('2d'),W,H,stars=[];
function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}function init(){stars=[];var n=innerWidth<700?28:65;for(var i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.2,s:Math.random()*.25+.04,a:Math.random()*.4+.1});}
function draw(){ctx.clearRect(0,0,W,H);for(var i=0;i<stars.length;i++){var s=stars[i];s.y+=s.s;if(s.y>H)s.y=0;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+s.a+')';ctx.fill();}requestAnimationFrame(draw);}resize();init();draw();window.addEventListener('resize',function(){resize();init();});
function tick(){document.getElementById('clk').textContent='Bangalore · '+new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit'});}tick();setInterval(tick,1000);
function toast(m){var el=document.getElementById('toast');el.textContent=m;el.classList.add('show');setTimeout(function(){el.classList.remove('show');},1800);}
document.getElementById('copyMail').onclick=function(e){e.preventDefault();if(navigator.clipboard)navigator.clipboard.writeText('affanahmed2302@gmail.com').then(function(){toast('Email copied');});};
var cmd=document.getElementById('cmd');
function openCmd(){cmd.classList.add('open');document.getElementById('cmdIn').focus();}function closeCmd(){cmd.classList.remove('open');}
document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();cmd.classList.contains('open')?closeCmd():openCmd();}if(e.key==='Escape')closeCmd();});
cmd.onclick=function(e){if(e.target===cmd)closeCmd();};
document.getElementById('cmdList').querySelectorAll('button').forEach(function(b){b.onclick=function(){var g=b.getAttribute('data-go');closeCmd();if(g==='copy'){if(navigator.clipboard)navigator.clipboard.writeText('affanahmed2302@gmail.com').then(function(){toast('Email copied');});}else if(g==='theme')setTheme(ti+1);else if(g.indexOf('http')===0||g.indexOf('/')===0)window.open(g,'_blank');else{var el=document.querySelector(g);if(el)el.scrollIntoView({behavior:'smooth'});}};});
var termOut=document.getElementById('termOut');
function tprint(html){var d=document.createElement('div');d.innerHTML=html;termOut.appendChild(d);termOut.scrollTop=termOut.scrollHeight;}
document.getElementById('termIn').addEventListener('keydown',function(e){if(e.key!=='Enter')return;var v=this.value.trim().toLowerCase();this.value='';tprint('<span class="cmd">$ '+v+'</span>');unlock('term');if(v==='help')tprint('<span class="out">projects · contact · theme · hatch · aether · play · clear</span>');else if(v==='projects')tprint('<span class="out">Hatch (campus) · Aether (Raft KV). Both live.</span>');else if(v==='contact')tprint('<span class="out">WhatsApp +91 9480751817 · affanahmed2302@gmail.com</span>');else if(v==='theme'){setTheme(ti+1);tprint('<span class="out">Theme blasted.</span>');}else if(v==='hatch'){window.open('https://hatch-primeora.vercel.app','_blank');tprint('<span class="out">Opening Hatch…</span>');}else if(v==='aether'){location.href='/aether/';}else if(v==='play'){document.getElementById('play').scrollIntoView({behavior:'smooth'});tprint('<span class="out">Scrolling to play…</span>');}else if(v==='clear')termOut.innerHTML='';else tprint('<span class="out">Unknown. Type help.</span>');});
if(window.matchMedia('(min-width:900px)').matches){var cur=document.getElementById('cur');document.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});document.querySelectorAll('a,button').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('big');});el.addEventListener('mouseleave',function(){cur.classList.remove('big');});});}
})();
