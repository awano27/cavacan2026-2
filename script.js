(() => {
  const deck = document.querySelector(".deck");
  const slides = [...document.querySelectorAll(".slide")];
  const dots = [...document.querySelectorAll(".deck-nav .dot")];

  // ---- Active dot via IntersectionObserver ----
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.55) {
          const idx = Number(e.target.dataset.index) - 1;
          dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
        }
      });
    },
    { root: deck, threshold: [0.55] }
  );
  slides.forEach(s => io.observe(s));

  // ---- Keyboard nav ----
  const goto = (i) => {
    const t = slides[Math.max(0, Math.min(slides.length - 1, i))];
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const currentIndex = () => {
    let best = 0, bestTop = Infinity;
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const dist = Math.abs(r.top);
      if (dist < bestTop) { bestTop = dist; best = i; }
    });
    return best;
  };
  window.addEventListener("keydown", e => {
    if (lb.classList.contains("is-open")) {
      if (e.key === "Escape") closeLB();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault(); goto(currentIndex() + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); goto(currentIndex() - 1);
    } else if (e.key === "Home") {
      e.preventDefault(); goto(0);
    } else if (e.key === "End") {
      e.preventDefault(); goto(slides.length - 1);
    }
  });

  // ---- Lightbox ----
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector(".lb-img");
  const lbCap = lb.querySelector(".lb-cap");
  const closeBtn = lb.querySelector(".lb-close");

  const openLB = (src, cap) => {
    lbImg.src = src;
    lbCap.textContent = cap || "";
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
  };
  const closeLB = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
  };

  document.querySelectorAll(".g").forEach(fig => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      const cap = fig.querySelector("figcaption");
      if (img) openLB(img.src, cap ? cap.textContent : "");
    });
  });
  closeBtn.addEventListener("click", closeLB);
  lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
})();
