// Function to apply or remove the dark mode CSS
function toggleDarkModeInTab(tabId, isEnabled) {
    if (isEnabled) {
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['dark-mode.css']
        });
    } else {
        chrome.scripting.removeCSS({
            target: { tabId: tabId },
            files: ['dark-mode.css']
        });
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleDarkMode') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                toggleDarkModeInTab(tabs[0].id, request.isEnabled);
            }
        });
    }
});

// Apply dark mode to newly loaded pages if it's enabled
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded and has a URL
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.storage.sync.get('darkModeEnabled', (data) => {
            if (data.darkModeEnabled) {
                toggleDarkModeInTab(tabId, true);
            }
        });
    }
});

