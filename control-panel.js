const globalToggle = document.getElementById('global-toggle');
const themeButtons = document.querySelectorAll('.theme-button');

// Get initial state from storage and update UI
chrome.storage.sync.get(['isGloballyEnabled', 'theme'], ({ isGloballyEnabled, theme }) => {
  globalToggle.checked = isGloballyEnabled;
  // Add active class to the current theme button
  if (theme) {
    document.getElementById(theme).classList.add('active');
  }
});

// Add event listener for the global toggle
globalToggle.addEventListener('change', (event) => {
  const isGloballyEnabled = event.target.checked;
  chrome.storage.sync.set({ isGloballyEnabled });
  chrome.runtime.sendMessage({
    type: 'UPDATE_STATE',
    payload: { isGloballyEnabled }
  });
});

// Add event listeners for the theme buttons
themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const theme = button.id;
    chrome.storage.sync.set({ theme });
    chrome.runtime.sendMessage({
      type: 'UPDATE_STATE',
      payload: { theme }
    });

    // Update active class
    themeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
