#!/bin/bash

# Create PNG icons from SVG (requires ImageMagick)
# If you have ImageMagick installed, run this script to generate PNG icons

if command -v convert &> /dev/null; then
    echo "Converting SVG to PNG icons..."
    convert -background none -resize 16x16 icons/icon128.svg icons/icon16.png
    convert -background none -resize 48x48 icons/icon128.svg icons/icon48.png
    convert -background none -resize 128x128 icons/icon128.svg icons/icon128.png
    echo "Icons created successfully!"
else
    echo "ImageMagick not found. Please install it to generate PNG icons."
    echo "Or create icons manually at: icons/icon16.png, icons/icon48.png, icons/icon128.png"
fi
