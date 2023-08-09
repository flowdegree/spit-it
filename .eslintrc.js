module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base' , 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['prettier'],

    rules: {
        indent: 'off',
        quotes: ['error', 'single'],
        'no-var': 'error',
        'no-console:': 'off',
    },
};
