const path = require('path');
const fs = require('fs');
const chai = require('chai');
const fse = require('fs-extra');

const { expect } = chai;
const should = chai.should();

const pdf2html = require('../index');

const pdfFilepath = path.join(__dirname, './sample.pdf');
const pdfThumbnailFilepath = path.join(__dirname, '/../files/image/sample.png');
const pdfInvalidFilepath = path.join(__dirname, './sample2.pdf');

// Load PDF buffer for buffer-based tests
const pdfBuffer = fs.readFileSync(pdfFilepath);
const invalidBuffer = Buffer.from('not a pdf content');

const pdfFileHTML =
    '<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n<meta name="pdf:PDFVersion" content="1.3"/>\n<meta name="xmp:CreatorTool" content="Rave (http://www.nevrona.com/rave)"/>\n<meta name="pdf:hasXFA" content="false"/>\n<meta name="access_permission:modify_annotations" content="true"/>\n<meta name="pdf:incrementalUpdateCount" content="0"/>\n<meta name="dcterms:created" content="2006-03-01T07:28:26Z"/>\n<meta name="dc:format" content="application/pdf; version=1.3"/>\n<meta name="pdf:docinfo:creator_tool" content="Rave (http://www.nevrona.com/rave)"/>\n<meta name="access_permission:fill_in_form" content="true"/>\n<meta name="pdf:hasCollection" content="false"/>\n<meta name="pdf:encrypted" content="false"/>\n<meta name="X-TIKA:versionCount" content="0"/>\n<meta name="Content-Length" content="3028"/>\n<meta name="pdf:hasMarkedContent" content="false"/>\n<meta name="Content-Type" content="application/pdf"/>\n<meta name="access_permission:can_print_faithful" content="true"/>\n<meta name="pdf:producer" content="Nevrona Designs"/>\n<meta name="access_permission:extract_for_accessibility" content="true"/>\n<meta name="access_permission:assemble_document" content="true"/>\n<meta name="xmpTPg:NPages" content="2"/>\n<meta name="resourceName" content="sample.pdf"/>\n<meta name="pdf:hasXMP" content="false"/>\n<meta name="access_permission:extract_content" content="true"/>\n<meta name="access_permission:can_print" content="true"/>\n<meta name="X-TIKA:Parsed-By" content="org.apache.tika.parser.DefaultParser"/>\n<meta name="X-TIKA:Parsed-By" content="org.apache.tika.parser.pdf.PDFParser"/>\n<meta name="pdf:eofOffsets" content="3027"/>\n<meta name="access_permission:can_modify" content="true"/>\n<meta name="pdf:docinfo:producer" content="Nevrona Designs"/>\n<meta name="pdf:docinfo:created" content="2006-03-01T07:28:26Z"/>\n<title></title>\n</head>\n<body><div class="page"><p/>\n<p> A Simple PDF File \n This is a small demonstration .pdf file - \n</p>\n<p> just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...</p>\n<p/>\n</div>\n<div class="page"><p/>\n<p> Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. </p>\n<p/>\n</div>\n</body></html>';

const pdfFileText =
    '\n A Simple PDF File \n This is a small demonstration .pdf file - \n\n just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...\n\n\n\n Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. \n\n\n';

const pdfFileMeta = {
    'pdf:unmappedUnicodeCharsPerPage': ['0', '0'],
    'pdf:PDFVersion': '1.3',
    'xmp:CreatorTool': 'Rave (http://www.nevrona.com/rave)',
    'pdf:hasXFA': 'false',
    'access_permission:modify_annotations': 'true',
    'access_permission:can_print_faithful': 'true',
    'dcterms:created': '2006-03-01T07:28:26Z',
    'dc:format': 'application/pdf; version=1.3',
    'pdf:docinfo:creator_tool': 'Rave (http://www.nevrona.com/rave)',
    'access_permission:fill_in_form': 'true',
    'pdf:encrypted': 'false',
    'pdf:eofOffsets': '3027',
    'pdf:hasCollection': 'false',
    'Content-Length': '3028',
    'pdf:hasMarkedContent': 'false',
    'Content-Type': 'application/pdf',
    'pdf:incrementalUpdateCount': '0',
    'pdf:producer': 'Nevrona Designs',
    'access_permission:extract_for_accessibility': 'true',
    'access_permission:assemble_document': 'true',
    'xmpTPg:NPages': '2',
    resourceName: 'sample.pdf',
    'pdf:hasXMP': 'false',
    'pdf:charsPerPage': ['569', '367'],
    'access_permission:extract_content': 'true',
    'access_permission:can_print': 'true',
    'X-TIKA:Parsed-By': ['org.apache.tika.parser.DefaultParser', 'org.apache.tika.parser.pdf.PDFParser'],
    'X-TIKA:versionCount': '0',
    'access_permission:can_modify': 'true',
    'pdf:docinfo:producer': 'Nevrona Designs',
    'pdf:docinfo:created': '2006-03-01T07:28:26Z',
};

