const https = require('https');
const fs = require('fs');
const constants = require('./constants');

const dependencies = {
    [constants.VENDOR_PDF_BOX_JAR]: 'https://archive.apache.org/dist/pdfbox/2.0.33/pdfbox-app-2.0.33.jar',
    [constants.VENDOR_TIKA_JAR]: 'https://archive.apache.org/dist/tika/3.1.0/tika-app-3.1.0.jar',
};

const download = (filename) => {
    const filePath = constants.DIRECTORY.VENDOR + filename;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`Started downloading dependency ${filename}.`);
            const request = https.get(dependencies[filename], (response) => {
                if (response.statusCode === 200) {
                    const fileStream = fs.createWriteStream(filePath);
                    response.pipe(fileStream);
                    fileStream.addListener('finish', () => {
                        console.log(`Finished downloading dependency ${filename}.`);
                    });
                } else {
                    throw new Error(`Failed downloading dependency ${filename}.`);
                }
            });
            request.on('error', () => {
                throw new Error(`Failed downloading dependency ${filename}.`);
            });
        }
    });
};

const filenames = Object.keys(dependencies);
filenames.forEach((filename) => {
    download(filename);
});
