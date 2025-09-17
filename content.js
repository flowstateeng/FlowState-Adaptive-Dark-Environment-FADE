chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'APPLY_STYLES') {
    applyStyles(message.palette);
  } else if (message.type === 'REMOVE_STYLES') {
    removeStyles();
  }
});

function applyStyles(palette) {
  removeStyles(); // Remove existing styles before applying new ones
  const style = document.createElement('style');
  style.id = 'fade-style'; // Give it an ID so we can find it later to remove it
  style.textContent = `
    html, body {
      background-color: ${palette.bg} !important;
      color: ${palette.text} !important;
    }
    a {
      color: ${palette.link} !important;
    }
    input, textarea, select, button {
      background-color: ${palette.inputBg} !important;
      color: ${palette.inputText} !important;
      border: 1px solid ${palette.border} !important;
    }
    /* Add more specific selectors as needed */
  `;
  document.head.appendChild(style);
}

function removeStyles() {
  const existingStyle = document.getElementById('fade-style');
  if (existingStyle) {
    existingStyle.remove();
  }
}
