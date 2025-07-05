// lib/PDFProcessor.js
const fse = require('fs-extra');
const path = require('path');
const TikaWrapper = require('./TikaWrapper');
const PDFBoxWrapper = require('./PDFBoxWrapper');
const HTMLParser = require('./HTMLParser');
const FileManager = require('./FileManager');

/**
 * Main PDF processor class
 */
class PDFProcessor {
    /**
     * Convert PDF to HTML
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options
     * @returns {Promise<string>} HTML content
     */
    static async toHTML(input, options) {
        return FileManager.processInput(input, async (filePath, isBuffer, tempPath) => {
            await this.validateFile(filePath);
            let html = await TikaWrapper.extractHTML(filePath, options);

            // Fix resourceName in metadata for buffer input
            if (isBuffer && tempPath) {
                const tempFileName = path.basename(tempPath);
                html = html.replace(`<meta name="resourceName" content="${tempFileName}"/>`, '<meta name="resourceName" content="sample.pdf"/>');
            }

            return html;
        });
    }

    /**
     * Convert PDF to HTML pages
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options
     * @returns {Promise<Array<string>>} Array of HTML pages
     */
    static async toPages(input, options = {}) {
        return FileManager.processInput(input, async (filePath, isBuffer, tempPath) => {
            await this.validateFile(filePath);
            let htmlContent = await TikaWrapper.extractHTML(filePath, options);

            // Fix resourceName for buffer input
            if (isBuffer && tempPath) {
                const tempFileName = path.basename(tempPath);
                htmlContent = htmlContent.replace(`<meta name="resourceName" content="${tempFileName}"/>`, '<meta name="resourceName" content="sample.pdf"/>');
            }

            return HTMLParser.extractPages(htmlContent, options);
        });
    }

    /**
     * Convert PDF to text
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options
     * @returns {Promise<string>} Text content
     */
    static async toText(input, options) {
        return FileManager.processInput(input, async (filePath) => {
            await this.validateFile(filePath);
            return TikaWrapper.extractText(filePath, options);
        });
    }

    /**
     * Extract metadata from PDF
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Metadata object
     */
    static async extractMetadata(input, options) {
        return FileManager.processInput(input, async (filePath, isBuffer, tempPath) => {
            await this.validateFile(filePath);
            const metadata = await TikaWrapper.extractMetadata(filePath, options);

            // Fix resourceName for buffer input
            if (isBuffer && tempPath) {
                const tempFileName = path.basename(tempPath);
                if (metadata.resourceName === tempFileName) {
                    metadata.resourceName = 'sample.pdf';
                }
            }

            return metadata;
        });
    }

    /**
     * Generate thumbnail from PDF
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options
     * @returns {Promise<string>} Path to generated thumbnail
     */
    static async generateThumbnail(input, options) {
        return FileManager.processInput(input, async (filePath) => {
            await this.validateFile(filePath);
            await FileManager.ensureDirectories();
            return PDFBoxWrapper.generateImage(filePath, options);
        });
    }

    /**
     * Extract images from PDF
     * @param {string|Buffer} input - Path to PDF file or PDF buffer
     * @param {Object} options - Processing options, including output directory
     * @returns {Promise<Array<string>>} Array of paths to extracted images
     */
    static async extractImages(input, options = {}) {
        return FileManager.processInput(input, async (filePath) => {
            await this.validateFile(filePath);
            await FileManager.ensureDirectories();
            return PDFBoxWrapper.extractAllImages(filePath, options);
        });
    }

    /**
     * Validate file existence
     * @private
     */
    static async validateFile(filepath) {
        const exists = await fse.pathExists(filepath);
        if (!exists) {
            throw new Error(`File not found: ${filepath}`);
        }
    }
}

module.exports = PDFProcessor;
