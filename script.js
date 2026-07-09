(() => {
  const deck = document.querySelector(".deck");
  const slides = [...document.querySelectorAll(".slide")];
  const dots = [...document.querySelectorAll(".deck-nav .dot")];
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox.querySelector(".lb-img");
  const lbCap = lightbox.querySelector(".lb-cap");
  const closeBtn = lightbox.querySelector(".lb-close");

  const setActive = index => {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActive(Number(entry.target.dataset.index) - 1);
          }
        });
      },
      { root: deck, threshold: [0.55] }
    );
    slides.forEach(slide => io.observe(slide));
  }
  setActive(0);

  const currentIndex = () => {
    let best = 0;
    let bestDistance = Infinity;
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().top);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best;
  };

  const goTo = index => {
    const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.querySelectorAll(".deck-nav a").forEach((link, index) => {
    link.addEventListener("click", event => {
      event.preventDefault();
      history.replaceState(null, "", link.getAttribute("href"));
      goTo(index);
    });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target?.classList.contains("slide")) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "auto", block: "start" }));
    }
  }

  const openLightbox = (img, caption) => {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.removeAttribute("src");
  };

  document.querySelectorAll("[data-lightbox]").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.querySelector("figcaption")?.textContent || "";
      if (img) openLightbox(img, caption);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", event => {
    if (lightbox.classList.contains("is-open")) {
      if (event.key === "Escape") closeLightbox();
      return;
    }
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      goTo(currentIndex() + 1);
    }
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      goTo(currentIndex() - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });
})();
