// Background script for ScrollCircle Chrome extension

let settings = {
  speedMultiplier: 1.0,
  circleSize: 100,
  circleOpacity: 0.7,
  highContrast: false
};

let extensionActive = false; // Global activation state
const activeTabIds = new Set(); // Track active tabs

// Load settings from storage
async function loadSettings() {
  const stored = await chrome.storage.sync.get([
    'speedMultiplier', 'circleSize', 'circleOpacity', 'highContrast'
  ]);
  settings = {
    speedMultiplier: stored.speedMultiplier || 1.0,
    circleSize: stored.circleSize || 100,
    circleOpacity: stored.circleOpacity || 0.7,
    highContrast: stored.highContrast || false
  };
}

// Save settings to storage
async function saveSettings(newSettings) {
  settings = { ...settings, ...newSettings };
  await chrome.storage.sync.set(settings);
  sendSettingsToAllTabs();
}

// Send settings to all tabs
async function sendSettingsToAllTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    try {
      // First, update the settings object
      console.log("Sending settings to tab " + tab.id + ":", settings);
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (tabId, settings) => {
          window.scrollCircleSettings = settings;
          if (window.scrollCircle && typeof window.scrollCircle.updateSettings === 'function') {
            window.scrollCircle.updateSettings(window.scrollCircleSettings);
          }
        },
        args: [tab.id, settings]
      });
    } catch (error) {
      console.warn(`Error sending settings to tab ${tab.id}: ${error}`);
    }
  }
}

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  await toggleScrollCircle();
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-scroll-circle') {
    await toggleScrollCircle();
  }
});

// Toggle ScrollCircle on/off globally
async function toggleScrollCircle() {
  try {
    extensionActive = !extensionActive; // Flip global state
    const tabs = await chrome.tabs.query({});
    
    // Update all tabs
    for (const tab of tabs) {
      await updateTabState(tab.id);
    }
  } catch (error) {
    console.error('Error toggling ScrollCircle:', error);
  }
}

// Update a single tab's ScrollCircle state
async function updateTabState(tabId) {
  try {
    if (extensionActive) {
      // Activate ScrollCircle using direct messaging
      console.log(`Sending toggle-scroll-circle message to tab ${tabId}`);
      await chrome.tabs.sendMessage(tabId, { type: 'toggle-scroll-circle' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(`Error toggling scroll circle in tab ${tabId}:`, chrome.runtime.lastError);
        } else if (response && response.isActive) {
          activeTabIds.add(tabId);
        }
      });
    } else if (activeTabIds.has(tabId)) {
      // Deactivate ScrollCircle
      await chrome.tabs.sendMessage(tabId, { type: 'toggle-scroll-circle' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(`Error toggling scroll circle in tab ${tabId}:`, chrome.runtime.lastError);
        } else if (response && !response.isActive) {
          activeTabIds.delete(tabId);
        }
      });
    }

    // Update icon and title
    // Update icon and title only if successful
    if (extensionActive && activeTabIds.has(tabId)) {
      await chrome.action.setIcon({
        tabId: tabId,
        path: {
          16: 'icons/icon16-active.png',
          32: 'icons/icon32-active.png',
          48: 'icons/icon64.png',
          128: 'icons/icon128-active.png'
        }
      });
      await chrome.action.setTitle({
        tabId: tabId,
        title: 'ScrollCircle (Active)'
      });
    } else {
      await chrome.action.setIcon({
        tabId: tabId,
        path: {
          16: 'icons/icon16.png',
          32: 'icons/icon32.png',
          48: 'icons/icon64.png',
          128: 'icons/icon128.png'
        }
      });
      await chrome.action.setTitle({
        tabId: tabId,
        title: 'ScrollCircle (Inactive)'
      });
    }
  } catch (error) {
    console.warn(`Error updating tab ${tabId}: ${error}`);
  }
}

// Handle tab updates (navigation/reloads)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    try {
      // Update tab state if extension is active
      if (extensionActive) {
        await updateTabState(tabId);
      }
    } catch (error) {
      console.warn(`Error updating tab ${tabId}: ${error}`);
    }
  }
});

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabIds.delete(tabId);
});

// Update icon when tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    await chrome.action.setIcon({
      tabId: activeInfo.tabId,
      path: {
        16: extensionActive ? 'icons/icon16-active.png' : 'icons/icon16.png',
        32: extensionActive ? 'icons/icon32-active.png' : 'icons/icon32.png',
        48: extensionActive ? 'icons/icon48-active.png' : 'icons/icon48.png',
        128: extensionActive ? 'icons/icon128-active.png' : 'icons/icon128.png'
      }
    });
    await chrome.action.setTitle({
      tabId: activeInfo.tabId,
      title: extensionActive ? 'ScrollCircle (Active)' : 'ScrollCircle (Inactive)'
    });
  } catch (error) {
    console.warn(`Error updating tab ${activeInfo.tabId}: ${error}`);
  }
});

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      speedMultiplier: 1.0,
      circleSize: 100,
      circleOpacity: 0.7,
      highContrast: false
    });
  }
  loadSettings();
});

// Inject content script and activate on new tab creation
chrome.tabs.onCreated.addListener(async (tab) => {
  try {
    await updateTabState(tab.id);
    sendSettingsToAllTabs();
  } catch (error) {
    console.warn(`Error processing new tab ${tab.id}: ${error}`);
  }
});

  // Listen for changes to settings
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === 'sync') {
      await loadSettings();
      // Send updated settings to all tabs immediately
      await sendSettingsToAllTabs();
    }
  });

  // Listen for messages from content scripts about frame activations
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'scroll-circle-activated') {
      console.log(`Scroll circle activated in frame: ${request.frameId}`);
      // Optionally handle frame activations here
    }
  });

// Load settings on startup and activate if needed
loadSettings().then(async () => {
  if (extensionActive) {
    // Activate ScrollCircle in all existing tabs
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      await updateTabState(tab.id);
    }
  }
});
