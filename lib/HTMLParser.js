// lib/HTMLParser.js
const cheerio = require('cheerio');

/**
 * HTML content parser
 */
class HTMLParser {
    static extractPages(htmlContent, options = {}) {
        const $ = cheerio.load(htmlContent);
        const pages = [];

        $('.page').each((index, element) => {
            const $page = $(element);
            const content = options.text ? $page.text().trim() : $page.html();
            pages.push(content);
        });

        return pages;
    }
}

module.exports = HTMLParser;
