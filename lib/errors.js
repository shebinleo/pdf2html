// lib/errors.js
/**
 * Custom error class for PDF processing errors
 */
class PDFProcessingError extends Error {
    constructor(message, command, exitCode) {
        super(message);
        this.name = 'PDFProcessingError';
        this.command = command;
        this.exitCode = exitCode;
    }
}

module.exports = { PDFProcessingError };
