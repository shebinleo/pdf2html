// index.js - Main entry point
const PDFProcessor = require('./lib/PDFProcessor');
const { PDFProcessingError } = require('./lib/errors');
const CommandExecutor = require('./lib/CommandExecutor');
const ImageProcessor = require('./lib/ImageProcessor');
const FileManager = require('./lib/FileManager');
const HTMLParser = require('./lib/HTMLParser');

// Export main functions with backward compatibility
module.exports = {
    // Main API - bind methods to maintain the correct 'this' context
    html: PDFProcessor.toHTML.bind(PDFProcessor),
    pages: PDFProcessor.toPages.bind(PDFProcessor),
    text: PDFProcessor.toText.bind(PDFProcessor),
    meta: PDFProcessor.extractMetadata.bind(PDFProcessor),
    thumbnail: PDFProcessor.generateThumbnail.bind(PDFProcessor),
    extractImages: PDFProcessor.extractImages.bind(PDFProcessor),

    // Export classes for advanced usage
    PDFProcessor,
    PDFProcessingError,

    // Utility exports
    utils: {
        CommandExecutor,
        ImageProcessor,
        FileManager,
        HTMLParser,
    },
};
