(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initRevealOnScroll() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
  }

  function initDotNav() {
    const links = document.querySelectorAll(".dot-nav a");
    if (!links.length) return;
    const sections = Array.from(links)
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
  }

  function initCardSpotlight() {
    if (prefersReducedMotion) return;
    const items = document.querySelectorAll(".card, .project, .pub");
    items.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });
  }

  // Hero canvas: a signal line that reads as clean and reliable, then
  // briefly distorts — a visual echo of "a learning signal can look
  // trustworthy while being wrong."
  function initSignalCanvas() {
    const canvas = document.getElementById("signal-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    if (prefersReducedMotion) {
      drawFrame(0, false);
      return;
    }

    let glitchUntil = -1;
    let nextGlitch = 1800 + Math.random() * 2200;

    function drawFrame(timestamp, animate) {
      ctx.clearRect(0, 0, w, h);
      const midY = h * 0.82;
      const amp = h * 0.028;
      const points = 220;
      const inGlitch = timestamp < glitchUntil;

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const phase = timestamp * 0.0008 + i * 0.1;
        let y;
        if (inGlitch && i > points * 0.42 && i < points * 0.7) {
          y =
            midY +
            Math.sin(phase * 7) * amp * 2.2 +
            (Math.sin(i * 12.9) * 0.5) * amp;
        } else {
          y = midY + Math.sin(phase) * amp + Math.sin(phase * 2.2) * amp * 0.22;
        }
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      const glitchColor = inGlitch ? "rgba(224,90,90,0.55)" : "rgba(232,162,77,0.4)";
      grad.addColorStop(0, "rgba(232,162,77,0)");
      grad.addColorStop(0.5, glitchColor);
      grad.addColorStop(1, "rgba(79,209,197,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (!animate) return;
      if (timestamp > nextGlitch) {
        glitchUntil = timestamp + 180;
        nextGlitch = timestamp + 3200 + Math.random() * 3800;
      }
      requestAnimationFrame((t) => drawFrame(t, true));
    }
    requestAnimationFrame((t) => drawFrame(t, true));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initRevealOnScroll();
    initDotNav();
    initCardSpotlight();
    initSignalCanvas();
  });
})();
