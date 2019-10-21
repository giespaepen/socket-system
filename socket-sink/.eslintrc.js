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
        "@typescript-eslint/interface-name-prefix": [0, { "prefixWithI": "always" }],
        "eol-line": ["error", "always"]
    },
}