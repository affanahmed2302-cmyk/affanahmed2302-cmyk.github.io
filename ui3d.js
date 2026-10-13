/* ui3d.js — real 3D tilt on cards */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || innerWidth < 800) return;

  document.querySelectorAll('.p-card, .bento-cell, .story-card, .fact, .exp-item, .skill-row').forEach(function(card){
    card.classList.add('card-3d');
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        'perspective(900px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateZ(8px)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
})();
