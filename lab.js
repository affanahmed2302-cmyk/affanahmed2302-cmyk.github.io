(function(){
  var root=document.documentElement;
  var xp=0,xpFill=document.getElementById('xpFill'),xpText=document.getElementById('xpText');
  var seen={};

  function addXp(key,n){
    if(seen[key])return;seen[key]=1;xp=Math.min(100,xp+(n||15));
    if(xpFill)xpFill.style.width=xp+'%';
    if(xpText){
      var msg=xp>=100?'100 / 100 — full explorer':xp+' / 100 — keep clicking';
      xpText.textContent=msg;
    }
  }

  function setTheme(t){
    root.setAttribute('data-theme',t);
    try{localStorage.setItem('affan-theme',t)}catch(e){}
    addXp('theme',20);
  }
  try{var saved=localStorage.getItem('affan-theme');if(saved)root.setAttribute('data-theme',saved)}catch(e){}
  function toggleTheme(){
    setTheme(root.getAttribute('data-theme')==='green'?'blue':'green');
  }
  var tb=document.getElementById('themeBtn'),tb2=document.getElementById('themeBtn2');
  if(tb)tb.addEventListener('click',toggleTheme);
  if(tb2)tb2.addEventListener('click',toggleTheme);

  var menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',function(){nav.classList.toggle('open')});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
  }

  document.querySelectorAll('[data-expand]').forEach(function(card){
    var hit=card.querySelector('.card-hit');
    if(!hit)return;
    hit.addEventListener('click',function(){
      var open=card.classList.toggle('open');
      hit.setAttribute('aria-expanded',open?'true':'false');
      if(open)addXp('card-'+card.querySelector('h3').textContent,15);
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
    if(!body)return;
    body.innerHTML='';
    var i=0;
    function next(){
      if(i>=lines.length){
        body.innerHTML+='<span class="caret"></span>';
        addXp('intro',10);
        return;
      }
      var L=lines[i++];
      var d=document.createElement('div');
      d.className=L.c||'';
      body.appendChild(d);
      var j=0;
      function type(){
        if(j<=L.t.length){d.textContent=L.t.slice(0,j++);setTimeout(type,18+Math.random()*22)}
        else setTimeout(next,280);
      }
      type();
    }
    next();
  }
  runTerm();
  var pi=document.getElementById('playIntro');
  if(pi)pi.addEventListener('click',runTerm);

  var cmds=[
    {label:'Go to Work',run:function(){location.hash='#work'}},
    {label:'Go to Lab',run:function(){location.hash='#lab'}},
    {label:'Go to About',run:function(){location.hash='#about'}},
    {label:'Go to Contact',run:function(){location.hash='#contact'}},
    {label:'Open Hatch live',run:function(){window.open('https://hatch-primeora.vercel.app','_blank')}},
    {label:'Open Aether simulator',run:function(){location.href='/aether/'}},
    {label:'Open GestureOS demo',run:function(){location.href='/gestureos/'}},
    {label:'Toggle theme',run:toggleTheme},
    {label:'WhatsApp Affan',run:function(){window.open('https://wa.me/919480751817','_blank')}},
    {label:'Email Affan',run:function(){location.href='mailto:affanahmed2302@gmail.com'}}
  ];
  var overlay=document.getElementById('overlay'),input=document.getElementById('cmdInput'),list=document.getElementById('cmdList');
  var active=0,filtered=cmds.slice();

  function render(){
    if(!list)return;
    list.innerHTML='';
    filtered.forEach(function(c,idx){
      var li=document.createElement('li');
      var b=document.createElement('button');
      b.type='button';
      b.innerHTML=c.label+'<span>↵</span>';
      if(idx===active)b.className='active';
      b.addEventListener('click',function(){c.run();closeCmd();addXp('cmd',10)});
      li.appendChild(b);list.appendChild(li);
    });
  }
  function openCmd(){
    if(!overlay)return;
    overlay.hidden=false;filtered=cmds.slice();active=0;render();
    if(input){input.value='';input.focus()}
    addXp('palette',15);
  }
  function closeCmd(){if(overlay)overlay.hidden=true}
  function filterCmd(q){
    q=(q||'').toLowerCase();
    filtered=cmds.filter(function(c){return c.label.toLowerCase().indexOf(q)!==-1});
    active=0;render();
  }
  document.getElementById('cmdBtn')&&document.getElementById('cmdBtn').addEventListener('click',openCmd);
  document.getElementById('cmdBtn2')&&document.getElementById('cmdBtn2').addEventListener('click',openCmd);
  if(overlay)overlay.addEventListener('click',function(e){if(e.target===overlay)closeCmd()});
  if(input){
    input.addEventListener('input',function(){filterCmd(input.value)});
    input.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,filtered.length-1);render()}
      else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(active-1,0);render()}
      else if(e.key==='Enter'&&filtered[active]){filtered[active].run();closeCmd();addXp('cmd',10)}
      else if(e.key==='Escape')closeCmd();
    });
  }
  document.addEventListener('keydown',function(e){
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay&&!overlay.hidden?closeCmd():openCmd()}
    if(e.key==='Escape')closeCmd();
  });

  var cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&cur&&ring){
    document.body.classList.add('cursor-on');
    var x=0,y=0,rx=0,ry=0;
    document.addEventListener('mousemove',function(e){
      x=e.clientX;y=e.clientY;
      cur.style.left=x+'px';cur.style.top=y+'px';
    });
    function loop(){
      rx+=(x-rx)*0.18;ry+=(y-ry)*0.18;
      ring.style.left=rx+'px';ring.style.top=ry+'px';
      requestAnimationFrame(loop);
    }
    loop();
    document.querySelectorAll('a,button').forEach(function(el){
      el.addEventListener('mouseenter',function(){document.body.classList.add('hovering')});
      el.addEventListener('mouseleave',function(){document.body.classList.remove('hovering')});
    });
  }

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting)addXp('sec-'+en.target.id,12)});
    },{threshold:0.4});
    ['work','lab','about','contact'].forEach(function(id){
      var el=document.getElementById(id);if(el)io.observe(el);
    });
  }
})();
