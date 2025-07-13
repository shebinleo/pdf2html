// lib/PDFBoxWrapper.js
const debug = require('debug')('pdf2html');
const path = require('path');
const fse = require('fs-extra');
const defaults = require('lodash.defaults');

const CommandExecutor = require('./CommandExecutor');
const ImageProcessor = require('./ImageProcessor');
const FileManager = require('./FileManager');
const constants = require('../constants');
const { DEFAULT_OPTIONS } = require('./config');

/**
 * PDFBox wrapper for image generation
 */
class PDFBoxWrapper {
    static async generateImage(filepath, options) {
        const opts = defaults(options, DEFAULT_OPTIONS.thumbnail);

        return FileManager.withTempFile(filepath, constants.DIRECTORY.PDF, async (tempFilePath, tempUri) => {
            // Generate image using PDFBox
            await this.executePDFBox(tempFilePath, opts);

            // Determine file paths
            const pdfBoxImagePath = this.getPDFBoxImagePath(tempFilePath, opts);
            const finalImagePath = path.join(constants.DIRECTORY.IMAGE, tempUri.filename().replace(tempUri.suffix(), opts.imageType));

            // Process the generated image
            await this.processGeneratedImage(pdfBoxImagePath, finalImagePath, opts);

            return finalImagePath;
        });
    }

    static async executePDFBox(filepath, options) {
        const args = ['-jar', path.join(constants.DIRECTORY.VENDOR, constants.VENDOR_PDF_BOX_JAR), 'PDFToImage', '-imageType', options.imageType, '-startPage', options.page.toString(), '-endPage', options.page.toString(), filepath];

        await CommandExecutor.execute('java', args, {
            maxBuffer: options.maxBuffer || DEFAULT_OPTIONS.command.maxBuffer,
        });
    }

    static getPDFBoxImagePath(filepath, options) {
        const dir = path.dirname(filepath);
        const basename = path.basename(filepath, path.extname(filepath));
        return path.join(dir, `${basename}${options.page}.${options.imageType}`);
    }

    static async processGeneratedImage(sourcePath, targetPath, options) {
        try {
            await ImageProcessor.resize(sourcePath, targetPath, options);
        } catch (err) {
            debug(`Resize failed, copying original: ${err.message}`);
            await fse.copy(sourcePath, targetPath);
        } finally {
            await fse.remove(sourcePath).catch((err) => debug(`Failed to remove PDFBox image: ${err.message}`));
        }
    }

    static async extractAllImages(filepath, options = {}) {
        const outputDirectory = options.outputDirectory || constants.DIRECTORY.IMAGE;
        await fse.ensureDir(outputDirectory);

        const pdfFileName = path.basename(filepath, path.extname(filepath));
        const prefix = path.join(outputDirectory, pdfFileName);

        const args = [
            '-jar',
            path.join(constants.DIRECTORY.VENDOR, constants.VENDOR_PDF_BOX_JAR),
            'ExtractImages',
            '-prefix',
            prefix,
            filepath,
        ];

        await CommandExecutor.execute('java', args, {
            maxBuffer: options.maxBuffer || DEFAULT_OPTIONS.command.maxBuffer,
        });

        const extractedImages = await fse.readdir(outputDirectory);

        return extractedImages
            .filter((file) => file.startsWith(pdfFileName) && (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.bmp') || file.endsWith('.jpeg')))
            .map((file) => path.join(outputDirectory, file));
    }
}

module.exports = PDFBoxWrapper;
