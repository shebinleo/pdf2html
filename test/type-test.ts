
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
