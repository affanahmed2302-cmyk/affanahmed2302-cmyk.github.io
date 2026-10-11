/* Expert features v2 — useful only */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var spot = document.getElementById('spot');
  if (spot && matchMedia('(hover:hover)').matches && !reduce) {
    document.body.classList.add('spot-on');
    document.addEventListener('mousemove', function(e){
      document.documentElement.style.setProperty('--sx', e.clientX + 'px');
      document.documentElement.style.setProperty('--sy', e.clientY + 'px');
    }, {passive:true});
  }

  if (matchMedia('(hover:hover) and (min-width:900px)').matches && !reduce) {
    document.querySelectorAll('.btn, .bento-cell').forEach(function(el){
      el.classList.add('magnetic');
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2) * 0.16) + 'px,' + ((e.clientY - r.top - r.height/2) * 0.16) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  var cyc = document.getElementById('cyc');
  var words = ['ship','scale','work','last','win'], wi = 0;
  var chars = '!<>-_\\/[]{}—=+*^?#________';
  function scrambleTo(el, next){
    if (reduce) { el.textContent = next; return; }
    var len = Math.max(el.textContent.length, next.length), frame = 0;
    el.classList.add('scrambling');
    var id = setInterval(function(){
      var out = '';
      for (var i = 0; i < len; i++) out += (i < frame/2) ? (next[i]||'') : chars[Math.floor(Math.random()*chars.length)];
      el.textContent = out;
      if (++frame > len * 2) { clearInterval(id); el.textContent = next; el.classList.remove('scrambling'); }
    }, 28);
  }
  if (cyc) setInterval(function(){ wi = (wi+1)%words.length; scrambleTo(cyc, words[wi]); }, 2800);

  var sections = ['top','personal','tools','contact'];
  var dots = document.querySelectorAll('.dots a[data-s]');
  function markDot(){
    var y = scrollY + innerHeight * 0.35, cur = 'top';
    sections.forEach(function(id){ var el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
    dots.forEach(function(a){ a.classList.toggle('on', a.getAttribute('data-s') === cur); });
  }
  window.addEventListener('scroll', markDot, {passive:true});
  markDot();

  var shareBtn = document.getElementById('shareBtn');
  if (shareBtn) shareBtn.onclick = function(){
    var url = location.origin + '/';
    if (navigator.share) navigator.share({title:'Affan Ahmed Shariff', url:url}).catch(function(){});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function(){ if (window.toast) window.toast('Profile link copied'); });
  };

  var keys = document.getElementById('keys');
  function openKeys(){ if (keys) keys.classList.add('open'); }
  function closeKeys(){ if (keys) keys.classList.remove('open'); }
  var keysClose = document.getElementById('keysClose');
  if (keysClose) keysClose.onclick = closeKeys;
  if (keys) keys.onclick = function(e){ if (e.target === keys) closeKeys(); };
  var gPending = false;
  document.addEventListener('keydown', function(e){
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === '?' || (e.shiftKey && e.key === '/')) { e.preventDefault(); openKeys(); return; }
    if (e.key === 'Escape') { closeKeys(); return; }
    if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
      var tb = document.getElementById('themeBtn'); if (tb) tb.click(); return;
    }
    if (e.key.toLowerCase() === 'g') { gPending = true; setTimeout(function(){ gPending = false; }, 700); return; }
    if (gPending) {
      gPending = false;
      var k = e.key.toLowerCase();
      if (k === 'h') window.open('https://hatch-primeora.vercel.app', '_blank');
      if (k === 'a') location.href = '/aether/';
      if (k === 'g') location.href = '/gestureos/';
      if (k === 'p') location.href = 'play.html';
    }
  });

  var readPct = document.getElementById('readPct');
  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight - innerHeight;
    var p = h > 0 ? Math.round((scrollY / h) * 100) : 0;
    if (readPct) readPct.textContent = String(p);
  }, {passive:true});

  var greet = document.getElementById('greet');
  if (greet) {
    try {
      var hr = Number(new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata', hour:'numeric', hour12:false}));
      greet.textContent = hr < 12 ? 'Good morning · open to collabs' : hr < 17 ? 'Good afternoon · open to collabs' : 'Good evening · open to collabs';
    } catch(e) { greet.textContent = 'Open to collabs'; }
  }

  var filters = document.getElementById('pFilters');
  if (filters) {
    filters.querySelectorAll('.pf').forEach(function(btn){
      btn.onclick = function(){
        filters.querySelectorAll('.pf').forEach(function(b){ b.classList.remove('on'); });
        btn.classList.add('on');
        var f = btn.getAttribute('data-f');
        document.querySelectorAll('.p-card').forEach(function(card){
          var cat = card.getAttribute('data-cat');
          card.hidden = !(f === 'all' || cat === f);
        });
      };
    });
  }

  document.querySelectorAll('.copy-link').forEach(function(btn){
    btn.onclick = function(){
      var u = btn.getAttribute('data-url') || '';
      var full = u.indexOf('http') === 0 ? u : (location.origin + (u.indexOf('/') === 0 ? u : '/' + u));
      if (navigator.clipboard) navigator.clipboard.writeText(full).then(function(){
        var old = btn.textContent; btn.textContent = 'Copied';
        if (window.toast) window.toast('Link copied');
        setTimeout(function(){ btn.textContent = old; }, 1200);
      });
    };
  });

  if (!reduce) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});
    document.querySelectorAll('.reveal-sec, .proof-card.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal-sec, .proof-card.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  document.querySelectorAll('a[href^="/"], a[href$=".html"]').forEach(function(a){
    var done = false;
    a.addEventListener('mouseenter', function(){
      if (done) return; done = true;
      var l = document.createElement('link');
      l.rel = 'prefetch'; l.href = a.href;
      document.head.appendChild(l);
    }, {once:true});
  });

  setTimeout(function(){
    document.querySelectorAll('.reveal-sec').forEach(function(el){
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    });
  }, 400);
})();
