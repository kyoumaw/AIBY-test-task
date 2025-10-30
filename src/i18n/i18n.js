import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";

class I18n {
  constructor() {
    this.translations = {};
    this.currentLocale = DEFAULT_LOCALE;
    this.initialized = false;
  }

  getPreferredLocale() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLocale = urlParams.get("lang");

      if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
        return urlLocale;
      }

      const browserLang = navigator.language?.split("-")[0];

      if (browserLang && SUPPORTED_LOCALES.includes(browserLang)) {
        return browserLang;
      }
    } catch (error) {
      console.error("Error detecting preferred locale:", error);
    }

    return DEFAULT_LOCALE;
  }

  async init() {
    if (this.initialized) {
      return;
    }

    try {
      const initialLocale = this.getPreferredLocale();
      this.currentLocale = initialLocale;

      this.ensureUrlHasLocale(initialLocale);
      this.updateHtmlLang(initialLocale);

      await this.loadAndRender(initialLocale);

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize i18n:", error);
      this.initialized = true;
    }
  }

  ensureUrlHasLocale(locale) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');

      if (!langParam || !SUPPORTED_LOCALES.includes(langParam)) {
        const url = new URL(window.location);
        url.searchParams.set("lang", locale);
        history.replaceState({ locale }, "", url);
      }
    } catch (error) {
      console.error("Error updating URL with locale:", error);
    }
  }

  async loadTranslations(locale) {
    try {
      const modules = import.meta.glob("./*.json");
      const path = `./${locale}.json`;
      const importModule = modules[path];

      if (!importModule) {
        const errorMsg = `No translation file found for locale: ${locale}`;
        console.warn(errorMsg);

        if (locale !== DEFAULT_LOCALE) {
          await this.loadTranslations(DEFAULT_LOCALE);
        } else {
          throw new Error(errorMsg);
        }
        return;
      }

      const module = await importModule();
      this.translations = module.default || module;
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
      throw error;
    }
  }

  t(key, params = {}) {
    let text = this.translations[key];

    if (!text) {
      console.warn(`Translation key not found: "${key}"`);
      return key;
    }

    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((varKey) => {
        const regex = new RegExp(`\\{\\{${varKey}\\}\\}`, "g");
        text = text.replace(regex, params[varKey]);
      });
    }

    return text;
  }

  updateUrlWithLanguage(lang) {
    try {
      const url = new URL(window.location);
      url.searchParams.set("lang", lang);
      window.history.replaceState({ locale: lang }, "", url.toString());
    } catch (error) {
      console.error("Error updating URL with language:", error);
    }
  }

  async loadAndRender(locale) {
    try {
      await this.loadTranslations(locale);
      if (this.currentLocale === DEFAULT_LOCALE) {
        this.initialized = true;
        return;
      }
      this.updateDOM();
    } catch (error) {
      console.error(`Failed to load and render locale ${locale}:`, error);
    }
  }

  updateDOM() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((el) => {
      try {
        const key = el.dataset.i18n;

        if (!key) {
          console.warn("Element has data-i18n attribute but no key value", el);
          return;
        }

        const translated = this.t(key);
        el.innerHTML = translated;
      } catch (error) {
        console.error("Error updating element:", el, error);
      }
    });
  }

  updateHtmlLang(locale) {
    try {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute('data-locale', locale);
    } catch (error) {
      console.error("Error updating html lang attribute:", error);
    }
  }
}

export const i18n = new I18n();
