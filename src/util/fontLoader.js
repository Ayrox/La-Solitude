const fs = require('fs');
const path = require('path');

class FontLoader {
    constructor() {
        this.defaultFont = 'Arial'; // Fallback font
        this.loadedFonts = new Map();
    }

    loadFont(fontPath, fontName = 'default') {
        try {
            const fullPath = path.resolve(fontPath);
            
            if (!fs.existsSync(fullPath)) {
                console.log(`[FONT] Font file not found: ${fullPath}`);
                console.log(`[FONT] Using default font: ${this.defaultFont}`);
                return this.defaultFont;
            }

            // Load font logic here
            this.loadedFonts.set(fontName, fullPath);
            console.log(`[FONT] Successfully loaded font: ${fontPath}`);
            return fontPath;
            
        } catch (error) {
            console.error(`[FONT] Error loading font ${fontPath}:`, error.message);
            console.log(`[FONT] Using default font: ${this.defaultFont}`);
            return this.defaultFont;
        }
    }

    getFont(fontName = 'default') {
        return this.loadedFonts.get(fontName) || this.defaultFont;
    }
}

module.exports = FontLoader;
