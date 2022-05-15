module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'comma-dangle': ['error', 'never'],
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'no-undef': ['off'],
        'quotes': ['error', 'single', { "allowTemplateLiterals": true }],
        'semi': ['error', 'always']
    }
};
