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
const pdf2html = require('pdf2html');

const html = await pdf2html.html('sample.pdf');
console.log(html);
```

#### Convert to text

```javascript
const text = await pdf2html.text('sample.pdf');
console.log(text);
```

#### Convert as pages

```javascript
const htmlPages = await pdf2html.pages('sample.pdf');
console.log(htmlPages);
```

```javascript
const options = { text: true };
const textPages = await pdf2html.pages('sample.pdf', options);
console.log(textPages);
```

#### Extra metadata

```javascript
const meta = await pdf2html.meta('sample.pdf');
console.log(meta);
```

#### Generate thumbnail

```javascript
const thumbnailPath = await pdf2html.thumbnail('sample.pdf');
console.log(thumbnailPath);
```

```javascript
const options = { page: 1, imageType: 'png', width: 160, height: 226 };
const thumbnailPath = await pdf2html.thumbnail('sample.pdf', options);
console.log(thumbnailPath);
```

### Manually download dependencies files

Sometimes downloading the dependencies might be too slow or unable to download in a HTTP proxy environment. Follow the step below to skip the dependency downloads.

```bash
cd node_modules/pdf2html/vendor
# These URLs come from https://github.com/shebinleo/pdf2html/blob/master/postinstall.js#L6-L7
wget https://archive.apache.org/dist/pdfbox/2.0.27/pdfbox-app-2.0.27.jar
wget https://archive.apache.org/dist/tika/2.6.0/tika-app-2.6.0.jar
```
