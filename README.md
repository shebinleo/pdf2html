# pdf2html

[![NPM version](https://img.shields.io/npm/v/pdf2html.svg)](https://www.npmjs.com/package/pdf2html)
[![npm module downloads](http://img.shields.io/npm/dt/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)
[![Build Status](https://travis-ci.org/shebinleo/pdf2html.svg?branch=master)](https://travis-ci.org/shebinleo/pdf2html)
[![view on npm](http://img.shields.io/npm/l/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)


pdf2html helps to convert PDF file to HTML or Text using [Apache Tika](https://tika.apache.org/). This module also helps to generate thumbnail image for PDF file using [Apache PDFBox](https://pdfbox.apache.org/).

### Installation
via yarn:

```
yarn add pdf2html
```

via npm:

```
npm install --save pdf2html
```

**Java runtime environment (JRE) is required to run this module.**

### Usage
```javascript
const pdf2html = require('pdf2html')

pdf2html.html('sample.pdf', (err, html) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(html)
    }
})
```

#### Convert to text
```javascript
pdf2html.text('sample.pdf', (err, text) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(text)
    }
})
```

#### Convert as pages
```javascript
pdf2html.pages('sample.pdf', (err, htmlPages) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(htmlPages)
    }
})
```

```javascript
const options = { text: true }
pdf2html.pages('sample.pdf', options, (err, textPages) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(textPages)
    }
})
```

#### Extra metadata
```javascript
pdf2html.meta('sample.pdf', (err, meta) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(meta)
    }
})
```

#### Generate thumbnail
```javascript
pdf2html.thumbnail('sample.pdf', (err, thumbnailPath) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(thumbnailPath)
    }
})
```

```javascript
const options = { page: 1, imageType: 'png', width: 160, height: 226 }
pdf2html.thumbnail('sample.pdf', options, (err, thumbnailPath) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(thumbnailPath)
    }
})
```

### Manually download dependencies files

Sometimes downloading the dependencies might be too slow or unable to download in a HTTP proxy environment. Follow the step below to skip the dependency downloads.

```bash
cd node_modules/pdf2html/vendor
# These URLs come from https://github.com/shebinleo/pdf2html/blob/master/postinstall.js#L6-L7
wget https://archive.apache.org/dist/pdfbox/2.0.26/pdfbox-app-2.0.26.jar
wget https://archive.apache.org/dist/tika/2.4.0/tika-app-2.4.0.jar
```