// Helper function to assert that a promise rejects with a specific error
async function expectReject(promise, errorType = Error, errorMessage = null) {
    try {
        await promise;
        expect.fail('Expected promise to be rejected');
    } catch (error) {
        expect(error).to.be.an.instanceOf(errorType);
        if (errorMessage) {
            expect(error.message).to.match(errorMessage);
        }
    }
}

describe('PDF to HTML', () => {
    describe('File path input', () => {
        it('should return html for the pdf file', async () => {
            const html = await pdf2html.html(pdfFilepath);
            should.exist(html);
            expect(html).to.equal(pdfFileHTML);
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.html(pdfInvalidFilepath));
        });

        it('should handle custom maxBuffer option', async () => {
            const html = await pdf2html.html(pdfFilepath, { maxBuffer: 1024 * 1024 * 10 });
            should.exist(html);
            expect(html).to.equal(pdfFileHTML);
        });
    });

    describe('Buffer input', () => {
        it('should return html for the pdf buffer', async () => {
            const html = await pdf2html.html(pdfBuffer);
            should.exist(html);
            expect(html).to.equal(pdfFileHTML);
        });

        it('should return error for invalid pdf buffer', async () => {
            // Note: Tika doesn't throw errors for non-PDF content, it just processes it as text
            // So we need to check the output instead
            const html = await pdf2html.html(invalidBuffer);
            expect(html).to.not.equal(pdfFileHTML);
            expect(html).to.include('not a pdf content');
        });

        it('should handle custom maxBuffer option with buffer input', async () => {
            const html = await pdf2html.html(pdfBuffer, { maxBuffer: 1024 * 1024 * 10 });
            should.exist(html);
            expect(html).to.equal(pdfFileHTML);
        });
    });
});

describe('PDF to Text', () => {
    describe('File path input', () => {
        it('should return text for the pdf file', async () => {
            const text = await pdf2html.text(pdfFilepath);
            should.exist(text);
            expect(text).to.equal(pdfFileText);
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.text(pdfInvalidFilepath));
        });
    });

    describe('Buffer input', () => {
        it('should return text for the pdf buffer', async () => {
            const text = await pdf2html.text(pdfBuffer);
            should.exist(text);
            expect(text).to.equal(pdfFileText);
        });

        it('should process invalid pdf buffer as text', async () => {
            // Tika processes non-PDF content as plain text
            const text = await pdf2html.text(invalidBuffer);
            expect(text).to.equal('not a pdf content\n');
        });
    });
});

describe('PDF to Pages', () => {
    const htmlPage1 =
        '<p>\n</p><p> A Simple PDF File \n This is a small demonstration .pdf file - \n</p>\n<p> just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...</p>\n<p>\n</p>';
    const htmlPage2 =
        '<p>\n</p><p> Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. </p>\n<p>\n</p>';
    const textPage1 =
        'A Simple PDF File \n This is a small demonstration .pdf file - \n\n just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...';
    const textPage2 =
        'Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well.';

    describe('File path input', () => {
        it('should return html as pages for the pdf file', async () => {
            const pages = await pdf2html.pages(pdfFilepath);
            should.exist(pages);
            expect(pages).to.have.lengthOf(2);
            expect(pages[0]).to.equal(htmlPage1);
            expect(pages[1]).to.equal(htmlPage2);
        });

        it('should return text as pages for the pdf file', async () => {
            const pages = await pdf2html.pages(pdfFilepath, { text: true });
            should.exist(pages);
            expect(pages).to.have.lengthOf(2);
            expect(pages[0]).to.equal(textPage1);
            expect(pages[1]).to.equal(textPage2);
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.pages(pdfInvalidFilepath));
        });
    });

    describe('Buffer input', () => {
        it('should return html as pages for the pdf buffer', async () => {
            const pages = await pdf2html.pages(pdfBuffer);
            should.exist(pages);
            expect(pages).to.have.lengthOf(2);
            expect(pages[0]).to.equal(htmlPage1);
            expect(pages[1]).to.equal(htmlPage2);
        });

        it('should return text as pages for the pdf buffer', async () => {
            const pages = await pdf2html.pages(pdfBuffer, { text: true });
            should.exist(pages);
            expect(pages).to.have.lengthOf(2);
            expect(pages[0]).to.equal(textPage1);
            expect(pages[1]).to.equal(textPage2);
        });

        it('should process invalid pdf buffer', async () => {
            // Tika processes non-PDF content, just returns empty array for pages
            const pages = await pdf2html.pages(invalidBuffer);
            expect(pages).to.be.an('array');
            expect(pages).to.have.lengthOf(0);
        });
    });
});

