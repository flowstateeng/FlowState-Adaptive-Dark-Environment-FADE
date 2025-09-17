// Import shared scripts for storage, color palettes, and actions.
importScripts('storage.js', 'palettes.js', 'actions.js');

const storage = new Storage();

/**
 * Listens for updates to any tab in any window.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // We are only interested in events where the tab has finished loading.
  // We also check if the tab has a URL and if it's an http/https page.
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    const settings = await storage.get();
    const hostname = new URL(tab.url).hostname;

    // The applyDarkMode function will be defined in actions.js.
    // It contains the core logic for deciding whether to apply or remove dark mode.
    applyDarkMode(tab.id, hostname, settings);
  }
});
