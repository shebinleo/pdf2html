// lib/PDFProcessor.js
const fse = require('fs-extra');
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
     * @param {string} filepath - Path to PDF file
     * @param {Object} options - Processing options
     * @returns {Promise<string>} HTML content
     */
    static async toHTML(filepath, options) {
        await this.validateFile(filepath);
        return TikaWrapper.extractHTML(filepath, options);
    }

    /**
     * Convert PDF to HTML pages
     * @param {string} filepath - Path to PDF file
     * @param {Object} options - Processing options
     * @returns {Promise<Array<string>>} Array of HTML pages
     */
    static async toPages(filepath, options = {}) {
        await this.validateFile(filepath);
        const htmlContent = await this.toHTML(filepath, options);
        return HTMLParser.extractPages(htmlContent, options);
    }

    /**
     * Convert PDF to text
     * @param {string} filepath - Path to PDF file
     * @param {Object} options - Processing options
     * @returns {Promise<string>} Text content
     */
    static async toText(filepath, options) {
        await this.validateFile(filepath);
        return TikaWrapper.extractText(filepath, options);
    }

    /**
     * Extract metadata from PDF
     * @param {string} filepath - Path to PDF file
     * @param {Object} options - Processing options
     * @returns {Promise<Object>} Metadata object
     */
    static async extractMetadata(filepath, options) {
        await this.validateFile(filepath);
        return TikaWrapper.extractMetadata(filepath, options);
    }

    /**
     * Generate thumbnail from PDF
     * @param {string} filepath - Path to PDF file
     * @param {Object} options - Processing options
     * @returns {Promise<string>} Path to generated thumbnail
     */
    static async generateThumbnail(filepath, options) {
        await this.validateFile(filepath);
        await FileManager.ensureDirectories();
        return PDFBoxWrapper.generateImage(filepath, options);
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
