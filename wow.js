/* wow micro-interactions */
(function(){
  document.querySelectorAll('.bento-cell').forEach(function(el){
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
  var hero = document.querySelector('.hero');
  if (hero && matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function(){
      var y = Math.min(scrollY, 400);
      hero.style.transform = 'translateY(' + (y * 0.12) + 'px)';
      hero.style.opacity = String(Math.max(0.35, 1 - y / 500));
    }, {passive:true});
  }
  document.querySelectorAll('.btn-p, .cta-primary, .pill.red').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var r = document.createElement('span');
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      r.style.cssText = 'position:absolute;border-radius:50%;width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px;background:rgba(255,255,255,.35);pointer-events:none;transform:scale(0);animation:ripple .55s ease-out forwards';
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(function(){ r.remove(); }, 600);
    });
  });
  if (!document.getElementById('wowRipple')) {
    var st = document.createElement('style');
    st.id = 'wowRipple';
    st.textContent = '@keyframes ripple{to{transform:scale(2.4);opacity:0}}';
    document.head.appendChild(st);
  }
})();
