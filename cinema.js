/* cinema.js — 21st.dev patterns: word reveal, parallax, magnetic, marquee, velocity skew */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wrapWords(el){
    if (!el || el.dataset.words) return;
    el.dataset.words = '1';
    el.classList.add('word-reveal');
    var html = el.innerHTML;
    var parts = html.split(/(<[^>]+>)/);
    var out = '';
    parts.forEach(function(p){
      if (p.charAt(0) === '<') { out += p; return; }
      p.split(/(\s+)/).forEach(function(tok){
        if (!tok) return;
        if (/^\s+$/.test(tok)) out += tok;
        else out += '<span class="w">' + tok + '</span>';
      });
    });
    el.innerHTML = out;
  }
  document.querySelectorAll('.lead, .sub, .about-lead, .cta-sub, .desc').forEach(wrapWords);

  function updateWordReveal(){
    document.querySelectorAll('.word-reveal').forEach(function(block){
      var words = block.querySelectorAll('.w');
      if (!words.length) return;
      var r = block.getBoundingClientRect();
      var vh = innerHeight || 1;
      var start = vh * 0.92;
      var end = vh * 0.35;
      var p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      var n = words.length;
      for (var i = 0; i < n; i++) {
        if (i / n <= p) words[i].classList.add('on');
      }
    });
  }
  if (!reduce) {
    window.addEventListener('scroll', updateWordReveal, { passive: true });
    updateWordReveal();
    setTimeout(updateWordReveal, 400);
  } else {
    document.querySelectorAll('.word-reveal .w').forEach(function(w){ w.classList.add('on'); });
  }

  var parallaxEls = [];
  document.querySelectorAll('.hero h1, .hero .lead, .hero .stats, .blob1, .blob2, #orbs').forEach(function(el, i){
    el.setAttribute('data-parallax', String(0.04 + i * 0.02));
    parallaxEls.push(el);
  });
  function parallax(){
    if (reduce) return;
    var y = scrollY;
    parallaxEls.forEach(function(el){
      var s = parseFloat(el.getAttribute('data-parallax')) || 0.05;
      el.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
    });
  }
  if (!reduce) window.addEventListener('scroll', parallax, { passive: true });

  var pipeSec = document.getElementById('pipeline');
  if (pipeSec) {
    var wrap = pipeSec.querySelector('.wrap');
    if (wrap) {
      var pipe = wrap.querySelector('#pipe');
      var panel = wrap.querySelector('#pipePanel');
      if (pipe && panel) {
        var holder = document.createElement('div');
        holder.className = 'pipe-sticky-wrap';
        pipe.parentNode.insertBefore(holder, pipe);
        holder.appendChild(pipe);
        holder.appendChild(panel);
      }
    }
  }

  function magnetize(el){
    el.classList.add('mag');
    var strength = 0.35;
    el.addEventListener('mousemove', function(e){
      if (reduce || innerWidth < 800) return;
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
    });
    el.addEventListener('mouseleave', function(){
      el.style.transform = '';
    });
  }
  document.querySelectorAll('.btn, .nav-cta, .bento-cell, .curiosity button').forEach(magnetize);

  document.querySelectorAll('.btn-p, .btn-g, .nav-cta').forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  var hero = document.querySelector('.hero');
  if (hero && !document.querySelector('.marquee-strip')) {
    var strip = document.createElement('div');
    strip.className = 'marquee-strip';
    strip.setAttribute('aria-hidden', 'true');
    var items = [
      '<b>Hatch</b> \u00b7 live campus network',
      '<b>Aether</b> \u00b7 Raft consensus',
      '<b>GestureOS</b> \u00b7 hand tracking',
      '<b>Primora</b> \u00b7 founder',
      'BMSCE \u00b7 Bangalore',
      'Ship live demos not decks',
      'Next.js \u00b7 Go \u00b7 MediaPipe'
    ];
    var line = items.map(function(t){ return '<span>' + t + '</span>'; }).join('');
    strip.innerHTML = '<div class="marquee-track">' + line + line + '</div>';
    hero.appendChild(strip);
  }

  var contact = document.getElementById('contact');
  if (contact && !document.querySelector('.skew-banner')) {
    var ban = document.createElement('div');
    ban.className = 'skew-banner';
    ban.setAttribute('aria-hidden', 'true');
    ban.textContent = 'AFFAN \u00b7 PRIMORA \u00b7 SHIP \u00b7 BUILD \u00b7 AFFAN \u00b7 PRIMORA \u00b7 SHIP \u00b7 BUILD \u00b7 ';
    contact.parentNode.insertBefore(ban, contact);
  }
  var lastY = scrollY, vel = 0;
  function skewTick(){
    if (reduce) return;
    var dy = scrollY - lastY;
    lastY = scrollY;
    vel = vel * 0.85 + dy * 0.15;
    var sk = Math.max(-8, Math.min(8, vel * 0.35));
    var ban = document.querySelector('.skew-banner');
    if (ban) ban.style.transform = 'skewX(' + sk + 'deg) translateX(' + (vel * 0.4) + 'px)';
  }
  if (!reduce) window.addEventListener('scroll', skewTick, { passive: true });
})();
