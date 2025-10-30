import { i18n } from "./i18n";
import { PRICING, SELECTORS, TRANSLATION_KEYS } from "./config/constants";
import { querySelector, setTextContent, setHTML } from "./utils/dom";
import "./style.css";

const state = {
  initialized: false,
};

function renderDynamicContent() {
  const pricePerYearEl = querySelector(SELECTORS.pricePerYear);
  const priceYearlyPerWeekEl = querySelector(SELECTORS.priceYearlyPerWeek);
  const pricePerWeekEl = querySelector(SELECTORS.pricePerWeek);

  if (!pricePerYearEl || !priceYearlyPerWeekEl || !pricePerWeekEl) {
    return false;
  }

  try {
    const yearlyPerYearText = i18n.t(TRANSLATION_KEYS.justPricePerYear, {
      price: PRICING.yearlyPerYear,
    });
    setTextContent(pricePerYearEl, yearlyPerYearText);

    const yearlyPerWeekText = i18n.t(TRANSLATION_KEYS.pricePerWeek, {
      price: PRICING.yearlyPerWeek,
    });
    setHTML(priceYearlyPerWeekEl, yearlyPerWeekText);

    const weeklyPriceText = i18n.t(TRANSLATION_KEYS.pricePerWeek, {
      price: PRICING.weeklyPrice,
    });
    setHTML(pricePerWeekEl, weeklyPriceText);

    return true;
  } catch (error) {
    console.error("Error rendering dynamic content", error);
    return false;
  }
}

function setupEventListeners() {
  const continueButton = querySelector(SELECTORS.continueButton);
  if (continueButton) {
    continueButton.addEventListener("click", handleContinueClick);
  }
}

function handleContinueClick(event) {
  event.preventDefault();
  alert("clicked");
}

async function initializeApp() {
  if (state.initialized) {
    return;
  }

  try {
    await i18n.init();

    renderDynamicContent();
    setupEventListeners();

    state.initialized = true;
    
  } catch (error) {
    console.error("Failed to initialize application", error);
    throw error;
  }
}

initializeApp();
