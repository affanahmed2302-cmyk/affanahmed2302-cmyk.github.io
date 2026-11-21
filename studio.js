(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.querySelector(".nav");
  const saved = localStorage.getItem("affan-theme");
  if (saved === "forest" || saved === "ocean") root.setAttribute("data-theme", saved);

  themeBtn?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "forest" ? "ocean" : "forest";
    root.setAttribute("data-theme", next);
    localStorage.setItem("affan-theme", next);
  });

  menuBtn?.addEventListener("click", () => {
    nav?.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", () => nav?.classList.remove("open"));
  });

  // Expandable projects
  document.querySelectorAll("[data-expand]").forEach((card) => {
    const btn = card.querySelector(".project-hit");
    btn?.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Scroll reveal
  const els = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  // Count-up stats
  const stats = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count") || 0);
    const dur = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const sio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            sio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach((s) => sio.observe(s));
  } else {
    stats.forEach(animateCount);
  }

  // Soft pointer glow follow (desktop)
  const glow = document.getElementById("glow");
  if (glow && window.matchMedia("(pointer:fine)").matches) {
    let x = window.innerWidth / 2;
    let y = 120;
    let cx = x;
    let cy = y;
    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY * 0.35 + 40;
      },
      { passive: true }
    );
    const loop = () => {
      cx += (x - cx) * 0.06;
      cy += (y - cy) * 0.06;
      glow.style.left = cx + "px";
      glow.style.top = cy + "px";
      glow.style.transform = "translate(-50%, -50%)";
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
})();
