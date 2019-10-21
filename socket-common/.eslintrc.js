module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        // Special ESLint rules or overrides go here.
        "@typescript-eslint/interface-name-prefix": [0, { "prefixWithI": "always" }],
    },
}