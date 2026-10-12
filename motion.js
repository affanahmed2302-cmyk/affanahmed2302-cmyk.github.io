/* motion.js — parallax orbs + mouse depth */
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var orbs = document.getElementById('orbs');
  if (!orbs || !matchMedia('(hover:hover)').matches) return;
  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function(e){
    mx = (e.clientX / innerWidth - 0.5) * 24;
    my = (e.clientY / innerHeight - 0.5) * 18;
  }, {passive:true});
  (function tick(){
    cx += (mx - cx) * 0.06;
    cy += (my - cy) * 0.06;
    orbs.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(tick);
  })();
})();
