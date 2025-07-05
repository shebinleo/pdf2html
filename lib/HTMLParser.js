// lib/HTMLParser.js
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * HTML content parser
 */
class HTMLParser {
    static extractPages(htmlContent, options = {}) {
        const $ = cheerio.load(htmlContent);
        const pages = [];

        $('.page').each((index, element) => {
            const $page = $(element);
            const content = options.text ? $page.text().trim() : purify.sanitize($page.html());
            pages.push(content);
        });

        return pages;
    }
}

module.exports = HTMLParser;
