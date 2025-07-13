# pdf2html

[![NPM version](https://img.shields.io/npm/v/pdf2html.svg)](https://www.npmjs.com/package/pdf2html)
[![npm module downloads](https://img.shields.io/npm/dt/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)
[![Build Status](https://travis-ci.org/shebinleo/pdf2html.svg?branch=master)](https://travis-ci.org/shebinleo/pdf2html)
[![License](https://img.shields.io/npm/l/pdf2html.svg)](https://www.npmjs.org/package/pdf2html)
[![Node.js Version](https://img.shields.io/node/v/pdf2html.svg)](https://nodejs.org)

> Convert PDF files to HTML, extract text, generate thumbnails, extract images, and extract metadata using Apache Tika and PDFBox

## 🚀 Features

- **PDF to HTML conversion** - Maintains formatting and structure
- **Text extraction** - Extract plain text content from PDFs
- **Page-by-page processing** - Process PDFs page by page
- **Metadata extraction** - Extract author, title, creation date, and more
- **Thumbnail generation** - Generate preview images from PDF pages
- **Image extraction** - Extract all embedded images from PDFs
- **Buffer support** - Process PDFs from memory buffers or file paths
- **TypeScript support** - Full type definitions included
- **Async/Promise based** - Modern async API
- **Configurable** - Extensive options for customization

## 📋 Prerequisites

- **Node.js** >= 12.0.0
- **Java Runtime Environment (JRE)** >= 8
    - Required for Apache Tika and PDFBox
    - [Download Java](https://www.java.com/en/download/)

## 📦 Installation

### Using npm:

```bash
npm install pdf2html
```

### Using yarn:

```bash
yarn add pdf2html
```

### Using pnpm:

```bash
pnpm add pdf2html
```

The installation process will automatically download the required Apache Tika and PDFBox JAR files. You'll see a progress indicator during the download.

## 🔧 Basic Usage

### Convert PDF to HTML

```javascript
const pdf2html = require('pdf2html');
const fs = require('fs');

// From file path
const html = await pdf2html.html('path/to/document.pdf');
console.log(html);

// From buffer
const pdfBuffer = fs.readFileSync('path/to/document.pdf');
const html = await pdf2html.html(pdfBuffer);
console.log(html);

// With options
const html = await pdf2html.html(pdfBuffer, {
    maxBuffer: 1024 * 1024 * 10, // 10MB buffer
});
```

### Extract Text

```javascript
// From file path
const text = await pdf2html.text('path/to/document.pdf');

// From buffer
const pdfBuffer = fs.readFileSync('path/to/document.pdf');
const text = await pdf2html.text(pdfBuffer);
console.log(text);
```

### Process Pages Individually

```javascript
// From file path
const htmlPages = await pdf2html.pages('path/to/document.pdf');

// From buffer
const pdfBuffer = fs.readFileSync('path/to/document.pdf');
const htmlPages = await pdf2html.pages(pdfBuffer);
htmlPages.forEach((page, index) => {
    console.log(`Page ${index + 1}:`, page);
});

// Get text for each page
const textPages = await pdf2html.pages(pdfBuffer, {
    text: true,
});
```

### Extract Metadata

```javascript
// From file path or buffer
const metadata = await pdf2html.meta(pdfBuffer);
console.log(metadata);
// Output: {
//   title: 'Document Title',
//   author: 'John Doe',
//   subject: 'Document Subject',
//   keywords: 'pdf, conversion',
//   creator: 'Microsoft Word',
//   producer: 'Adobe PDF Library',
//   creationDate: '2023-01-01T00:00:00Z',
//   modificationDate: '2023-01-02T00:00:00Z',
//   pages: 10
// }
```

### Generate Thumbnails

```javascript
// From file path
const thumbnailPath = await pdf2html.thumbnail('path/to/document.pdf');

// From buffer
const pdfBuffer = fs.readFileSync('path/to/document.pdf');
const thumbnailPath = await pdf2html.thumbnail(pdfBuffer);
console.log('Thumbnail saved to:', thumbnailPath);

// Custom thumbnail options
const thumbnailPath = await pdf2html.thumbnail(pdfBuffer, {
    page: 1, // Page number (default: 1)
    imageType: 'png', // 'png' or 'jpg' (default: 'png')
    width: 300, // Width in pixels (default: 160)
    height: 400, // Height in pixels (default: 226)
});
```

### Extract Images

```javascript
// From file path
const imagePaths = await pdf2html.extractImages('path/to/document.pdf');
console.log('Extracted images:', imagePaths);
// Output: ['/absolute/path/to/files/image/document1.jpg', '/absolute/path/to/files/image/document2.png', ...]

// From buffer
const pdfBuffer = fs.readFileSync('path/to/document.pdf');
const imagePaths = await pdf2html.extractImages(pdfBuffer);

// With custom output directory
const imagePaths = await pdf2html.extractImages(pdfBuffer, {
    outputDirectory: './extracted-images', // Custom output directory
});

// With custom buffer size for large PDFs
const imagePaths = await pdf2html.extractImages('large-document.pdf', {
    outputDirectory: './output',
    maxBuffer: 1024 * 1024 * 10, // 10MB buffer
});
```

## 💻 TypeScript Support

This package includes TypeScript type definitions out of the box. No need to install `@types/pdf2html`.

### Basic TypeScript Usage

```typescript
import * as pdf2html from 'pdf2html';
// or
import { html, text, pages, meta, thumbnail, extractImages, PDFMetadata, PDFProcessingError } from 'pdf2html';

async function convertPDF() {
    try {
        // All methods accept string paths or Buffers
        const htmlContent: string = await pdf2html.html('document.pdf');
        const textContent: string = await pdf2html.text(Buffer.from(pdfData));

        // Full type safety for options
        const thumbnailPath = await pdf2html.thumbnail('document.pdf', {
            page: 1, // number
            imageType: 'png', // 'png' | 'jpg'
            width: 300, // number
            height: 400, // number
        });

        // TypeScript knows the shape of metadata
        const metadata: PDFMetadata = await pdf2html.meta('document.pdf');
        console.log(metadata['pdf:producer']); // string | undefined
        console.log(metadata.resourceName); // string | undefined
    } catch (error) {
        if (error instanceof pdf2html.PDFProcessingError) {
            console.error('PDF processing failed:', error.message);
            console.error('Exit code:', error.exitCode);
        }
    }
}
```

### Type Definitions

```typescript
// Input types - all methods accept either file paths or Buffers
type PDFInput = string | Buffer;

// Options interfaces
interface ProcessingOptions {
    maxBuffer?: number; // Maximum buffer size in bytes
}

interface PageOptions extends ProcessingOptions {
    text?: boolean; // Extract text instead of HTML
}

interface ThumbnailOptions extends ProcessingOptions {
    page?: number; // Page number (default: 1)
    imageType?: 'png' | 'jpg'; // Image format (default: 'png')
    width?: number; // Width in pixels (default: 160)
    height?: number; // Height in pixels (default: 226)
}

// Metadata structure with common fields
interface PDFMetadata {
    'pdf:PDFVersion'?: string;
    'pdf:producer'?: string;
    'xmp:CreatorTool'?: string;
    'dc:title'?: string;
    'dc:creator'?: string;
    resourceName?: string;
    [key: string]: any; // Allows additional properties
}

// Error class
class PDFProcessingError extends Error {
    command?: string; // The command that failed
    exitCode?: number; // The process exit code
}
```

### IntelliSense Support

Full IntelliSense support in VS Code and other TypeScript-aware editors:

- Auto-completion for all methods and options
- Inline documentation on hover
- Type checking at compile time
- Catch errors before runtime

### Advanced TypeScript Usage

```typescript
import { PDFProcessor, utils } from 'pdf2html';

// Using the PDFProcessor class directly
const html = await PDFProcessor.toHTML('document.pdf');

// Using utility classes
const { FileManager, HTMLParser } = utils;
await FileManager.ensureDirectories();

// Type guards
function isPDFProcessingError(error: unknown): error is pdf2html.PDFProcessingError {
    return error instanceof pdf2html.PDFProcessingError;
}

// Generic helper with proper typing
async function processPDFSafely<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (isPDFProcessingError(error)) {
            console.error(`PDF operation failed: ${error.message}`);
        }
        return fallback;
    }
}

// Usage
const pages = await processPDFSafely(
    () => pdf2html.pages('document.pdf', { text: true }),
    [] // fallback to empty array
);
```

## ⚙️ Advanced Configuration

### Buffer Size Configuration

By default, the maximum buffer size is 2MB. For large PDFs, you may need to increase this:

```javascript
const options = {
    maxBuffer: 1024 * 1024 * 50, // 50MB buffer
};

// Apply to any method
await pdf2html.html('large-file.pdf', options);
await pdf2html.text('large-file.pdf', options);
await pdf2html.pages('large-file.pdf', options);
await pdf2html.meta('large-file.pdf', options);
await pdf2html.thumbnail('large-file.pdf', options);
```

### Error Handling

Always wrap your calls in try-catch blocks for proper error handling:

```javascript
try {
    const html = await pdf2html.html('document.pdf');
    // Process HTML
} catch (error) {
    if (error.code === 'ENOENT') {
        console.error('PDF file not found');
    } else if (error.message.includes('Java')) {
        console.error('Java is not installed or not in PATH');
    } else {
        console.error('PDF processing failed:', error.message);
    }
}
```

## 🏗️ API Reference

### `pdf2html.html(input, [options])`

Converts PDF to HTML format.

- **input** `string | Buffer` - Path to the PDF file or PDF buffer
- **options** `object` (optional)
    - `maxBuffer` `number` - Maximum buffer size in bytes (default: 2MB)
- **Returns:** `Promise<string>` - HTML content

### `pdf2html.text(input, [options])`

Extracts text from PDF.

- **input** `string | Buffer` - Path to the PDF file or PDF buffer
- **options** `object` (optional)
    - `maxBuffer` `number` - Maximum buffer size in bytes
- **Returns:** `Promise<string>` - Extracted text

### `pdf2html.pages(input, [options])`

Processes PDF page by page.

- **input** `string | Buffer` - Path to the PDF file or PDF buffer
- **options** `object` (optional)
    - `text` `boolean` - Extract text instead of HTML (default: false)
    - `maxBuffer` `number` - Maximum buffer size in bytes
- **Returns:** `Promise<string[]>` - Array of HTML or text strings

### `pdf2html.meta(input, [options])`

Extracts PDF metadata.

- **input** `string | Buffer` - Path to the PDF file or PDF buffer
- **options** `object` (optional)
    - `maxBuffer` `number` - Maximum buffer size in bytes
- **Returns:** `Promise<object>` - Metadata object

### `pdf2html.thumbnail(input, [options])`

Generates a thumbnail image from PDF.

- **input** `string | Buffer` - Path to the PDF file or PDF buffer
- **options** `object` (optional)
    - `page` `number` - Page to thumbnail (default: 1)
    - `imageType` `string` - 'png' or 'jpg' (default: 'png')
    - `width` `number` - Thumbnail width (default: 160)
    - `height` `number` - Thumbnail height (default: 226)
    - `maxBuffer` `number` - Maximum buffer size in bytes
- **Returns:** `Promise<string>` - Path to generated thumbnail

## 🔧 Manual Dependency Installation

If automatic download fails (e.g., due to network restrictions), you can manually download the dependencies:

1. Create the vendor directory:

    ```bash
    mkdir -p node_modules/pdf2html/vendor
    ```

2. Download the required JAR files:

    ```bash
    cd node_modules/pdf2html/vendor

    # Download Apache PDFBox
    wget https://archive.apache.org/dist/pdfbox/2.0.34/pdfbox-app-2.0.34.jar

    # Download Apache Tika
    wget https://archive.apache.org/dist/tika/3.2.0/tika-app-3.2.0.jar
    ```

3. Verify the files are in place:
    ```bash
    ls -la node_modules/pdf2html/vendor/
    # Should show both JAR files
    ```

## 🐛 Troubleshooting

### Common Issues

1. **"Java is not installed"**
    - Install Java JRE 8 or higher
    - Ensure `java` is in your system PATH
    - Verify with: `java -version`

2. **"File not found" errors**
    - Check that the PDF path is correct
    - Use absolute paths for better reliability
    - Ensure the file has read permissions

3. **"Buffer size exceeded"**
    - Increase maxBuffer option
    - Process large PDFs page by page
    - Consider splitting very large PDFs

4. **"Download failed during installation"**
    - Check internet connection
    - Try manual installation (see above)
    - Check proxy settings if behind firewall

### Debug Mode

Enable debug output for troubleshooting:

```bash
DEBUG=pdf2html node your-script.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Apache Tika](https://tika.apache.org/) - Content analysis toolkit
- [Apache PDFBox](https://pdfbox.apache.org/) - PDF manipulation library

## 📊 Dependencies

- **Production**: Apache Tika 3.2.0, Apache PDFBox 2.0.34
- **Development**: See package.json for development dependencies

---

Made with ❤️ by the pdf2html community
