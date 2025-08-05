// Popup script for ScrollCircle Chrome extension

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const status = document.getElementById('status');
  const speedSlider = document.getElementById('speedSlider');
  const sizeSlider = document.getElementById('sizeSlider');
  const opacitySlider = document.getElementById('opacitySlider');
  const speedValue = document.getElementById('speedValue');
  const sizeValue = document.getElementById('sizeValue');
  const opacityValue = document.getElementById('opacityValue');
  const optionsLink = document.getElementById('optionsLink');
  const helpLink = document.getElementById('helpLink');

  // Load current settings
  let settings = await chrome.storage.sync.get([
    'speedMultiplier', 'circleSize', 'circleOpacity'
  ]);
  
  settings = {
    speedMultiplier: settings.speedMultiplier || 1.0,
    circleSize: settings.circleSize || 100,
    circleOpacity: settings.circleOpacity || 0.7
  };

  // Update UI with current settings
  speedSlider.value = settings.speedMultiplier;
  sizeSlider.value = settings.circleSize;
  opacitySlider.value = settings.circleOpacity;
  updateValueDisplays();

  // Check current tab state
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      // Try to get current state from content script
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return typeof window.scrollCircleToggle === 'function' && 
                   window.scrollCircle && window.scrollCircle.isActive;
          }
        });
        
        const isActive = results[0]?.result || false;
        updateToggleButton(isActive);
      } catch (error) {
        // Content script not loaded yet
        updateToggleButton(false);
      }
    }
  } catch (error) {
    console.error('Error checking tab state:', error);
    status.textContent = 'Cannot access this page';
    toggleBtn.disabled = true;
  }

  // Toggle button click handler
  toggleBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      // Execute toggle function
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (typeof window.scrollCircleToggle === 'function') {
            return window.scrollCircleToggle();
          }
          return false;
        }
      });

      const isActive = results[0]?.result || false;
      updateToggleButton(isActive);
      
    } catch (error) {
      console.error('Error toggling ScrollCircle:', error);
      status.textContent = 'Error: Cannot access this page';
    }
  });

  // Settings sliders
  speedSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    chrome.storage.sync.set({ speedMultiplier: value });
    updateValueDisplays();
  });

  sizeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    chrome.storage.sync.set({ circleSize: value });
    updateValueDisplays();
  });

  opacitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    chrome.storage.sync.set({ circleOpacity: value });
    updateValueDisplays();
  });

  // Options and help links
  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
    window.close();
  });

  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ 
      url: 'https://github.com/scrollcircle/help' // Replace with actual help URL
    });
    window.close();
  });

  function updateToggleButton(isActive) {
    if (isActive) {
      toggleBtn.textContent = 'Disable ScrollCircle';
      toggleBtn.classList.add('active');
      status.textContent = 'Active - Circle is visible on page';
    } else {
      toggleBtn.textContent = 'Enable ScrollCircle';
      toggleBtn.classList.remove('active');
      status.textContent = 'Inactive - Click to show circle';
    }
  }

  function updateValueDisplays() {
    speedValue.textContent = parseFloat(speedSlider.value).toFixed(1) + 'x';
    sizeValue.textContent = sizeSlider.value + 'px';
    opacityValue.textContent = Math.round(parseFloat(opacitySlider.value) * 100) + '%';
  }
});