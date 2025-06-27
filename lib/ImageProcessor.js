// lib/ImageProcessor.js
const sharp = require('sharp');

/**
 * Image processing utilities
 */
class ImageProcessor {
    static async resize(sourceFilepath, targetFilepath, options) {
        try {
            await sharp(sourceFilepath)
                .resize(options.width, options.height, {
                    fit: 'fill', // equivalent to gm's '!' option for exact dimensions
                })
                .toFile(targetFilepath);
        } catch (err) {
            throw new Error(`Image resize failed: ${err.message}`);
        }
    }
}

module.exports = ImageProcessor;
