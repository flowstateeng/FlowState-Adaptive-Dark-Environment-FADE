document.addEventListener('DOMContentLoaded', () => {
  const ui = {
    globalSwitch: document.getElementById('global-switch'),
    siteSwitch: document.getElementById('site-switch'),
    paletteSelect: document.getElementById('palette-select'),
    currentSiteHostname: document.getElementById('current-site-hostname'),
  };

  // The main DarkMode class will be instantiated here and will handle all logic.
  // This keeps the popup script clean and focused on UI wiring.
  const darkMode = new DarkMode();

  // The initPopup method will be responsible for setting up the initial state
  // of the UI and attaching all the necessary event listeners.
  darkMode.initPopup(ui);
});
