document.addEventListener('DOMContentLoaded', () => {
  const paletteSelect = document.getElementById('palette-select');
  const globalSwitch = document.getElementById('global-switch');

  // Populate palettes
  for (const id in PALETTES) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = PALETTES[id].name;
    paletteSelect.appendChild(option);
  }

  // Event listener for the global switch
  globalSwitch.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      type: 'GLOBAL_SWITCH_CHANGED',
      enabled: globalSwitch.checked,
    });
  });

  // Event listener for palette selection
  paletteSelect.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      type: 'PALETTE_CHANGED',
      palette: paletteSelect.value,
    });
  });

  // Request current state from background script
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
    if (response) {
      globalSwitch.checked = response.enabled;
      paletteSelect.value = response.palette;
    }
  });
});
