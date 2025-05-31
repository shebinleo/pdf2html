// lib/ImageProcessor.js
const gm = require('gm').subClass({ imageMagick: true });

/**
 * Image processing utilities
 */
class ImageProcessor {
    static async resize(sourceFilepath, targetFilepath, options) {
        return new Promise((resolve, reject) => {
            gm(sourceFilepath)
                .resize(options.width, options.height, '!')
                .write(targetFilepath, (err) => {
                    if (err) {
                        reject(new Error(`Image resize failed: ${err.message}`));
                        return;
                    }
                    resolve();
                });
        });
    }
}

module.exports = ImageProcessor;
