class Storage {
  constructor() {
    // Default settings are used if no settings are found in storage.
    this.defaultSettings = {
      globalEnabled: true,
      // A list of hostnames where dark mode is disabled.
      disabledSites: [],
      // Per-site settings, like custom palettes.
      // e.g., {'www.google.com': { palette: 'solarized-dark' }}
      siteSettings: {},
    };
  }

  /**
   * Retrieves all settings from chrome.storage.local.
   * If no settings are found, it returns the default settings.
   * @returns {Promise<object>} A promise that resolves with the settings object.
   */
  get() {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.defaultSettings, (items) => {
        resolve(items);
      });
    });
  }

  /**
   * Saves the provided settings object to chrome.storage.local.
   * @param {object} settings - The settings object to save.
   * @returns {Promise<void>} A promise that resolves when the settings are saved.
   */
  set(settings) {
    return new Promise((resolve) => {
      chrome.storage.local.set(settings, () => {
        resolve();
      });
    });
  }
}
