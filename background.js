import { PALETTES } from './palettes.js';

let isEnabled = false;
let selectedPalette = 'default-dark'; // default palette

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATE') {
    sendResponse({ enabled: isEnabled, palette: selectedPalette });
    return true; // Keep the message channel open for the asynchronous response
  } else if (message.type === 'GLOBAL_SWITCH_CHANGED') {
    isEnabled = message.enabled;
    updateAllTabs();
  } else if (message.type === 'PALETTE_CHANGED') {
    selectedPalette = message.palette;
    if (isEnabled) {
      updateAllTabs();
    }
  }
});

function updateAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      // Only inject into tabs that have a URL (e.g., not chrome://extensions)
      // and are not chrome internal pages.
      if (tab.url && !tab.url.startsWith('chrome://')) {
          updateTab(tab.id);
      }
    }
  });
}

function updateTab(tabId) {
    if (isEnabled) {
        chrome.tabs.sendMessage(tabId, {
            type: 'APPLY_STYLES',
            palette: PALETTES[selectedPalette]
        }).catch(error => console.warn(`Could not send message to tab ${tabId}: ${error.message}`));
    } else {
        chrome.tabs.sendMessage(tabId, {
            type: 'REMOVE_STYLES'
        }).catch(error => console.warn(`Could not send message to tab ${tabId}: ${error.message}`));
    }
}

// Also update tabs when they are newly created or updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        updateTab(tabId);
    }
});
