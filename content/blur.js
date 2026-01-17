/**
 * Messenger Privacy Guard - Content Script
 * Detects and applies blur effects to messenger UI elements
 */

class MessengerPrivacyGuard {
  constructor() {
    this.settings = { enabled: true, blurNames: true, blurMessages: true, blurAvatars: true, blurIntensity: 10 };
    this.observer = null;
    this.selectors = {
      names: ['span[dir="auto"]', 'h2', 'h3'],
      messageText: ['span[dir="auto"]', 'div[dir="auto"]'],
      avatars: ['img', 'image']
    };
  }

  async init() {
    await this.loadSettings();
    this.applyBlurToPage();
    this.setupObserver();
    this.setupMessageListener();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['settings'], (result) => {
        if (result.settings) this.settings = { ...this.settings, ...result.settings };
        resolve();
      });
    });
  }

  findElements(selectorArray) {
    const elements = new Set();
    selectorArray.forEach(selector => {
      try { document.querySelectorAll(selector).forEach(el => elements.add(el)); }
      catch (e) {}
    });
    return Array.from(elements);
  }

  isNameElement(element) {
    if (!element?.textContent) return false;
    const text = element.textContent.trim();
    const className = typeof element.className === 'string' ? element.className : '';
    
    if (/^\d{1,2}:\d{2}$/.test(text) || 
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2}:\d{2}$/i.test(text) ||
        /^\d+[mhd]$|sent .+ ago|\d+ (second|minute|hour|day|week|month|year)s? ago|active now|unread/i.test(text)) return false;
    
    return element.getAttribute('role') === 'heading' || 
           ['h1', 'h2', 'h3', 'h4'].includes(element.tagName.toLowerCase()) ||
           (className && /title|name|sender|x6prxxf/i.test(className)) ||
           (text.length >= 2 && text.length < 50 && element.getAttribute('dir') === 'auto' && !text.includes(':') && !text.includes('·'));
  }

  isMessageElement(element) {
    if (!element?.textContent) return false;
    const text = element.textContent.trim();
    const tag = element.tagName.toLowerCase();
    const className = typeof element.className === 'string' ? element.className : '';
    
    if (/^\d{1,2}:\d{2}$/.test(text) || 
        /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \d{1,2}:\d{2}$/i.test(text) ||
        /unread message|^\d+[mhd]$|sent .+ ago|\d+ (second|minute|hour|day|week|month|year)s? ago|active now/i.test(text) || 
        (text.includes('·') && text.length < 10)) return false;
    
    return (element.dataset?.scope === 'message_text') ||
           (element.getAttribute('dir') === 'auto' && ['span', 'div'].includes(tag) && className.includes('x1lliihq') && text.length >= 1) ||
           (text.length > 10);
  }

  isAvatarElement(element) {
    if (!element) return false;
    const tag = element.tagName.toLowerCase();
    if (tag !== 'img' && tag !== 'image') return false;
    
    let src = element.src || '';
    if (!src && tag === 'image') {
      src = element.getAttribute('href') || element.getAttribute('xlink:href') || element.href?.baseVal || '';
    }
    
    const className = typeof element.className === 'string' ? element.className : '';
    
    if (src.startsWith('data:image/') && /\bx[a-z0-9]+/i.test(className)) return true;
    if ((src.includes('fbcdn.net') || src.includes('facebook.com')) && 
        (/s\d{2,3}x\d{2,3}/.test(src) || src.includes('profile') || /\bx[0-9]/.test(className))) return true;
    
    return element.dataset?.visualcompletion === 'media-vc-image' || /profile|avatar/i.test(element.alt || '') || /avatar|profile/i.test(className);
  }

  applyBlur(element, type) {
    if (!element || (element.classList.contains('mpg-blurred') && element.classList.contains(`mpg-blur-${type}`))) return;
    element.classList.add('mpg-blurred', `mpg-blur-${type}`);
    element.style.setProperty('--blur-intensity', `${this.settings.blurIntensity}px`);
    element.addEventListener('mouseenter', () => element.classList.add('mpg-hover-unblur'));
    element.addEventListener('mouseleave', () => element.classList.remove('mpg-hover-unblur'));
  }

  removeBlur(element) {
    if (!element) return;
    element.classList.remove('mpg-blurred', 'mpg-blur-name', 'mpg-blur-message', 'mpg-blur-avatar');
    element.style.removeProperty('--blur-intensity');
  }

  applyBlurToPage() {
    if (!this.settings.enabled) return this.removeAllBlurs();
    
    if (this.settings.blurNames) {
      this.findElements(this.selectors.names).forEach(el => this.isNameElement(el) && this.applyBlur(el, 'name'));
    }
    if (this.settings.blurMessages) {
      this.findElements(this.selectors.messageText).forEach(el => this.isMessageElement(el) && this.applyBlur(el, 'message'));
    }
    if (this.settings.blurAvatars) {
      this.findElements(this.selectors.avatars).forEach(el => this.isAvatarElement(el) && this.applyBlur(el, 'avatar'));
    }
    this.setupConversationHover();
  }

  setupConversationHover() {
    document.querySelectorAll('a[href^="/e2ee/t/"], a[href^="/t/"], a[href*="facebook.com"]').forEach(link => {
      if (link.dataset.mpgHoverSetup) return;
      link.dataset.mpgHoverSetup = 'true';
      link.addEventListener('mouseenter', () => link.querySelectorAll('.mpg-blurred').forEach(child => child.classList.add('mpg-hover-unblur')));
      link.addEventListener('mouseleave', () => link.querySelectorAll('.mpg-blurred').forEach(child => child.classList.remove('mpg-hover-unblur')));
    });
  }

  removeAllBlurs() {
    document.querySelectorAll('.mpg-blurred').forEach(el => this.removeBlur(el));
  }

  setupObserver() {
    if (this.observer) this.observer.disconnect();
    this.observer = new MutationObserver(() => {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame(() => this.applyBlurToPage());
    });
    this.observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'settingsUpdated') {
        this.settings = { ...this.settings, ...message.settings };
        this.removeAllBlurs();
        if (this.settings.enabled) this.applyBlurToPage();
        sendResponse({ success: true });
      } else if (message.type === 'togglePrivacyMode') {
        this.settings.enabled = !this.settings.enabled;
        chrome.storage.sync.set({ settings: this.settings });
        this.settings.enabled ? this.applyBlurToPage() : this.removeAllBlurs();
        sendResponse({ success: true, enabled: this.settings.enabled });
      }
      return true;
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const guard = new MessengerPrivacyGuard();
    guard.init();
  });
} else {
  const guard = new MessengerPrivacyGuard();
  guard.init();
}
