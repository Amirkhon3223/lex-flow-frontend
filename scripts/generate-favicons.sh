#!/bin/bash

# =============================================================================
# LexFlow Favicon Generation Script
# =============================================================================
#
# This script generates all required favicon files from a source PNG image.
# Source: public/ROUNDED_LEXFLOW_BG.png (512x512)
#
# Prerequisites:
#   - ImageMagick 7.x (brew install imagemagick on macOS)
#   - Source image: 512x512 PNG with transparency
#
# Usage:
#   cd lex-flow-frontend
#   chmod +x scripts/generate-favicons.sh
#   ./scripts/generate-favicons.sh
#
# Alternative: Use https://realfavicongenerator.net for a GUI approach
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SOURCE_IMAGE="public/ROUNDED_LEXFLOW_BG.png"
OUTPUT_DIR="public"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed.${NC}"
    echo ""
    echo "Install ImageMagick:"
    echo "  macOS:   brew install imagemagick"
    echo "  Ubuntu:  sudo apt-get install imagemagick"
    echo "  Windows: choco install imagemagick"
    echo ""
    echo "Or use https://realfavicongenerator.net instead."
    exit 1
fi

# Determine which ImageMagick command to use (v7 uses 'magick', v6 uses 'convert')
if command -v magick &> /dev/null; then
    CONVERT="magick"
    IDENTIFY="magick identify"
else
    CONVERT="convert"
    IDENTIFY="identify"
fi

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo -e "${RED}Error: Source image not found: $SOURCE_IMAGE${NC}"
    echo "Please ensure ROUNDED_LEXFLOW_BG.png exists in the public folder."
    exit 1
fi

echo -e "${GREEN}=== LexFlow Favicon Generator ===${NC}"
echo "Source: $SOURCE_IMAGE"
echo "Output: $OUTPUT_DIR"
echo ""

# Verify source image dimensions
DIMENSIONS=$($IDENTIFY -format "%wx%h" "$SOURCE_IMAGE" 2>/dev/null || echo "unknown")
echo "Source dimensions: $DIMENSIONS"
if [ "$DIMENSIONS" != "512x512" ]; then
    echo -e "${YELLOW}Warning: Source image is not 512x512. Results may vary.${NC}"
fi
echo ""

# Function to generate favicon
generate_favicon() {
    local size=$1
    local output=$2
    local description=$3

    echo -n "Generating $output ($description)... "
    $CONVERT "$SOURCE_IMAGE" -resize ${size}x${size} -quality 100 "$OUTPUT_DIR/$output"
    echo -e "${GREEN}Done${NC}"
}

# =============================================================================
# Generate PNG favicons
# =============================================================================

echo -e "${YELLOW}--- Generating PNG Favicons ---${NC}"

# Standard web favicons
generate_favicon 16 "favicon-16x16.png" "Standard favicon (small)"
generate_favicon 32 "favicon-32x32.png" "Standard favicon (large)"

# Apple Touch Icon (iOS home screen)
generate_favicon 180 "apple-touch-icon.png" "Apple Touch Icon"

# Android Chrome icons (PWA)
generate_favicon 192 "android-chrome-192x192.png" "Android Chrome (small)"
generate_favicon 512 "android-chrome-512x512.png" "Android Chrome (large)"

# Microsoft tiles
echo ""
echo -e "${YELLOW}--- Generating Microsoft Tiles ---${NC}"
generate_favicon 70 "mstile-70x70.png" "MS Tile 70x70"
generate_favicon 144 "mstile-144x144.png" "MS Tile 144x144"
generate_favicon 150 "mstile-150x150.png" "MS Tile 150x150"
generate_favicon 310 "mstile-310x310.png" "MS Tile 310x310"

# Wide tile (310x150) - need to handle aspect ratio
echo -n "Generating mstile-310x150.png (MS Wide Tile)... "
$CONVERT "$SOURCE_IMAGE" -resize 150x150 -gravity center -background transparent -extent 310x150 "$OUTPUT_DIR/mstile-310x150.png"
echo -e "${GREEN}Done${NC}"

# =============================================================================
# Generate favicon.ico (multi-resolution ICO file)
# =============================================================================

echo ""
echo -e "${YELLOW}--- Generating favicon.ico (multi-size) ---${NC}"

echo -n "Creating favicon.ico with 16x16, 32x32, and 48x48 sizes... "

# Create temporary files for each size
$CONVERT "$SOURCE_IMAGE" -resize 16x16 "$OUTPUT_DIR/favicon-16-tmp.png"
$CONVERT "$SOURCE_IMAGE" -resize 32x32 "$OUTPUT_DIR/favicon-32-tmp.png"
$CONVERT "$SOURCE_IMAGE" -resize 48x48 "$OUTPUT_DIR/favicon-48-tmp.png"

# Combine into ICO file
$CONVERT "$OUTPUT_DIR/favicon-16-tmp.png" "$OUTPUT_DIR/favicon-32-tmp.png" "$OUTPUT_DIR/favicon-48-tmp.png" "$OUTPUT_DIR/favicon.ico"

# Clean up temporary files
rm -f "$OUTPUT_DIR/favicon-16-tmp.png" "$OUTPUT_DIR/favicon-32-tmp.png" "$OUTPUT_DIR/favicon-48-tmp.png"

echo -e "${GREEN}Done${NC}"

# =============================================================================
# Generate Safari Pinned Tab (SVG - optional, requires manual conversion)
# =============================================================================

echo ""
echo -e "${YELLOW}--- Safari Pinned Tab SVG ---${NC}"
echo "Note: Safari pinned tab requires a monochrome SVG."
echo "For best results, create safari-pinned-tab.svg manually from your logo."
echo "The SVG should be a single-color silhouette of your icon."

# =============================================================================
# Summary
# =============================================================================

echo ""
echo -e "${GREEN}=== Generation Complete ===${NC}"
echo ""
echo "Generated files:"
echo "  - favicon.ico (16, 32, 48)"
echo "  - favicon-16x16.png"
echo "  - favicon-32x32.png"
echo "  - apple-touch-icon.png (180x180)"
echo "  - android-chrome-192x192.png"
echo "  - android-chrome-512x512.png"
echo "  - mstile-70x70.png"
echo "  - mstile-144x144.png"
echo "  - mstile-150x150.png"
echo "  - mstile-310x310.png"
echo "  - mstile-310x150.png"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify the generated files look correct"
echo "2. Test favicons at https://realfavicongenerator.net/favicon_checker"
echo "3. Clear browser cache to see updated favicons"
echo ""
echo -e "${GREEN}Done!${NC}"
