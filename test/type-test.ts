import { expectType, expectAssignable } from 'tsd';
import * as pdf2html from 'pdf2html';

// Test basic function return types
expectType<Promise<string>>(pdf2html.html('test.pdf'));
expectType<Promise<string>>(pdf2html.html(Buffer.from('test')));
expectType<Promise<string>>(pdf2html.text('test.pdf'));
expectType<Promise<string[]>>(pdf2html.pages('test.pdf'));
expectType<Promise<pdf2html.PDFMetadata>>(pdf2html.meta('test.pdf'));
expectType<Promise<string>>(pdf2html.thumbnail('test.pdf'));

// Test with options
expectType<Promise<string>>(pdf2html.html('test.pdf', { maxBuffer: 1000 }));
expectType<Promise<string[]>>(pdf2html.pages('test.pdf', { text: true }));
expectType<Promise<string>>(
    pdf2html.thumbnail('test.pdf', {
        page: 1,
        imageType: 'png',
        width: 200,
        height: 300,
    })
);

// Test invalid inputs should produce errors
// @ts-expect-error
pdf2html.html(123);

pdf2html.html(null);

// @ts-expect-error
pdf2html.html({});

// Test options assignability
expectAssignable<pdf2html.ProcessingOptions>({});
expectAssignable<pdf2html.ProcessingOptions>({ maxBuffer: 1000 });

expectAssignable<pdf2html.PageOptions>({ text: true });
expectAssignable<pdf2html.PageOptions>({ text: false, maxBuffer: 1000 });

expectAssignable<pdf2html.ThumbnailOptions>({ page: 1 });
expectAssignable<pdf2html.ThumbnailOptions>({ imageType: 'png' });
expectAssignable<pdf2html.ThumbnailOptions>({ imageType: 'jpg' });

// Test invalid imageType
// @ts-expect-error
const invalidThumbOptions: pdf2html.ThumbnailOptions = { imageType: 'gif' };

// Test PDFProcessingError
const error = new pdf2html.PDFProcessingError('test', 'command', 1);
expectType<string>(error.message);
expectType<string | undefined>(error.command);
expectType<number | undefined>(error.exitCode);

// Test PDFProcessor class
expectType<Promise<string>>(pdf2html.PDFProcessor.toHTML('test.pdf'));
expectType<Promise<string[]>>(pdf2html.PDFProcessor.toPages('test.pdf'));
expectType<Promise<string>>(pdf2html.PDFProcessor.toText('test.pdf'));
expectType<Promise<pdf2html.PDFMetadata>>(pdf2html.PDFProcessor.extractMetadata('test.pdf'));
expectType<Promise<string>>(pdf2html.PDFProcessor.generateThumbnail('test.pdf'));

// Test utility classes exist
expectType<typeof pdf2html.utils.CommandExecutor>(pdf2html.utils.CommandExecutor);
expectType<typeof pdf2html.utils.ImageProcessor>(pdf2html.utils.ImageProcessor);
expectType<typeof pdf2html.utils.FileManager>(pdf2html.utils.FileManager);
expectType<typeof pdf2html.utils.HTMLParser>(pdf2html.utils.HTMLParser);

// Test PDFInput type
const stringInput: pdf2html.PDFInput = 'test.pdf';
const bufferInput: pdf2html.PDFInput = Buffer.from('test');

// Test metadata structure
async function testMetadata() {
    const meta = await pdf2html.meta('test.pdf');
    expectType<string | undefined>(meta['pdf:PDFVersion']);
    expectType<string | undefined>(meta.resourceName);
    expectType<any>(meta.customProperty); // Should allow any property
}
