#!/bin/bash

# Messenger Privacy Guard - Setup Script
# This script helps you set up the extension quickly

set -e  # Exit on error

echo "🛡️  Messenger Privacy Guard - Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found!"
    echo "Please run this script from the messenger-privacy directory."
    exit 1
fi

echo "✓ Found manifest.json"
echo ""

# Step 1: Generate icons
echo "📦 Step 1: Generating icons..."
echo ""

cd icons

# Try Python method first
if command -v python3 &> /dev/null; then
    echo "Using Python to generate icons..."
    if python3 create-icons.py; then
        echo "✓ Icons generated with Python!"
    else
        echo "⚠ Python method failed, trying ImageMagick..."
        
        # Try ImageMagick method
        if command -v convert &> /dev/null; then
            echo "Using ImageMagick to generate icons..."
            chmod +x create-icons.sh
            ./create-icons.sh
        else
            echo "❌ Neither Python (Pillow) nor ImageMagick found!"
            echo ""
            echo "Please install one of these:"
            echo "  - Python Pillow: pip install Pillow"
            echo "  - ImageMagick: sudo apt install imagemagick (Linux)"
            echo "                 brew install imagemagick (Mac)"
            echo ""
            echo "Or create icons manually (see QUICKSTART.md)"
            exit 1
        fi
    fi
else
    echo "⚠ Python not found, trying ImageMagick..."
    
    if command -v convert &> /dev/null; then
        echo "Using ImageMagick to generate icons..."
        chmod +x create-icons.sh
        ./create-icons.sh
    else
        echo "❌ Neither Python nor ImageMagick found!"
        echo ""
        echo "Please install one of these:"
        echo "  - Python: sudo apt install python3 python3-pip (Linux)"
        echo "           brew install python3 (Mac)"
        echo "  - ImageMagick: sudo apt install imagemagick (Linux)"
        echo "                 brew install imagemagick (Mac)"
        echo ""
        echo "Or create icons manually (see QUICKSTART.md)"
        exit 1
    fi
fi

cd ..

echo ""
echo "✓ Icons ready!"
echo ""

# Step 2: Verify all files
echo "📋 Step 2: Verifying files..."
echo ""

REQUIRED_FILES=(
    "manifest.json"
    "background.js"
    "content/blur.js"
    "content/styles.css"
    "popup/popup.html"
    "popup/popup.js"
    "popup/popup.css"
)

ALL_GOOD=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file (missing!)"
        ALL_GOOD=false
    fi
done

# Check icons
if [ -f "icons/icon16.png" ] && [ -f "icons/icon48.png" ] && [ -f "icons/icon128.png" ]; then
    echo "  ✓ icons/*.png"
else
    echo "  ⚠ icons/*.png (some missing, but we have SVG)"
fi

echo ""

if [ "$ALL_GOOD" = true ]; then
    echo "✓ All required files present!"
else
    echo "❌ Some files are missing. Please check the project structure."
    exit 1
fi

echo ""
echo "===================================="
echo "✅ Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top-right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this folder: $(pwd)"
echo "5. Go to https://messenger.com and test it!"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: QUICKSTART.md"
echo "  - Full Guide: README.md"
echo "  - Testing: TESTING.md"
echo "  - Architecture: ARCHITECTURE.md"
echo ""
echo "🎉 Happy privacy protection!"
echo ""
