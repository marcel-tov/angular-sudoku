/** Used for all .html files. */
module.exports = {
    parser: '@angular-eslint/template-parser',
    plugins: ['@angular-eslint/template'],
    extends: ['plugin:@angular-eslint/template/recommended'],
    rules: {
        '@angular-eslint/template/banana-in-box': 'error',
        '@angular-eslint/template/conditional-complexity': 'error',
        '@angular-eslint/template/cyclomatic-complexity': 'warn',
        '@angular-eslint/template/eqeqeq': 'error',
        '@angular-eslint/template/no-any': 'error',
        '@angular-eslint/template/no-duplicate-attributes': 'error',
        '@angular-eslint/template/no-negated-async': 'error',
    },
};
