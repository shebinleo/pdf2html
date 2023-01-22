const debug = require('debug')('pdf2html');
const cheerio = require('cheerio');
const URI = require('urijs');
const fse = require('fs-extra');
const defaults = require('lodash.defaults');
const gm = require('gm').subClass({ imageMagick: true });
const { spawn } = require('child_process');
const constants = require('./constants');

const executeCommand = async (command, args, options = {}) => {
    const child = spawn(command, args, { ...options });
    return new Promise((resolve, reject) => {
        debug(`Executing command: ${command} ${args.join(' ')} with options: ${JSON.stringify(options)}`);

        let stdout = '';
        // let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        // child.stderr.on('data', function(data) {
        //   stderr += data.toString();
        // });

        child.on('close', (code, signal) => {
            if (code !== 0) {
                reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code} with signal ${signal}. Please check your console.`));
                return;
            }

            // if (stderr && stderr.length > 0) {
            //   reject(new Error(stderr));
            //   return;
            // }

            resolve(stdout);
        });
    });
};

const resizeImage = (sourceFilepath, targetFilepath, options) =>
    new Promise((resolve, reject) => {
        gm(sourceFilepath)
            .resize(options.width, options.height, '!') // use the '!' flag to ignore aspect ratio
            .write(targetFilepath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
    });

const runPDFBox = async (filepath, _options) => {
    const options = defaults(_options || {}, { page: 1, imageType: 'png', width: 160, height: 226 });
    const uri = new URI(filepath);

    const copyFilePath = constants.DIRECTORY.PDF + uri.filename();
    await fse.copy(filepath, copyFilePath);

    const maxBuffer = options.maxBuffer || 1024 * 2000;
    const command = 'java';
    const commandArgs = ['-jar', `${constants.DIRECTORY.VENDOR + constants.VENDOR_PDF_BOX_JAR}`, 'PDFToImage', '-imageType', options.imageType, '-startPage', options.page, '-endPage', options.page, copyFilePath];
    await executeCommand(command, commandArgs, { maxBuffer });

    uri.suffix(options.imageType);

    const pdfBoxImageFilePath = constants.DIRECTORY.PDF + uri.filename().replace(new RegExp(`.${uri.suffix()}$`), `${options.page}.${uri.suffix()}`);
    const imageFilePath = constants.DIRECTORY.IMAGE + uri.filename();

    // Resize image
    try {
        await resizeImage(pdfBoxImageFilePath, imageFilePath, options);
    } catch (err) {
        await fse.copy(pdfBoxImageFilePath, imageFilePath);
    } finally {
        // delete temp pdf file copied
        await fse.remove(copyFilePath);
        // delete temp image file created by PdfBox
        await fse.remove(pdfBoxImageFilePath);
    }

    return imageFilePath;
};

const runTika = async (filepath, _commandOption, options) => {
    const maxBuffer = (options && options.maxBuffer) || 1024 * 2000;
    const commandOption = _commandOption || 'html';
    const command = 'java';
    const commandArgs = ['-jar', `${constants.DIRECTORY.VENDOR + constants.VENDOR_TIKA_JAR}`, `--${commandOption}`, filepath];
    return executeCommand(command, commandArgs, { maxBuffer });
};

const html = async (filepath, options) => {
    debug('Converts PDF to HTML');
    return runTika(filepath, 'html', options);
};

const pages = async (filepath, _options) => {
    const options = defaults(_options || {}, { text: false });

    debug('Converts PDF to HTML pages');
    const result = await html(filepath, options);
    const $ = cheerio.load(result);
    const htmlPages = [];
    const $pages = $('.page');
    $pages.each((index) => {
        const $page = $pages.eq(index);
        htmlPages.push(options.text ? $page.text().trim() : $page.html());
    });
    return htmlPages;
};

const text = async (filepath, options) => {
    debug('Converts PDF to Text');
    return runTika(filepath, 'text', options);
};

const meta = async (filepath, options) => {
    debug('Extracts meta information from PDF');
    return JSON.parse(await runTika(filepath, 'json', options));
};

const thumbnail = async (filepath, options) => {
    debug('Generate thumbnail image for PDF');
    return runPDFBox(filepath, options);
};

exports.html = html;
exports.pages = pages;
exports.text = text;
exports.meta = meta;
exports.thumbnail = thumbnail;
