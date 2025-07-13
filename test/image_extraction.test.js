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
});
