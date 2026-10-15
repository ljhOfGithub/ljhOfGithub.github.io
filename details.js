(() => {
  const params = new URLSearchParams(window.location.search);
  const pageType = document.body.dataset.page;
  const collection = pageType === "paper" ? window.RESUME_DATA.papers : window.RESUME_DATA.work;
  const item = collection[params.get("id")] || collection[pageType === "paper" ? "polypresentation" : "polyu"];
  const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value || ""; };
  const fillList = (name, values) => { const list = document.querySelector(`[data-detail-list="${name}"]`); if (!list) return; list.replaceChildren(...values.map((value) => { const li = document.createElement("li"); li.textContent = value; return li; })); };
  function render() {
    const language = window.resumeI18n.getLanguage();
    document.title = `${item.title} | Jihao Li`;
    setText("[data-detail-title]", item.title);
    if (pageType === "paper") {
      setText("[data-detail-status]", `${item.year} · ${item.status[language]}`); setText("[data-detail-authors]", item.authors); setText("[data-detail-overview]", item.overview[language]);
      document.querySelectorAll("[data-detail-pdf]").forEach((link) => link.href = item.pdf); document.querySelector("[data-detail-pdf-frame]").src = item.pdf;
      const image = document.querySelector("[data-detail-image]"); image.src = item.image; image.alt = item.title;
      ["contribution","evidence","role","limits"].forEach((name) => fillList(name, item[name][language]));
    } else {
      setText("[data-detail-status]", item.organization[language]); setText("[data-detail-overview]", item.overview[language]); setText("[data-work-organization]", item.organization[language]); setText("[data-work-period]", item.period[language]); setText("[data-work-stack]", item.stack); fillList("responsibilities", item.responsibilities[language]); fillList("outcomes", item.outcomes[language]);
    }
  }
  window.addEventListener("languagechange", render); render();
})();
