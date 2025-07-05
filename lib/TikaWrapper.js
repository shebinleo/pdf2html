// lib/TikaWrapper.js
const debug = require('debug')('pdf2html');
const path = require('path');
const CommandExecutor = require('./CommandExecutor');
const { DEFAULT_OPTIONS } = require('./config');
const constants = require('../constants');
const FileManager = require('./FileManager');

/**
 * Apache Tika wrapper for content extraction
 */
class TikaWrapper {
    static async extract(filepath, format, options = {}) {
        return FileManager.withTempFile(filepath, constants.DIRECTORY.PDF, async (tempFilePath) => {
            const args = ['-jar', path.join(constants.DIRECTORY.VENDOR, constants.VENDOR_TIKA_JAR), `--${format}`, tempFilePath];

            const maxBuffer = options.maxBuffer || DEFAULT_OPTIONS.command.maxBuffer;
            return CommandExecutor.execute('java', args, { maxBuffer });
        });
    }

    static async extractHTML(filepath, options) {
        debug('Converting PDF to HTML');
        return this.extract(filepath, 'html', options);
    }

    static async extractText(filepath, options) {
        debug('Converting PDF to Text');
        return this.extract(filepath, 'text', options);
    }

    static async extractMetadata(filepath, options) {
        debug('Extracting metadata from PDF');
        const jsonString = await this.extract(filepath, 'json', options);
        return JSON.parse(jsonString);
    }
}

module.exports = TikaWrapper;
