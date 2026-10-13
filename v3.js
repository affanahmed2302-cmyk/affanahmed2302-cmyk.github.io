(function(){
  var root=document.documentElement;

  try{var t=localStorage.getItem('affan-v3');if(t)root.setAttribute('data-theme',t)}catch(e){}
  function toggleTheme(){
    var n=root.getAttribute('data-theme')==='mint'?'night':'mint';
    root.setAttribute('data-theme',n);
    try{localStorage.setItem('affan-v3',n)}catch(e){}
  }
  var tb=document.getElementById('themeBtn');
  if(tb)tb.addEventListener('click',toggleTheme);

  var burger=document.getElementById('burger'),nav=document.getElementById('nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){nav.classList.toggle('open')});
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){nav.classList.remove('open')});
    });
  }

  var bar=document.getElementById('progress');
  function onScroll(){
    var h=document.documentElement;
    var max=h.scrollHeight-h.clientHeight;
    if(bar&&max>0)bar.style.width=(h.scrollTop/max*100)+'%';
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}});
    },{threshold:0.12,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  } else document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('on')});

  function animateCount(el){
    var target=+el.getAttribute('data-count')||0,cur=0,steps=24,step=target/steps,i=0;
    var id=setInterval(function(){
      i++;cur=Math.min(target,Math.round(step*i));
      el.textContent=cur;
      if(i>=steps)clearInterval(id);
    },30);
  }
  if('IntersectionObserver' in window){
    var cio=new IntersectionObserver(function(ents){
      ents.forEach(function(e){
        if(e.isIntersecting){
          e.target.querySelectorAll('[data-count]').forEach(animateCount);
          cio.unobserve(e.target);
        }
      });
    },{threshold:0.4});
    var stats=document.querySelector('.stats');
    if(stats)cio.observe(stats);
  }

  document.querySelectorAll('.proj').forEach(function(card){
    card.addEventListener('pointermove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--x',(e.clientX-r.left)+'px');
      card.style.setProperty('--y',(e.clientY-r.top)+'px');
    });
  });

  var cmds=[
    {l:'Work',fn:function(){location.hash='#work'}},
    {l:'Stack',fn:function(){location.hash='#stack'}},
    {l:'About',fn:function(){location.hash='#about'}},
    {l:'Contact',fn:function(){location.hash='#contact'}},
    {l:'Open Hatch live',fn:function(){window.open('https://hatch-primeora.vercel.app','_blank')}},
    {l:'Open Aether simulator',fn:function(){location.href='/aether/'}},
    {l:'Open GestureOS demo',fn:function(){location.href='/gestureos/'}},
    {l:'Toggle theme',fn:toggleTheme},
    {l:'WhatsApp',fn:function(){window.open('https://wa.me/919480751817','_blank')}},
    {l:'Email',fn:function(){location.href='mailto:affanahmed2302@gmail.com'}},
    {l:'GitHub',fn:function(){window.open('https://github.com/affanahmed2302-cmyk','_blank')}}
  ];
  var overlay=document.getElementById('overlay');
  var input=document.getElementById('cmdInput');
  var list=document.getElementById('cmdList');
  var active=0,filtered=cmds.slice();

  function render(){
    if(!list)return;
    list.innerHTML='';
    filtered.forEach(function(c,i){
      var li=document.createElement('li');
      var b=document.createElement('button');
      b.type='button';
      b.innerHTML=c.l+'<span style="opacity:.4;font-size:.75rem">↵</span>';
      if(i===active)b.className='active';
      b.addEventListener('click',function(){c.fn();close()});
      li.appendChild(b);list.appendChild(li);
    });
  }
  function open(){
    if(!overlay)return;
    overlay.hidden=false;filtered=cmds.slice();active=0;render();
    if(input){input.value='';setTimeout(function(){input.focus()},50)}
  }
  function close(){if(overlay)overlay.hidden=true}
  function filter(q){
    q=(q||'').toLowerCase();
    filtered=cmds.filter(function(c){return c.l.toLowerCase().indexOf(q)!==-1});
    active=0;render();
  }
  var cmdBtn=document.getElementById('cmdBtn');
  if(cmdBtn)cmdBtn.addEventListener('click',open);
  if(overlay)overlay.addEventListener('click',function(e){if(e.target===overlay)close()});
  if(input){
    input.addEventListener('input',function(){filter(input.value)});
    input.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,filtered.length-1);render()}
      else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(active-1,0);render()}
      else if(e.key==='Enter'&&filtered[active]){filtered[active].fn();close()}
      else if(e.key==='Escape')close();
    });
  }
  document.addEventListener('keydown',function(e){
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay&&!overlay.hidden?close():open()}
    if(e.key==='Escape')close();
  });
})();
