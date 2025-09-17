document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Load the saved state from chrome.storage
    chrome.storage.sync.get('darkModeEnabled', (data) => {
        darkModeToggle.checked = !!data.darkModeEnabled;
    });

    // Listen for toggle changes
    darkModeToggle.addEventListener('change', () => {
        const isEnabled = darkModeToggle.checked;
        chrome.storage.sync.set({ darkModeEnabled: isEnabled });

        // Send a message to the background script to update the active tab
        chrome.runtime.sendMessage({ action: 'toggleDarkMode', isEnabled: isEnabled });
    });
});
