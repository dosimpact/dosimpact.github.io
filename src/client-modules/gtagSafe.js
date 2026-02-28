function ensureGtag() {
  if (typeof window === "undefined") {
    return;
  }

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

const clientModule = {
  onRouteDidUpdate() {
    ensureGtag();
  },
};

ensureGtag();

export default clientModule;
