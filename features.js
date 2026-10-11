/* Expert features pack - Affan portfolio */
(function(){
  var spot=document.getElementById('spot');
  if(spot && matchMedia('(hover:hover)').matches){
    document.body.classList.add('spot-on');
    document.addEventListener('mousemove',function(e){
      document.documentElement.style.setProperty('--sx',e.clientX+'px');
      document.documentElement.style.setProperty('--sy',e.clientY+'px');
    },{passive:true});
  }
  if(matchMedia('(hover:hover) and (min-width:900px)').matches){
    document.querySelectorAll('.btn, .bento-cell').forEach(function(el){
      el.classList.add('magnetic');
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*0.18;
        var y=(e.clientY-r.top-r.height/2)*0.18;
        el.style.transform='translate('+x+'px,'+y+'px)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform='';});
    });
  }
  var cyc=document.getElementById('cyc');
  var words=['ship','scale','work','last','win'];
  var wi=0;
  var chars='!<>-_\\/[]{}—=+*^?#________';
  function scrambleTo(el, next){
    var old=el.textContent, len=Math.max(old.length, next.length), frame=0;
    el.classList.add('scrambling');
    var id=setInterval(function(){
      var out='';
      for(var i=0;i<len;i++){
        if(i < frame/2) out += next[i]||'';
        else out += chars[Math.floor(Math.random()*chars.length)];
      }
      el.textContent=out;
      frame++;
      if(frame > len*2){ clearInterval(id); el.textContent=next; el.classList.remove('scrambling'); }
    }, 28);
  }
  if(cyc){
    setInterval(function(){
      wi=(wi+1)%words.length;
      scrambleTo(cyc, words[wi]);
    }, 2800);
  }
  var sections=['top','personal','tools','contact'];
  var dots=document.querySelectorAll('.dots a[data-s]');
  function markDot(){
    var y=scrollY+innerHeight*0.35;
    var cur='top';
    sections.forEach(function(id){
      var el=document.getElementById(id);
      if(el && el.offsetTop <= y) cur=id;
    });
    dots.forEach(function(a){
      a.classList.toggle('on', a.getAttribute('data-s')===cur);
    });
  }
  window.addEventListener('scroll',markDot,{passive:true});
  markDot();
  var shareBtn=document.getElementById('shareBtn');
  if(shareBtn){
    shareBtn.onclick=function(){
      var url=location.origin+'/';
      if(navigator.share){
        navigator.share({title:'Affan Ahmed Shariff',url:url}).catch(function(){});
      } else if(navigator.clipboard){
        navigator.clipboard.writeText(url).then(function(){
          if(window.toast) window.toast('Profile link copied');
        });
      }
    };
  }
  var sfxOn=false;
  var sfxBtn=document.getElementById('sfxBtn');
  var audioCtx=null;
  function beep(freq, dur){
    if(!sfxOn) return;
    try{
      if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      var o=audioCtx.createOscillator();
      var g=audioCtx.createGain();
      o.type='sine'; o.frequency.value=freq;
      g.gain.value=0.04;
      o.connect(g); g.connect(audioCtx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+(dur||0.08));
      o.stop(audioCtx.currentTime+(dur||0.08));
    }catch(e){}
  }
  if(sfxBtn){
    sfxBtn.classList.add('muted');
    sfxBtn.onclick=function(){
      sfxOn=!sfxOn;
      sfxBtn.classList.toggle('muted', !sfxOn);
      sfxBtn.title=sfxOn?'Sound on':'Sound off';
      if(sfxOn) beep(880,0.06);
      if(window.toast) window.toast(sfxOn?'Sound on':'Sound off');
    };
    document.addEventListener('click',function(e){
      if(e.target.closest('a,button')) beep(520,0.04);
    }, true);
  }
  var keys=document.getElementById('keys');
  function openKeys(){ if(keys) keys.classList.add('open'); }
  function closeKeys(){ if(keys) keys.classList.remove('open'); }
  var keysClose=document.getElementById('keysClose');
  if(keysClose) keysClose.onclick=closeKeys;
  if(keys) keys.onclick=function(e){ if(e.target===keys) closeKeys(); };
  var gPending=false;
  document.addEventListener('keydown',function(e){
    if(e.target && (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')) return;
    if(e.key==='?' || (e.shiftKey && e.key==='/')){ e.preventDefault(); openKeys(); return; }
    if(e.key==='Escape'){ closeKeys(); return; }
    if(e.key.toLowerCase()==='t' && !e.metaKey && !e.ctrlKey){
      var tb=document.getElementById('themeBtn'); if(tb) tb.click();
      return;
    }
    if(e.key.toLowerCase()==='g'){ gPending=true; setTimeout(function(){gPending=false;},700); return; }
    if(gPending){
      gPending=false;
      var k=e.key.toLowerCase();
      if(k==='h') window.open('https://hatch-primeora.vercel.app','_blank');
      if(k==='a') location.href='/aether/';
      if(k==='g') location.href='/gestureos/';
      if(k==='p') location.href='play.html';
    }
  });
  var seq=[38,38,40,40,37,39,37,39,66,65], si=0;
  document.addEventListener('keydown',function(e){
    if(e.keyCode===seq[si]){ si++; if(si===seq.length){ si=0;
      document.body.style.transition='filter .4s';
      document.body.style.filter='hue-rotate(90deg) saturate(1.4)';
      if(window.toast) window.toast('Konami unlocked');
      beep(660,0.1); setTimeout(function(){beep(880,0.12);},100);
      setTimeout(function(){ document.body.style.filter=''; }, 2800);
    }} else si=0;
  });
})();
