/**
 * This is a shared function that contains the core logic for applying or removing dark mode.
 * It can be called from the background script or the popup script.
 *
 * @param {number} tabId - The ID of the tab to modify.
 * @param {string} hostname - The hostname of the site in the tab.
 * @param {object} settings - The user's settings object from storage.
 */
function applyDarkMode(tabId, hostname, settings) {
  const siteIsDisabled = settings.disabledSites.includes(hostname);
  const siteIsEnabled = !siteIsDisabled;

  // First, ensure the content script is injected into the tab.
  // This is necessary because the script is not persistent across page loads.
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  }).then(() => {
    // After the script is successfully injected, send it a message.
    if (settings.globalEnabled && siteIsEnabled) {
      // If dark mode should be on, find the correct palette and send it.
      const siteSettings = settings.siteSettings[hostname];
      const paletteId = siteSettings && siteSettings.palette ? siteSettings.palette : 'default-dark';
      const palette = PALETTES[paletteId];

      chrome.tabs.sendMessage(tabId, {
        action: 'applyDarkMode',
        palette: palette
      });
    } else {
      // If dark mode should be off, tell the content script to remove its styles.
      chrome.tabs.sendMessage(tabId, {
        action: 'removeDarkMode'
      });
    }
  }).catch(err => {
    // This error is expected on certain pages (e.g., chrome:// pages, file URLs)
    // where content scripts cannot be injected. We can safely ignore it.
    console.warn(`Dark Mode Extension: Could not inject script into tab ${tabId}.`, err);
  });
}
