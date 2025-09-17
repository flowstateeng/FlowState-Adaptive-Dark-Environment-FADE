class DarkMode {
  constructor() {
    this.storage = new Storage();
    this.settings = null;
    this.currentTab = null;
    this.hostname = null;
    this.ui = null;
  }

  /**
   * Initializes the popup UI and application state.
   * This method is called from popup.js.
   * @param {object} ui - An object containing references to the UI elements.
   */
  async initPopup(ui) {
    this.ui = ui;

    // Fetch settings and the current tab info concurrently.
    [this.settings, this.currentTab] = await Promise.all([
      this.storage.get(),
      this.getCurrentTab(),
    ]);

    // A fallback for when the tab URL is not available (e.g., chrome:// pages)
    if (!this.currentTab || !this.currentTab.url) {
      document.body.innerHTML = "This page cannot be modified.";
      return;
    }

    this.hostname = new URL(this.currentTab.url).hostname;
    this.ui.currentSiteHostname.textContent = this.hostname;

    this.populatePalettes();
    this.updatePopupUI();
    this.addEventListeners();

    // Apply or remove dark mode on the current tab when the popup is opened.
    this.updateTabStyles();
  }

  /**
   * Gets the currently active tab.
   * @returns {Promise<object>} A promise that resolves with the tab object.
   */
  getCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      });
    });
  }

  /**
   * Populates the color palette dropdown from the PALETTES constant.
   */
  populatePalettes() {
    for (const id in PALETTES) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = PALETTES[id].name;
      this.ui.paletteSelect.appendChild(option);
    }
  }

  /**
   * Updates the state of the UI elements based on the current settings.
   */
  updatePopupUI() {
    this.ui.globalSwitch.checked = this.settings.globalEnabled;

    const siteIsDisabled = this.settings.disabledSites.includes(this.hostname);
    this.ui.siteSwitch.checked = !siteIsDisabled;

    const siteSettings = this.settings.siteSettings[this.hostname];
    this.ui.paletteSelect.value = siteSettings ? siteSettings.palette : 'default-dark';
  }

  /**
   * Adds event listeners to the UI controls.
   */
  addEventListeners() {
    this.ui.globalSwitch.addEventListener('change', this.handleGlobalSwitchChange.bind(this));
    this.ui.siteSwitch.addEventListener('change', this.handleSiteSwitchChange.bind(this));
    this.ui.paletteSelect.addEventListener('change', this.handlePaletteChange.bind(this));
  }

  /**
   * Handles changes to the global on/off switch.
   */
  async handleGlobalSwitchChange(event) {
    this.settings.globalEnabled = event.target.checked;
    await this.storage.set(this.settings);
    this.updateTabStyles();
  }

  /**
   * Handles changes to the per-site on/off switch.
   */
  async handleSiteSwitchChange(event) {
    const isEnabled = event.target.checked;
    const siteIndex = this.settings.disabledSites.indexOf(this.hostname);

    if (isEnabled && siteIndex > -1) {
      // If the switch is turned on, remove the site from the disabled list.
      this.settings.disabledSites.splice(siteIndex, 1);
    } else if (!isEnabled && siteIndex === -1) {
      // If the switch is turned off, add the site to the disabled list.
      this.settings.disabledSites.push(this.hostname);
    }

    await this.storage.set(this.settings);
    this.updateTabStyles();
  }

  /**
   * Handles changes to the color palette selector.
   */
  async handlePaletteChange(event) {
    const newPalette = event.target.value;
    if (!this.settings.siteSettings[this.hostname]) {
      this.settings.siteSettings[this.hostname] = {};
    }
    this.settings.siteSettings[this.hostname].palette = newPalette;

    await this.storage.set(this.settings);
    this.updateTabStyles();
  }

  /**
   * Calls the shared action function to update the styles on the current tab
   * based on the current settings.
   */
  updateTabStyles() {
    // The core logic is now in the shared actions.js file.
    // The popup just needs to call the shared function with the current state.
    applyDarkMode(this.currentTab.id, this.hostname, this.settings);
  }
}
