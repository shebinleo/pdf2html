// lib/FileManager.js
const debug = require('debug')('pdf2html');
const fse = require('fs-extra');
const path = require('path');
const URI = require('urijs');
const constants = require('../constants');

/**
 * File management utilities
 */
class FileManager {
    static async withTempFile(sourceFile, tempDir, operation) {
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
}

module.exports = FileManager;