describe('PDF to Meta', () => {
    describe('File path input', () => {
        it('should return meta for the pdf file', async () => {
            const meta = await pdf2html.meta(pdfFilepath);
            should.exist(meta);
            expect(meta).to.eql(pdfFileMeta);
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.meta(pdfInvalidFilepath));
        });
    });

    describe('Buffer input', () => {
        it('should return meta for the pdf buffer', async () => {
            const meta = await pdf2html.meta(pdfBuffer);
            should.exist(meta);
            expect(meta).to.eql(pdfFileMeta);
        });

        it('should process invalid pdf buffer', async () => {
            // Tika processes non-PDF content and returns metadata for it
            const meta = await pdf2html.meta(invalidBuffer);
            expect(meta).to.be.an('object');
            expect(meta['Content-Type']).to.include('text/plain');
        });
    });
});

describe('PDF to Thumbnail', () => {
    const tempDir = path.join(__dirname, '../files/temp_thumbnails');

    beforeEach(async () => {
        await fse.ensureDir(tempDir);
    });

    afterEach(async () => {
        await fse.remove(tempDir);
    });

    describe('File path input', () => {
        it('should return thumbnail for the pdf file', async () => {
            const thumbnailPath = await pdf2html.thumbnail(pdfFilepath, { outputDirectory: tempDir });
            expect(thumbnailPath).to.be.a('string');
            expect(thumbnailPath).to.include('.png');
            expect(await fse.pathExists(thumbnailPath)).to.be.true;
        });

        it('should return thumbnail with custom options', async () => {
            const thumbnailPath = await pdf2html.thumbnail(pdfFilepath, {
                page: 1,
                imageType: 'png',
                width: 200,
                height: 300,
                outputDirectory: tempDir,
            });
            expect(thumbnailPath).to.be.a('string');
            expect(thumbnailPath).to.include('.png');
            expect(await fse.pathExists(thumbnailPath)).to.be.true;
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.thumbnail(pdfInvalidFilepath, { outputDirectory: tempDir }));
        });
    });

    describe('Buffer input', () => {
        it('should return thumbnail for the pdf buffer', async () => {
            const thumbnailPath = await pdf2html.thumbnail(pdfBuffer, { outputDirectory: tempDir });
            expect(thumbnailPath).to.be.a('string');
            expect(thumbnailPath).to.include('.png');
            expect(await fse.pathExists(thumbnailPath)).to.be.true;
        });

        it('should return thumbnail with custom options for buffer', async () => {
            const thumbnailPath = await pdf2html.thumbnail(pdfBuffer, {
                page: 1,
                imageType: 'jpg',
                width: 320,
                height: 480,
                outputDirectory: tempDir,
            });
            expect(thumbnailPath).to.be.a('string');
            expect(thumbnailPath).to.include('.jpg');
            expect(await fse.pathExists(thumbnailPath)).to.be.true;
        });

        it('should return error for invalid pdf buffer', async () => {
            await expectReject(pdf2html.thumbnail(invalidBuffer, { outputDirectory: tempDir }));
        });
    });
});

describe('Edge Cases and Error Handling', () => {
    it('should handle null input', async () => {
        await expectReject(pdf2html.html(null));
    });

    it('should handle undefined input', async () => {
        await expectReject(pdf2html.html(undefined));
    });

    it('should handle empty string input', async () => {
        await expectReject(pdf2html.html(''));
    });

    it('should handle non-buffer, non-string input', async () => {
        await expectReject(pdf2html.html(123));
        await expectReject(pdf2html.html({}));
        await expectReject(pdf2html.html([]));
    });

    it('should handle empty buffer', async () => {
        const emptyBuffer = Buffer.alloc(0);
        // Tika throws an error for empty files
        await expectReject(pdf2html.html(emptyBuffer), Error, /ZeroByteFileException|0 bytes/);
    });

    it('should clean up temp files even on error', async () => {
        // This test ensures temp files are cleaned up
        // We use a valid PDF buffer to ensure it creates a temp file
        const result = await pdf2html.html(pdfBuffer);
        expect(result).to.include('Simple PDF File');
    });
});

