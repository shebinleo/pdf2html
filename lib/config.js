// lib/config.js
/**
 * Configuration constants
 */
const DEFAULT_OPTIONS = {
    thumbnail: {
        page: 1,
        imageType: 'png',
        width: 160,
        height: 226,
    },
    command: {
        maxBuffer: 1024 * 2000,
    },
};

module.exports = { DEFAULT_OPTIONS };
