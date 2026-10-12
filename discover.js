/* discover.js — make exploring Affan fun */
(function(){
  var found = 0;
  var total = 8;
  var hud = document.createElement('div');
  hud.className = 'explore-hud';
  hud.innerHTML = 'Discovered <b id="discN">0</b> / ' + total + ' secrets';
  document.body.appendChild(hud);
  var discN = document.getElementById('discN');
  var seen = {};

  function bump(id){
    if (seen[id]) return;
    seen[id] = 1;
    found++;
    if (discN) discN.textContent = String(found);
    hud.classList.add('show');
    clearTimeout(hud._t);
    hud._t = setTimeout(function(){ hud.classList.remove('show'); }, 2200);
    if (window.toast && found === total) window.toast('You found everything ✨');
    if (window.affanSound && window.affanSound.click) try{ window.affanSound.click(); }catch(e){}
  }

  document.querySelectorAll('.curiosity button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.curiosity button').forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      var go = btn.getAttribute('data-go');
      var el = go && document.querySelector(go);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      bump('chip-' + (btn.getAttribute('data-id')||go));
    });
  });

  document.querySelectorAll('.story-card').forEach(function(card){
    card.addEventListener('click', function(){
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped')) bump('story-' + card.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.fact').forEach(function(f){
    f.addEventListener('click', function(){
      f.classList.add('revealed');
      bump('fact-' + f.getAttribute('data-id'));
    });
  });

  var chat = document.getElementById('chatDiscover');
  if (chat) {
    var paths = {
      build: [
        {who:'YOU', me:true, t:'How do you actually build?'},
        {who:'AFFAN', t:'Pain first. Then architecture. Then a live demo people can open — Hatch, Aether, GestureOS.'},
        {who:'AFFAN', t:'If it only lives in a slide deck, it doesn’t count.'}
      ],
      campus: [
        {who:'YOU', me:true, t:'What’s Hatch really about?'},
        {who:'AFFAN', t:'Campus teams were stuck across random chats. Hatch is one place to find teammates, clubs, and ship.'},
        {who:'AFFAN', t:'It’s live on Vercel — not a mockup.'}
      ],
      systems: [
        {who:'YOU', me:true, t:'Why Aether?'},
        {who:'AFFAN', t:'I wanted real systems depth — Raft, leader election, chaos when a node dies.'},
        {who:'AFFAN', t:'There’s a simulator on this site. Kill the leader. Watch recovery.'}
      ],
      fun: [
        {who:'YOU', me:true, t:'Anything unexpected?'},
        {who:'AFFAN', t:'GestureOS — control a machine with your hands. MediaPipe + OpenCV. Works on phone camera too.'},
        {who:'AFFAN', t:'Also: try the theme button. And the ♪ sound toggle. This site is part of the work.'}
      ]
    };
    function addBubble(b, delay){
      setTimeout(function(){
        var d = document.createElement('div');
        d.className = 'bubble' + (b.me ? ' me' : '');
        d.innerHTML = '<div class="who">' + b.who + '</div>' + b.t;
        chat.appendChild(d);
        chat.scrollTop = chat.scrollHeight;
      }, delay);
    }
    document.querySelectorAll('[data-chat]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var key = btn.getAttribute('data-chat');
        var seq = paths[key];
        if (!seq) return;
        chat.innerHTML = '';
        seq.forEach(function(b, i){ addBubble(b, i * 420); });
        bump('chat-' + key);
        var choices = document.getElementById('chatChoices');
        if (choices) choices.style.display = 'none';
        setTimeout(function(){ if (choices) choices.style.display = ''; }, seq.length * 420 + 400);
      });
    });
  }

  document.querySelectorAll('.p-card').forEach(function(card, i){
    var spark = document.createElement('button');
    spark.type = 'button';
    spark.className = 'spark';
    spark.setAttribute('aria-label', 'Fun fact');
    spark.textContent = '✦';
    var pop = document.createElement('div');
    pop.className = 'spark-pop';
    var facts = [
      'Built for real BMSCE campus use — not a course assignment left in a folder.',
      'Raft isn’t a buzzword here — you can break the cluster in the live simulator.',
      'Phone camera works. Allow permissions and wave — MediaPipe tracks in real time.'
    ];
    pop.textContent = facts[i] || 'Ship live demos, not decks.';
    card.style.position = 'relative';
    card.appendChild(spark);
    card.appendChild(pop);
    spark.addEventListener('click', function(e){
      e.stopPropagation();
      document.querySelectorAll('.spark-pop').forEach(function(p){ p.classList.remove('show'); });
      pop.classList.toggle('show');
      bump('spark-' + i);
    });
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.spark-pop').forEach(function(p){ p.classList.remove('show'); });
  });
})();
