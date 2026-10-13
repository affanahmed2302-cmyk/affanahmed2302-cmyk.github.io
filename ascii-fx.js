/* ascii-fx.js — matrix rain + wave + cinema scroll (21st.dev-inspired, pure JS) */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var rain = document.getElementById('asciiRain');
  if (!rain) {
    rain = document.createElement('canvas');
    rain.id = 'asciiRain';
    rain.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(rain, document.body.firstChild);
  }
  var rctx = rain.getContext('2d');
  var cols = [], font = 14, W, H;
  var glyphs = '\uff71\uff72\uff73\uff74\uff75\uff76\uff77\uff78\uff79\uff7a\uff7b\uff7c\uff7d\uff7e\uff7f01<>/{}[]*=+#$AFFANPRIMORA'.split('');

  function rainColor(){
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'ocean') return '59,130,246';
    if (t === 'forest') return '34,197,94';
    return '255,45,74';
  }
  function sizeRain(){
    W = rain.width = innerWidth;
    H = rain.height = innerHeight;
    font = innerWidth < 700 ? 12 : 14;
    var n = Math.floor(W / font);
    cols = [];
    for (var i = 0; i < n; i++) cols.push(Math.random() * H / font);
  }
  sizeRain();
  window.addEventListener('resize', sizeRain);

  function drawRain(){
    rctx.fillStyle = 'rgba(5,5,10,0.08)';
    rctx.fillRect(0, 0, W, H);
    rctx.font = font + 'px "JetBrains Mono",monospace';
    var rgb = rainColor();
    for (var i = 0; i < cols.length; i++) {
      var ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      var x = i * font;
      var y = cols[i] * font;
      rctx.fillStyle = 'rgba(' + rgb + ',0.85)';
      rctx.fillText(ch, x, y);
      rctx.fillStyle = 'rgba(' + rgb + ',0.25)';
      rctx.fillText(glyphs[Math.floor(Math.random()*glyphs.length)], x, y - font);
      if (y > H && Math.random() > 0.975) cols[i] = 0;
      cols[i] += 0.35 + Math.random() * 0.45;
    }
    requestAnimationFrame(drawRain);
  }
  rctx.fillStyle = '#05050a';
  rctx.fillRect(0,0,W,H);
  drawRain();

  var hero = document.querySelector('.hero');
  var wave = document.getElementById('asciiWave');
  if (hero && !wave) {
    wave = document.createElement('div');
    wave.id = 'asciiWave';
    wave.setAttribute('aria-hidden', 'true');
    hero.appendChild(wave);
  }
  if (wave) {
    var waveChars = '\u00b7\u02d9\u00b7\u02d9\u00b7\u02d9~-~-~-\u2248\u2248\u2248~-~-\u00b7\u02d9\u00b7\u02d9';
    var rows = 12, colsW = 80, t0 = 0;
    function paintWave(t){
      var out = [];
      var w = Math.min(colsW, Math.floor((hero.offsetWidth || innerWidth) / 8));
      for (var r = 0; r < rows; r++) {
        var line = '';
        for (var c = 0; c < w; c++) {
          var v = Math.sin(c * 0.18 + t * 0.04 + r * 0.35) + Math.sin(c * 0.07 - t * 0.02);
          var idx = Math.floor((v + 2) / 4 * (waveChars.length - 1));
          line += waveChars[Math.max(0, Math.min(waveChars.length - 1, idx))];
        }
        out.push(line);
      }
      wave.textContent = out.join('\n');
    }
    (function loopWave(){
      t0++;
      paintWave(t0);
      requestAnimationFrame(loopWave);
    })();
  }

  document.querySelectorAll('.reveal-sec, .p-card, .bento-cell, .story-card, .fact, .pipe-step, .tp').forEach(function(el, i){
    el.classList.add('cinema');
    if (i % 3 === 1) el.classList.add('cinema-left');
    else if (i % 3 === 2) el.classList.add('cinema-right');
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.cinema').forEach(function(el){ io.observe(el); });
  setTimeout(function(){
    document.querySelectorAll('.cinema').forEach(function(el){
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    });
  }, 500);

  document.querySelectorAll('.reveal-sec .wrap').forEach(function(wrap){
    var rail = document.createElement('div');
    rail.className = 'sec-rail';
    rail.innerHTML = '<i></i>';
    wrap.prepend(rail);
  });
  function updateRails(){
    document.querySelectorAll('.reveal-sec').forEach(function(sec){
      var rail = sec.querySelector('.sec-rail i');
      if (!rail) return;
      var r = sec.getBoundingClientRect();
      var h = r.height || 1;
      var p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / h));
      rail.style.height = (p * 100) + '%';
    });
  }
  window.addEventListener('scroll', updateRails, { passive: true });
  updateRails();

  if (!document.getElementById('scan')) {
    var scan = document.createElement('div');
    scan.id = 'scan';
    scan.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scan);
  }
})();
