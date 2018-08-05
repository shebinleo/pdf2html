# pdf2html

[![NPM version](https://img.shields.io/npm/v/pdf2html.svg)](https://www.npmjs.com/package/pdf2html)
[![npm module downloads](http://img.shields.io/npm/dt/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)
[![view on npm](http://img.shields.io/npm/l/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)


pdf2html helps to convert PDF file to HTML pages using [Apache Tika](https://tika.apache.org/). This module also helps to generate thumbnail image for PDF file using [Apache PDFBox](https://pdfbox.apache.org/).

### Installation
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
const pdf2html = require('pdf2html')

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
const pdf2html = require('pdf2html')

pdf2html.pages('sample.pdf', { text: true }, (err, pages) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(pages)
    }
})
```

#### Extra metadata
```javascript
const pdf2html = require('pdf2html')

pdf2html.meta('sample.pdf', (err, meta) => {
    if (err) {
        console.error('Conversion error: ' + err)
    } else {
        console.log(meta)
    }
})
```
