/* bg-mesh.js — soft animated mesh gradient (21st.dev style, not matrix rain) */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var old = document.getElementById('asciiRain');
  if (old) { old.remove(); }
  var wave = document.getElementById('asciiWave');
  if (wave) wave.style.opacity = '0.12';

  var c = document.createElement('canvas');
  c.id = 'meshBg';
  c.setAttribute('aria-hidden','true');
  Object.assign(c.style, {
    position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none',
    width:'100%', height:'100%'
  });
  document.body.insertBefore(c, document.body.firstChild);

  var ctx = c.getContext('2d');
  var W, H, t = 0, mx = 0.5, my = 0.5;

  function size(){
    W = c.width = innerWidth * (devicePixelRatio > 1.5 ? 1.25 : 1);
    H = c.height = innerHeight * (devicePixelRatio > 1.5 ? 1.25 : 1);
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
  }
  size();
  window.addEventListener('resize', size);

  window.addEventListener('pointermove', function(e){
    mx = e.clientX / innerWidth;
    my = e.clientY / innerHeight;
  }, { passive: true });

  function palette(){
    var th = document.documentElement.getAttribute('data-theme');
    if (th === 'ocean') return [
      [8,12,28], [20,40,90], [40,100,200], [80,160,255], [5,8,18]
    ];
    if (th === 'forest') return [
      [6,16,12], [12,40,28], [30,90,55], [60,180,100], [4,10,8]
    ];
    return [
      [8,6,14], [40,10,30], [120,20,50], [220,40,70], [5,5,10]
    ];
  }

  function blob(x, y, r, col, a){
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba('+col[0]+','+col[1]+','+col[2]+','+a+')');
    g.addColorStop(1, 'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function frame(){
    var cols = palette();
    ctx.fillStyle = 'rgb('+cols[4][0]+','+cols[4][1]+','+cols[4][2]+')';
    ctx.fillRect(0, 0, W, H);

    if (!reduce) t += 0.004;

    var cx = W * (0.5 + Math.sin(t * 0.7) * 0.15 + (mx - 0.5) * 0.08);
    var cy = H * (0.4 + Math.cos(t * 0.5) * 0.12 + (my - 0.5) * 0.08);
    blob(cx, cy, Math.max(W,H) * 0.55, cols[2], 0.45);

    blob(
      W * (0.2 + Math.sin(t * 0.9 + 1) * 0.1),
      H * (0.7 + Math.cos(t * 0.6) * 0.1),
      Math.max(W,H) * 0.4, cols[1], 0.4
    );
    blob(
      W * (0.85 + Math.cos(t * 0.5) * 0.08),
      H * (0.25 + Math.sin(t * 0.8) * 0.1),
      Math.max(W,H) * 0.38, cols[3], 0.28
    );
    blob(
      W * (0.5 + Math.sin(t * 1.1 + 2) * 0.2),
      H * (0.9),
      Math.max(W,H) * 0.35, cols[0], 0.5
    );

    var v = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v;
    ctx.fillRect(0,0,W,H);

    requestAnimationFrame(frame);
  }
  frame();

  var bg = document.getElementById('bg');
  if (bg) bg.style.opacity = '0.25';
})();
