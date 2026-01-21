# 🛡️ Messenger Privacy Guard

A Chrome extension that adds intelligent privacy features to social platforms, starting with Messenger.com. Automatically blur sensitive content (names, messages, avatars) with smart hover-to-reveal functionality.

Firefox: [Messenger Privacy Guard for Firefox](https://addons.mozilla.org/en-US/firefox/addon/messenger-privacy-guard/)

## ✨ Features

- **🎭 Smart Content Detection**: Automatically detects and blurs:
  - Sender names and conversation titles
  - Message text content
  - Profile avatars and pictures

- **👆 Hover to Reveal**: Temporarily unblur content by hovering your mouse over it

- **⚙️ Granular Control**: Toggle blur independently for:
  - Names
  - Messages  
  - Avatars

- **🎚️ Adjustable Intensity**: Blur intensity slider (0-20px) to match your privacy needs

- **💾 Persistent Settings**: All preferences saved automatically using Chrome storage

- **🚀 High Performance**: Optimized with GPU acceleration and debounced observers

## 📦 Installation

### Development Mode (Load Unpacked)

1. **Clone or download this repository**
   ```bash
   git clone https://codeberg.org/vuthanhtrung2010/messenger-privacy.git
   cd messenger-privacy
   ```

2. **Create icon files** (optional, but recommended)
   ```bash
   cd icons
   chmod +x create-icons.sh
   ./create-icons.sh
   ```
   
   Or manually create three PNG files:
   - `icons/icon16.png` (16x16 pixels)
   - `icons/icon48.png` (48x48 pixels)
   - `icons/icon128.png` (128x128 pixels)

3. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `messenger-privacy` folder
   - The extension should now appear in your extensions list

5. **Pin the extension** (optional)
   - Click the puzzle icon in Chrome toolbar
   - Find "Messenger Privacy Guard"
   - Click the pin icon to keep it visible

## 🚀 Usage

### Basic Usage

1. **Navigate to Messenger.com**
   - Open https://messenger.com in Chrome
   - Log in to your account

2. **The extension works automatically**
   - Names, messages, and avatars will be blurred based on your settings
   - Hover over any blurred element to temporarily reveal it

3. **Customize settings**
   - Click the extension icon in the toolbar
   - Toggle privacy mode on/off
   - Enable/disable blur for specific elements
   - Adjust blur intensity with the slider

## 📋 Requirements

- **Chrome Version**: 88 or higher (Manifest V3 support)
- **Permissions**:
  - `storage`: Save user settings
  - `activeTab`: Interact with active tab
  - Host access to messenger.com

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with details
2. **Suggest Features**: Share your ideas
3. **Submit PRs**: Fork, create a branch, and submit a pull request
4. **Improve Docs**: Help make this README better
5. **Test on Different Platforms**: Share feedback on various OS/browsers

## 📄 License

This project is open source. Feel free to use, modify, and distribute as needed.

## ⚠️ Disclaimer

This extension is for privacy and focus purposes. It modifies the appearance of web pages but does not:
- Access or transmit your personal data
- Modify or delete your messages
- Interact with Messenger's servers
- Bypass any security features

Use responsibly and in accordance with Messenger's Terms of Service.

## 🙏 Acknowledgments

- Built with Chrome Extension Manifest V3
- Icons and UI inspired by modern design principles
- Resilient selector strategies inspired by web scraping best practices

## 📞 Support

For issues, questions, or feature requests:
1. Check the Troubleshooting section
2. Open an issue on the repository
3. Provide detailed information (browser version, OS, steps to reproduce)

---

**Made with ❤️ for privacy-conscious users**
