#!/usr/bin/env node

/**
 * Simple type validation script
 * This validates that TypeScript can compile code using our type definitions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a temporary TypeScript file that uses all our types
const testContent = `
import * as pdf2html from 'pdf2html';

async function test() {
  // Test all functions with both string and Buffer
  await pdf2html.html('test.pdf');
  await pdf2html.html(Buffer.from('test'));

  await pdf2html.text('test.pdf');
  await pdf2html.text(Buffer.from('test'));

  await pdf2html.pages('test.pdf');
  await pdf2html.pages(Buffer.from('test'));

  await pdf2html.meta('test.pdf');
  await pdf2html.meta(Buffer.from('test'));

  await pdf2html.thumbnail('test.pdf');
  await pdf2html.thumbnail(Buffer.from('test'));

  // Test with options
  await pdf2html.html('test.pdf', { maxBuffer: 1000 });
  await pdf2html.pages('test.pdf', { text: true });
  await pdf2html.thumbnail('test.pdf', {
    page: 1,
    imageType: 'png',
    width: 200,
    height: 300
  });

  // Test types
  const meta: pdf2html.PDFMetadata = await pdf2html.meta('test.pdf');
  const error: pdf2html.PDFProcessingError = new pdf2html.PDFProcessingError('test');

  // Test classes
  await pdf2html.PDFProcessor.toHTML('test.pdf');
  const utils: typeof pdf2html.utils = pdf2html.utils;
}

console.log('Types are valid!');
`;

// Create a temporary tsconfig that knows about our module
const tsconfigContent = {
    "compilerOptions": {
        "noEmit": true,
        "esModuleInterop": true,
        "target": "ES2018",
        "module": "commonjs",
        "lib": ["ES2018"],
        "types": ["node"],
        "baseUrl": ".",
        "paths": {
            "pdf2html": ["./index.d.ts"]
        }
    },
    "include": ["temp-type-test.ts"]
};

const tempFile = path.join(__dirname, 'temp-type-test.ts');
const tempTsConfig = path.join(__dirname, 'temp-tsconfig.json');

try {
    // Write test file
    fs.writeFileSync(tempFile, testContent);
    fs.writeFileSync(tempTsConfig, JSON.stringify(tsconfigContent, null, 2));

    console.log('Validating TypeScript types...');

    // Try to compile it
    execSync(`tsc --project ${tempTsConfig}`, {
        stdio: 'inherit'
    });

    console.log('✅ TypeScript types are valid!');
    process.exit(0);
} catch (error) {
    console.error('❌ TypeScript type validation failed!');
    process.exit(1);
} finally {
    // Clean up
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
    if (fs.existsSync(tempTsConfig)) {
        fs.unlinkSync(tempTsConfig);
    }
}
