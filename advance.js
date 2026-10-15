(function(){
  var root=document.documentElement,xp=0,seen={};
  var fill=document.getElementById('xpFill'),xpNum=document.getElementById('xpNum'),xpHint=document.getElementById('xpHint');

  function addXp(k,n){
    if(seen[k])return;seen[k]=1;xp=Math.min(100,xp+(n||12));
    if(fill)fill.style.width=xp+'%';
    if(xpNum)xpNum.textContent=xp>=100?'100 / 100 ★':xp+' / 100';
    if(xpHint)xpHint.textContent=xp>=100?'Full explorer unlocked':'Click around — unlock the full explorer';
  }

  var canvas=document.getElementById('stars'),ctx=canvas&&canvas.getContext('2d');
  var stars=[],W=0,H=0,raf=0;
  function resize(){
    if(!canvas)return;
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    var n=Math.min(160,Math.floor(W*H/9000));
    stars=[];
    for(var i=0;i<n;i++)stars.push({
      x:Math.random()*W,y:Math.random()*H,
      z:Math.random()*0.6+0.2,
      r:Math.random()*1.4+0.3,
      tw:Math.random()*Math.PI*2
    });
  }
  function color(){
    var t=root.getAttribute('data-theme');
    return t==='green'?'rgba(110,231,183,':'rgba(140,176,255,';
  }
  function draw(t){
    if(!ctx)return;
    ctx.clearRect(0,0,W,H);
    var c=color();
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      s.y+=s.z*0.35;if(s.y>H)s.y=0;
      s.tw+=0.02;
      var a=0.35+0.45*Math.abs(Math.sin(s.tw));
      ctx.beginPath();
      ctx.fillStyle=c+a+')';
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    raf=requestAnimationFrame(draw);
  }
  if(canvas&&ctx&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    resize();draw(0);
    window.addEventListener('resize',function(){resize()},{passive:true});
  } else if(canvas){resize();}

  try{var sav=localStorage.getItem('affan-adv');if(sav)root.setAttribute('data-theme',sav)}catch(e){}
  function blast(){
    var layer=document.getElementById('blast');
    if(!layer)return;
    layer.innerHTML='';
    var cx=window.innerWidth/2,cy=window.innerHeight*0.35;
    var n=48;
    for(var i=0;i<n;i++){
      var p=document.createElement('i');
      var ang=(i/n)*Math.PI*2+Math.random()*0.4;
      var dist=80+Math.random()*180;
      p.style.cssText='position:absolute;left:'+cx+'px;top:'+cy+'px;width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--glow);pointer-events:none;transition:transform .45s cubic-bezier(.15,.85,.25,1),opacity .45s;opacity:1;transform:translate(-50%,-50%)';
      layer.appendChild(p);
      (function(el,a,d){
        requestAnimationFrame(function(){
          el.style.transform='translate(calc(-50% + '+Math.cos(a)*d+'px), calc(-50% + '+Math.sin(a)*d+'px)) scale(0)';
          el.style.opacity='0';
        });
      })(p,ang,dist);
    }
    setTimeout(function(){layer.innerHTML=''},500);
  }
  function setTheme(t){
    root.setAttribute('data-theme',t);
    try{localStorage.setItem('affan-adv',t)}catch(e){}
    blast();addXp('theme',20);
  }
  function toggleTheme(){setTheme(root.getAttribute('data-theme')==='green'?'blue':'green')}
  ['themeBtn','themeBtn2'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',toggleTheme)});

  var burger=document.getElementById('burger'),nav=document.getElementById('nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){nav.classList.toggle('open')});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  }

  var bar=document.getElementById('progress');
  window.addEventListener('scroll',function(){
    var h=document.documentElement,m=h.scrollHeight-h.clientHeight;
    if(bar&&m>0)bar.style.width=(h.scrollTop/m*100)+'%';
  },{passive:true});

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('on');
          if(e.target.id)addXp('sec-'+e.target.id,10);
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -28px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
    var cio=new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if(e.isIntersecting){
          e.target.querySelectorAll('[data-count]').forEach(function(el){
            var t=+el.getAttribute('data-count'),i=0,s=20;
            var id=setInterval(function(){i++;el.textContent=Math.min(t,Math.round(t*i/s));if(i>=s)clearInterval(id)},28);
          });
          cio.unobserve(e.target);
        }
      });
    },{threshold:0.4});
    var st=document.querySelector('.stats');if(st)cio.observe(st);
  } else document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('on')});

  document.querySelectorAll('[data-expand]').forEach(function(card){
    card.addEventListener('pointermove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    var hit=card.querySelector('.card-hit');
    if(hit)hit.addEventListener('click',function(){
      var open=card.classList.toggle('open');
      hit.setAttribute('aria-expanded',open?'true':'false');
      if(open)addXp('card-'+(card.querySelector('h3')||{}).textContent,15);
    });
  });

  var lines=[
    {t:'$ whoami',c:'cmd'},
    {t:'Affan Ahmed Shariff · 1st year BMSCE · Primora',c:'ok'},
    {t:'$ ls projects/',c:'cmd'},
    {t:'Hatch/  Aether/  GestureOS/',c:''},
    {t:'$ echo "live demos > slides"',c:'cmd'},
    {t:'live demos > slides',c:'ok'}
  ];
  var body=document.getElementById('termBody');
  function runTerm(){
    if(!body)return;body.innerHTML='';
    var i=0;
    function next(){
      if(i>=lines.length){body.innerHTML+='<span class="caret"></span>';addXp('intro',10);return}
      var L=lines[i++],d=document.createElement('div');d.className=L.c||'';body.appendChild(d);
      var j=0;
      function type(){
        if(j<=L.t.length){d.textContent=L.t.slice(0,j++);setTimeout(type,16+Math.random()*20)}
        else setTimeout(next,220);
      }
      type();
    }
    next();
  }
  runTerm();
  var rt=document.getElementById('replayTerm');if(rt)rt.addEventListener('click',runTerm);

  var cmds=[
    {l:'Go to Work',fn:function(){location.hash='#work'}},
    {l:'Go to Lab',fn:function(){location.hash='#lab'}},
    {l:'Go to Stack',fn:function(){location.hash='#stack'}},
    {l:'Go to About',fn:function(){location.hash='#about'}},
    {l:'Go to Contact',fn:function(){location.hash='#contact'}},
    {l:'Open Hatch live',fn:function(){window.open('https://hatch-primeora.vercel.app','_blank')}},
    {l:'Open Aether simulator',fn:function(){location.href='/aether/'}},
    {l:'Open GestureOS',fn:function(){location.href='/gestureos/'}},
    {l:'Toggle theme (blast)',fn:toggleTheme},
    {l:'WhatsApp Affan',fn:function(){window.open('https://wa.me/919480751817','_blank')}},
    {l:'Email Affan',fn:function(){location.href='mailto:affanahmed2302@gmail.com'}},
    {l:'GitHub',fn:function(){window.open('https://github.com/affanahmed2302-cmyk','_blank')}}
  ];
  var overlay=document.getElementById('overlay'),input=document.getElementById('cmdInput'),list=document.getElementById('cmdList');
  var active=0,filtered=cmds.slice();
  function render(){
    if(!list)return;list.innerHTML='';
    filtered.forEach(function(c,i){
      var li=document.createElement('li'),b=document.createElement('button');
      b.type='button';b.innerHTML=c.l+'<span style="opacity:.4;font-size:.75rem">↵</span>';
      if(i===active)b.className='on';
      b.addEventListener('click',function(){c.fn();close();addXp('cmd',10)});
      li.appendChild(b);list.appendChild(li);
    });
  }
  function open(){if(!overlay)return;overlay.hidden=false;filtered=cmds.slice();active=0;render();if(input){input.value='';setTimeout(function(){input.focus()},40)}addXp('pal',15)}
  function close(){if(overlay)overlay.hidden=true}
  function filter(q){q=(q||'').toLowerCase();filtered=cmds.filter(function(c){return c.l.toLowerCase().indexOf(q)!==-1});active=0;render()}
  ['cmdBtn','cmdBtn2','cmdBtn3'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',open)});
  if(overlay)overlay.addEventListener('click',function(e){if(e.target===overlay)close()});
  if(input){
    input.addEventListener('input',function(){filter(input.value)});
    input.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,filtered.length-1);render()}
      else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(active-1,0);render()}
      else if(e.key==='Enter'&&filtered[active]){filtered[active].fn();close();addXp('cmd',10)}
      else if(e.key==='Escape')close();
    });
  }
  document.addEventListener('keydown',function(e){
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay&&!overlay.hidden?close():open()}
    if(e.key==='Escape')close();
  });

  var cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&cur&&ring){
    document.body.classList.add('cur-on');
    var x=0,y=0,rx=0,ry=0;
    document.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;cur.style.left=x+'px';cur.style.top=y+'px'});
    (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop)})();
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){document.body.classList.add('hov')});
      el.addEventListener('mouseleave',function(){document.body.classList.remove('hov')});
    });
  }
})();
