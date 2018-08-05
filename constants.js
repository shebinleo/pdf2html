const path = require('path')

module.exports = {

  VENDOR_PDF_BOX_JAR: 'pdfbox-app-2.0.2.jar',
  VENDOR_TIKA_JAR: 'tika-app-1.13.jar',

  DIRECTORY: {
    PDF: path.join(__dirname, './files/pdf/'),
    IMAGE: path.join(__dirname, './files/image/'),
    VENDOR: path.join(__dirname, './vendor/')
  }

}
