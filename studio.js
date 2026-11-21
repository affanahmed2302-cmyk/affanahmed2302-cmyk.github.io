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

  menuBtn?.addEventListener("click", () => nav?.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => nav?.classList.remove("open"))
  );

  document.querySelectorAll("[data-expand]").forEach((card) => {
    const btn = card.querySelector(".project-hit");
    btn?.addEventListener("click", () => {
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

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
  } else els.forEach((el) => el.classList.add("in"));

  const animateCount = (el) => {
    const target = Number(el.getAttribute("data-count") || 0);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  document.querySelectorAll("[data-count]").forEach((s) => {
    if ("IntersectionObserver" in window) {
      const o = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            o.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      o.observe(s);
    } else animateCount(s);
  });

  const glow = document.getElementById("glow");
  if (glow && matchMedia("(pointer:fine)").matches) {
    let x = innerWidth / 2, y = 120, cx = x, cy = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY * 0.35 + 40; }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.06; cy += (y - cy) * 0.06;
      glow.style.left = cx + "px"; glow.style.top = cy + "px";
      glow.style.transform = "translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  // Command palette
  const commands = [
    { label: "Work / Projects", href: "#work" },
    { label: "Voice identity", href: "#voice" },
    { label: "Primora Solutions", href: "#primora" },
    { label: "Impact & leadership", href: "#impact" },
    { label: "About", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
    { label: "Open Hatch live", href: "https://hatch-primeora.vercel.app", external: true },
    { label: "Aether simulator", href: "/aether/" },
    { label: "GestureOS demo", href: "/gestureos/" },
    { label: "GitHub", href: "https://github.com/affanahmed2302-cmyk", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/affan-ahmed-shariff-a0917a332", external: true },
    { label: "WhatsApp", href: "https://wa.me/919480751817?text=Hi%20Affan", external: true },
    { label: "Toggle theme", action: "theme" },
  ];
  const overlay = document.getElementById("overlay");
  const cmdInput = document.getElementById("cmdInput");
  const cmdList = document.getElementById("cmdList");
  let active = 0;

  function renderCmd(q = "") {
    const qq = q.trim().toLowerCase();
    const items = commands.filter((c) => !qq || c.label.toLowerCase().includes(qq));
    cmdList.innerHTML = items
      .map((c, i) => `<li class="${i === active ? "on" : ""}" data-i="${i}">${c.label}</li>`)
      .join("") || `<li class="empty">No matches</li>`;
    cmdList.querySelectorAll("li[data-i]").forEach((li) => {
      li.addEventListener("click", () => runCmd(items[Number(li.dataset.i)]));
    });
    return items;
  }

  function runCmd(c) {
    if (!c) return;
    if (c.action === "theme") themeBtn?.click();
    else if (c.external) window.open(c.href, "_blank", "noopener");
    else location.hash = c.href.replace("#", "") ? c.href : c.href;
    closeCmd();
  }

  function openCmd() {
    overlay.hidden = false;
    active = 0;
    renderCmd();
    cmdInput.value = "";
    cmdInput.focus();
  }
  function closeCmd() {
    overlay.hidden = true;
  }

  document.getElementById("cmdBtn")?.addEventListener("click", openCmd);
  overlay?.addEventListener("click", (e) => { if (e.target === overlay) closeCmd(); });
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.hidden ? openCmd() : closeCmd();
    }
    if (overlay?.hidden) return;
    if (e.key === "Escape") closeCmd();
    const items = renderCmd(cmdInput.value);
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, items.length - 1); renderCmd(cmdInput.value); }
    if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); renderCmd(cmdInput.value); }
    if (e.key === "Enter") { e.preventDefault(); runCmd(items[active]); }
  });
  cmdInput?.addEventListener("input", () => { active = 0; renderCmd(cmdInput.value); });
})();
