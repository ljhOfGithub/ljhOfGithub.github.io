(() => {
  const totalSlides = 30;
  const image = document.querySelector("[data-slide-image]");
  const status = document.querySelector("[data-slide-status]");
  const previous = document.querySelector("[data-slide-previous]");
  const next = document.querySelector("[data-slide-next]");
  const thumbnailStrip = document.querySelector("[data-slide-thumbnails]");
  const pathFor = (number) => `./assets/slides/slide-${String(number).padStart(2, "0")}.jpg`;
  const template = (value, replacements) => Object.entries(replacements).reduce((text, [key, replacement]) => text.replace(`{${key}}`, replacement), value);
  let currentSlide = Math.min(totalSlides, Math.max(1, Number(new URLSearchParams(location.hash.slice(1)).get("slide")) || 1));

  const getCopy = () => window.RESUME_DATA.ui[window.resumeI18n.getLanguage()].slides;
  const updateCopy = () => {
    const copy = getCopy();
    previous.setAttribute("aria-label", copy.previous);
    next.setAttribute("aria-label", copy.next);
    image.alt = template(copy.thumbnail, { number: currentSlide });
    status.textContent = template(copy.status, { current: currentSlide, total: totalSlides });
    thumbnailStrip.setAttribute("aria-label", copy.title);
    thumbnailStrip.querySelectorAll("button").forEach((button, index) => {
      button.setAttribute("aria-label", template(copy.thumbnail, { number: index + 1 }));
    });
  };

  const showSlide = (number, updateHistory = true) => {
    currentSlide = Math.min(totalSlides, Math.max(1, number));
    image.src = pathFor(currentSlide);
    previous.disabled = currentSlide === 1;
    next.disabled = currentSlide === totalSlides;
    thumbnailStrip.querySelectorAll("button").forEach((button, index) => {
      const active = index + 1 === currentSlide;
      button.setAttribute("aria-current", active ? "true" : "false");
      if (active) button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    updateCopy();
    if (updateHistory) history.replaceState(null, "", `#slide=${currentSlide}`);
    [currentSlide - 1, currentSlide + 1].filter((number) => number >= 1 && number <= totalSlides).forEach((number) => {
      const preload = new Image();
      preload.src = pathFor(number);
    });
  };

  for (let number = 1; number <= totalSlides; number += 1) {
    const button = document.createElement("button");
    button.className = "slide-thumbnail";
    button.type = "button";
    button.innerHTML = `<img src="${pathFor(number)}" alt="" loading="lazy" />`;
    button.addEventListener("click", () => showSlide(number));
    thumbnailStrip.append(button);
  }

  previous.addEventListener("click", () => showSlide(currentSlide - 1));
  next.addEventListener("click", () => showSlide(currentSlide + 1));
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
    if (event.key === "ArrowRight") showSlide(currentSlide + 1);
    if (event.key === "Home") showSlide(1);
    if (event.key === "End") showSlide(totalSlides);
  });
  window.addEventListener("hashchange", () => {
    const requested = Number(new URLSearchParams(location.hash.slice(1)).get("slide"));
    if (requested) showSlide(requested, false);
  });
  window.addEventListener("languagechange", updateCopy);
  showSlide(currentSlide, false);
})();
