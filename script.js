(() => {
  const getByPath = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);
  let language = localStorage.getItem("jihao-site-language") === "en" ? "en" : "zh";
  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    localStorage.setItem("jihao-site-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getByPath(window.RESUME_DATA.ui[language], element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.textContent = language === "zh" ? "EN" : "中文";
      button.setAttribute("aria-label", language === "zh" ? "Switch to English" : "切换到中文");
    });
    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
  }
  document.querySelectorAll("[data-lang-toggle]").forEach((button) => button.addEventListener("click", () => applyLanguage(language === "zh" ? "en" : "zh")));
  window.resumeI18n = { getLanguage: () => language, applyLanguage };
  applyLanguage(language);
})();
