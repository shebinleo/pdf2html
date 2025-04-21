const path = require('path');

module.exports = {
    VENDOR_PDF_BOX_JAR: 'pdfbox-app-2.0.33.jar',
    VENDOR_TIKA_JAR: 'tika-app-3.1.0.jar',

    DIRECTORY: {
        PDF: path.join(__dirname, './files/pdf/'),
        IMAGE: path.join(__dirname, './files/image/'),
        VENDOR: path.join(__dirname, './vendor/'),
    },
};
