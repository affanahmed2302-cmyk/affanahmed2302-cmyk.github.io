/* sound.js — two premium UI tones (Web Audio, no files) */
(function(){
  var enabled = false;
  var ctx = null;
  function getCtx(){
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function playClick(){
    if (!enabled) return;
    try {
      var c = getCtx(), t = c.currentTime;
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(880, t);
      o.frequency.exponentialRampToValueAtTime(440, t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + 0.16);
    } catch(e) {}
  }
  function playChime(){
    if (!enabled) return;
    try {
      var c = getCtx(), t = c.currentTime;
      [523.25, 659.25].forEach(function(freq, i){
        var o = c.createOscillator(), g = c.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        var start = t + i * 0.09;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.1, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
        o.connect(g); g.connect(c.destination);
        o.start(start); o.stop(start + 0.3);
      });
    } catch(e) {}
  }
  window.affanSound = { click: playClick, chime: playChime };

  var btn = document.getElementById('soundBtn');
  if (btn) {
    try { if (localStorage.getItem('affan-sound') === '1') { enabled = true; btn.classList.add('on'); } } catch(e) {}
    btn.addEventListener('click', function(){
      enabled = !enabled;
      btn.classList.toggle('on', enabled);
      try { localStorage.setItem('affan-sound', enabled ? '1' : '0'); } catch(e) {}
      if (enabled) { getCtx(); playChime(); }
    });
  }

  document.addEventListener('click', function(e){
    var t = e.target.closest('a,button,.tp,.pipe-step,.pf,.bento-cell,.case-toggle');
    if (!t || t.id === 'soundBtn') return;
    if (t.id === 'themeBtn' || t.classList.contains('theme-btn')) playChime();
    else playClick();
  }, true);
})();
