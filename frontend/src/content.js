// Inject wallet monitoring code into page context
function injectWalletMonitor() {
  const script = document.createElement("script");
  script.textContent = `
    (function() {
      ${walletStore.toString()}
      walletStore.init();
    })();
  `;
  document.documentElement.appendChild(script);
  script.remove();
}

// Run injection when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectWalletMonitor);
} else {
  injectWalletMonitor();
}
