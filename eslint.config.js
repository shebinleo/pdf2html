const globals = require('globals');
const js = require('@eslint/js');

const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,

    prettierConfig,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'off',
        },
    },
];
