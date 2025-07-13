const path = require('path');
const fs = require('fs');
const chai = require('chai');
const fse = require('fs-extra');

const { expect } = chai;
const should = chai.should();

const pdf2html = require('../index');

const pdfImageFilepath = path.join(__dirname, './sample-images.pdf');
const pdfImageBuffer = fs.readFileSync(pdfImageFilepath);

describe('PDF to Images with images', () => {
    const outputDir = path.join(__dirname, '../files/temp_extracted_images');

    beforeEach(async () => {
        await fse.remove(outputDir);
        await fse.ensureDir(outputDir);
    });

    afterEach(async () => {
        await fse.remove(outputDir);
    });

    describe('File path input', () => {
        it('should extract images to the specified directory', async () => {
            const extractedImagePaths = await pdf2html.extractImages(pdfImageFilepath, { outputDirectory: outputDir });
            should.exist(extractedImagePaths);
            expect(extractedImagePaths).to.be.an('array');
            expect(extractedImagePaths).to.have.lengthOf(3);
        });
    });

    describe('Buffer input', () => {
        it('should extract images from buffer to the specified directory', async () => {
            const extractedImagePaths = await pdf2html.extractImages(pdfImageBuffer, { outputDirectory: outputDir });
            should.exist(extractedImagePaths);
            expect(extractedImagePaths).to.be.an('array');
            expect(extractedImagePaths).to.have.lengthOf(3);
        });
    });

    describe('Default options', () => {
        it('should extract images with default options when options not provided', async () => {
            const extractedImagePaths = await pdf2html.extractImages(pdfImageFilepath);
            should.exist(extractedImagePaths);
            expect(extractedImagePaths).to.be.an('array');
            expect(extractedImagePaths).to.have.lengthOf(3);
            // Check that images are saved to default directory
            extractedImagePaths.forEach(imagePath => {
                expect(imagePath).to.include('/files/image/');
            });
        });
    });

    describe('Error handling', () => {
        it('should handle non-existent PDF file', async () => {
            try {
                await pdf2html.extractImages('/path/to/non-existent.pdf');
                expect.fail('Should have thrown an error');
            } catch (error) {
                should.exist(error);
                expect(error.message).to.include('not found');
            }
        });

        it('should handle invalid PDF buffer', async () => {
            const invalidBuffer = Buffer.from('This is not a PDF');
            try {
                await pdf2html.extractImages(invalidBuffer, { outputDirectory: outputDir });
                expect.fail('Should have thrown an error');
            } catch (error) {
                should.exist(error);
            }
        });
    });
});
