class DarkModeInjector {
  constructor() {
    // A single style element to hold our dark mode CSS.
    this.styleElement = null;
    this.initListener();
  }

  /**
   * Initializes the message listener to wait for commands from the extension popup.
   */
  initListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'applyDarkMode') {
        this.apply(request.palette);
        sendResponse({ status: 'success' });
      } else if (request.action === 'removeDarkMode') {
        this.remove();
        sendResponse({ status: 'success' });
      }
      // Keep the message channel open for an async response.
      return true;
    });
  }

  /**
   * Applies the dark mode styles to the page.
   * @param {object} palette - The color palette to use.
   */
  apply(palette) {
    // If the style element doesn't exist, create it and append it to the head.
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      document.head.appendChild(this.styleElement);
    }

    // This is a simple but effective dark mode. It sets the background and text colors
    // for the whole page. More complex rules can be added here for better results.
    this.styleElement.innerHTML = `
      html, body {
        background-color: ${palette.bg} !important;
        color: ${palette.text} !important;
      }
      a {
        color: ${palette.link} !important;
      }
      /* Add other generic element styles here */
      input, textarea, button, select {
        background-color: ${palette.inputBg} !important;
        color: ${palette.inputText} !important;
        border-color: ${palette.border} !important;
      }
    `;
  }

  /**
   * Removes the dark mode styles from the page.
   */
  remove() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}

// To prevent the script from running multiple times on the same page (e.g., in iframes),
// we attach the instance to the window object.
if (!window.darkModeInjector) {
  window.darkModeInjector = new DarkModeInjector();
}
