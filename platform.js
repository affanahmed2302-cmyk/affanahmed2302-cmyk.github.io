(() => {
  const nav = document.querySelector(".nav");
  document.getElementById("menuBtn")?.addEventListener("click", () => nav?.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => nav?.classList.remove("open")));

  document.querySelectorAll(".fade").forEach((el) => {
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    io.observe(el);
  });

  const commands = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Journey", href: "/journey/" },
    { label: "Ventures", href: "/ventures/" },
    { label: "Primora Solutions", href: "/ventures/primora-solutions/" },
    { label: "Hatch", href: "/ventures/hatch/" },
    { label: "Projects", href: "/projects/" },
    { label: "Expertise", href: "/expertise/" },
    { label: "Education", href: "/education/" },
    { label: "Leadership", href: "/leadership/" },
    { label: "Voice", href: "/voice/" },
    { label: "Media", href: "/media/" },
    { label: "Resume", href: "/resume/" },
    { label: "Contact", href: "/contact/" },
    { label: "Open Hatch live", href: "https://hatch-primeora.vercel.app", external: true },
    { label: "Aether simulator", href: "/aether/" },
    { label: "GestureOS", href: "/gestureos/" },
    { label: "GitHub", href: "https://github.com/affanahmed2302-cmyk", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/affan-ahmed-shariff-a0917a332", external: true },
    { label: "WhatsApp", href: "https://wa.me/919480751817?text=Hi%20Affan", external: true },
  ];

  const overlay = document.getElementById("overlay");
  const cmdInput = document.getElementById("cmdInput");
  const cmdList = document.getElementById("cmdList");
  let active = 0;

  function render(q = "") {
    const qq = q.trim().toLowerCase();
    const items = commands.filter((c) => !qq || c.label.toLowerCase().includes(qq));
    cmdList.innerHTML = items.map((c, i) => `<li class="${i === active ? "on" : ""}" data-i="${i}">${c.label}</li>`).join("") || `<li class="empty">No matches</li>`;
    cmdList.querySelectorAll("li[data-i]").forEach((li) => {
      li.addEventListener("click", () => run(items[Number(li.dataset.i)]));
    });
    return items;
  }
  function run(c) {
    if (!c) return;
    if (c.external) window.open(c.href, "_blank", "noopener");
    else location.href = c.href;
    close();
  }
  function open() { overlay.hidden = false; active = 0; render(); cmdInput.value = ""; cmdInput.focus(); }
  function close() { overlay.hidden = true; }

  document.getElementById("cmdBtn")?.addEventListener("click", open);
  overlay?.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); overlay.hidden ? open() : close(); }
    if (overlay?.hidden) return;
    if (e.key === "Escape") close();
    const items = render(cmdInput.value);
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, items.length - 1); render(cmdInput.value); }
    if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); render(cmdInput.value); }
    if (e.key === "Enter") { e.preventDefault(); run(items[active]); }
  });
  cmdInput?.addEventListener("input", () => { active = 0; render(cmdInput.value); });
})();