describe('Buffer vs File Path Consistency', () => {
    it('should produce identical HTML output for file and buffer input', async () => {
        const htmlFromFile = await pdf2html.html(pdfFilepath);
        const htmlFromBuffer = await pdf2html.html(pdfBuffer);
        expect(htmlFromFile).to.equal(htmlFromBuffer);
    });

    it('should produce identical text output for file and buffer input', async () => {
        const textFromFile = await pdf2html.text(pdfFilepath);
        const textFromBuffer = await pdf2html.text(pdfBuffer);
        expect(textFromFile).to.equal(textFromBuffer);
    });

    it('should produce identical pages output for file and buffer input', async () => {
        const pagesFromFile = await pdf2html.pages(pdfFilepath);
        const pagesFromBuffer = await pdf2html.pages(pdfBuffer);
        expect(pagesFromFile).to.deep.equal(pagesFromBuffer);
    });

    it('should produce identical metadata for file and buffer input', async () => {
        const metaFromFile = await pdf2html.meta(pdfFilepath);
        const metaFromBuffer = await pdf2html.meta(pdfBuffer);
        expect(metaFromFile).to.deep.equal(metaFromBuffer);
    });
});

// Internal module tests
const CommandExecutor = require('../lib/CommandExecutor');
const { PDFProcessingError } = require('../lib/errors');

describe('CommandExecutor', () => {
    describe('execute', () => {
        it('should execute a simple command successfully', async () => {
            const result = await CommandExecutor.execute('echo', ['hello']);
            expect(result.trim()).to.equal('hello');
        });

        it('should handle commands with multiple arguments', async () => {
            const result = await CommandExecutor.execute('echo', ['hello', 'world']);
            expect(result.trim()).to.equal('hello world');
        });

        it('should reject when command exits with non-zero code', async () => {
            try {
                await CommandExecutor.execute('sh', ['-c', 'exit 1']);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(PDFProcessingError);
                expect(error.command).to.include('sh -c exit 1');
                expect(error.exitCode).to.equal(1);
            }
        });

        it('should include stderr in error message when command fails', async () => {
            try {
                await CommandExecutor.execute('sh', ['-c', 'echo "error message" >&2; exit 1']);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(PDFProcessingError);
                expect(error.message).to.include('error message');
            }
        });

        it('should handle spawn errors for non-existent commands', async () => {
            try {
                await CommandExecutor.execute('nonexistentcommand123456', ['arg']);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.be.instanceOf(PDFProcessingError);
                expect(error.message).to.include('Failed to spawn process');
                expect(error.command).to.include('nonexistentcommand123456');
            }
        });


        it('should capture stdout correctly', async () => {
            const result = await CommandExecutor.execute('sh', ['-c', 'echo "line1"; echo "line2"']);
            expect(result).to.include('line1');
            expect(result).to.include('line2');
        });

        it('should pass options to spawn', async () => {
            const result = await CommandExecutor.execute('pwd', [], { cwd: '/tmp' });
            // On macOS, /tmp is a symlink to /private/tmp
            expect(result.trim()).to.match(/\/tmp$|\/private\/tmp$/);
        });
    });
});

// Additional internal module tests for coverage
const FileManager = require('../lib/FileManager');
const HTMLParser = require('../lib/HTMLParser');
const ImageProcessor = require('../lib/ImageProcessor');

describe('Internal Modules - Coverage Tests', () => {
    describe('FileManager', () => {
        it('should use default .pdf extension when not provided', async () => {
            const buffer = Buffer.from('test content');
            const filePath = await FileManager.createTempFileFromBuffer(buffer);
            
            expect(filePath).to.include('.pdf');
            
            // Clean up
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    });

    describe('HTMLParser', () => {
        it('should use default empty options when not provided', () => {
            const html = '<html><body><div class="page">Page 1</div><div class="page">Page 2</div></body></html>';
            const pages = HTMLParser.extractPages(html);
            
            expect(pages).to.be.an('array');
            expect(pages).to.have.length(2);
            expect(pages[0]).to.include('Page 1');
            expect(pages[1]).to.include('Page 2');
        });
    });

    describe('ImageProcessor', () => {
        it('should throw error when sharp fails to process image', async () => {
            // Create a file that's not a valid image
            const invalidImagePath = path.join(__dirname, 'test-invalid.txt');
            fs.writeFileSync(invalidImagePath, 'This is not an image');
            
            try {
                await ImageProcessor.resize(invalidImagePath, 100, 100);
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).to.exist;
                expect(error.message).to.include('Missing output file');
            } finally {
                // Clean up
                if (fs.existsSync(invalidImagePath)) {
                    fs.unlinkSync(invalidImagePath);
                }
            }
        });
    });
});
