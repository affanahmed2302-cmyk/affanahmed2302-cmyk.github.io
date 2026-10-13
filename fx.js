(function(){
  var root=document.documentElement,xp=0,seen={};
  var fill=document.getElementById('xpFill'),num=document.getElementById('xpNum');
  function addXp(k,n){
    if(seen[k])return;seen[k]=1;xp=Math.min(100,xp+(n||12));
    if(fill)fill.style.width=xp+'%';
    if(num)num.textContent=xp>=100?'100 ★':xp;
  }
  function setTheme(t){root.setAttribute('data-theme',t);try{localStorage.setItem('affan-t',t)}catch(e){}addXp('theme',20)}
  try{var s=localStorage.getItem('affan-t');if(s)root.setAttribute('data-theme',s)}catch(e){}
  function toggle(){setTheme(root.getAttribute('data-theme')==='green'?'blue':'green')}
  ['themeBtn','themeBtn2'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',toggle)});

  var burger=document.getElementById('burger'),links=document.getElementById('links');
  if(burger&&links){
    burger.addEventListener('click',function(){links.classList.toggle('open')});
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});
  }

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');if(e.target.id)addXp('s-'+e.target.id,10)}});
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
    ['work','lab','about','contact'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)});
  } else document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});

  document.querySelectorAll('.spot-card').forEach(function(card){
    card.addEventListener('pointermove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    var btn=card.querySelector('.card-main');
    if(btn)btn.addEventListener('click',function(){
      var open=card.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      if(open)addXp('c-'+card.querySelector('h3').textContent,15);
    });
  });

  var cmds=[
    {l:'Go to Work',fn:function(){location.hash='#work'}},
    {l:'Go to Lab',fn:function(){location.hash='#lab'}},
    {l:'Go to About',fn:function(){location.hash='#about'}},
    {l:'Go to Contact',fn:function(){location.hash='#contact'}},
    {l:'Open Hatch',fn:function(){window.open('https://hatch-primeora.vercel.app','_blank')}},
    {l:'Open Aether simulator',fn:function(){location.href='/aether/'}},
    {l:'Open GestureOS',fn:function(){location.href='/gestureos/'}},
    {l:'Toggle theme',fn:toggle},
    {l:'WhatsApp',fn:function(){window.open('https://wa.me/919480751817','_blank')}},
    {l:'Email',fn:function(){location.href='mailto:affanahmed2302@gmail.com'}}
  ];
  var layer=document.getElementById('cmdLayer'),inp=document.getElementById('cmdIn'),ul=document.getElementById('cmdUl');
  var act=0,list=cmds.slice();
  function render(){
    if(!ul)return;ul.innerHTML='';
    list.forEach(function(c,i){
      var li=document.createElement('li');
      var b=document.createElement('button');b.type='button';
      b.textContent=c.l;if(i===act)b.className='on';
      b.addEventListener('click',function(){c.fn();close();addXp('cmd',10)});
      li.appendChild(b);ul.appendChild(li);
    });
  }
  function open(){if(!layer)return;layer.hidden=false;list=cmds.slice();act=0;render();if(inp){inp.value='';inp.focus()}addXp('pal',15)}
  function close(){if(layer)layer.hidden=true}
  function filter(q){q=(q||'').toLowerCase();list=cmds.filter(function(c){return c.l.toLowerCase().indexOf(q)>-1});act=0;render()}
  ['cmdOpen','cmdOpen2','cmdOpen3'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('click',open)});
  if(layer)layer.addEventListener('click',function(e){if(e.target===layer)close()});
  if(inp){
    inp.addEventListener('input',function(){filter(inp.value)});
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();act=Math.min(act+1,list.length-1);render()}
      else if(e.key==='ArrowUp'){e.preventDefault();act=Math.max(act-1,0);render()}
      else if(e.key==='Enter'&&list[act]){list[act].fn();close();addXp('cmd',10)}
      else if(e.key==='Escape')close();
    });
  }
  document.addEventListener('keydown',function(e){
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();layer&&!layer.hidden?close():open()}
    if(e.key==='Escape')close();
  });
})();
