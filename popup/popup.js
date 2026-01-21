/**
 * Popup UI Script - Handles settings UI and communication with content script
 */

// Cross-browser API alias
const api = (typeof browser !== 'undefined' && browser.runtime) ? browser : chrome;

class PopupController {
  constructor() {
    this.settings = {
      enabled: true,
      blurNames: true,
      blurMessages: true,
      blurAvatars: true,
      blurIntensity: 10
    };
    
    this.elements = {};
    this.saveTimeout = null;
  }

  /**
   * Initialize popup
   */
  async init() {
    // Get DOM elements
    this.elements = {
      enabledToggle: document.getElementById('enabledToggle'),
      blurNames: document.getElementById('blurNames'),
      blurMessages: document.getElementById('blurMessages'),
      blurAvatars: document.getElementById('blurAvatars'),
      blurIntensity: document.getElementById('blurIntensity'),
      intensityValue: document.getElementById('intensityValue'),
      settingsPanel: document.getElementById('settingsPanel'),
      statusMessage: document.getElementById('statusMessage')
    };

    // Load saved settings
    await this.loadSettings();

    // Setup event listeners
    this.setupEventListeners();

    // Update UI
    this.updateUI();
  }

  /**
   * Load settings from chrome storage
   */
  async loadSettings() {
    return new Promise((resolve) => {
      api.storage.sync.get(['settings'], (result) => {
        if (result.settings) {
          this.settings = { ...this.settings, ...result.settings };
        }
        resolve();
      });
    });
  }

  /**
   * Save settings to chrome storage
   */
  async saveSettings() {
    return new Promise((resolve) => {
      api.storage.sync.set({ settings: this.settings }, () => {
        resolve();
        this.showStatus('Settings saved!');
        this.notifyContentScript();
      });
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Master toggle
    this.elements.enabledToggle.addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
      this.updateUI();
      this.debounceSave();
    });

    // Blur option checkboxes
    this.elements.blurNames.addEventListener('change', (e) => {
      this.settings.blurNames = e.target.checked;
      this.debounceSave();
    });

    this.elements.blurMessages.addEventListener('change', (e) => {
      this.settings.blurMessages = e.target.checked;
      this.debounceSave();
    });

    this.elements.blurAvatars.addEventListener('change', (e) => {
      this.settings.blurAvatars = e.target.checked;
      this.debounceSave();
    });

    // Blur intensity slider
    this.elements.blurIntensity.addEventListener('input', (e) => {
      this.settings.blurIntensity = parseInt(e.target.value);
      this.elements.intensityValue.textContent = `${this.settings.blurIntensity}px`;
      this.debounceSave();
    });
  }

  /**
   * Update UI based on current settings
   */
  updateUI() {
    // Update toggle states
    this.elements.enabledToggle.checked = this.settings.enabled;
    this.elements.blurNames.checked = this.settings.blurNames;
    this.elements.blurMessages.checked = this.settings.blurMessages;
    this.elements.blurAvatars.checked = this.settings.blurAvatars;
    this.elements.blurIntensity.value = this.settings.blurIntensity;
    this.elements.intensityValue.textContent = `${this.settings.blurIntensity}px`;

    // Disable/enable settings panel based on master toggle
    if (this.settings.enabled) {
      this.elements.settingsPanel.classList.remove('disabled');
      this.elements.blurNames.disabled = false;
      this.elements.blurMessages.disabled = false;
      this.elements.blurAvatars.disabled = false;
      this.elements.blurIntensity.disabled = false;
    } else {
      this.elements.settingsPanel.classList.add('disabled');
      this.elements.blurNames.disabled = true;
      this.elements.blurMessages.disabled = true;
      this.elements.blurAvatars.disabled = true;
      this.elements.blurIntensity.disabled = true;
    }
  }

  /**
   * Debounce save to avoid too many writes
   */
  debounceSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.saveSettings();
    }, 300);
  }

  /**
   * Notify content script of settings change
   */
  async notifyContentScript() {
    try {
      const [tab] = await api.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.id) {
        api.tabs.sendMessage(tab.id, {
          type: 'settingsUpdated',
          settings: this.settings
        }).catch((error) => {
          // Content script might not be injected yet, that's okay
          console.debug('Could not send message to content script:', error);
        });
      }
    } catch (error) {
      console.error('Error notifying content script:', error);
    }
  }

  /**
   * Show status message
   */
  showStatus(message) {
    this.elements.statusMessage.textContent = message;
    this.elements.statusMessage.classList.add('show');

    setTimeout(() => {
      this.elements.statusMessage.classList.remove('show');
    }, 2000);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const popup = new PopupController();
  popup.init();
});
