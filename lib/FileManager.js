// lib/FileManager.js
const debug = require('debug')('pdf2html');
const fse = require('fs-extra');
const path = require('path');
const URI = require('urijs');
const crypto = require('crypto');
const constants = require('../constants');

/**
 * File management utilities
 */
class FileManager {
    static async withTempFile(sourceFile, tempDir, operation) {
        // If a source file is already in the temp directory, don't copy it
        if (sourceFile.includes(tempDir)) {
            const uri = new URI(sourceFile);
            return operation(sourceFile, uri);
        }

        const uri = new URI(sourceFile);
        const tempFilePath = path.join(tempDir, uri.filename());

        try {
            await fse.copy(sourceFile, tempFilePath);
            return await operation(tempFilePath, uri);
        } finally {
            await fse.remove(tempFilePath).catch((err) => debug(`Failed to remove temp file ${tempFilePath}: ${err.message}`));
        }
    }

    static async ensureDirectories() {
        const dirs = Object.values(constants.DIRECTORY);
        await Promise.all(dirs.map((dir) => fse.ensureDir(dir)));
    }

    /**
     * Creates a temporary file from a buffer
     * @param {Buffer} buffer - The buffer to write
     * @param {string} extension - File extension (e.g., '.pdf')
     * @returns {Promise<string>} - Path to the temporary file
     */
    static async createTempFileFromBuffer(buffer, extension = '.pdf') {
        await this.ensureDirectories();

        // Generate unique filename using hash of buffer content
        const timestamp = Date.now();
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const tempFileName = `temp_${timestamp}_${randomBytes}${extension}`;
        const tempFilePath = path.join(constants.DIRECTORY.PDF, tempFileName);

        await fse.writeFile(tempFilePath, buffer);
        return tempFilePath;
    }

    /**
     * Processes input that can be either a file path or buffer
     * @param {string|Buffer} input - File path or buffer
     * @param {Function} processor - Function to process the file path
     * @returns {Promise<*>} - Result from processor
     */
    static async processInput(input, processor) {
        // Validate input
        if (input === null || input === undefined) {
            throw new Error('Input cannot be null or undefined');
        }

        if (typeof input === 'string') {
            if (input.trim() === '') {
                throw new Error('File path cannot be empty');
            }
        } else if (!Buffer.isBuffer(input)) {
            throw new Error('Input must be a file path (string) or Buffer');
        }

        const isBuffer = Buffer.isBuffer(input);
        let filePath = input;
        let tempFilePath = null;

        try {
            if (isBuffer) {
                tempFilePath = await this.createTempFileFromBuffer(input, '.pdf');
                filePath = tempFilePath;
            }

            return await processor(filePath, isBuffer, tempFilePath);
        } finally {
            if (tempFilePath) {
                await fse.remove(tempFilePath).catch((err) => debug(`Failed to remove temp file ${tempFilePath}: ${err.message}`));
            }
        }
    }
}

module.exports = FileManager;
