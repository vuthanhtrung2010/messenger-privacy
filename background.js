/**
 * Background Service Worker - Handles extension lifecycle and cross-tab communication
 */

// Cross-browser API alias
const api = (typeof browser !== 'undefined' && browser.runtime) ? browser : chrome;

/**
 * Handle extension installation or update
 */
api.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    api.storage.sync.set({
      settings: {
        enabled: true,
        blurNames: true,
        blurMessages: true,
        blurAvatars: true,
        blurIntensity: 10
      }
    });

    console.log('[Privacy Guard] Extension installed successfully');
  } else if (details.reason === 'update') {
    console.log('[Privacy Guard] Extension updated to version', api.runtime.getManifest().version);
  }
});

// Keep service worker alive (optional, for debugging)
api.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ping') {
    sendResponse({ status: 'alive' });
  }
  return true;
});
