const path = require('path');
const fs = require('fs');
const chai = require('chai');
const fse = require('fs-extra');

const { expect } = chai;
const should = chai.should();

const pdf2html = require('../index');

const pdfFilepath = path.join(__dirname, '/../sample.pdf');
const pdfInvalidFilepath = path.join(__dirname, '/../sample2.pdf');
const pdfBuffer = fs.readFileSync(pdfFilepath);
const invalidBuffer = Buffer.from('not a pdf content');

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

describe('PDF to Images', () => {
    const outputDir = path.join(__dirname, '../files/temp_extracted_images');

    beforeEach(async () => {
        await fse.remove(outputDir);
        await fse.ensureDir(outputDir);
    });

    afterEach(async () => {
        await fse.remove(outputDir);
    });

    describe('File path input', () => {
        it('should extract images to the specified directory (empty for sample.pdf)', async () => {
            const extractedImagePaths = await pdf2html.extractImages(pdfFilepath, { outputDirectory: outputDir });
            should.exist(extractedImagePaths);
            expect(extractedImagePaths).to.be.an('array');
            // The sample PDF does not contain images, so we expect an empty array
            expect(extractedImagePaths).to.have.lengthOf(0);
        });

        it('should return error for the pdf file that does not exist', async () => {
            await expectReject(pdf2html.extractImages(pdfInvalidFilepath, { outputDirectory: outputDir }));
        });
    });

    describe('Buffer input', () => {
        it('should extract images from buffer to the specified directory (empty for sample.pdf)', async () => {
            const extractedImagePaths = await pdf2html.extractImages(pdfBuffer, { outputDirectory: outputDir });
            should.exist(extractedImagePaths);
            expect(extractedImagePaths).to.be.an('array');
            // The sample PDF does not contain images, so we expect an empty array
            expect(extractedImagePaths).to.have.lengthOf(0);
        });

        it('should return error for invalid pdf buffer', async () => {
            await expectReject(pdf2html.extractImages(invalidBuffer, { outputDirectory: outputDir }));
        });
    });
});
