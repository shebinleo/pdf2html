const path = require('path');
const chai = require('chai');

const { expect } = chai;
const should = chai.should();
chai.use(require('chai-as-promised'));
const pdf2html = require('../index');

const pdfFilepath = path.join(__dirname, '/../sample.pdf');
const pdfThumbnailFilepath = path.join(__dirname, '/../files/image/sample.png');
const pdfInvalidFilepath = path.join(__dirname, '/../sample2.pdf');
const pdfFileHTML =
    '<html xmlns="http://www.w3.org/1999/xhtml">\n<head>\n<meta name="pdf:PDFVersion" content="1.3"/>\n<meta name="xmp:CreatorTool" content="Rave (http://www.nevrona.com/rave)"/>\n<meta name="pdf:hasXFA" content="false"/>\n<meta name="access_permission:modify_annotations" content="true"/>\n<meta name="access_permission:can_print_degraded" content="true"/>\n<meta name="dcterms:created" content="2006-03-01T07:28:26Z"/>\n<meta name="dc:format" content="application/pdf; version=1.3"/>\n<meta name="pdf:docinfo:creator_tool" content="Rave (http://www.nevrona.com/rave)"/>\n<meta name="access_permission:fill_in_form" content="true"/>\n<meta name="pdf:hasCollection" content="false"/>\n<meta name="pdf:encrypted" content="false"/>\n<meta name="Content-Length" content="3028"/>\n<meta name="pdf:hasMarkedContent" content="false"/>\n<meta name="Content-Type" content="application/pdf"/>\n<meta name="pdf:producer" content="Nevrona Designs"/>\n<meta name="access_permission:extract_for_accessibility" content="true"/>\n<meta name="access_permission:assemble_document" content="true"/>\n<meta name="xmpTPg:NPages" content="2"/>\n<meta name="resourceName" content="sample.pdf"/>\n<meta name="pdf:hasXMP" content="false"/>\n<meta name="access_permission:extract_content" content="true"/>\n<meta name="access_permission:can_print" content="true"/>\n<meta name="X-TIKA:Parsed-By" content="org.apache.tika.parser.DefaultParser"/>\n<meta name="X-TIKA:Parsed-By" content="org.apache.tika.parser.pdf.PDFParser"/>\n<meta name="access_permission:can_modify" content="true"/>\n<meta name="pdf:docinfo:producer" content="Nevrona Designs"/>\n<meta name="pdf:docinfo:created" content="2006-03-01T07:28:26Z"/>\n<title></title>\n</head>\n<body><div class="page"><p/>\n<p> A Simple PDF File \n This is a small demonstration .pdf file - \n</p>\n<p> just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...</p>\n<p/>\n</div>\n<div class="page"><p/>\n<p> Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. </p>\n<p/>\n</div>\n</body></html>';
const pdfFileText =
    '\n A Simple PDF File \n This is a small demonstration .pdf file - \n\n just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...\n\n\n\n Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. \n\n\n';
const pdfFileMeta = {
    'pdf:unmappedUnicodeCharsPerPage': ['0', '0'],
    'pdf:PDFVersion': '1.3',
    'xmp:CreatorTool': 'Rave (http://www.nevrona.com/rave)',
    'pdf:hasXFA': 'false',
    'access_permission:modify_annotations': 'true',
    'access_permission:can_print_degraded': 'true',
    'dcterms:created': '2006-03-01T07:28:26Z',
    'dc:format': 'application/pdf; version=1.3',
    'pdf:docinfo:creator_tool': 'Rave (http://www.nevrona.com/rave)',
    'access_permission:fill_in_form': 'true',
    'pdf:encrypted': 'false',
    'pdf:hasCollection': 'false',
    'Content-Length': '3028',
    'pdf:hasMarkedContent': 'false',
    'Content-Type': 'application/pdf',
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
    'access_permission:can_modify': 'true',
    'pdf:docinfo:producer': 'Nevrona Designs',
    'pdf:docinfo:created': '2006-03-01T07:28:26Z',
};

describe('PDF to HTML', async () => {
    it('should return html for the pdf file', async () => {
        const html = await pdf2html.html(pdfFilepath);
        should.exist(html);
        expect(html).to.equal(pdfFileHTML);
    });

    it('should return error for the pdf file that does not exist', async () => {
        await expect(pdf2html.html(pdfInvalidFilepath)).to.be.rejectedWith(Error);
    });
});

describe('PDF to Text', async () => {
    it('should return text for the pdf file', async () => {
        const text = await pdf2html.text(pdfFilepath);
        should.exist(text);
        expect(text).to.equal(pdfFileText);
    });

    it('should return error for the pdf file that does not exist', async () => {
        await expect(pdf2html.text(pdfInvalidFilepath)).to.be.rejectedWith(Error);
    });
});

describe('PDF to Pages', async () => {
    it('should return html as pages for the pdf file', async () => {
        const pages = await pdf2html.pages(pdfFilepath);
        should.exist(pages);
        expect(pages).to.have.lengthOf(2);
        expect(pages[0]).to.equal(
            '<p>\n</p><p> A Simple PDF File \n This is a small demonstration .pdf file - \n</p>\n<p> just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n</p>\n<p> And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...</p>\n<p>\n</p>'
        );
        expect(pages[1]).to.equal(
            '<p>\n</p><p> Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well. </p>\n<p>\n</p>'
        );
    });

    it('should return text as pages for the pdf file', async () => {
        const pages = await pdf2html.pages(pdfFilepath, { text: true });
        should.exist(pages);
        expect(pages).to.have.lengthOf(2);
        expect(pages[0]).to.equal(
            'A Simple PDF File \n This is a small demonstration .pdf file - \n\n just for use in the Virtual Mechanics tutorials. More text. And more \n text. And more text. And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. Boring, zzzzz. And more text. And more text. And \n more text. And more text. And more text. And more text. And more text. \n And more text. And more text. \n\n And more text. And more text. And more text. And more text. And more \n text. And more text. And more text. Even more. Continued on page 2 ...'
        );
        expect(pages[1]).to.equal(
            'Simple PDF File 2 \n ...continued from page 1. Yet more text. And more text. And more text. \n And more text. And more text. And more text. And more text. And more \n text. Oh, how boring typing this stuff. But not as boring as watching \n paint dry. And more text. And more text. And more text. And more text. \n Boring.  More, a little more text. The end, and just as well.'
        );
    });

    it('should return error for the pdf file that does not exist', async () => {
        await expect(pdf2html.pages(pdfInvalidFilepath)).to.be.rejectedWith(Error);
    });
});

describe('PDF to Meta', async () => {
    it('should return meta for the pdf file', async () => {
        const meta = await pdf2html.meta(pdfFilepath);
        should.exist(meta);
        expect(meta).to.eql(pdfFileMeta);
    });

    it('should return error for the pdf file that does not exist', async () => {
        await expect(pdf2html.meta(pdfInvalidFilepath)).to.be.rejectedWith(Error);
    });
});

describe('PDF to Thumbnail', async () => {
    it('should return thumbnail for the pdf file', async () => {
        expect(await pdf2html.thumbnail(pdfFilepath)).to.equal(pdfThumbnailFilepath);
    });

    it('should return error for the pdf file that does not exist', async () => {
        await expect(pdf2html.thumbnail(pdfInvalidFilepath)).to.be.rejectedWith(Error);
    });
});
