// Options page script for ScrollCircle Chrome extension

document.addEventListener('DOMContentLoaded', async () => {
  // Get all form elements
  const speedSlider = document.getElementById('speedSlider');
  const sizeSlider = document.getElementById('sizeSlider');
  const opacitySlider = document.getElementById('opacitySlider');
  const resetBtn = document.getElementById('resetBtn');
  const saveStatus = document.getElementById('saveStatus');
  const previewCircle = document.getElementById('previewCircle');
  const enableButton = document.getElementById('enableButton');

  // Value display elements
  const speedValue = document.getElementById('speedValue');
  const sizeValue = document.getElementById('sizeValue');
  const opacityValue = document.getElementById('opacityValue');

  // Default settings
  const defaultSettings = {
    speedMultiplier: 1.0,
    circleSize: 100,
    circleOpacity: 0.7
  };

  // Load current settings
  let settings = await chrome.storage.sync.get([
    'speedMultiplier', 'circleSize', 'circleOpacity'
  ]);
  
  settings = { ...defaultSettings, ...settings };

  // Initialize form with current settings
  speedSlider.value = settings.speedMultiplier;
  sizeSlider.value = settings.circleSize;
  opacitySlider.value = settings.circleOpacity;

  opacitySlider.value = 0.15;
  
  updateValueDisplays();
  updatePreview();

  // Function to update button state
  async function updateButtonState() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (typeof window.scrollCircleToggle === 'function') {
            return window.scrollCircleToggle();
          }
          return false; // Not initialized yet
        }
      });
      const isActive = results[0]?.result;
      enableButton.textContent = isActive ? 'Disable Scroll Wheel' : 'Enable Scroll Wheel';
      enableButton.classList.toggle('active', isActive);
    }
  }

  // Initial button state update
  await updateButtonState();

  // Event listener for enable/disable button
  enableButton.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (typeof window.scrollCircleToggle === 'function') {
            window.scrollCircleToggle();
          }
        }
      });
      await updateButtonState();
    }
  });

  // Event listeners for real-time updates
  speedSlider.addEventListener('input', () => {
    updateValueDisplays();
    saveSettings();
  });

  sizeSlider.addEventListener('input', () => {
    updateValueDisplays();
    updatePreview();
    saveSettings();
  });

  opacitySlider.addEventListener('input', () => {
    updateValueDisplays();
    updatePreview();
    saveSettings();
  });

  // Reset button
  resetBtn.addEventListener('click', async () => {
    if (confirm('Reset all settings to default values?')) {
      speedSlider.value = defaultSettings.speedMultiplier;
      sizeSlider.value = defaultSettings.circleSize;
      opacitySlider.value = defaultSettings.circleOpacity;
      
      updateValueDisplays();
      updatePreview();
      await saveSettings();
      showSaveStatus('Settings reset to defaults');
    }
  });

  // Functions
  function updateValueDisplays() {
    speedValue.textContent = parseFloat(speedSlider.value).toFixed(1) + 'x';
    sizeValue.textContent = sizeSlider.value + 'px';
    opacityValue.textContent = Math.round(parseFloat(opacitySlider.value) * 100) + '%';
  }

  function updatePreview() {
    const size = parseInt(sizeSlider.value);
    const opacity = parseFloat(opacitySlider.value);
    
    previewCircle.style.width = Math.max(60, size * 0.6) + 'px'; // Scale down for preview
    previewCircle.style.height = Math.max(60, size * 0.6) + 'px';
    previewCircle.style.background = `rgba(66, 133, 244, ${opacity})`;
    
    const dot = previewCircle.querySelector('.preview-dot');
    if (dot) {
      dot.style.background = '#1a73e8';
    }
  }

  async function saveSettings() {
    const newSettings = {
      speedMultiplier: parseFloat(speedSlider.value),
      circleSize: parseInt(sizeSlider.value),
      circleOpacity: parseFloat(opacitySlider.value)
    };

    try {
      await chrome.storage.sync.set(newSettings);
      showSaveStatus('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
      showSaveStatus('Error saving settings', false);
    }
  }

  function showSaveStatus(message, isSuccess = true) {
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${isSuccess ? 'success' : 'error'} show`;
    
    setTimeout(() => {
      saveStatus.classList.remove('show');
    }, 2000);
  }
});
