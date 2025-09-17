// Set initial state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    isGloballyEnabled: true,
    theme: 'slate'
  });
});

// Function to handle injecting CSS
const injectCSS = (tabId, theme) => {
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    files: [`themes/${theme}.css`]
  }).catch(err => console.log("Error injecting CSS: ", err));
};

// Function to handle removing CSS
const removeCSS = (tabId, theme) => {
  chrome.scripting.removeCSS({
    target: { tabId: tabId },
    files: [`themes/${theme}.css`]
  }).catch(err => console.log("Error removing CSS (may be expected): ", err));
};

// Listen for messages from the control panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'UPDATE_STATE') {
    // Get the current state from storage
    chrome.storage.sync.get(['isGloballyEnabled', 'theme'], (currentState) => {
      // Determine the new state from the message payload
      const newState = { ...currentState, ...request.payload };

      // Decide what to do based on the state change
      chrome.tabs.query({ url: ["http://*/*", "https://*/*", "file://*/*"] }, (tabs) => {
        for (const tab of tabs) {
          // Case 1: Dark mode is being turned OFF
          if (currentState.isGloballyEnabled && !newState.isGloballyEnabled) {
            removeCSS(tab.id, currentState.theme);
          }
          // Case 2: Dark mode is being turned ON
          else if (!currentState.isGloballyEnabled && newState.isGloballyEnabled) {
            injectCSS(tab.id, newState.theme);
          }
          // Case 3: Theme is changing while dark mode is ON
          else if (currentState.isGloballyEnabled && newState.isGloballyEnabled && currentState.theme !== newState.theme) {
            removeCSS(tab.id, currentState.theme);
            injectCSS(tab.id, newState.theme);
          }
        }
      });

      // After dispatching changes, save the new state
      chrome.storage.sync.set(newState);
    });
    // Return true to indicate you wish to send a response asynchronously
    return true;
  }
});

// Inject CSS when a new page loads or an existing one is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http') || tab.url.startsWith('file'))) {
        chrome.storage.sync.get(['isGloballyEnabled', 'theme'], ({ isGloballyEnabled, theme }) => {
            if (isGloballyEnabled) {
                injectCSS(tabId, theme);
            }
        });
    }
});
